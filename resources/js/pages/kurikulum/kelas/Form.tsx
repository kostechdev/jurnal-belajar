import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { type KelasFormPageProps } from '@/types';
import InputError from '@/components/input-error';

export default function KelasForm() {
    const { kelas } = usePage<KelasFormPageProps>().props;

    const isEditMode = !!kelas;

    const { data, setData, post, put, errors, processing } = useForm({
        tingkat: kelas?.tingkat ?? '',
        jurusan: kelas?.jurusan ?? '',
        rombel: kelas?.rombel ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            put(route('kurikulum.kelas.update', kelas.kelas_id));
        } else {
            post(route('kurikulum.kelas.store'));
        }
    };

    return (
        <AppLayout>
            <Head title={isEditMode ? 'Edit Kelas' : 'Tambah Kelas'} />
            <Card>
                <CardHeader>
                    <CardTitle>{isEditMode ? 'Edit Kelas' : 'Tambah Kelas'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="tingkat">Tingkat</Label>
                            <Select name="tingkat" onValueChange={(value) => setData('tingkat', value)} value={data.tingkat}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tingkat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="X">X</SelectItem>
                                    <SelectItem value="XI">XI</SelectItem>
                                    <SelectItem value="XII">XII</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.tingkat} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="jurusan">Jurusan</Label>
                            <Input
                                id="jurusan"
                                name="jurusan"
                                value={data.jurusan}
                                onChange={(e) => setData('jurusan', e.target.value)}
                            />
                            <InputError message={errors.jurusan} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="rombel">Rombel</Label>
                            <Input
                                id="rombel"
                                name="rombel"
                                value={data.rombel}
                                onChange={(e) => setData('rombel', e.target.value)}
                                placeholder="Contoh: 1, 2, atau A, B"
                            />
                            <InputError message={errors.rombel} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <Button type="button" variant="outline" asChild>
                                <Link href={route('kurikulum.kelas.index')}>Batal</Link>
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
