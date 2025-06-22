import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Jadwal, type JurnalMengajar, type PageProps, type Siswa } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button, buttonVariants } from '@/components/ui/button';
import React from 'react';

interface JurnalFormParams extends PageProps {
    jadwal: Jadwal & {
        kelas: {
            siswa: Siswa[];
        };
    };
    jurnal?: JurnalMengajar; // Jurnal is optional, only present in edit mode
}

export default function JurnalForm({ jadwal, jurnal }: JurnalFormParams) {
    const isEditMode = !!jurnal;

    const { data, setData, post, put, processing, errors } = useForm({
        materi_pembahasan: jurnal?.catatan_mengajar || '',
        absensi: isEditMode
            ? jurnal.kehadiran.reduce(
                  (acc, kehadiran) => {
                      acc[kehadiran.siswa_id] = kehadiran.status_kehadiran.toLowerCase();
                      return acc;
                  },
                  {} as Record<number, string>,
              )
            : jadwal.kelas.siswa.reduce(
                  (acc, siswa) => {
                      acc[siswa.siswa_id] = 'hadir';
                      return acc;
                  },
                  {} as Record<number, string>,
              ),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            put(route('guru.jurnal.update', { jurnal: jurnal.jurnal_id }));
        } else {
            post(route('guru.jurnal.store', { jadwal: jadwal.jadwal_id }));
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('guru.dashboard'),
        },
        {
            title: isEditMode ? 'Edit Jurnal' : 'Isi Jurnal & Absensi',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEditMode ? 'Edit' : 'Isi'} Jurnal - ${jadwal.mapel.nama_mapel}`} />

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>{isEditMode ? 'Edit Formulir Jurnal Mengajar' : 'Formulir Jurnal Mengajar'}</CardTitle>
                        <CardDescription>
                            {isEditMode
                                ? 'Perbarui detail jurnal mengajar untuk sesi ini.'
                                : 'Isi detail jurnal mengajar untuk sesi ini.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Mata Pelajaran</p>
                                    <p className="font-semibold">{jadwal.mapel.nama_mapel}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Kelas</p>
                                    <p className="font-semibold">{`${jadwal.kelas.tingkat} ${jadwal.kelas.jurusan} ${jadwal.kelas.rombel}`}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Hari</p>
                                    <p className="font-semibold">{jadwal.hari}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Jam</p>
                                    <p className="font-semibold">{jadwal.jam_mulai.slice(0, 5)} - {jadwal.jam_selesai.slice(0, 5)}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="materi_pembahasan">Materi Pembahasan</Label>
                                    <Textarea
                                        id="materi_pembahasan"
                                        className="mt-1 block w-full"
                                        value={data.materi_pembahasan}
                                        onChange={(e) => setData('materi_pembahasan', e.target.value)}
                                        placeholder="Contoh: Membahas tentang Hukum Archimedes dan penerapannya."
                                    />
                                    {errors.materi_pembahasan && (
                                        <p className="text-sm text-red-600 mt-1">{errors.materi_pembahasan}</p>
                                    )}
                                </div>

                                <div>
                                    <Label>Absensi Siswa</Label>
                                    <Card className="mt-1">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[10px]">No</TableHead>
                                                    <TableHead>Nama Siswa / NIS</TableHead>
                                                    <TableHead className="text-right">Kehadiran</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {jadwal.kelas.siswa.map((siswa, index) => (
                                                    <TableRow key={siswa.siswa_id}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>
                                                            <div className="font-medium">{siswa.nama_lengkap}</div>
                                                            <div className="text-sm text-muted-foreground">{siswa.NIS}</div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <RadioGroup
                                                                value={data.absensi[siswa.siswa_id]}
                                                                onValueChange={(value) => {
                                                                    const newAbsensi = { ...data.absensi };
                                                                    newAbsensi[siswa.siswa_id] = value;
                                                                    setData('absensi', newAbsensi);
                                                                }}
                                                                className="flex flex-row justify-end space-x-4"
                                                            >
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="hadir" id={`h-${siswa.siswa_id}`} />
                                                                    <Label htmlFor={`h-${siswa.siswa_id}`}>Hadir</Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="sakit" id={`s-${siswa.siswa_id}`} />
                                                                    <Label htmlFor={`s-${siswa.siswa_id}`}>Sakit</Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="izin" id={`i-${siswa.siswa_id}`} />
                                                                    <Label htmlFor={`i-${siswa.siswa_id}`}>Izin</Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="alpa" id={`a-${siswa.siswa_id}`} />
                                                                    <Label htmlFor={`a-${siswa.siswa_id}`}>Alpa</Label>
                                                                </div>
                                                            </RadioGroup>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        {isEditMode && (
                            <Link
                                href={route('guru.jurnal.show', jurnal.jurnal_id)}
                                className={buttonVariants({ variant: 'outline' })}
                            >
                                Batal
                            </Link>
                        )}
                        <Button type="submit" disabled={processing}>
                            {isEditMode ? 'Update Jurnal' : 'Simpan Jurnal'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </AppLayout>
    );
}
