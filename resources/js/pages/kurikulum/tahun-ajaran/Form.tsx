import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { type PageProps, type TahunAjaran } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TahunAjaranFormPageProps extends PageProps {
    tahunAjaran?: TahunAjaran;
}

export default function TahunAjaranForm() {
    const { tahunAjaran } = usePage<TahunAjaranFormPageProps>().props;

    const { data, setData, post, put, errors, processing } = useForm({
        tahun_ajaran: tahunAjaran?.tahun_ajaran || '',
        semester: tahunAjaran?.semester || '',
        status: tahunAjaran?.status || 'Tidak Aktif',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tahunAjaran) {
            put(route('kurikulum.tahun-ajaran.update', tahunAjaran.id));
        } else {
            post(route('kurikulum.tahun-ajaran.store'));
        }
    };

    return (
        <AppLayout>
            <Head title={tahunAjaran ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'} />
            <Card>
                <CardHeader>
                    <CardTitle>{tahunAjaran ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}</CardTitle>
                    <CardDescription>Gunakan format YYYY/YYYY untuk tahun ajaran, contoh: 2023/2024.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="tahun_ajaran">Tahun Ajaran</Label>
                            <Input
                                id="tahun_ajaran"
                                name="tahun_ajaran"
                                value={data.tahun_ajaran}
                                onChange={(e) => setData('tahun_ajaran', e.target.value)}
                                placeholder="Contoh: 2023/2024"
                            />
                            <InputError message={errors.tahun_ajaran} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="semester">Semester</Label>
                            <Select name="semester" onValueChange={(value) => setData('semester', value as 'Ganjil' | 'Genap')} value={data.semester}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ganjil">Ganjil</SelectItem>
                                    <SelectItem value="Genap">Genap</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.semester} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" onValueChange={(value) => setData('status', value as 'Aktif' | 'Tidak Aktif')} value={data.status}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Aktif">Aktif</SelectItem>
                                    <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <Button type="button" variant="outline" asChild>
                                <Link href={route('kurikulum.tahun-ajaran.index')}>Batal</Link>
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
