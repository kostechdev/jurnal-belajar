<?php

namespace App\Http\Controllers\Kurikulum;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => ['required', Rule::in(['kurikulum', 'guru', 'wali_kelas'])],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return redirect()->route('kurikulum.pengguna.index')->with('success', 'Pengguna berhasil dibuat.');
    }

    public function edit(User $pengguna): Response
    {
        return Inertia::render('kurikulum/pengguna/Form', [
            'user' => $pengguna,
        ]);
    }

    public function update(Request $request, User $pengguna): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($pengguna->id)],
            'password' => 'nullable|string|min:8|confirmed',
            'role' => ['required', Rule::in(['kurikulum', 'guru', 'wali_kelas'])],
        ]);

        $pengguna->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ]);

        if (!empty($validated['password'])) {
            $pengguna->update(['password' => Hash::make($validated['password'])]);
        }

        return redirect()->route('kurikulum.pengguna.index')->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function destroy(User $pengguna): RedirectResponse
    {
        $pengguna->delete();

        return redirect()->route('kurikulum.pengguna.index')->with('success', 'Pengguna berhasil dihapus.');
    }
}

