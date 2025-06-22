import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Jadwal, type PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CalendarClock, Eye, Info, PenSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('guru.dashboard'),
    },
];

interface GuruDashboardPageProps extends PageProps {
    jadwalHariIni: Jadwal[];
    error?: string;
}

export default function GuruDashboard() {
    const { jadwalHariIni, error, auth } = usePage<GuruDashboardPageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Guru" />
            <div className="space-y-6 p-4 md:p-8">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard Guru</h1>
                    <p className="text-muted-foreground">Selamat datang, {auth.user.name}. Berikut adalah jadwal mengajar Anda hari ini.</p>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-4">
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                        <CalendarClock className="h-6 w-6" />
                        Jadwal Hari Ini
                    </h2>

                    {jadwalHariIni.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {jadwalHariIni.map((jadwal) => (
                                <Card key={jadwal.jadwal_id} className="flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{jadwal.mapel.nama_mapel}</CardTitle>
                                                <CardDescription>
                                                    {jadwal.kelas.nama_kelas} - {jadwal.hari}, Pukul {jadwal.jam_mulai} -{' '}
                                                    {jadwal.jam_selesai}
                                                </CardDescription>
                                            </div>
                                            {jadwal.sudah_diisi && (
                                                <Badge className="border-transparent bg-emerald-500 text-primary-foreground shadow hover:bg-emerald-500/80">Selesai</Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <div className="text-sm text-muted-foreground">
                                            <p>Hari: {jadwal.hari}</p>
                                            <p>Jam: {jadwal.jam_mulai.slice(0, 5)} - {jadwal.jam_selesai.slice(0, 5)}</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Link
                                            href={jadwal.sudah_diisi && jadwal.jurnal_id ? route('guru.jurnal.show', { jurnal: jadwal.jurnal_id }) : route('guru.jurnal.isi', { jadwal: jadwal.jadwal_id })}
                                            className={cn(
                                                buttonVariants({
                                                    variant: jadwal.sudah_diisi ? 'default' : 'default',
                                                }),
                                                'w-full',
                                                jadwal.sudah_diisi && 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                            )}
                                            aria-disabled={false} // Tombol selalu aktif
                                            as='a' // Selalu menjadi link
                                        >
                                            {jadwal.sudah_diisi ? (
                                                <><Eye className="mr-2 h-4 w-4" /> Lihat Jurnal Belajar</>
                                            ) : (
                                                <><PenSquare className="mr-2 h-4 w-4" /> Isi Jurnal & Absensi</>
                                            )}
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
                            <Info className="h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">Tidak Ada Jadwal Mengajar</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Anda tidak memiliki jadwal mengajar untuk hari ini.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

