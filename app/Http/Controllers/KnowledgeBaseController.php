<?php

namespace App\Http\Controllers;

use App\Models\KnowledgeBase;
use App\Models\EvolutionInstance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

class KnowledgeBaseController extends Controller
{
    public function index(Request $request)
    {
        $tenant_id = Auth::user()->tenant_id;
        $documents = KnowledgeBase::where('tenant_id', $tenant_id)
            ->latest()
            ->get();

        return Inertia::render('KnowledgeBase/Index', [
            'documents' => $documents,
            "instances" => EvolutionInstance::where('tenant_id', $tenant_id)->where('status', 'connected')->select('instance_name')->get()
        ]);
    }


    // 2. Handle File Upload & Trigger n8n
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,txt,docx|max:10240', // 10MB max
            'name' => 'required|string|max:255',
            'instance_names' => ['required','array'], // Which bot this belongs to
        ]);

        

        $document = KnowledgeBase::create([
            'tenant_id' => $request->user()->tenant_id,
            'name' => $request->name,
            'status' => 'processing'
        ]);

        $document->addMediaFromRequest('file')->toMediaCollection('documents');


        // Trigger n8n Webhook
        // The URL is your n8n webhook for document ingestion
        $n8nWebhookUrl = config('services.n8n.n8n_base_url') . 'webhook/ingest-document';

        
        //http://127.0.0.1:5678/webhook-test/ingest-document
        try {
            foreach ($request->instance_names as $instance) {

                Http::withHeaders([
                    'X-N8N-API-KEY' => config('services.n8n.api_key')
                    ])
                    ->post($n8nWebhookUrl, [
                'document_id' => $document->id,
                'tenant_id' => (string) $document->tenant_id,
                'instance_name' => $instance,
                'file_name' => $request->file('file')->getClientOriginalName()
            ]);

            return back()->with('success', 'Document uploaded! AI is processing it.');
        }
        } catch (\Exception $e) {
            $document->update(['status' => 'failed']);
            return back()->withErrors(['error' => 'Failed to trigger AI ingestion.']);
        }

        
    }


        // 3. Secure Download Route (Only accessible with a valid signed URL)
    public function download(Request $request, $id)
    {

        $document = KnowledgeBase::findOrFail($id);

        $file_path = $document->getFirstMediaPath('documents');
        
        return response()->download($file_path);
    }


    public function markAsIndexed(Request $request)
    {
        $document = KnowledgeBase::findOrFail($request->document_id);
        $document->update(['status' => 'indexed']);
        
        return response()->json(['success' => true]);
    }


}
