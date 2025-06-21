import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GuruPageProps } from '@/types';

export default function Form({ guru }: GuruPageProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        nama_lengkap: guru?.nama_lengkap || '',
        NIP: guru?.NIP || '',
        email: guru?.user?.email || '',
        alamat: guru?.alamat || '',
        nomor_telepon: guru?.nomor_telepon || '',
        tanggal_lahir: guru?.tanggal_lahir || '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (guru) {
            put(route('kurikulum.guru.update', guru.guru_id));
        } else {
            post(route('kurikulum.guru.store'));
        }
    };

    return (
        <AppSidebarLayout>
            <Head title={`${guru ? 'Edit' : 'Tambah'} Guru`} />
            <div className="p-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={route('kurikulum.dashboard')}>Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={route('kurikulum.guru.index')}>Guru</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>{guru ? 'Edit' : 'Tambah'} Guru</BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>{guru ? 'Edit' : 'Tambah'} Guru</CardTitle>
                        <CardDescription>Lengkapi form di bawah ini untuk {guru ? 'memperbarui' : 'menambahkan'} data guru.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                                <Input
                                    id="nama_lengkap"
                                    value={data.nama_lengkap}
                                    onChange={(e) => setData('nama_lengkap', e.target.value)}
                                    required
                                />
                                {errors.nama_lengkap && <p className="text-sm text-red-500">{errors.nama_lengkap}</p>}
                            </div>

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="NIP">NIP</Label>
                                <Input id="NIP" value={data.NIP} onChange={(e) => setData('NIP', e.target.value)} required />
                                {errors.NIP && <p className="text-sm text-red-500">{errors.NIP}</p>}
                            </div>

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="nomor_telepon">Nomor Telepon</Label>
                                <Input
                                    id="nomor_telepon"
                                    value={data.nomor_telepon ?? ''}
                                    onChange={(e) => setData('nomor_telepon', e.target.value)}
                                />
                                {errors.nomor_telepon && <p className="text-sm text-red-500">{errors.nomor_telepon}</p>}
                            </div>

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                <Input
                                    id="tanggal_lahir"
                                    type="date"
                                    value={data.tanggal_lahir ?? ''}
                                    onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                />
                                {errors.tanggal_lahir && <p className="text-sm text-red-500">{errors.tanggal_lahir}</p>}
                            </div>

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="alamat">Alamat</Label>
                                <Textarea
                                    id="alamat"
                                    value={data.alamat ?? ''}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('alamat', e.target.value)}
                                />
                                {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                            </div>

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required={!guru}
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required={!guru}
                                />
                                {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
                            </div>

                            <div className="col-span-1 md:col-span-2 flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
