<?php

namespace App\Http\Controllers\Kurikulum;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $kelasQuery = Kelas::with(['siswa' => function ($query) use ($search) {
            if ($search) {
                $query->where('nama_lengkap', 'like', '%' . $search . '%')
                    ->orWhere('NIS', 'like', '%' . $search . '%');
            }
            $query->orderBy('nama_lengkap');
        }])->orderBy('tingkat')->orderBy('jurusan')->orderBy('rombel');

        if ($search) {
            $kelasQuery->whereHas('siswa', function ($query) use ($search) {
                $query->where('nama_lengkap', 'like', '%' . $search . '%')
                    ->orWhere('NIS', 'like', '%' . $search . '%');
            });
        }

        return Inertia::render('kurikulum/siswa/Index', [
            'kelasWithSiswa' => $kelasQuery->get(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('kurikulum/siswa/Form', [
            'kelas' => Kelas::orderBy('tingkat')->orderBy('jurusan')->orderBy('rombel')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'NIS' => 'required|string|max:255|unique:siswa,NIS',
            'NISN' => 'nullable|string|max:255|unique:siswa,NISN',
            'nama_lengkap' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'kelas_id' => 'required|exists:kelas,kelas_id',
            'status_siswa' => 'required|in:Aktif,Lulus,Pindah,Keluar',
            'tempat_lahir' => 'nullable|string|max:255',
            'alamat' => 'nullable|string',
            'nomor_telepon_siswa' => 'nullable|string|max:20',
            'nama_wali_murid' => 'nullable|string|max:255',
            'nomor_telepon_wali_murid' => 'nullable|string|max:20',
        ]);

        Siswa::create($request->all());

        return redirect()->route('kurikulum.siswa.index')->with('success', 'Siswa berhasil ditambahkan.');
    }

    public function edit(string $id)
    {
        return Inertia::render('kurikulum/siswa/Form', [
            'siswa' => Siswa::findOrFail($id),
            'kelas' => Kelas::orderBy('tingkat')->orderBy('jurusan')->orderBy('rombel')->get(),
        ]);
    }

    public function update(Request $request, string $id)
    {
        $siswa = Siswa::findOrFail($id);

        $request->validate([
            'NIS' => ['required', 'string', 'max:255', Rule::unique('siswa')->ignore($siswa->siswa_id, 'siswa_id')],
            'NISN' => ['nullable', 'string', 'max:255', Rule::unique('siswa')->ignore($siswa->siswa_id, 'siswa_id')],
            'nama_lengkap' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'kelas_id' => 'required|exists:kelas,kelas_id',
            'status_siswa' => 'required|in:Aktif,Lulus,Pindah,Keluar',
            'tempat_lahir' => 'nullable|string|max:255',
            'alamat' => 'nullable|string',
            'nomor_telepon_siswa' => 'nullable|string|max:20',
            'nama_wali_murid' => 'nullable|string|max:255',
            'nomor_telepon_wali_murid' => 'nullable|string|max:20',
        ]);

        $siswa->update($request->all());

        return redirect()->route('kurikulum.siswa.index')->with('success', 'Data siswa berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $siswa = Siswa::findOrFail($id);
        $siswa->delete();

        return redirect()->route('kurikulum.siswa.index')->with('success', 'Data siswa berhasil dihapus.');
    }
}
