<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kurikulum extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'kurikulum';
    protected $primaryKey = 'kurikulum_id';

    protected $fillable = [
        'user_id',
        'NIP_NIDN',
        'nama_lengkap',
        'alamat',
        'no_telepon',
    ];

    /**
     * Get the user that owns the Kurikulum
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
