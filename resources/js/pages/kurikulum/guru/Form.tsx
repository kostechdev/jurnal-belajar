import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { GuruPageProps } from '@/types';

export default function Form({ guru }: GuruPageProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        nama_lengkap: guru?.nama_lengkap || '',
        NIP: guru?.NIP || '',
        email: guru?.user?.email || '',
        alamat: guru?.alamat || '',
        nomor_telepon: guru?.nomor_telepon || '',
        tanggal_lahir: guru?.tanggal_lahir || '',
        tempat_lahir: guru?.tempat_lahir || '',
        jenis_kelamin: guru?.jenis_kelamin || null,
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
                                <Input id="NIP" value={data.NIP} onChange={(e) => setData('NIP', e.target.value)} required maxLength={18} />
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
                                <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                                <Input
                                    id="tempat_lahir"
                                    value={data.tempat_lahir ?? ''}
                                    onChange={(e) => setData('tempat_lahir', e.target.value)}
                                />
                                {errors.tempat_lahir && <p className="text-sm text-red-500">{errors.tempat_lahir}</p>}
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
                                <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                <Select value={data.jenis_kelamin ?? ''} onValueChange={(value) => setData('jenis_kelamin', value as 'L' | 'P')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jenis kelamin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="L">Laki-laki</SelectItem>
                                        <SelectItem value="P">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.jenis_kelamin && <p className="text-sm text-red-500">{errors.jenis_kelamin}</p>}
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

                            <div className="grid w-full items-center gap-1.5 md:col-span-2">
                                <Label htmlFor="alamat">Alamat</Label>
                                <Textarea
                                    id="alamat"
                                    value={data.alamat ?? ''}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('alamat', e.target.value)}
                                />
                                {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                            </div>

                            <div className="relative grid w-full items-center gap-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required={!guru}
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-6 h-7 w-7"
                                    onClick={() => setShowPassword((prev) => !prev)}>
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            <div className="relative grid w-full items-center gap-1.5">
                                <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required={!guru}
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-6 h-7 w-7"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}>
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
                            </div>

                            <div className="col-span-1 md:col-span-2 flex justify-end gap-2">
                                <Link href={route('kurikulum.guru.index')}>
                                    <Button variant="outline" type="button">
                                        Kembali
                                    </Button>
                                </Link>
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
