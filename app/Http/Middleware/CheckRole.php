<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if ($request->user()->role !== $role) {
            // Jika peran tidak cocok, alihkan ke dasbor yang sesuai dengan peran pengguna.
            $userRole = $request->user()->role;
            $dashboardRoute = $userRole === 'wali_kelas' ? 'wali-kelas.dashboard' : "{$userRole}.dashboard";
            return redirect()->route($dashboardRoute);
        }

        return $next($request);
    }
}
