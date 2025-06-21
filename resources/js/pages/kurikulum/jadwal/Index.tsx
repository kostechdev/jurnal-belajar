import AppLayout from '@/layouts/app-layout';
import { type JadwalIndexPageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { buttonVariants } from '@/components/ui/button';
import { FileSpreadsheet, Settings } from 'lucide-react';

export default function JadwalIndex() {
    const { kelas, flash } = usePage<JadwalIndexPageProps>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success('Berhasil', {
                description: flash.success,
            });
        }
    }, [flash]);

    // TODO: Implement toast notifications for success/error from flash messages

    return (
        <AppLayout>
            <Head title="Manajemen Jadwal Pelajaran" />

            <Card>
                <CardHeader>
                    <CardTitle>Manajemen Jadwal Pelajaran</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kelas</TableHead>
                                <TableHead className="w-48 text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {kelas.length > 0 ? (
                                kelas.map((item) => (
                                    <TableRow key={item.kelas_id}>
                                        <TableCell className="font-medium">
                                            {item.tingkat} {item.jurusan} {item.rombel}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={route('kurikulum.jadwal.edit', item.kelas_id)}
                                                    className={buttonVariants({ variant: 'default', size: 'sm' })}
                                                >
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    Atur Jadwal
                                                </Link>
                                                <a
                                                    href={route('kurikulum.jadwal.export-excel', item.kelas_id)}
                                                    className={buttonVariants({ variant: 'outline', size: 'sm' })}
                                                >
                                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                                    Export Excel
                                                </a>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center">
                                        Tidak ada data kelas. Silakan tambahkan kelas terlebih dahulu.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
