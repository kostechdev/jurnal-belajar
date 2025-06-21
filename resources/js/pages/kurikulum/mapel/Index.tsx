import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Mapel, type MapelIndexPageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, PlusIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/pagination';

export default function MapelIndex() {
    const { mapel, flash } = usePage<MapelIndexPageProps>().props;

    const [dialogOpen, setDialogOpen] = useState(false);
    const [mapelToDelete, setMapelToDelete] = useState<Mapel | null>(null);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleDelete = () => {
        if (mapelToDelete) {
            router.delete(route('kurikulum.mapel.destroy', mapelToDelete.mapel_id), {
                onSuccess: () => setDialogOpen(false),
                onError: () => {
                    toast.error('Gagal menghapus mata pelajaran.');
                    setDialogOpen(false);
                },
            });
        }
    };

    const openDeleteDialog = (item: Mapel) => {
        setMapelToDelete(item);
        setDialogOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Manajemen Mata Pelajaran" />
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Manajemen Mata Pelajaran</CardTitle>
                        <Link href={route('kurikulum.mapel.create')} className={buttonVariants()}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Tambah Mata Pelajaran
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kode</TableHead>
                                <TableHead>Nama Mata Pelajaran</TableHead>
                                <TableHead>Deskripsi</TableHead>
                                <TableHead className="w-20">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mapel.data.length > 0 ? (
                                mapel.data.map((item) => (
                                    <TableRow key={item.mapel_id}>
                                        <TableCell>{item.kode_mapel}</TableCell>
                                        <TableCell>{item.nama_mapel}</TableCell>
                                        <TableCell>{item.deskripsi}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route('kurikulum.mapel.edit', item.mapel_id)}
                                                    className={buttonVariants({ variant: 'outline', size: 'icon' })}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <Button variant="destructive" size="icon" onClick={() => openDeleteDialog(item)}>
                                                    <Trash2Icon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        Tidak ada data.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Pagination links={mapel.links} />
                </CardContent>
            </Card>

            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus mata pelajaran{' '}
                            <span className="font-semibold">{mapelToDelete?.nama_mapel}</span>. Anda tidak dapat membatalkan tindakan ini.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className={buttonVariants({ variant: 'destructive' })}>
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
