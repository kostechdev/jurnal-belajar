import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type Siswa, type SiswaIndexPageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, PlusIcon, Trash2Icon } from 'lucide-react';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function SiswaIndex() {
    const { kelasWithSiswa, filters, flash } = usePage<SiswaIndexPageProps>().props;

    const [dialogOpen, setDialogOpen] = useState(false);
    const [siswaToDelete, setSiswaToDelete] = useState<Siswa | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            router.get(route('kurikulum.siswa.index'), { search: value }, { preserveState: true, replace: true });
        }, 300),
        []
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handleDelete = () => {
        if (siswaToDelete) {
            router.delete(route('kurikulum.siswa.destroy', siswaToDelete.siswa_id), {
                onSuccess: () => setDialogOpen(false),
                onError: () => {
                    toast.error('Gagal menghapus data siswa.');
                    setDialogOpen(false);
                },
            });
        }
    };

    const openDeleteDialog = (item: Siswa) => {
        setSiswaToDelete(item);
        setDialogOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Manajemen Siswa" />
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                        <CardTitle>Manajemen Siswa</CardTitle>
                        <div className="flex items-center gap-2">
                            <Input
                                type="search"
                                placeholder="Cari NIS atau Nama..."
                                value={search}
                                onChange={handleSearchChange}
                                className="w-64"
                            />
                            <Link href={route('kurikulum.siswa.create')} className={buttonVariants()}>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Tambah Siswa
                            </Link>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" className="w-full">
                        {kelasWithSiswa.length > 0 ? (
                            kelasWithSiswa.map(
                                (kelas) =>
                                    kelas.siswa &&
                                    kelas.siswa.length > 0 && (
                                        <AccordionItem value={`kelas-${kelas.kelas_id}`} key={kelas.kelas_id}>
                                            <AccordionTrigger>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">
                                                        {`${kelas.tingkat} ${kelas.jurusan} ${kelas.rombel}`}
                                                    </span>
                                                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                                                        {kelas.siswa.length} siswa
                                                    </span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>NIS</TableHead>
                                                            <TableHead>Nama Lengkap</TableHead>
                                                            <TableHead>Jenis Kelamin</TableHead>
                                                            <TableHead className="w-20">Aksi</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {kelas.siswa.map((item) => (
                                                            <TableRow key={item.siswa_id}>
                                                                <TableCell>{item.NIS}</TableCell>
                                                                <TableCell>{item.nama_lengkap}</TableCell>
                                                                <TableCell>{item.jenis_kelamin}</TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center gap-2">
                                                                        <Link
                                                                            href={route('kurikulum.siswa.edit', item.siswa_id)}
                                                                            className={buttonVariants({ variant: 'outline', size: 'icon' })}
                                                                        >
                                                                            <Edit className="h-4 w-4" />
                                                                        </Link>
                                                                        <Button
                                                                            variant="destructive"
                                                                            size="icon"
                                                                            onClick={() => openDeleteDialog(item)}
                                                                        >
                                                                            <Trash2Icon className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                            )
                        ) : (
                            <div className="py-4 text-center text-muted-foreground">
                                {filters.search
                                    ? 'Tidak ada siswa yang cocok dengan pencarian Anda.'
                                    : 'Tidak ada data siswa.'}
                            </div>
                        )}
                    </Accordion>
                </CardContent>
            </Card>

            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus data siswa{' '}
                            <span className="font-semibold">{siswaToDelete?.nama_lengkap}</span>. Anda tidak dapat membatalkan tindakan ini.
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
