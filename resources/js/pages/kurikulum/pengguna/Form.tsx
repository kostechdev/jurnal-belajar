import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { PageProps, User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormProps extends PageProps {
    user?: User & {
        guru: {
            nama_lengkap: string;
            NIP: string;
            alamat: string | null;
            nomor_telepon: string | null;
            tanggal_lahir: string | null;
            tempat_lahir: string | null;
            jenis_kelamin: 'L' | 'P' | null;
        } | null;
        kurikulum: {
            nama_lengkap: string;
            NIP_NIDN: string;
            alamat: string | null;
            nomor_telepon: string | null;
            tanggal_lahir: string | null;
            tempat_lahir: string | null;
            jenis_kelamin: 'L' | 'P' | null;
        } | null;
    };
}

export default function Form({ user }: FormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        nama_lengkap: user?.guru?.nama_lengkap || user?.kurikulum?.nama_lengkap || '',
        email: user?.email || '',
        role: user?.role || 'guru',
        password: '',
        password_confirmation: '',
        NIP: user?.guru?.NIP || '',
        NIP_NIDN: user?.kurikulum?.NIP_NIDN || '',
        tempat_lahir: user?.guru?.tempat_lahir || user?.kurikulum?.tempat_lahir || '',
        jenis_kelamin: user?.guru?.jenis_kelamin || user?.kurikulum?.jenis_kelamin || null,
        tanggal_lahir: user?.guru?.tanggal_lahir || user?.kurikulum?.tanggal_lahir || '',
        alamat: user?.guru?.alamat || user?.kurikulum?.alamat || '',
        nomor_telepon: user?.guru?.nomor_telepon || user?.kurikulum?.nomor_telepon || '',
    });

    const title = user ? 'Edit Pengguna' : 'Tambah Pengguna';
    const description = user ? 'Edit detail pengguna yang sudah ada.' : 'Tambah pengguna baru ke dalam sistem.';

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (user) {
            put(route('kurikulum.pengguna.update', user.id), {
                preserveScroll: true,
            });
        } else {
            post(route('kurikulum.pengguna.store'), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Manajemen Pengguna', href: route('kurikulum.pengguna.index') },
                { title: user ? 'Edit' : 'Tambah' },
            ]}>
            <Head title={title} />

            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="grid w-full items-center gap-1.5 md:col-span-2">
                            <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                            <Input
                                type="text"
                                id="nama_lengkap"
                                value={data.nama_lengkap}
                                onChange={(e) => setData('nama_lengkap', e.target.value)}
                                required
                            />
                            {errors.nama_lengkap && <p className="text-sm text-red-500">{errors.nama_lengkap}</p>}
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="role">Role</Label>
                            <Select value={data.role} onValueChange={(value) => setData('role', value as 'kurikulum' | 'guru')} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="kurikulum">Kurikulum</SelectItem>
                                    <SelectItem value="guru">Guru</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                        </div>

                        {data.role === 'guru' && (
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="NIP">NIP</Label>
                                <Input
                                    type="text"
                                    id="NIP"
                                    value={data.NIP}
                                    onChange={(e) => setData('NIP', e.target.value)}
                                    required
                                    maxLength={18}
                                />
                                {errors.NIP && <p className="text-sm text-red-500">{errors.NIP}</p>}
                            </div>
                        )}

                        {data.role === 'kurikulum' && (
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="NIP_NIDN">NIP</Label>
                                <Input
                                    type="text"
                                    id="NIP_NIDN"
                                    value={data.NIP_NIDN}
                                    onChange={(e) => setData('NIP_NIDN', e.target.value)}
                                    required
                                />
                                {errors.NIP_NIDN && <p className="text-sm text-red-500">{errors.NIP_NIDN}</p>}
                            </div>
                        )}

                        {(data.role === 'guru' || data.role === 'kurikulum') && (
                            <>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                                    <Input
                                        type="text"
                                        id="tempat_lahir"
                                        value={data.tempat_lahir ?? ''}
                                        onChange={(e) => setData('tempat_lahir', e.target.value)}
                                    />
                                    {errors.tempat_lahir && <p className="text-sm text-red-500">{errors.tempat_lahir}</p>}
                                </div>

                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                    <Input
                                        type="date"
                                        id="tanggal_lahir"
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
                                        type="tel"
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
                                        onChange={(e) => setData('alamat', e.target.value)}
                                    />
                                    {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                                </div>
                            </>
                        )}

                        <div className="relative grid w-full items-center gap-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required={!user}
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
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required={!user}
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

                        <div className="col-span-1 flex justify-end gap-2 md:col-span-2">
                            <Link href={route('kurikulum.pengguna.index')}>
                                <Button variant="outline" type="button">
                                    Kembali
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {user ? 'Simpan Perubahan' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
