import AppLayout from '@/layouts/app-layout';
import { JurnalMengajar, PageProps, RekapKehadiran, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Users, UserCheck, UserX, FileText, Ambulance } from 'lucide-react';

interface JurnalShowPageProps extends PageProps {
    jurnal: JurnalMengajar;
    rekapKehadiran: RekapKehadiran;
}

const RekapCard = ({ title, value, icon: Icon }: { title: string; value: number; icon: React.ElementType }) => (
    <div className="flex items-center rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        <div className="mr-4 rounded-md bg-primary p-3 text-primary-foreground">
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

export default function JurnalShow({ jurnal, rekapKehadiran }: JurnalShowPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('guru.dashboard'),
        },
        {
            title: 'Lihat Jurnal',
        },
    ];

    const getBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'hadir':
                return 'default';
            case 'sakit':
                return 'secondary';
            case 'izin':
                return 'outline';
            case 'alpa':
                return 'destructive';
            default:
                return 'default';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Jurnal ${jurnal.jadwal.mapel.nama_mapel} - ${jurnal.jadwal.kelas.nama_kelas}`} />

            <div className="space-y-6 p-4 md:p-8">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Detail Jurnal Mengajar</CardTitle>
                            <Link href={route('guru.jurnal.edit', jurnal.jurnal_id)}>
                                <Button variant="outline" size="sm">
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Jurnal
                                </Button>
                            </Link>
                        </div>
                        <CardDescription>
                            {jurnal.jadwal.mapel.nama_mapel} - {jurnal.jadwal.kelas.nama_kelas}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold">Tanggal</h3>
                            <p className="text-muted-foreground">
                                {format(new Date(jurnal.tanggal), 'EEEE, dd MMMM yyyy', { locale: id })}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Materi Pembahasan</h3>
                            <p className="text-muted-foreground whitespace-pre-wrap">{jurnal.catatan_mengajar}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Rekap Kehadiran Siswa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
                            <RekapCard title="Total Siswa" value={rekapKehadiran.total} icon={Users} />
                            <RekapCard title="Hadir" value={rekapKehadiran.hadir} icon={UserCheck} />
                            <RekapCard title="Sakit" value={rekapKehadiran.sakit} icon={Ambulance} />
                            <RekapCard title="Izin" value={rekapKehadiran.izin} icon={FileText} />
                            <RekapCard title="Alpa" value={rekapKehadiran.alpa} icon={UserX} />
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[10px]">No</TableHead>
                                    <TableHead>Nama Siswa</TableHead>
                                    <TableHead>NIS</TableHead>
                                    <TableHead className="text-right">Status Kehadiran</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jurnal.kehadiran.map((item, index) => (
                                    <TableRow key={item.kehadiran_id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.siswa.nama_lengkap}</TableCell>
                                        <TableCell>{item.siswa.NIS}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={getBadgeVariant(item.status_kehadiran)}>
                                                {item.status_kehadiran}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
