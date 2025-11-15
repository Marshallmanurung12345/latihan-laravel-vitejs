<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
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
            'title' => $this->title,
            'content' => $this->content,
            'cover_image_url' => $this->cover_image_url, // Pastikan atribut ini ada
            'created_at' => $this->created_at,
            'completed_at' => $this->completed_at,
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}