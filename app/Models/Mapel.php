<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mapel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'mapel';
    protected $primaryKey = 'mapel_id';

    protected $fillable = [
        'kode_mapel',
        'nama_mapel',
        'deskripsi',
    ];

    /**
     * Get all of the jadwal for the Mapel.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function jadwal(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'mapel_id');
    }
}
