import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps, type JurnalMengajar } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, School, Book, Activity } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('kurikulum.dashboard'),
    },
];

interface KurikulumDashboardPageProps extends PageProps {
    stats: {
        jumlah_guru: number;
        jumlah_siswa: number;
        jumlah_kelas: number;
        jumlah_mapel: number;
    };
    jurnalStats: {
        total: number;
        terisi: number;
    };
    recentActivities: JurnalMengajar[];
}

export default function KurikulumDashboard() {
    const { stats, jurnalStats, recentActivities } = usePage<KurikulumDashboardPageProps>().props;
    const progressPercentage = jurnalStats.total > 0 ? (jurnalStats.terisi / jurnalStats.total) * 100 : 0;

    const getProgressColor = (percentage: number) => {
        if (percentage < 50) return 'text-red-500';
        if (percentage < 80) return 'text-yellow-500';
        return 'text-green-500';
    };

    const progressColorClass = getProgressColor(progressPercentage);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Kurikulum" />
            <div className="space-y-8 p-4 md:p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Dashboard Kurikulum</h1>
                    <p className="text-muted-foreground">Ringkasan data penting dan aktivitas terbaru dalam sistem.</p>
                </div>

                <div className="grid cursor-pointer gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Link href={route('kurikulum.guru.index')}>
                        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 transition-all hover:shadow-lg hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Jumlah Guru</CardTitle>
                                <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.jumlah_guru}</div>
                                <p className="text-xs text-blue-700 dark:text-blue-300">Total guru aktif</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href={route('kurikulum.siswa.index')}>
                        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 transition-all hover:shadow-lg hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Jumlah Siswa</CardTitle>
                                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.jumlah_siswa}</div>
                                <p className="text-xs text-green-700 dark:text-green-300">Total siswa terdaftar</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href={route('kurikulum.kelas.index')}>
                        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 transition-all hover:shadow-lg hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Jumlah Kelas</CardTitle>
                                <School className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{stats.jumlah_kelas}</div>
                                <p className="text-xs text-yellow-700 dark:text-yellow-300">Total rombongan belajar</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href={route('kurikulum.mapel.index')}>
                        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 transition-all hover:shadow-lg hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">Jumlah Mapel</CardTitle>
                                <Book className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.jumlah_mapel}</div>
                                <p className="text-xs text-purple-700 dark:text-purple-300">Total mata pelajaran</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="flex flex-col lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-base">Jurnal Hari Ini</CardTitle>
                            <CardDescription>Progress pengisian jurnal.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col items-center justify-center gap-4">
                            <div className="relative h-24 w-24">
                                <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-gray-700" strokeWidth="2"></circle>
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="16"
                                        fill="none"
                                        className={`stroke-current ${progressColorClass} transition-all duration-500`}
                                        strokeWidth="2"
                                        strokeDasharray={`${progressPercentage}, 100`}
                                        strokeLinecap="round"
                                        transform="rotate(-90 18 18)"
                                    ></circle>
                                </svg>
                                <div className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${progressColorClass}`}>
                                    {Math.round(progressPercentage)}%
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold">{jurnalStats.terisi} / {jurnalStats.total}</p>
                                <p className="text-xs text-muted-foreground">Guru telah mengisi</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                <CardTitle>Aktivitas Terbaru</CardTitle>
                            </div>
                            <CardDescription>5 jurnal mengajar terakhir yang diisi oleh guru.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[250px]">Guru</TableHead>
                                        <TableHead>Mata Pelajaran</TableHead>
                                        <TableHead>Kelas</TableHead>
                                        <TableHead className="text-right">Waktu</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentActivities.length > 0 ? (
                                        recentActivities.map((activity) => (
                                            <TableRow key={activity.jurnal_id}>
                                                <TableCell className="font-medium">{activity.jadwal.guru.nama_lengkap}</TableCell>
                                                <TableCell>{activity.jadwal.mapel.nama_mapel}</TableCell>
                                                <TableCell className="text-muted-foreground">{`${activity.jadwal.kelas.tingkat} ${activity.jadwal.kelas.jurusan} ${activity.jadwal.kelas.rombel}`}</TableCell>
                                                <TableCell className="text-right text-muted-foreground">{format(new Date(activity.created_at), 'd MMM, HH:mm')}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center h-24">
                                                Belum ada aktivitas hari ini.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
