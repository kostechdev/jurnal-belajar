import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type WaliKelas, type WaliKelasIndexPageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, PlusIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/pagination';

export default function WaliKelasIndex() {
    const { waliKelas, flash } = usePage<WaliKelasIndexPageProps>().props;

    const [dialogOpen, setDialogOpen] = useState(false);
    const [waliKelasToDelete, setWaliKelasToDelete] = useState<WaliKelas | null>(null);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleDelete = () => {
        if (waliKelasToDelete) {
            router.delete(route('kurikulum.walikelas.destroy', waliKelasToDelete.wali_kelas_id), {
                onSuccess: () => {
                    setDialogOpen(false);
                },
                onError: () => {
                    toast.error('Gagal menghapus penetapan wali kelas.');
                    setDialogOpen(false);
                },
            });
        }
    };

    const openDeleteDialog = (item: WaliKelas) => {
        setWaliKelasToDelete(item);
        setDialogOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Manajemen Wali Kelas" />
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Manajemen Wali Kelas</CardTitle>
                        <Link href={route('kurikulum.walikelas.create')} className={buttonVariants()}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Tetapkan Wali Kelas
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>NIP</TableHead>
                                <TableHead>Nama Guru</TableHead>
                                <TableHead>Kelas</TableHead>
                                <TableHead>Tahun Ajaran</TableHead>
                                <TableHead className="w-20">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {waliKelas.data.length > 0 ? (
                                waliKelas.data.map((item) => (
                                    <TableRow key={item.wali_kelas_id}>
                                        <TableCell>{item.guru.NIP}</TableCell>
                                        <TableCell>{item.guru.nama_lengkap}</TableCell>
                                                                                <TableCell>{`${item.kelas.tingkat} ${item.kelas.jurusan}`}</TableCell>
                                        <TableCell>{item.tahun_ajaran.tahun_ajaran} - {item.tahun_ajaran.semester}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route('kurikulum.walikelas.edit', item.wali_kelas_id)}
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
                                    <TableCell colSpan={5} className="text-center">
                                        Tidak ada data.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Pagination links={waliKelas.links} />
                </CardContent>
            </Card>

            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus penetapan untuk guru{' '}
                            <span className="font-semibold">{waliKelasToDelete?.guru.nama_lengkap}</span> sebagai wali kelas{' '}
                            <span className="font-semibold">{`${waliKelasToDelete?.kelas.tingkat} ${waliKelasToDelete?.kelas.jurusan}`}</span>. Anda tidak dapat membatalkan tindakan ini.
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
