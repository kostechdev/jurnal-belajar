<?php

namespace App\Http\Controllers\Kurikulum;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Kurikulum;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PenggunaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('kurikulum/pengguna/Index', [
            'users' => User::latest()->paginate(10),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('kurikulum/pengguna/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', 'string', 'min:3'],
            'role' => ['required', Rule::in(['kurikulum', 'guru'])],
            'NIP' => ['required_if:role,guru', 'nullable', 'string', 'digits:18', 'unique:guru,NIP'],
            'NIP_NIDN' => ['required_if:role,kurikulum', 'nullable', 'string', 'max:255', 'unique:kurikulum,NIP_NIDN'],
            'tempat_lahir' => 'nullable|string|max:255',
            'jenis_kelamin' => ['nullable', Rule::in(['L', 'P'])],
            'alamat' => 'nullable|string',
            'nomor_telepon' => 'nullable|string|max:15',
            'tanggal_lahir' => 'nullable|date',
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
            ]);

            if ($validated['role'] === 'guru') {
                Guru::create([
                    'user_id' => $user->id,
                    'nama_lengkap' => $validated['nama_lengkap'],
                    'NIP' => $validated['NIP'],
                    'tempat_lahir' => $validated['tempat_lahir'],
                    'jenis_kelamin' => $validated['jenis_kelamin'],
                    'alamat' => $validated['alamat'],
                    'nomor_telepon' => $validated['nomor_telepon'],
                    'tanggal_lahir' => $validated['tanggal_lahir'],
                ]);
            } elseif ($validated['role'] === 'kurikulum') {
                Kurikulum::create([
                    'user_id' => $user->id,
                    'nama_lengkap' => $validated['nama_lengkap'],
                    'NIP_NIDN' => $validated['NIP_NIDN'],
                    'tempat_lahir' => $validated['tempat_lahir'],
                    'jenis_kelamin' => $validated['jenis_kelamin'],
                    'alamat' => $validated['alamat'],
                    'nomor_telepon' => $validated['nomor_telepon'],
                    'tanggal_lahir' => $validated['tanggal_lahir'],
                ]);
            }
        });

        return redirect()->route('kurikulum.pengguna.index')->with('success', 'Pengguna berhasil dibuat.');
    }

    public function edit(User $pengguna): Response
    {
        $pengguna->load(['guru', 'kurikulum']);

        return Inertia::render('kurikulum/pengguna/Form', [
            'user' => $pengguna,
        ]);
    }

    public function update(Request $request, User $pengguna): RedirectResponse
    {
        $pengguna->load(['guru', 'kurikulum']);

        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($pengguna->id)],
            'password' => ['nullable', 'confirmed', 'string', 'min:3'],
            'role' => ['required', Rule::in(['kurikulum', 'guru'])],
            'NIP' => ['required_if:role,guru', 'nullable', 'string', 'digits:18', Rule::unique('guru', 'NIP')->ignore($pengguna->guru)],
            'NIP_NIDN' => ['required_if:role,kurikulum', 'nullable', 'string', 'max:255', Rule::unique('kurikulum', 'NIP_NIDN')->ignore($pengguna->kurikulum)],
            'tempat_lahir' => 'nullable|string|max:255',
            'jenis_kelamin' => ['nullable', Rule::in(['L', 'P'])],
            'alamat' => 'nullable|string',
            'nomor_telepon' => 'nullable|string|max:15',
            'tanggal_lahir' => 'nullable|date',
        ]);

        DB::transaction(function () use ($pengguna, $validated) {
            // Handle role change might be needed here in the future
            // For now, we assume role is not changed, or if changed, the related data is handled manually.
            $pengguna->update([
                'email' => $validated['email'],
                'role' => $validated['role'],
            ]);

            if ($validated['role'] === 'guru' && $pengguna->guru) {
                $pengguna->guru->update([
                    'nama_lengkap' => $validated['nama_lengkap'],
                    'NIP' => $validated['NIP'],
                    'tempat_lahir' => $validated['tempat_lahir'],
                    'jenis_kelamin' => $validated['jenis_kelamin'],
                    'alamat' => $validated['alamat'],
                    'nomor_telepon' => $validated['nomor_telepon'],
                    'tanggal_lahir' => $validated['tanggal_lahir'],
                ]);
            } elseif ($validated['role'] === 'kurikulum' && $pengguna->kurikulum) {
                $pengguna->kurikulum->update([
                    'nama_lengkap' => $validated['nama_lengkap'],
                    'NIP_NIDN' => $validated['NIP_NIDN'],
                    'tempat_lahir' => $validated['tempat_lahir'],
                    'jenis_kelamin' => $validated['jenis_kelamin'],
                    'alamat' => $validated['alamat'],
                    'nomor_telepon' => $validated['nomor_telepon'],
                    'tanggal_lahir' => $validated['tanggal_lahir'],
                ]);
            }

            if (!empty($validated['password'])) {
                $pengguna->update(['password' => Hash::make($validated['password'])]);
            }
        });

        return redirect()->route('kurikulum.pengguna.index')->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function destroy(User $pengguna): RedirectResponse
    {
        try {
            $pengguna->delete();

            return redirect()->route('kurikulum.pengguna.index')->with('success', 'Pengguna berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('kurikulum.pengguna.index')->with('error', 'Gagal menghapus pengguna. Terjadi kesalahan: ' . $e->getMessage());
        }
    }
}

