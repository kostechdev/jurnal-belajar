import AppLayout from '@/layouts/app-layout';
import { type JadwalFormPageProps } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

export default function JadwalForm() {
    const { kelas, jadwalData, mapel, guru, hari, tahunAjaranAktif, flash } = usePage<JadwalFormPageProps>().props;

    const { data, setData, put, errors, processing } = useForm({
        jadwal: hari.reduce(
            (acc, currentDay) => {
                acc[currentDay] = jadwalData[currentDay] || [];
                return acc;
            },
            {} as Record<string, any[]>
        ),
    });

    useEffect(() => {
        if (flash?.error) {
            toast.error('Gagal Menyimpan Jadwal', {
                description: flash.error,
            });
        }
    }, [flash]);


    const handleAddEntry = (day: string) => {
        const newEntry = {
            mapel_id: '',
            guru_id: '',
            jam_mulai: '07:00',
            jam_selesai: '08:00',
        };
        setData('jadwal', { ...data.jadwal, [day]: [...data.jadwal[day], newEntry] });
    };

    const handleRemoveEntry = (day: string, index: number) => {
        const updatedEntries = data.jadwal[day].filter((_, i) => i !== index);
        setData('jadwal', { ...data.jadwal, [day]: updatedEntries });
    };

    const handleEntryChange = (day: string, index: number, field: string, value: string | number) => {
        const updatedEntries = [...data.jadwal[day]];
        updatedEntries[index] = { ...updatedEntries[index], [field]: value };
        setData('jadwal', { ...data.jadwal, [day]: updatedEntries });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('kurikulum.jadwal.update', kelas.kelas_id));
    };

    return (
        <AppLayout>
            <Head title={`Atur Jadwal - ${kelas.tingkat} ${kelas.jurusan} ${kelas.rombel}`} />

            <Card>
                <CardHeader>
                    <CardTitle>Atur Jadwal Pelajaran</CardTitle>
                    <CardDescription>
                        Kelas: {`${kelas.tingkat} ${kelas.jurusan} ${kelas.rombel}`} | Tahun Ajaran: {tahunAjaranAktif.tahun_ajaran} ({tahunAjaranAktif.semester})
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {hari.map((day) => (
                            <div key={day} className="rounded-md border p-4">
                                <h3 className="mb-4 text-lg font-semibold">{day}</h3>
                                <div className="space-y-4">
                                    {data.jadwal[day] && data.jadwal[day].map((entry, index) => (
                                        <div key={index} className="flex items-end gap-4">
                                            <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
                                                {/* Mapel */}
                                                <div className="flex flex-col gap-2">
                                                    <label>Mata Pelajaran</label>
                                                    <Select
                                                        value={entry.mapel_id?.toString() ?? ''}
                                                        onValueChange={(value) => handleEntryChange(day, index, 'mapel_id', value)}
                                                    >
                                                        <SelectTrigger><SelectValue placeholder="Pilih Mapel" /></SelectTrigger>
                                                        <SelectContent>
                                                            {mapel.map((m) => (
                                                                <SelectItem key={m.mapel_id} value={m.mapel_id.toString()}>
                                                                    {m.nama_mapel}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Guru */}
                                                <div className="flex flex-col gap-2">
                                                    <label>Guru</label>
                                                    <Select
                                                        value={entry.guru_id?.toString() ?? ''}
                                                        onValueChange={(value) => handleEntryChange(day, index, 'guru_id', value)}
                                                    >
                                                        <SelectTrigger><SelectValue placeholder="Pilih Guru" /></SelectTrigger>
                                                        <SelectContent>
                                                            {guru.map((g) => (
                                                                <SelectItem key={g.guru_id} value={g.guru_id.toString()}>
                                                                    {g.nama_lengkap}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Jam Mulai */}
                                                <div className="flex flex-col gap-2">
                                                    <label>Jam Mulai</label>
                                                    <Input
                                                        type="time"
                                                        value={entry.jam_mulai}
                                                        onChange={(e) => handleEntryChange(day, index, 'jam_mulai', e.target.value)}
                                                    />
                                                </div>

                                                {/* Jam Selesai */}
                                                <div className="flex flex-col gap-2">
                                                    <label>Jam Selesai</label>
                                                    <Input
                                                        type="time"
                                                        value={entry.jam_selesai}
                                                        onChange={(e) => handleEntryChange(day, index, 'jam_selesai', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveEntry(day, index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => handleAddEntry(day)}>
                                    + Tambah Jam
                                </Button>
                            </div>
                        ))}
                        <div className="flex justify-end gap-2">
                             <Link href={route('kurikulum.jadwal.index')} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2">Batal</Link>
                            <Button type="submit" disabled={processing}>Simpan Jadwal</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
