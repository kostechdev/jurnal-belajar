<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Guru extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'guru';
    protected $primaryKey = 'guru_id';

    protected $fillable = [
        'user_id',
        'NIP',
        'nama_lengkap',
        'alamat',
        'no_telepon',
        'tanggal_lahir',
    ];

    /**
     * Get the user that owns the Guru.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get all of the jadwal for the Guru.
     */
    public function jadwal(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'guru_id');
    }

    /**
     * Get all of the waliKelas for the Guru.
     */
    public function waliKelas(): HasMany
    {
        return $this->hasMany(WaliKelas::class, 'guru_id');
    }

    /**
     * Get all of the jurnalMengajar for the Guru.
     */
    public function jurnalMengajar(): HasMany
    {
        return $this->hasMany(JurnalMengajar::class, 'diinput_oleh_guru_id');
    }
}
