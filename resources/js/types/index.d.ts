import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface PageProps extends Record<string, unknown> {
    auth: {
        user: User;
        is_wali_kelas: boolean;
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

export type NavItem = {
    title: string;
    href: string;
    icon?: LucideIcon;
    children?: NavItem[];
    permission?: string;
    isActive?: boolean;
};

export type RekapSiswa = {
    siswa_id: number;
    nama_lengkap: string;
    nis: string;
    stats: {
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
    };
};

export type Guru = {
    guru_id: number;
    user_id: number;
    NIP: string;
    nama_lengkap: string;
    alamat: string;
    nomor_telepon: string;
    tanggal_lahir: string;
};

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: 'kurikulum' | 'guru' | 'wali_kelas';
    guru?: Guru;
    avatar?: string;
    created_at: string;
    updated_at: string;
}

export interface FlashMessage {
    success?: string;
    error?: string;
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
    tempat_lahir: string | null;
    jenis_kelamin: 'L' | 'P' | null;
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
    nama_kelas: string;
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
    hari: string;
    jam_mulai: string;
    jam_selesai: string;
    guru_id: number;
    mapel_id: number;
    kelas_id: number;
    tahun_ajaran_id: number;
    sudah_diisi?: boolean;
    jurnal_id?: number;
    kelas: Kelas;
    mapel: Mapel;
    guru: Guru;
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

export interface JurnalMengajar {
    jurnal_id: number;
    jadwal_id: number;
    tanggal: string;
    catatan_mengajar: string;
    status: string;
    diinput_oleh_guru_id: number;
    created_at: string;
    updated_at: string;
    jadwal: Jadwal;
    kehadiran: Kehadiran[];
}

export interface Kehadiran {
    kehadiran_id: number;
    jurnal_id: number;
    siswa_id: number;
    tanggal_kehadiran: string;
    status_kehadiran: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
    siswa: Siswa;
}

export interface RekapKehadiran {
    total: number;
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
