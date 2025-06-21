import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type SiswaFormPageProps } from '@/types';
import InputError from '@/components/input-error';

export default function SiswaForm() {
    const { siswa, kelas } = usePage<SiswaFormPageProps>().props;

    const isEditMode = !!siswa;

    const { data, setData, post, put, errors, processing } = useForm({
        NIS: siswa?.NIS ?? '',
        NISN: siswa?.NISN ?? '',
        nama_lengkap: siswa?.nama_lengkap ?? '',
        tempat_lahir: siswa?.tempat_lahir ?? '',
        tanggal_lahir: siswa?.tanggal_lahir ?? '',
        jenis_kelamin: siswa?.jenis_kelamin ?? 'Laki-laki',
        alamat: siswa?.alamat ?? '',
        nomor_telepon_siswa: siswa?.nomor_telepon_siswa ?? '',
        nama_wali_murid: siswa?.nama_wali_murid ?? '',
        nomor_telepon_wali_murid: siswa?.nomor_telepon_wali_murid ?? '',
        kelas_id: siswa?.kelas_id ?? undefined,
        status_siswa: siswa?.status_siswa ?? 'Aktif',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            put(route('kurikulum.siswa.update', siswa.siswa_id));
        } else {
            post(route('kurikulum.siswa.store'));
        }
    };

    return (
        <AppLayout>
            <Head title={isEditMode ? 'Edit Siswa' : 'Tambah Siswa'} />
            <Card>
                <CardHeader>
                    <CardTitle>{isEditMode ? 'Edit Siswa' : 'Tambah Siswa'}</CardTitle>
                    <CardDescription>Lengkapi formulir di bawah ini untuk {isEditMode ? 'memperbarui' : 'menambahkan'} data siswa.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Data Diri Siswa */}
                        <div className="space-y-4 md:col-span-2">
                            <h3 className="text-lg font-medium">Data Diri Siswa</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="NIS">NIS</Label>
                                    <Input id="NIS" value={data.NIS} onChange={(e) => setData('NIS', e.target.value)} />
                                    <InputError message={errors.NIS} className="mt-2" />
                                </div>
                                <div>
                                    <Label htmlFor="NISN">NISN (Opsional)</Label>
                                    <Input id="NISN" value={data.NISN} onChange={(e) => setData('NISN', e.target.value)} />
                                    <InputError message={errors.NISN} className="mt-2" />
                                </div>
                                <div>
                                    <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                                    <Input id="nama_lengkap" value={data.nama_lengkap} onChange={(e) => setData('nama_lengkap', e.target.value)} />
                                    <InputError message={errors.nama_lengkap} className="mt-2" />
                                </div>
                                <div>
                                    <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                    <Select value={data.jenis_kelamin} onValueChange={(value) => setData('jenis_kelamin', value as any)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                            <SelectItem value="Perempuan">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.jenis_kelamin} className="mt-2" />
                                </div>
                                <div>
                                    <Label htmlFor="tempat_lahir">Tempat Lahir (Opsional)</Label>
                                    <Input id="tempat_lahir" value={data.tempat_lahir} onChange={(e) => setData('tempat_lahir', e.target.value)} />
                                    <InputError message={errors.tempat_lahir} className="mt-2" />
                                </div>
                                <div>
                                    <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                    <Input id="tanggal_lahir" type="date" value={data.tanggal_lahir} onChange={(e) => setData('tanggal_lahir', e.target.value)} />
                                    <InputError message={errors.tanggal_lahir} className="mt-2" />
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="alamat">Alamat (Opsional)</Label>
                                    <Textarea id="alamat" value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} />
                                    <InputError message={errors.alamat} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Data Akademik & Wali */}
                        <div className="space-y-4 md:col-span-2">
                            <h3 className="text-lg font-medium">Data Akademik & Wali</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="kelas_id">Kelas</Label>
                                    <Select value={data.kelas_id?.toString()} onValueChange={(value) => setData('kelas_id', Number(value))}>
                                        <SelectTrigger><SelectValue placeholder="Pilih kelas" /></SelectTrigger>
                                        <SelectContent>
                                            {kelas.map((k) => (
                                                <SelectItem key={k.kelas_id} value={k.kelas_id.toString()}>
                                                    {k.tingkat} {k.jurusan} {k.rombel}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.kelas_id} className="mt-2" />
                                </div>
                                <div>
                                    <Label htmlFor="status_siswa">Status Siswa</Label>
                                    <Select value={data.status_siswa} onValueChange={(value) => setData('status_siswa', value as any)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Aktif">Aktif</SelectItem>
                                            <SelectItem value="Lulus">Lulus</SelectItem>
                                            <SelectItem value="Pindah">Pindah</SelectItem>
                                            <SelectItem value="Keluar">Keluar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status_siswa} className="mt-2" />
                                </div>
                                <div>
                                    <Label htmlFor="nomor_telepon_siswa">No. Telepon Siswa (Opsional)</Label>
                                    <Input id="nomor_telepon_siswa" value={data.nomor_telepon_siswa} onChange={(e) => setData('nomor_telepon_siswa', e.target.value)} />
                                    <InputError message={errors.nomor_telepon_siswa} className="mt-2" />
                                </div>
                                <div>
                                    <Label htmlFor="nama_wali_murid">Nama Wali Murid (Opsional)</Label>
                                    <Input id="nama_wali_murid" value={data.nama_wali_murid} onChange={(e) => setData('nama_wali_murid', e.target.value)} />
                                    <InputError message={errors.nama_wali_murid} className="mt-2" />
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="nomor_telepon_wali_murid">No. Telepon Wali (Opsional)</Label>
                                    <Input id="nomor_telepon_wali_murid" value={data.nomor_telepon_wali_murid} onChange={(e) => setData('nomor_telepon_wali_murid', e.target.value)} />
                                    <InputError message={errors.nomor_telepon_wali_murid} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 md:col-span-2">
                            <Button type="button" variant="outline" asChild>
                                <Link href={route('kurikulum.siswa.index')}>Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
