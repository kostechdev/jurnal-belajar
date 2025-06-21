<?php

namespace App\Exports;

use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\TahunAjaran;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;

class JadwalExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithTitle
{
    protected $kelas;
    protected $tahunAjaran;

    public function __construct(Kelas $kelas)
    {
        $this->kelas = $kelas;
        $this->tahunAjaran = TahunAjaran::where('status', 'Aktif')->first();
    }

    public function collection()
    {
        return Jadwal::with(['mapel', 'guru'])
            ->where('kelas_id', $this->kelas->kelas_id)
            ->where('tahun_ajaran_id', $this->tahunAjaran->id)
            ->orderBy('hari')
            ->orderBy('jam_mulai')
            ->get();
    }

    public function headings(): array
    {
        return [
            'Hari',
            'Jam Mulai',
            'Jam Selesai',
            'Mata Pelajaran',
            'Guru',
        ];
    }

    public function map($jadwal): array
    {
        return [
            $jadwal->hari,
            $jadwal->jam_mulai,
            $jadwal->jam_selesai,
            $jadwal->mapel->nama_mapel,
            $jadwal->guru->nama_lengkap,
        ];
    }

    public function title(): string
    {
        return 'Jadwal ' . $this->kelas->tingkat . ' ' . $this->kelas->jurusan . ' ' . $this->kelas->rombel;
    }
}
