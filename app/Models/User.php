<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Builder;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['name'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the kurikulum associated with the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function kurikulum(): HasOne
    {
        return $this->hasOne(Kurikulum::class, 'user_id');
    }

    /**
     * Get the guru associated with the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function guru(): HasOne
    {
        return $this->hasOne(Guru::class, 'user_id');
    }

    /**
     * Get the user's name.
     *
     * @return string
     */
    public function getNameAttribute(): string
    {
        if ($this->kurikulum) {
            return $this->kurikulum->nama_lengkap;
        }

        if ($this->guru) {
            return $this->guru->nama_lengkap;
        }

        return 'User'; // Fallback
    }

    /**
     * Scope a query to only include admin users.
     */
    public function scopeAdmin(Builder $query): void
    {
        $query->where('role', 'admin');
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::deleting(function (User $user) {
            // Hapus data terkait di tabel guru atau kurikulum
            if ($user->guru) {
                $user->guru->delete();
            }
            if ($user->kurikulum) {
                $user->kurikulum->delete();
            }
        });
    }

    /**
     * Scope a query to only include kurikulum users.
     */
    public function scopeKurikulum(Builder $query): void
    {
        $query->where('role', 'kurikulum');
    }

    /**
     * Scope a query to only include guru users.
     */
    public function scopeGuru(Builder $query): void
    {
        $query->where('role', 'guru');
    }

    /**
     * Scope a query to only include wali kelas users.
     */

}
