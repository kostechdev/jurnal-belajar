import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { type MapelFormPageProps } from '@/types';
import InputError from '@/components/input-error';

export default function MapelForm() {
    const { mapel } = usePage<MapelFormPageProps>().props;

    const isEditMode = !!mapel;

    const { data, setData, post, put, errors, processing } = useForm({
        kode_mapel: mapel?.kode_mapel ?? '',
        nama_mapel: mapel?.nama_mapel ?? '',
        deskripsi: mapel?.deskripsi ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            put(route('kurikulum.mapel.update', mapel.mapel_id));
        } else {
            post(route('kurikulum.mapel.store'));
        }
    };

    return (
        <AppLayout>
            <Head title={isEditMode ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'} />
            <Card>
                <CardHeader>
                    <CardTitle>{isEditMode ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="kode_mapel">Kode Mata Pelajaran</Label>
                            <Input
                                id="kode_mapel"
                                name="kode_mapel"
                                value={data.kode_mapel}
                                onChange={(e) => setData('kode_mapel', e.target.value)}
                            />
                            <InputError message={errors.kode_mapel} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="nama_mapel">Nama Mata Pelajaran</Label>
                            <Input
                                id="nama_mapel"
                                name="nama_mapel"
                                value={data.nama_mapel}
                                onChange={(e) => setData('nama_mapel', e.target.value)}
                            />
                            <InputError message={errors.nama_mapel} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea
                                id="deskripsi"
                                name="deskripsi"
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                            />
                            <InputError message={errors.deskripsi} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <Button type="button" variant="outline" asChild>
                                <Link href={route('kurikulum.mapel.index')}>Batal</Link>
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
