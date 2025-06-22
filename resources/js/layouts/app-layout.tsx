import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem, type FlashMessage } from '@/types';
import { type ReactNode, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { usePage } from '@inertiajs/react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const { flash } = usePage<{ flash: FlashMessage }>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success('Berhasil', {
                description: flash.success,
            });
        }
    }, [flash?.success]);

    useEffect(() => {
        if (flash?.error) {
            toast.error('Gagal', {
                description: flash.error,
            });
        }
    }, [flash?.error]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <Toaster richColors />
        </AppLayoutTemplate>
    );
}
