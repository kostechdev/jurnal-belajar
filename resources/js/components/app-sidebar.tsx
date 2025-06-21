import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { GraduationCap, LayoutDashboard, Users, ClipboardList, CalendarDays, School, Book, Contact } from 'lucide-react';
import AppLogo from './app-logo';
import { usePage } from '@inertiajs/react';
import { type PageProps } from '@/types';

type NavItemGroup = {
    title: string;
    items: NavItem[];
};

const getMainNavItems = (role: string): NavItemGroup[] => {
    const dashboardGroup: NavItemGroup = {
        title: '',
        items: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutDashboard,
                isActive: route().current('dashboard'),
            },
        ],
    };

    if (role === 'kurikulum') {
        const akademikGroup: NavItemGroup = {
            title: 'Manajemen Akademik',
            items: [
                {
                    title: 'Manajemen Jadwal',
                    href: route('kurikulum.jadwal.index'),
                    icon: CalendarDays,
                    isActive: route().current('kurikulum.jadwal.*'),
                },
                {
                    title: 'Wali Kelas',
                    href: route('kurikulum.walikelas.index'),
                    icon: ClipboardList,
                    isActive: route().current('kurikulum.walikelas.*'),
                },
            ],
        };

        const masterDataGroup: NavItemGroup = {
            title: 'Master Data',
            items: [
                {
                    title: 'Manajemen Siswa',
                    href: route('kurikulum.siswa.index'),
                    icon: Contact,
                    isActive: route().current('kurikulum.siswa.*'),
                },
                {
                    title: 'Manajemen Guru',
                    href: route('kurikulum.guru.index'),
                    icon: GraduationCap,
                    isActive: route().current('kurikulum.guru.*'),
                },
                {
                    title: 'Manajemen Kelas',
                    href: route('kurikulum.kelas.index'),
                    icon: School,
                    isActive: route().current('kurikulum.kelas.*'),
                },
                {
                    title: 'Manajemen Mapel',
                    href: route('kurikulum.mapel.index'),
                    icon: Book,
                    isActive: route().current('kurikulum.mapel.*'),
                },
                {
                    title: 'Tahun Ajaran',
                    href: route('kurikulum.tahun-ajaran.index'),
                    icon: CalendarDays,
                    isActive: route().current('kurikulum.tahun-ajaran.*'),
                },
            ],
        };

        const administrasiGroup: NavItemGroup = {
            title: 'Administrasi',
            items: [
                {
                    title: 'Manajemen Pengguna',
                    href: route('kurikulum.pengguna.index'),
                    icon: Users,
                    isActive: route().current('kurikulum.pengguna.*'),
                },
            ],
        };

        return [dashboardGroup, akademikGroup, masterDataGroup, administrasiGroup];
    }

    return [dashboardGroup];
};

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;
    const mainNavGroups = getMainNavItems(auth.user.role);
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="flex flex-col gap-2">
                {mainNavGroups.map((group, index) => (
                    <div key={group.title}>
                        {index > 0 && <hr className="my-3" />}
                        {group.title && (
                            <h4 className="mb-2 mt-3 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                                {group.title}
                            </h4>
                        )}
                        <NavMain items={group.items} />
                    </div>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
