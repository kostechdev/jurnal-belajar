<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JurnalMengajar extends Model
{
    use HasFactory;

    protected $table = 'jurnal_mengajar';
    protected $primaryKey = 'jurnal_id';

    protected $fillable = [
        'jadwal_id',
        'tanggal',
        'catatan_mengajar',
        'status',
        'diinput_oleh_guru_id',
    ];

    /**
     * Get the jadwal that owns the JurnalMengajar.
     */
    public function jadwal(): BelongsTo
    {
        return $this->belongsTo(Jadwal::class, 'jadwal_id');
    }

    /**
     * Get the guru that inputs the JurnalMengajar.
     */
    public function guru(): BelongsTo
    {
        return $this->belongsTo(Guru::class, 'diinput_oleh_guru_id');
    }

    /**
     * Get all of the kehadiran for the JurnalMengajar.
     */
    public function kehadiran(): HasMany
    {
        return $this->hasMany(Kehadiran::class, 'jurnal_id');
    }
}
