<?php

namespace App\Http\Controllers\Kurikulum;

use App\Http\Controllers\Controller;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TahunAjaranController extends Controller
{
    public function index()
    {
        return Inertia::render('kurikulum/tahun-ajaran/Index', [
            'tahunAjarans' => TahunAjaran::latest()->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('kurikulum/tahun-ajaran/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tahun_ajaran' => ['required', 'string', 'regex:/^\d{4}\/\d{4}$/', Rule::unique('tahun_ajaran')->where('semester', $request->semester)],
            'semester' => ['required', Rule::in(['Ganjil', 'Genap'])],
            'status' => ['required', Rule::in(['Aktif', 'Tidak Aktif'])],
        ], [
            'tahun_ajaran.unique' => 'Kombinasi tahun ajaran dan semester ini sudah ada.',
            'tahun_ajaran.regex' => 'Format tahun ajaran harus YYYY/YYYY (contoh: 2023/2024).',
        ]);

        if ($validated['status'] === 'Aktif') {
            TahunAjaran::where('status', 'Aktif')->update(['status' => 'Tidak Aktif']);
        }

        TahunAjaran::create($validated);

        return redirect()->route('kurikulum.tahun-ajaran.index')->with('success', 'Tahun Ajaran berhasil ditambahkan.');
    }



    public function edit(TahunAjaran $tahunAjaran)
    {
        return Inertia::render('kurikulum/tahun-ajaran/Form', [
            'tahunAjaran' => $tahunAjaran,
        ]);
    }

    public function update(Request $request, TahunAjaran $tahunAjaran)
    {
        $validated = $request->validate([
            'tahun_ajaran' => ['required', 'string', 'regex:/^\d{4}\/\d{4}$/', Rule::unique('tahun_ajaran')->where('semester', $request->semester)->ignore($tahunAjaran->id)],
            'semester' => ['required', Rule::in(['Ganjil', 'Genap'])],
            'status' => ['required', Rule::in(['Aktif', 'Tidak Aktif'])],
        ], [
            'tahun_ajaran.unique' => 'Kombinasi tahun ajaran dan semester ini sudah ada.',
            'tahun_ajaran.regex' => 'Format tahun ajaran harus YYYY/YYYY (contoh: 2023/2024).',
        ]);

        if ($validated['status'] === 'Aktif') {
            TahunAjaran::where('status', 'Aktif')->where('id', '!=', $tahunAjaran->id)->update(['status' => 'Tidak Aktif']);
        }

        $tahunAjaran->update($validated);

        return redirect()->route('kurikulum.tahun-ajaran.index')->with('success', 'Tahun Ajaran berhasil diperbarui.');
    }

    public function destroy(TahunAjaran $tahunAjaran)
    {
        if ($tahunAjaran->status === 'Aktif') {
            return redirect()->route('kurikulum.tahun-ajaran.index')->with('error', 'Tahun ajaran yang aktif tidak dapat dihapus.');
        }

        $tahunAjaran->delete();

        return redirect()->route('kurikulum.tahun-ajaran.index')->with('success', 'Tahun Ajaran berhasil dihapus.');
    }
}
