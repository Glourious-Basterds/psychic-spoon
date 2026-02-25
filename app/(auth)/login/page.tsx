'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github, Mail, Loader2 } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email({ message: 'Email non valida' }),
    password: z.string().min(6, { message: 'La password deve avere almeno 6 caratteri' }),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError('Credenziali non valide');
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } catch (err) {
            setError('Si è verificato un errore durante il login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4">
            <div className="glass w-full max-w-md rounded-[40px] p-10 text-center">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
                    <p className="text-zinc-400 text-sm">Sign in to your Hashi account</p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2 text-left">
                        <label className="text-xs font-medium text-zinc-500 ml-2">Email Address</label>
                        <Input
                            type="email"
                            placeholder="name@example.com"
                            disabled={isLoading}
                            {...register('email')}
                            className={errors.email ? 'border-red-500/50' : ''}
                        />
                        {errors.email && <p className="ml-2 text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2 text-left">
                        <label className="text-xs font-medium text-zinc-500 ml-2">Password</label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            disabled={isLoading}
                            {...register('password')}
                            className={errors.password ? 'border-red-500/50' : ''}
                        />
                        {errors.password && <p className="ml-2 text-xs text-red-500">{errors.password.message}</p>}
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
                    </Button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#050505] px-2 text-zinc-500">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        className="w-full border-zinc-800 hover:bg-zinc-900"
                        onClick={() => signIn('github')}
                        disabled={isLoading}
                    >
                        <Github className="mr-2 h-4 w-4" /> Github
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full border-zinc-800 hover:bg-zinc-900"
                        onClick={() => signIn('google')}
                        disabled={isLoading}
                    >
                        <Mail className="mr-2 h-4 w-4" /> Google
                    </Button>
                </div>

                <p className="mt-8 text-sm text-zinc-500">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-white hover:underline decoration-purple-500 underline-offset-4">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
