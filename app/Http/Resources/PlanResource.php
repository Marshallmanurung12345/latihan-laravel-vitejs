<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class PlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $createdAt = $this->created_at instanceof \DateTimeInterface
            ? $this->created_at
            : Carbon::parse($this->created_at);
        $updatedAt = $this->updated_at instanceof \DateTimeInterface
            ? $this->updated_at
            : Carbon::parse($this->updated_at);
        $completedAt = $this->completed_at
            ? ($this->completed_at instanceof \DateTimeInterface
                ? $this->completed_at
                : Carbon::parse($this->completed_at))
            : null;

        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'status' => $this->status,
            'cover_image_url' => $this->cover_image_url,
            'completed_at' => $completedAt?->toIso8601String(),
            'created_at' => $createdAt->toIso8601String(),
            'updated_at' => $updatedAt->toIso8601String(),
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}
