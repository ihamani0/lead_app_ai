<?php

namespace App\Http\Controllers;

use App\Events\InstanceConnectionUpdated;
use App\Models\EvolutionInstance;
use App\Services\EvolutionService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EvolutionInstanceController extends Controller
{
    public function index(Request $request){
        $instances = EvolutionInstance::where("tenant_id" , $request->user()->tenant_id)
        ->orderByDesc('created_at')
        ->get();
    

    return Inertia::render('Profil/Index' , [
        "instances" => $instances
    ]) ;

    }

    public function store(Request $request, EvolutionService $evolutionService)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'phone_number' => 'nullable|string|max:20',
        ]);
        
        $user = $request->user();

        // 1. Generate Unique Instance Name (TenantSlug-Name) to prevent collisions
        // Clean the name to be URL safe
        $cleanName = Str::slug($request->name);
        $evolutionInstanceName = "{$user->tenant->slug}-{$cleanName}-" . Str::random(4);

        // Generate a security token for this specific instance
        $instanceToken = Str::random(32);

       try{
 // 2. Call Evolution API
        DB::transaction(function() use ($request , $evolutionService , $evolutionInstanceName , $instanceToken , $user){
            
            
        $response = $evolutionService->createInstance($evolutionInstanceName , $instanceToken);

        if(isset($response['error'])) {
            throw new Exception(
                data_get($response, 'response.message.0', 'Evolution API error')
            );
        }

        // 3. Save to Database
        EvolutionInstance::create([
            'tenant_id' => $user->tenant_id,
            'instance_name' => $evolutionInstanceName,
            'phone_number' => $request->phone_number,
            'settings' => [
                'token' => $instanceToken // Store token to authenticate future requests for this instance
            ]
        ]);

        // 6. Return success with the QR code data for the frontend modal
        return back()->with('success', 'Instance created. Click on it to connect.');
        
    });
       }catch(Exception $e){
            dd($e->getMessage());
            return back()->withErrors(['error' => 'Failed to create instance on Evolution API. ' . $e->getMessage()]);
       }
    }


     public function show(Request $request, $id)
    {
        $instance = EvolutionInstance::with('agentConfig')
        ->where('tenant_id', $request->user()->tenant_id)
        ->findOrFail($id);


        return Inertia::render('Profil/Show', [
            'instance' => $instance
        ]);
    }

    public function fetchQr(Request $request, $id, EvolutionService $service)
    {
        $instance = EvolutionInstance::where('tenant_id', $request->user()->tenant_id)
            ->findOrFail($id);

        // Call Evolution GET /instance/connect/{instance}
       $service->fetchQrCode($instance->instance_name);

        // if (!$qrCode) {
        //     return response()->json(['error' => 'Could not generate QR']);
        // }

        // return response()->json(['qr_code' => $qrCode]); 
    }



    public function disconnect(Request $request , $id,  EvolutionService $evolutionService){

        //find instance name by tenant_id 
        $instance = EvolutionInstance::where("tenant_id" , $request->user()->tenant_id)->findOrFail($id);

        if($instance){
            // 1. Call Evolution API to logout
            $evolutionService->logoutInstance($instance->instance_name);

            $instance->update([
                'status' => "disconnected",
                "phone_number"=> null ,
                "connected_at" => null
            ]);

            broadcast(new InstanceConnectionUpdated($instance));

            return back()->with('success', 'Instance disconnected successfully.');
        }

        return back()->with('error', 'Instance not Founde!.');

    }

    public function destroy(Request $request , $id , EvolutionService $evolutionService){
        //find instance name by tenant_id 
        $instance = EvolutionInstance::where("tenant_id" , $request->user()->tenant_id)->findOrFail($id);

        if($instance){
            // 1. Call Evolution API to logout
            $evolutionService->deleteInstance($instance->instance_name);

            $instance->delete();

            return back()->with('success', 'Instance Deleted successfully.');
        }

        return back()->with('error', 'Instance not Founde!.');
    }


    public function restart(Request $request , $id , EvolutionService $evolutionService){
                //find instance name by tenant_id 
        $instance = EvolutionInstance::where("tenant_id" , $request->user()->tenant_id)->findOrFail($id);

        if($instance){
            // 1. Call Evolution API to logout
            $response = $evolutionService->restartInstance($instance->instance_name);

            return back()->with('success', 'Instance Restart successfully.');
        }

        return back()->with('error', 'Instance not Founde!.');
    }

}
