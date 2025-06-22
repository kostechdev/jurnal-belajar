<?php

namespace App\Policies;

use App\Models\JurnalMengajar;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class JurnalMengajarPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, JurnalMengajar $jurnalMengajar): bool
    {
        return $user->guru->guru_id === $jurnalMengajar->jadwal->guru_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, JurnalMengajar $jurnalMengajar): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, JurnalMengajar $jurnalMengajar): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, JurnalMengajar $jurnalMengajar): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, JurnalMengajar $jurnalMengajar): bool
    {
        return false;
    }
}
