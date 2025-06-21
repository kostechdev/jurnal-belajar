<?php

namespace App\Http\Controllers\Kurikulum;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class KelasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('kurikulum/kelas/Index', [
            'kelas' => Kelas::orderBy('tingkat')->orderBy('jurusan')->orderBy('rombel')->paginate(10),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('kurikulum/kelas/Form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'tingkat' => 'required|in:X,XI,XII',
            'jurusan' => 'required|string|max:255',
            'rombel' => [
                'required',
                'string',
                'max:255',
                Rule::unique('kelas')->where(function ($query) use ($request) {
                    return $query->where('tingkat', $request->tingkat)
                                 ->where('jurusan', $request->jurusan);
                }),
            ],
        ]);

        Kelas::create($request->all());

        return redirect()->route('kurikulum.kelas.index')->with('success', 'Kelas berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Inertia::render('kurikulum/kelas/Form', [
            'kelas' => Kelas::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $kelas = Kelas::findOrFail($id);

        $request->validate([
            'tingkat' => 'required|in:X,XI,XII',
            'jurusan' => 'required|string|max:255',
            'rombel' => [
                'required',
                'string',
                'max:255',
                Rule::unique('kelas')->where(function ($query) use ($request) {
                    return $query->where('tingkat', $request->tingkat)
                                 ->where('jurusan', $request->jurusan);
                })->ignore($kelas->kelas_id, 'kelas_id'),
            ],
        ]);

        $kelas->update($request->all());

        return redirect()->route('kurikulum.kelas.index')->with('success', 'Kelas berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $kelas = Kelas::findOrFail($id);
        $kelas->delete();

        return redirect()->route('kurikulum.kelas.index')->with('success', 'Kelas berhasil dihapus.');
    }
}
