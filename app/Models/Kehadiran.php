<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kehadiran extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'kehadiran';
    protected $primaryKey = 'kehadiran_id';

    protected $fillable = [
        'jurnal_id',
        'siswa_id',
        'tanggal_kehadiran',
        'status_kehadiran',
        'catatan_per_siswa',
    ];

    /**
     * Get the jurnal mengajar that owns the Kehadiran.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function jurnalMengajar(): BelongsTo
    {
        return $this->belongsTo(JurnalMengajar::class, 'jurnal_id');
    }

    /**
     * Get the siswa that owns the Kehadiran.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class, 'siswa_id');
    }
}
