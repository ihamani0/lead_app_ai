<?php

namespace App\Http\Resources\EvolutionInstance;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EvolutionInstanceShowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tenant_id' => $this->tenant_id,
            'instance_name' => $this->instance_name,
            'phone_number' => $this->phone_number,
            'status' => $this->status,
            'qr_code' => $this->qr_code,
            'webhook_url' => $this->webhook_url,
            'settings' => $this->settings,
            'agent_config' => $this->agentConfig,
            'connected_at' => $this->connected_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
