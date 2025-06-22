import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, Kelas, Siswa, RekapSiswa } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileDown } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import React from 'react';

interface LaporanPageProps extends PageProps {
    rekapSiswa: RekapSiswa[];
    kelas: Kelas | null;
    filters: {
        bulan: string;
    };
    error?: string | null;
}

const LaporanIndex: React.FC<LaporanPageProps> = ({ auth, rekapSiswa, kelas, filters, error }) => {

    React.useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const bulan = e.target.value;
        router.get(route('wali-kelas.wali-kelas.laporan.index'), { bulan }, { preserveState: true, replace: true });
    };

    const handleExport = () => {
        const exportUrl = route('wali-kelas.wali-kelas.laporan.export', { bulan: filters.bulan });
        window.open(exportUrl, '_blank');
        toast.success('Laporan sedang dibuat dan akan terbuka di tab baru.');
    };

    const getStatusClass = (status: keyof RekapSiswa['stats']) => {
        switch (status) {
            case 'hadir': return 'text-green-600';
            case 'sakit': return 'text-yellow-600';
            case 'izin': return 'text-blue-600';
            case 'alpa': return 'text-red-600';
            default: return '';
        }
    };

    return (
        <AppLayout>
            <Head title="Laporan Absensi" />
            <Toaster />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>Laporan Absensi Kelas {kelas?.nama_kelas || '...'}</CardTitle>
                                    <CardDescription>Rekapitulasi kehadiran siswa per bulan.</CardDescription>
                                </div>
                                <Link href={route('wali-kelas.dashboard')}>
                                    <Button variant="outline">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Kembali
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex items-center space-x-4">
                                <input
                                    type="month"
                                    value={filters.bulan}
                                    onChange={handleFilterChange}
                                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                />
                                <Button onClick={handleExport} disabled={!rekapSiswa || rekapSiswa.length === 0}>
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Export ke PDF
                                </Button>
                            </div>

                            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">No</TableHead>
                                            <TableHead>Nama Siswa</TableHead>
                                            <TableHead>NIS</TableHead>
                                            <TableHead className="text-center">Hadir</TableHead>
                                            <TableHead className="text-center">Sakit</TableHead>
                                            <TableHead className="text-center">Izin</TableHead>
                                            <TableHead className="text-center">Alpa</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rekapSiswa && rekapSiswa.length > 0 ? (
                                            rekapSiswa.map((item, index) => (
                                                <TableRow key={item.siswa_id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{item.nama_lengkap}</TableCell>
                                                    <TableCell>{item.nis}</TableCell>
                                                    <TableCell className={`text-center font-bold ${getStatusClass('hadir')}`}>{item.stats.hadir}</TableCell>
                                                    <TableCell className={`text-center font-bold ${getStatusClass('sakit')}`}>{item.stats.sakit}</TableCell>
                                                    <TableCell className={`text-center font-bold ${getStatusClass('izin')}`}>{item.stats.izin}</TableCell>
                                                    <TableCell className={`text-center font-bold ${getStatusClass('alpa')}`}>{item.stats.alpa}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center">
                                                    Tidak ada data absensi untuk bulan yang dipilih.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default LaporanIndex;
