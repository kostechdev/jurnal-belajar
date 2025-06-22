import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Kelas, type PageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

interface RekapSiswa {
    siswa_id: number;
    nama_lengkap: string;
    nis: string;
    stats: {
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
    };
}

interface AbsensiIndexPageProps extends PageProps {
    kelas: Kelas | null;
    rekapSiswa: RekapSiswa[];
    error?: string;
    filters: {
        filter?: string;
    };
}

export default function AbsensiIndex() {
    const { kelas, rekapSiswa, error, filters } = usePage<AbsensiIndexPageProps>().props;

    const handleFilterChange = (newFilter: string) => {
        router.get(
            route('wali-kelas.wali-kelas.absensi.index'),
            { filter: newFilter },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const totals = useMemo(() => {
        return rekapSiswa.reduce(
            (acc, current) => {
                acc.hadir += current.stats.hadir;
                acc.sakit += current.stats.sakit;
                acc.izin += current.stats.izin;
                acc.alpa += current.stats.alpa;
                return acc;
            },
            { hadir: 0, sakit: 0, izin: 0, alpa: 0 }
        );
    }, [rekapSiswa]);

    return (
        <AppLayout>
            <Head title={`Rekap Absensi ${kelas?.nama_kelas ?? ''}`} />

            <div className="space-y-6 p-4 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Rekapitulasi Absensi</CardTitle>
                        {kelas ? (
                            <CardDescription>Kelas: {kelas.nama_kelas}</CardDescription>
                        ) : (
                            <CardDescription>Tidak ada data kelas yang dapat ditampilkan.</CardDescription>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center space-x-2">
                            <Button
                                variant={filters.filter === 'harian' ? 'default' : 'outline'}
                                onClick={() => handleFilterChange('harian')}>
                                Harian
                            </Button>
                            <Button
                                variant={filters.filter === 'mingguan' ? 'default' : 'outline'}
                                onClick={() => handleFilterChange('mingguan')}>
                                Mingguan
                            </Button>
                            <Button
                                variant={filters.filter === 'bulanan' ? 'default' : 'outline'}
                                onClick={() => handleFilterChange('bulanan')}>
                                Bulanan
                            </Button>
                            <Button
                                variant={!filters.filter || filters.filter === 'semester' ? 'default' : 'outline'}
                                onClick={() => handleFilterChange('semester')}>
                                Semester
                            </Button>
                        </div>

                        {error ? (
                            <div className="text-center text-red-500">{error}</div>
                        ) : rekapSiswa.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[10px]">No</TableHead>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead>NIS</TableHead>
                                        <TableHead className="text-center font-bold text-green-600">Hadir</TableHead>
                                        <TableHead className="text-center font-bold text-yellow-600">Sakit</TableHead>
                                        <TableHead className="text-center font-bold text-blue-600">Izin</TableHead>
                                        <TableHead className="text-center font-bold text-red-600">Alpa</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rekapSiswa.map((item, index) => (
                                        <TableRow key={item.siswa_id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.nama_lengkap}</TableCell>
                                            <TableCell>{item.nis}</TableCell>
                                            <TableCell className="text-center font-bold text-green-600">{item.stats.hadir}</TableCell>
                                            <TableCell className="text-center font-bold text-yellow-600">{item.stats.sakit}</TableCell>
                                            <TableCell className="text-center font-bold text-blue-600">{item.stats.izin}</TableCell>
                                            <TableCell className="text-center font-bold text-red-600">{item.stats.alpa}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-right font-bold">
                                            Total
                                        </TableCell>
                                        <TableCell className="text-center font-bold text-green-600">{totals.hadir}</TableCell>
                                        <TableCell className="text-center font-bold text-yellow-600">{totals.sakit}</TableCell>
                                        <TableCell className="text-center font-bold text-blue-600">{totals.izin}</TableCell>
                                        <TableCell className="text-center font-bold text-red-600">{totals.alpa}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        ) : (
                            <div className="text-center text-muted-foreground">Belum ada data absensi untuk ditampilkan.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

