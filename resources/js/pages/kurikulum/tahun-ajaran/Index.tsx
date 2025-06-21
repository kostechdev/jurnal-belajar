import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/pagination';
import { type PageProps, type TahunAjaran } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, PlusIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface TahunAjaranIndexPageProps extends PageProps {
    tahunAjarans: {
        data: TahunAjaran[];
        links: any[];
    };
}

export default function TahunAjaranIndex() {
    const { tahunAjarans, flash } = usePage<TahunAjaranIndexPageProps>().props;

    const [dialogOpen, setDialogOpen] = useState(false);
    const [tahunAjaranToDelete, setTahunAjaranToDelete] = useState<TahunAjaran | null>(null);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleDelete = () => {
        if (tahunAjaranToDelete) {
            router.delete(route('kurikulum.tahun-ajaran.destroy', tahunAjaranToDelete.id), {
                onSuccess: () => {
                    setDialogOpen(false);
                },
                onError: () => {
                    setDialogOpen(false);
                },
            });
        }
    };

    const openDeleteDialog = (tahunAjaran: TahunAjaran) => {
        setTahunAjaranToDelete(tahunAjaran);
        setDialogOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Manajemen Tahun Ajaran" />
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Manajemen Tahun Ajaran</CardTitle>
                        <Link href={route('kurikulum.tahun-ajaran.create')} className={buttonVariants()}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Tambah Tahun Ajaran
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tahun Ajaran</TableHead>
                                <TableHead>Semester</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-32">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tahunAjarans.data.length > 0 ? (
                                tahunAjarans.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.tahun_ajaran}</TableCell>
                                        <TableCell>{item.semester}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.status === 'Aktif' ? 'default' : 'secondary'}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="space-x-2">
                                            <Link
                                                href={route('kurikulum.tahun-ajaran.edit', item.id)}
                                                className={buttonVariants({ variant: 'outline', size: 'icon' })}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => openDeleteDialog(item)}
                                                disabled={item.status === 'Aktif'}
                                            >
                                                <Trash2Icon className="h-4 w-4" />
                                            </Button>
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
                    <Pagination links={tahunAjarans.links} />
                </CardContent>
            </Card>

            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus data tahun ajaran: {tahunAjaranToDelete?.tahun_ajaran} Semester {tahunAjaranToDelete?.semester}. Anda tidak dapat membatalkan tindakan ini.
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
