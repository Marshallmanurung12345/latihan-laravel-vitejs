<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Plan extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['title', 'content', 'cover', 'user_id'];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['cover_image_url'];

    /**
     * Get the URL for the plan's cover image.
     */
    public function getCoverImageUrlAttribute(): ?string
    {
        return $this->cover ? Storage::url($this->cover) : null;
    }

    /**
     * Mendefinisikan relasi "belongsTo" ke model User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}