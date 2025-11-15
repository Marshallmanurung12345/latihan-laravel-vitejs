<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Izinkan semua pengguna yang terautentikasi untuk membuat request ini.
        // Anda bisa menambahkan logika otorisasi yang lebih spesifik di sini jika perlu.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_completed' => 'nullable|boolean',
        ];

        // Aturan untuk 'cover_image' hanya 'required' saat membuat, dan 'nullable' saat update.
        // Namun, untuk kasus ini kita buat nullable saja agar lebih fleksibel.
        return [
            ...$rules,
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }
}