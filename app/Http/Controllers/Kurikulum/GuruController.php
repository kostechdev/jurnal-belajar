<?php

namespace App\Http\Controllers\Kurikulum;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class GuruController extends Controller
{
    public function index()
    {
        return Inertia::render('kurikulum/guru/Index', [
            'gurus' => Guru::with('user')->latest()->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('kurikulum/guru/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'NIP' => 'required|string|unique:guru,NIP',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:3|confirmed',
            'alamat' => 'nullable|string',
            'nomor_telepon' => 'nullable|string|max:20',
            'tanggal_lahir' => 'nullable|date',
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['nama_lengkap'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'guru',
            ]);

            $user->guru()->create([
                'NIP' => $validated['NIP'],
                'nama_lengkap' => $validated['nama_lengkap'],
                'alamat' => $validated['alamat'],
                'nomor_telepon' => $validated['nomor_telepon'],
                'tanggal_lahir' => $validated['tanggal_lahir'],
            ]);
        });

        return redirect()->route('kurikulum.guru.index')->with('success', 'Data guru berhasil ditambahkan.');
    }

    public function edit(Guru $guru)
    {
        return Inertia::render('kurikulum/guru/Form', [
            'guru' => $guru->load('user'),
        ]);
    }

    public function update(Request $request, Guru $guru)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'NIP' => ['required', 'string', Rule::unique('guru')->ignore($guru->guru_id, 'guru_id')],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($guru->user_id)],
            'password' => 'nullable|string|min:3|confirmed',
            'alamat' => 'nullable|string',
            'nomor_telepon' => 'nullable|string|max:20',
            'tanggal_lahir' => 'nullable|date',
        ]);

        DB::transaction(function () use ($validated, $guru) {
            $guru->user()->update([
                'name' => $validated['nama_lengkap'],
                'email' => $validated['email'],
                'password' => isset($validated['password']) ? Hash::make($validated['password']) : $guru->user->password,
            ]);

            $guru->update([
                'NIP' => $validated['NIP'],
                'nama_lengkap' => $validated['nama_lengkap'],
                'alamat' => $validated['alamat'],
                'nomor_telepon' => $validated['nomor_telepon'],
                'tanggal_lahir' => $validated['tanggal_lahir'],
            ]);
        });

        return redirect()->route('kurikulum.guru.index')->with('success', 'Data guru berhasil diperbarui.');
    }

    public function destroy(Guru $guru)
    {
        DB::transaction(function () use ($guru) {
            $guru->user()->delete(); // Soft delete user
            $guru->delete(); // Soft delete guru
        });

        return redirect()->route('kurikulum.guru.index')->with('success', 'Data guru berhasil dihapus.');
    }
}
