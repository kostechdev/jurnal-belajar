import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type WaliKelasFormPageProps } from '@/types';
import InputError from '@/components/input-error';

export default function WaliKelasForm() {
    const { waliKelas, gurus, kelas, tahunAjarans, activeTahunAjaranId } = usePage<WaliKelasFormPageProps>().props;

    const isEditMode = !!waliKelas;

    const getInitialValues = () => {
        if (isEditMode) {
            // Safely access properties to prevent errors if they are null/undefined.
            const guruId = waliKelas.guru_id;
            const kelasId = waliKelas.kelas_id;
            const tahunAjaranId = waliKelas.tahun_ajaran_id;

            return {
                guru_id: guruId ? guruId.toString() : '',
                kelas_id: kelasId ? kelasId.toString() : '',
                tahun_ajaran_id: tahunAjaranId ? tahunAjaranId.toString() : '',
            };
        }

        // For create mode, initialize with empty values.
        return {
            guru_id: '',
            kelas_id: '',
            tahun_ajaran_id: activeTahunAjaranId?.toString() ?? '',
        };
    };

    const { data, setData, post, put, errors, processing } = useForm(getInitialValues());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            put(route('kurikulum.walikelas.update', waliKelas.wali_kelas_id));
        } else {
            post(route('kurikulum.walikelas.store'));
        }
    };

    return (
        <AppLayout>
            <Head title={isEditMode ? 'Edit Wali Kelas' : 'Tetapkan Wali Kelas'} />
            <Card>
                <CardHeader>
                    <CardTitle>{isEditMode ? 'Edit Wali Kelas' : 'Tetapkan Wali Kelas'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="guru_id">Guru</Label>
                            <Select name="guru_id" onValueChange={(value) => setData('guru_id', value)} value={data.guru_id}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Guru" />
                                </SelectTrigger>
                                <SelectContent>
                                    {gurus.map((guru) => (
                                        <SelectItem key={guru.guru_id} value={guru.guru_id.toString()}>
                                            {guru.nama_lengkap}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.guru_id} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="kelas_id">Kelas</Label>
                            <Select name="kelas_id" onValueChange={(value) => setData('kelas_id', value)} value={data.kelas_id}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kelas.map((kls) => (
                                        <SelectItem key={kls.kelas_id} value={kls.kelas_id.toString()}>
                                            {`${kls.tingkat} ${kls.jurusan} ${kls.rombel}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.kelas_id} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="tahun_ajaran_id">Tahun Ajaran</Label>
                            <Select
                                name="tahun_ajaran_id"
                                onValueChange={(value) => setData('tahun_ajaran_id', value)}
                                value={data.tahun_ajaran_id}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tahun Ajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tahunAjarans.map((ta) => (
                                        <SelectItem key={ta.id} value={ta.id.toString()}>
                                            {ta.tahun_ajaran} - {ta.semester}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.tahun_ajaran_id} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <Button type="button" variant="outline" asChild>
                                <Link href={route('kurikulum.walikelas.index')}>Batal</Link>
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
