<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $guruId = $this->user()->guru?->guru_id;

        return [
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'NIP' => ['required', 'string', 'max:255', Rule::unique('guru', 'NIP')->ignore($guruId, 'guru_id')],
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'alamat' => ['nullable', 'string'],
            'nomor_telepon' => ['nullable', 'string', 'max:20'],
            'tanggal_lahir' => ['nullable', 'date'],
        ];
    }
}
