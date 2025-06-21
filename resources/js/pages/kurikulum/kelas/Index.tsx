import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Kelas, type KelasIndexPageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, PlusIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/pagination';

export default function KelasIndex() {
    const { kelas, flash } = usePage<KelasIndexPageProps>().props;

    const [dialogOpen, setDialogOpen] = useState(false);
    const [kelasToDelete, setKelasToDelete] = useState<Kelas | null>(null);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleDelete = () => {
        if (kelasToDelete) {
            router.delete(route('kurikulum.kelas.destroy', kelasToDelete.kelas_id), {
                onSuccess: () => setDialogOpen(false),
                onError: () => {
                    toast.error('Gagal menghapus kelas.');
                    setDialogOpen(false);
                },
            });
        }
    };

    const openDeleteDialog = (item: Kelas) => {
        setKelasToDelete(item);
        setDialogOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Manajemen Kelas" />
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Manajemen Kelas</CardTitle>
                        <Link href={route('kurikulum.kelas.create')} className={buttonVariants()}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Tambah Kelas
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tingkat</TableHead>
                                <TableHead>Jurusan</TableHead>
                                <TableHead>Rombel</TableHead>
                                <TableHead className="w-20">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {kelas.data.length > 0 ? (
                                kelas.data.map((item) => (
                                    <TableRow key={item.kelas_id}>
                                        <TableCell>{item.tingkat}</TableCell>
                                        <TableCell>{item.jurusan}</TableCell>
                                        <TableCell>{item.rombel}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route('kurikulum.kelas.edit', item.kelas_id)}
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
                    <Pagination links={kelas.links} />
                </CardContent>
            </Card>

            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus kelas{' '}
                            <span className="font-semibold">{`${kelasToDelete?.tingkat} ${kelasToDelete?.jurusan} ${kelasToDelete?.rombel}`}</span>. Anda tidak dapat membatalkan tindakan ini.
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
