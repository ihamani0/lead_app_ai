<?php

namespace App\Http\Resources\EvolutionInstance;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EvolutionInstanceIndexResource extends JsonResource
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
            'instance_name' => $this->instance_name,
            'phone_number' => $this->phone_number,
            'status' => $this->status,
            'settings' => $this->settings,
            'connected_at' => $this->connected_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
