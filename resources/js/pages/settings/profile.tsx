import { type BreadcrumbItem, type PageProps } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
    NIP: string;
    nama_lengkap: string;
    alamat: string;
    nomor_telepon: string;
    tanggal_lahir: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<PageProps>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
        name: auth.user.name ?? '',
        email: auth.user.email ?? '',
        NIP: auth.user.guru?.NIP ?? '',
        nama_lengkap: auth.user.guru?.nama_lengkap ?? '',
        alamat: auth.user.guru?.alamat ?? '',
        nomor_telepon: auth.user.guru?.nomor_telepon ?? '',
        tanggal_lahir: auth.user.guru?.tanggal_lahir ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your account's profile information." />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                                <Input
                                    id="nama_lengkap"
                                    value={data.nama_lengkap}
                                    onChange={(e) => setData('nama_lengkap', e.target.value)}
                                    required
                                    placeholder="Nama Lengkap"
                                />
                                <InputError message={errors.nama_lengkap} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="NIP">NIP</Label>
                                <Input
                                    id="NIP"
                                    value={data.NIP}
                                    onChange={(e) => setData('NIP', e.target.value)}
                                    required
                                    placeholder="Nomor Induk Pegawai"
                                />
                                <InputError message={errors.NIP} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="nomor_telepon">Nomor Telepon</Label>
                                <Input
                                    id="nomor_telepon"
                                    value={data.nomor_telepon}
                                    onChange={(e) => setData('nomor_telepon', e.target.value)}
                                    placeholder="Nomor Telepon"
                                />
                                <InputError message={errors.nomor_telepon} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                <Input
                                    id="tanggal_lahir"
                                    type="date"
                                    value={data.tanggal_lahir}
                                    onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                />
                                <InputError message={errors.tanggal_lahir} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="alamat">Alamat</Label>
                            <Textarea
                                id="alamat"
                                value={data.alamat}
                                onChange={(e) => setData('alamat', e.target.value)}
                                placeholder="Alamat Lengkap"
                                className="min-h-[100px]"
                            />
                            <InputError message={errors.alamat} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
