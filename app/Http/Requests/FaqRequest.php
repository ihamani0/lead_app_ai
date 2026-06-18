<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FaqRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'question' => 'required|string|max:65535',
            'answer' => 'nullable|string|max:65535',
            'category' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ];
    }
}
