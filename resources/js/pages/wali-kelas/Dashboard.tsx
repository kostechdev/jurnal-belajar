import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Wali Kelas',
        href: '/wali-kelas/dashboard',
    },
];

export default function WaliKelasDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Wali Kelas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-xl font-semibold">Selamat Datang di Dasbor Wali Kelas</h1>
                <p>Ini adalah halaman dasbor khusus untuk Wali Kelas.</p>
            </div>
        </AppLayout>
    );
}
