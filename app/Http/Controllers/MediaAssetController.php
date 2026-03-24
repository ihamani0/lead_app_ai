<?php

namespace App\Http\Controllers;

use App\Models\MediaAsset;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
                'type' => 'required|in:image,video,document',
                'upload_method' => 'required|in:file,url',
                'file' => 'required_if:upload_method,file|nullable|file|max:20480', // 20MB max
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
                ->usingFileName(uniqid() . '.' . $request->file('file')->extension())
                ->toMediaCollection('assets','s3');
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

    public function destroy(Request $request, $id)
    {
        $asset = MediaAsset::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);

        // Spatie automatically deletes the physical file when the model is deleted
        $asset->delete();

        return back()->with('success', 'Media asset deleted.');
    }
}
