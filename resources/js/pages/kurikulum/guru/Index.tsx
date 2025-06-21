import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Guru, GuruIndexPageProps, PaginationLinkItem } from '@/types';

export default function Index() {
    const { gurus, flash } = usePage<GuruIndexPageProps>().props;
    const [guruToDelete, setGuruToDelete] = useState<Guru | null>(null);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    return (
        <AppSidebarLayout>
            <Head title="Manajemen Guru" />
            <div className="p-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={route('kurikulum.dashboard')}>Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>Guru</BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <Card className="mt-4">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Manajemen Guru</CardTitle>
                            <Button asChild>
                                <Link href={route('kurikulum.guru.create')}>Tambah Guru</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIP</TableHead>
                                    <TableHead>Nama Lengkap</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {gurus.data.map((guru: Guru) => (
                                    <TableRow key={guru.guru_id}>
                                        <TableCell>{guru.NIP}</TableCell>
                                        <TableCell>{guru.nama_lengkap}</TableCell>
                                        <TableCell>{guru.user?.email}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('kurikulum.guru.edit', guru.guru_id)}>Edit</Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" size="sm" onClick={() => setGuruToDelete(guru)}>
                                                            Hapus
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    {guruToDelete && guruToDelete.guru_id === guru.guru_id && (
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Tindakan ini tidak bisa dibatalkan. Ini akan menghapus data guru secara permanen.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel onClick={() => setGuruToDelete(null)}>Batal</AlertDialogCancel>
                                                                <AlertDialogAction asChild>
                                                                    <Link href={route('kurikulum.guru.destroy', guru.guru_id)} method="delete" as="button" onClick={() => setGuruToDelete(null)}>
                                                                        Hapus
                                                                    </Link>
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    )}
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Pagination className="mt-4">
                            <PaginationContent>
                                {gurus.links.map((link: PaginationLinkItem, index: number) => (
                                    <PaginationItem key={index}>
                                        <PaginationLink href={link.url ?? ''} isActive={link.active} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </PaginationItem>
                                ))}
                            </PaginationContent>
                        </Pagination>
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
