import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center bg-gray-100 p-4 dark:bg-zinc-950">
            <Head title="Masuk" />
            <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg dark:bg-zinc-900 lg:grid lg:grid-cols-2">
                <div className="flex items-center p-6 sm:p-8 lg:p-12">
                    <div className="mx-auto w-full max-w-sm space-y-6">
                        <div className="space-y-2 text-left">
                            <h1 className="text-2xl font-bold sm:text-3xl">Sistem Jurnal Belajar</h1>
                            <p className="text-muted-foreground">SMK Negeri 4 Cilegon</p>
                        </div>

                        {status && <div className="text-sm font-medium text-green-600">{status}</div>}

                        <form className="space-y-4" onSubmit={submit}>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Alamat Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@contoh.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Kata Sandi</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Kata Sandi"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', !!checked)}
                                />
                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Ingat saya
                                </Label>
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Masuk
                            </Button>
                        </form>
                    </div>
                </div>
                <div className="hidden items-center justify-center p-6 lg:flex">
                    <img
                        src="/images/logo/logo.jpeg"
                        alt="Logo Sekolah"
                        className="w-2/3 max-w-xs rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}
