<?php

namespace App\Http\Controllers;

use App\Models\MediaAsset;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MediaAssetController extends Controller
{
    public function index()
    {
        $tenant_id = Auth::user()->tenant_id;

        $assets = MediaAsset::where('tenant_id', $tenant_id)
            ->latest()
            ->get()
            ->map(function ($asset) {
                // Append the resolved URL (Spatie or External) for the frontend
                $asset->url = $asset->resolved_url;

                return $asset;
            });

        return Inertia::render('Media/Index', [
            'assets' => $assets,
        ]);
    }

    public function store(Request $request)
    {

        try {

            $validated = $request->validate([
                'category' => 'required|string|max:100', // e.g., 'pool', 'apartment_a'
                'type' => 'required|in:image,video',
                'upload_method' => 'required|in:file,url',
                'file' => 'required_if:upload_method,file|nullable|file|mimes:jpg,jpeg,png,gif,webp|max:2048', // 2MB max
                'external_url' => 'required_if:upload_method,url|nullable|url',
                'caption' => 'nullable|string|max:255',
            ]);

            $asset = MediaAsset::create([
                'tenant_id' => $request->user()->tenant_id,
                'category' => strtolower(trim($request->category)),
                'type' => $request->type,
                'external_url' => $request->upload_method === 'url' ? $request->external_url : null,
                'caption' => $request->caption,
                'is_active' => true,
            ]);

            // If file upload, process via Spatie MediaLibrary
            if ($request->upload_method === 'file' && $request->hasFile('file')) {
                $media = $asset->addMediaFromRequest('file')
                    ->usingFileName(uniqid().'.'.$request->file('file')->extension())
                    ->toMediaCollection('assets', 's3');
                // save public url in database
                $asset->update([
                    'external_url' => $media->getUrl(),
                ]);

            }

            return back()->with('success', 'Media asset added successfully!');
        } catch (Exception $e) {

            return back()->with('error', 'Media asset not added successfully!');
        }
    }

    public function presign(Request $request)
    {
        Log::info('Media presign request', [
            'tenant_id' => $request->user()->tenant_id,
            'filename' => $request->input('filename'),
            'mime_type' => $request->input('mime_type'),
            'size' => $request->input('size'),
        ]);

        try {
            $validated = $request->validate([
                'filename' => 'required|string|max:255',
                'mime_type' => 'required|string|max:100',
                'size' => 'required|integer|max:25600', // 25MB in KB
            ]);

            $extension = pathinfo($validated['filename'], PATHINFO_EXTENSION);
            $key = 'media/temp/'.$request->user()->tenant_id.'/'.uniqid('', true).'.'.$extension;

            ['url' => $url, 'headers' => $headers] = Storage::temporaryUploadUrl(
                $key,
                now()->addMinutes(10),
            );

            Log::info('Media presign generated', [
                'key' => $key,
                'url' => $url,
                'headers' => $headers,
            ]);

            return response()->json([
                'url' => $url,
                'headers' => $headers,
                'key' => $key,
            ]);
        } catch (Exception $e) {
            Log::error('Media presign failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => 'Failed to generate upload URL.'], 500);
        }
    }

    public function finalize(Request $request)
    {
        Log::info('Media finalize request', [
            'tenant_id' => $request->user()->tenant_id,
            's3_key' => $request->input('s3_key'),
            'category' => $request->input('category'),
            'type' => $request->input('type'),
            'mime_type' => $request->input('mime_type'),
        ]);

        try {
            $validated = $request->validate([
                'category' => 'required|string|max:100',
                'type' => 'required|in:image,video',
                's3_key' => 'required|string',
                'mime_type' => 'required|string',
                'caption' => 'nullable|string|max:255',
            ]);

            // Verify the file exists on S3
            if (! Storage::disk('s3')->exists($validated['s3_key'])) {
                Log::error('Media finalize: file not found on S3', [
                    's3_key' => $validated['s3_key'],
                ]);

                return response()->json(['error' => 'Uploaded file not found. Please try again.'], 422);
            }

            $asset = MediaAsset::create([
                'tenant_id' => $request->user()->tenant_id,
                'category' => strtolower(trim($validated['category'])),
                'type' => $validated['type'],
                'caption' => $validated['caption'],
                'is_active' => true,
            ]);

            Log::info('MediaAsset created', ['asset_id' => $asset->id]);

            // Spatie reads temp file from S3, copies to permanent path, registers in media table
            $media = $asset->addMediaFromDisk($validated['s3_key'], 's3')
                ->toMediaCollection('assets', 's3');

            Log::info('Spatie media registered', [
                'media_id' => $media->id,
                'disk' => $media->disk,
                'file_name' => $media->file_name,
                'url' => $media->getUrl(),
            ]);

            // Update external_url with the Spatie-managed permanent URL
            $asset->update(['external_url' => $media->getUrl()]);

            // Clean up temp file from S3
            $deleted = Storage::disk('s3')->delete($validated['s3_key']);
            Log::info('Temp file cleanup', [
                's3_key' => $validated['s3_key'],
                'deleted' => $deleted,
            ]);

            return response()->json([
                'asset' => $asset->fresh()->toArray(),
                'message' => 'Media asset uploaded successfully!',
            ]);
        } catch (Exception $e) {
            Log::error('Media finalize failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => 'Failed to save media asset.'], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        $asset = MediaAsset::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);

        // Spatie automatically deletes the physical file when the model is deleted
        $asset->delete();

        return back()->with('success', 'Media asset deleted.');
    }
}
