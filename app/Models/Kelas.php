<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kelas extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'kelas';
    protected $primaryKey = 'kelas_id';

    protected $fillable = [
        'tingkat',
        'jurusan',
        'rombel',
        'tahun_ajaran_id',
    ];

    protected $appends = ['nama_kelas'];

    /**
     * Get the full name of the class.
     *
     * @return string
     */
    public function getNamaKelasAttribute(): string
    {
        return "{$this->tingkat} {$this->jurusan} {$this->rombel}";
    }

    /**
     * Get the tahun ajaran that owns the Kelas.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }

    /**
     * Get the wali kelas associated with the Kelas.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function waliKelas(): HasOne
    {
        return $this->hasOne(WaliKelas::class, 'kelas_id');
    }

    /**
     * Get all of the siswa for the Kelas.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function siswa(): HasMany
    {
        return $this->hasMany(Siswa::class, 'kelas_id');
    }

    /**
     * Get all of the jadwal for the Kelas.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function jadwal(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'kelas_id');
    }
}
