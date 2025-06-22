<?php

namespace App\Http\Middleware;

use App\Models\TahunAjaran;
use App\Models\WaliKelas;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsWaliKelas
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        $guru = $user->guru;

        if (!$guru) {
            abort(403, 'Anda bukan seorang guru.');
        }

        $tahunAjaranAktif = TahunAjaran::where('status', 'Aktif')->first();

        if (!$tahunAjaranAktif) {
            abort(403, 'Tidak ada tahun ajaran yang aktif.');
        }

        $isWaliKelas = WaliKelas::where('guru_id', $guru->guru_id)
            ->where('tahun_ajaran_id', $tahunAjaranAktif->id)
            ->exists();

        if ($isWaliKelas) {
            return $next($request);
        }

        abort(403, 'Anda tidak memiliki akses sebagai wali kelas untuk tahun ajaran ini.');
    }
}
