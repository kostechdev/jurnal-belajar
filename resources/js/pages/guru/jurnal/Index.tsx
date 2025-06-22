import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type JurnalMengajar, type PageProps, type PaginatedResponse, type PaginationLink } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Info } from 'lucide-react';

interface RiwayatJurnalIndexProps extends PageProps {
    riwayatJurnal: PaginatedResponse<JurnalMengajar>;
}

export default function RiwayatJurnalIndex({ riwayatJurnal }: RiwayatJurnalIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Riwayat Jurnal',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Jurnal Mengajar" />

            <Card>
                <CardHeader>
                    <CardTitle>Riwayat Jurnal Mengajar</CardTitle>
                    <CardDescription>Daftar semua jurnal yang pernah Anda isi.</CardDescription>
                </CardHeader>
                <CardContent>
                    {riwayatJurnal.data.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Mata Pelajaran</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Materi Pembahasan</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {riwayatJurnal.data.map((jurnal) => (
                                    <TableRow key={jurnal.jurnal_id}>
                                        <TableCell>
                                            {format(new Date(jurnal.tanggal), 'dd MMM yyyy', { locale: id })}
                                        </TableCell>
                                        <TableCell>{jurnal.jadwal.mapel.nama_mapel}</TableCell>
                                        <TableCell>{jurnal.jadwal.kelas.nama_kelas}</TableCell>
                                        <TableCell className="truncate max-w-xs">{jurnal.catatan_mengajar}</TableCell>
                                        <TableCell className="text-right">
                                            <Link
                                                href={route('guru.jurnal.show', jurnal.jurnal_id)}
                                                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                                            >
                                                Lihat Detail
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
                            <Info className="h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">Belum Ada Riwayat</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Anda belum pernah mengisi jurnal mengajar.</p>
                        </div>
                    )}
                </CardContent>
                {riwayatJurnal.data.length > 0 && (
                    <div className="flex items-center justify-end space-x-2 p-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                            Menampilkan {riwayatJurnal.from} - {riwayatJurnal.to} dari {riwayatJurnal.total} data.
                        </div>
                        <nav className="flex items-center space-x-1">
                            {riwayatJurnal.links.map((link: PaginationLink, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={cn(
                                        buttonVariants({ variant: link.active ? 'default' : 'outline', size: 'sm' }),
                                        !link.url && 'cursor-not-allowed opacity-50'
                                    )}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    as={!link.url ? 'button' : 'a'}
                                    disabled={!link.url}
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </Card>
        </AppLayout>
    );
}
