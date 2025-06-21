<?php

namespace App\Http\Controllers\Kurikulum;

use App\Http\Controllers\Controller;
use App\Models\Mapel;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MapelController extends Controller
{
    public function index()
    {
        return Inertia::render('kurikulum/mapel/Index', [
            'mapel' => Mapel::orderBy('kode_mapel')->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('kurikulum/mapel/Form');
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode_mapel' => 'required|string|max:255|unique:mapel,kode_mapel',
            'nama_mapel' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        Mapel::create($request->all());

        return redirect()->route('kurikulum.mapel.index')->with('success', 'Mata pelajaran berhasil ditambahkan.');
    }

    public function edit(string $id)
    {
        return Inertia::render('kurikulum/mapel/Form', [
            'mapel' => Mapel::findOrFail($id),
        ]);
    }

    public function update(Request $request, string $id)
    {
        $mapel = Mapel::findOrFail($id);

        $request->validate([
            'kode_mapel' => ['required', 'string', 'max:255', Rule::unique('mapel')->ignore($mapel->mapel_id, 'mapel_id')],
            'nama_mapel' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        $mapel->update($request->all());

        return redirect()->route('kurikulum.mapel.index')->with('success', 'Mata pelajaran berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $mapel = Mapel::findOrFail($id);
        $mapel->delete();

        return redirect()->route('kurikulum.mapel.index')->with('success', 'Mata pelajaran berhasil dihapus.');
    }
}
