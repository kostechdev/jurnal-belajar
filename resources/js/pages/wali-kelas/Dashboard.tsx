import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Users, UserCheck, UserX, HandPlatter, ShieldAlert, ClipboardList, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Wali Kelas',
        href: route('wali-kelas.dashboard'),
    },
];

interface DashboardProps {
    namaKelas: string;
    totalSiswa: number;
    summary: {
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
    };
    filters: {
        filter: string;
    };
}

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: LucideIcon; color: string }) => (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${color}`}>
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">{title}</h3>
            <Icon className="h-5 w-5 text-gray-500" />
        </div>
        <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{value}</div>
        </div>
    </div>
);

export default function WaliKelasDashboard({ namaKelas, totalSiswa, summary, filters }: DashboardProps) {
    const filterOptions = [
        { label: 'Hari Ini', value: 'today' },
        { label: 'Minggu Ini', value: 'week' },
        { label: 'Bulan Ini', value: 'month' },
    ];

    const filterLabels: { [key: string]: string } = {
        today: 'hari ini',
        week: 'minggu ini',
        month: 'bulan ini',
    };

    const handleFilterChange = (newFilter: string) => {
        router.get(route('wali-kelas.dashboard'), { filter: newFilter }, { preserveState: true, replace: true });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Wali Kelas" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-bold">Dasbor Wali Kelas</h1>
                    <p className="text-muted-foreground">
                        Ringkasan kelas <strong>{namaKelas}</strong> untuk {filterLabels[filters.filter] || 'hari ini'}.
                    </p>
                </div>

                                <div className="flex items-center gap-2">
                    {filterOptions.map(option => (
                        <Button
                            key={option.value}
                            variant={filters.filter === option.value ? 'default' : 'outline'}
                            onClick={() => handleFilterChange(option.value)}>
                            {option.label}
                        </Button>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <StatCard title="Total Siswa" value={totalSiswa} icon={Users} color="bg-blue-100 border-blue-200" />
                    <StatCard title="Hadir" value={summary.hadir} icon={UserCheck} color="bg-green-100 border-green-200" />
                    <StatCard title="Sakit" value={summary.sakit} icon={HandPlatter} color="bg-yellow-100 border-yellow-200" />
                    <StatCard title="Izin" value={summary.izin} icon={ShieldAlert} color="bg-orange-100 border-orange-200" />
                    <StatCard title="Alpa" value={summary.alpa} icon={UserX} color="bg-red-100 border-red-200" />
                </div>

                <div className="mt-4">
                    <Button asChild>
                        <Link href={route('wali-kelas.wali-kelas.absensi.index')}>
                            <ClipboardList className="mr-2 h-4 w-4" />
                            Lihat Rekap Absensi
                        </Link>
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
