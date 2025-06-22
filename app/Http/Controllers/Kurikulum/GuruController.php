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
            'NIP' => 'required|string|digits:18|unique:guru,NIP',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:3|confirmed',
            'alamat' => 'nullable|string',
            'nomor_telepon' => 'nullable|string|max:15',
            'tanggal_lahir' => 'nullable|date',
            'tempat_lahir' => 'nullable|string|max:255',
            'jenis_kelamin' => ['nullable', Rule::in(['L', 'P'])],
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
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
                'tempat_lahir' => $validated['tempat_lahir'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
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
            'NIP' => ['required', 'string', 'digits:18', Rule::unique('guru')->ignore($guru->guru_id, 'guru_id')],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($guru->user_id)],
            'password' => 'nullable|string|min:3|confirmed',
            'alamat' => 'nullable|string',
            'nomor_telepon' => 'nullable|string|max:15',
            'tanggal_lahir' => 'nullable|date',
            'tempat_lahir' => 'nullable|string|max:255',
            'jenis_kelamin' => ['nullable', Rule::in(['L', 'P'])],
        ]);

        DB::transaction(function () use ($validated, $guru) {
            $guru->user()->update([
                'email' => $validated['email'],
            ]);

            if (!empty($validated['password'])) {
                $guru->user()->update([
                    'password' => Hash::make($validated['password']),
                ]);
            }

            $guru->update([
                'NIP' => $validated['NIP'],
                'nama_lengkap' => $validated['nama_lengkap'],
                'alamat' => $validated['alamat'],
                'nomor_telepon' => $validated['nomor_telepon'],
                'tanggal_lahir' => $validated['tanggal_lahir'],
                'tempat_lahir' => $validated['tempat_lahir'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
            ]);
        });

        return redirect()->route('kurikulum.guru.index')->with('success', 'Data guru berhasil diperbarui.');
    }

    public function destroy(Guru $guru)
    {
        try {
            DB::transaction(function () use ($guru) {
                // Dengan menghapus user, data guru yang terkait akan ikut terhapus
                // berkat event 'deleting' pada model User.
                $guru->user->delete();
            });

            return redirect()->route('kurikulum.guru.index')->with('success', 'Data guru berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('kurikulum.guru.index')->with('error', 'Gagal menghapus data guru. Terjadi kesalahan: ' . $e->getMessage());
        }
    }
}
