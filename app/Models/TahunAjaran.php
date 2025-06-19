<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TahunAjaran extends Model
{
    use HasFactory;

    protected $table = 'tahun_ajaran';

    /**
     * Get all of the kelas for the TahunAjaran
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function kelas(): HasMany
    {
        return $this->hasMany(Kelas::class, 'tahun_ajaran_id');
    }

    /**
     * Get all of the waliKelas for the TahunAjaran
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function waliKelas(): HasMany
    {
        return $this->hasMany(WaliKelas::class, 'tahun_ajaran_id');
    }

    /**
     * Get all of the jadwal for the TahunAjaran
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function jadwal(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'tahun_ajaran_id');
    }
}
