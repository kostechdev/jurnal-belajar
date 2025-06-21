import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface PageProps extends Record<string, unknown> {
    auth: {
        user: User;
    };
    flash: {
        success?: string;
        error?: string;
    };
    ziggy: Config & { location: string };
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'kurikulum' | 'guru' | 'wali_kelas';
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface PaginationLinkItem {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    data: T[];
    links: PaginationLinkItem[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface Guru {
    guru_id: number;
    user_id: number;
    NIP: string;
    nama_lengkap: string;
    alamat: string | null;
    nomor_telepon: string | null;
    tanggal_lahir: string | null;
    user?: User;
}

export interface GuruPageProps extends PageProps {
    guru?: Guru;
}

export interface PenggunaIndexPageProps extends PageProps {
    users: Paginated<User>;
}

export interface GuruIndexPageProps extends PageProps {
    gurus: Paginated<Guru>;
}

export interface Kelas {
    kelas_id: number;
    tingkat: 'X' | 'XI' | 'XII';
    jurusan: string;
    rombel: string;
    siswa?: Siswa[];
}

export interface TahunAjaran {
    id: number;
    tahun_ajaran: string;
    semester: 'Ganjil' | 'Genap';
    status: 'Aktif' | 'Tidak Aktif';
}

export interface WaliKelas {
    wali_kelas_id: number;
    guru_id: number;
    kelas_id: number;
    tahun_ajaran_id: number;
    guru: Guru;
    kelas: Kelas;
    tahun_ajaran: TahunAjaran;
}

export interface WaliKelasIndexPageProps extends PageProps {
    waliKelas: Paginated<WaliKelas>;
}

export interface WaliKelasFormPageProps extends PageProps {
    waliKelas?: WaliKelas;
    gurus: Guru[];
    kelas: Kelas[];
    tahunAjarans: TahunAjaran[];
    activeTahunAjaranId?: number;
}

export type TahunAjaranFormPageProps = PageProps & {
    tahunAjaran?: TahunAjaran;
};

export interface TahunAjaranIndexPageProps extends PageProps {
    tahunAjarans: Paginated<TahunAjaran>;
}

export interface KelasIndexPageProps extends PageProps {
    kelas: Paginated<Kelas>;
}

export interface KelasFormPageProps extends PageProps {
    kelas?: Kelas;
}

export interface Mapel {
    mapel_id: number;
    kode_mapel: string;
    nama_mapel: string;
    deskripsi?: string;
}

export interface MapelIndexPageProps extends PageProps {
    mapel: Paginated<Mapel>;
}

export interface MapelFormPageProps extends PageProps {
    mapel?: Mapel;
}

export interface Siswa {
    siswa_id: number;
    NIS: string;
    NISN?: string;
    nama_lengkap: string;
    tempat_lahir?: string;
    tanggal_lahir: string;
    jenis_kelamin: 'Laki-laki' | 'Perempuan';
    alamat?: string;
    nomor_telepon_siswa?: string;
    nama_wali_murid?: string;
    nomor_telepon_wali_murid?: string;
    kelas_id?: number;
    status_siswa: 'Aktif' | 'Lulus' | 'Pindah' | 'Keluar';
    kelas?: Kelas;
}

export interface SiswaIndexPageProps extends PageProps {
    kelasWithSiswa: Kelas[];
    filters: {
        search?: string;
    };
}

export interface SiswaFormPageProps extends PageProps {
    siswa?: Siswa;
    kelas: Kelas[];
}

export interface Jadwal {
    jadwal_id: number;
    hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';
    jam_mulai: string;
    jam_selesai: string;
    mapel_id: number;
    guru_id: number;
    kelas_id: number;
    tahun_ajaran_id: number;
    mapel: Mapel;
    guru: Guru;
    kelas: Kelas;
}

export interface JadwalIndexPageProps extends PageProps {
    kelas: Kelas[];
}

export interface JadwalFormPageProps extends PageProps {
    kelas: Kelas;
    jadwalData: Record<string, Jadwal[]>;
    mapel: Mapel[];
    guru: Guru[];
    hari: string[];
    tahunAjaranAktif: TahunAjaran;
}

export type JurnalMengajar = {
    jurnal_id: number;
    jadwal_id: number;
    tanggal: string;
    materi: string;
    jam_ke: string;
    keterangan: string | null;
    is_libur: boolean;
    created_at: string;
    updated_at: string;
    jadwal: Jadwal;
};
