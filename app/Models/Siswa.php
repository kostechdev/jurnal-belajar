<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Siswa extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'siswa';
    protected $primaryKey = 'siswa_id';

    protected $fillable = [
        'NIS',
        'NISN',
        'nama_lengkap',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'alamat',
        'no_telepon_wali',
        'kelas_id',
        'status_siswa',
    ];

    /**
     * Get the kelas that owns the Siswa.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    /**
     * Get all of the kehadiran for the Siswa.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function kehadiran(): HasMany
    {
        return $this->hasMany(Kehadiran::class, 'siswa_id');
    }
}
