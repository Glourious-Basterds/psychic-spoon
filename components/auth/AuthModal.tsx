import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { 
    X, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    Chrome, 
    ArrowRight, 
    CheckCircle2, 
    AlertCircle,
    User
} from 'lucide-react';
import { useUI } from '@/context/UIContext';

// Validation Schemas
const loginSchema = z.object({
    email: z.string().optional(),
    password: z.string().optional(),
});

const registerSchema = z.object({
    name: z.string().min(2, 'Nome troppo breve'),
    email: z.string().email('Email non valida'),
    password: z.string()
        .min(8, 'Almeno 8 caratteri')
        .regex(/[A-Z]/, 'Almeno una maiuscola')
        .regex(/[0-9]/, 'Almeno un numero'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Le password non coincidono",
    path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthModal() {
    const { isAuthModalOpen, setAuthModalOpen, authModalView, setAuthModalView } = useUI();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const loginForm = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const registerForm = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    });

    if (!isAuthModalOpen) return null;

    const onLoginSubmit = async (values: LoginFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            // Dev mode: allow empty login as Pietro
            const email = (values.email && values.email.trim()) ? values.email : 'pietro@hashi.cx';
            const password = (values.password && values.password.trim()) ? values.password : 'password123';

            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Credenziali non valide. Riprova.');
            } else {
                setAuthModalOpen(false);
                loginForm.reset();
            }
        } catch (e) {
            setError('Si è verificato un errore durante il login.');
        } finally {
            setIsLoading(false);
        }
    };

    const onRegisterSubmit = async (values: RegisterFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            // Placeholder for registration logic (Server Action)
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Errore durante la registrazione.');
            } else {
                // Auto login after registration
                await signIn('credentials', {
                    email: values.email,
                    password: values.password,
                    redirect: false,
                });
                setAuthModalOpen(false);
                registerForm.reset();
            }
        } catch (e) {
            setError('Impossibile connettersi al server.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setError("Google login temporaneamente non disponibile.");
    };

    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setAuthModalOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#ffffff] rounded-3xl shadow-2xl overflow-hidden border border-black/5 animate-in fade-in zoom-in duration-300">
                
                {/* Close Button */}
                <button 
                    onClick={() => setAuthModalOpen(false)}
                    className="absolute top-6 right-6 text-black/40 hover:text-black transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* Tabs */}
                <div className="flex border-b border-black/[0.03]">
                    <button 
                        onClick={() => setAuthModalView('login')}
                        className={`flex-1 py-6 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${authModalView === 'login' ? 'text-black bg-white' : 'text-black/30 bg-gray-50/50 hover:bg-gray-50'}`}
                    >
                        Accedi
                    </button>
                    <button 
                        onClick={() => setAuthModalView('register')}
                        className={`flex-1 py-6 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${authModalView === 'register' ? 'text-black bg-white' : 'text-black/30 bg-gray-50/50 hover:bg-gray-50'}`}
                    >
                        Registrati
                    </button>
                </div>

                <div className="p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black hashi-font tracking-tight text-[#030712] uppercase mb-2">
                            {authModalView === 'login' ? 'Bentornato su Hashi' : 'Unisciti alla Community'}
                        </h2>
                        <p className="text-[12px] text-black/40 font-medium">
                            {authModalView === 'login' ? 'Inserisci le tue credenziali per continuare' : 'Crea il tuo passaporto per il futuro del cinema'}
                        </p>
                    </div>

                    {/* Social Login */}
                    <div className="relative group mb-8">
                        <button 
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 bg-white border border-black/10 py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-all opacity-50 cursor-not-allowed"
                        >
                            <Chrome size={18} className="text-blue-500" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-black/70">Continua con Google</span>
                        </button>
                        <p className="text-[9px] text-red-500 font-bold text-center mt-2 italic">Google login temporaneamente non disponibile</p>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-black/5 flex-1" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-black/20">oppure</span>
                        <div className="h-px bg-black/5 flex-1" />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 animate-in slide-in-from-top-2">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <p className="text-[11px] font-bold leading-tight">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    {authModalView === 'login' ? (
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-black/30 ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={16} />
                                    <input 
                                        {...loginForm.register('email')}
                                        type="email"
                                        placeholder="storia@hashi.cx"
                                        className="w-full bg-black/5 border border-black/5 rounded-xl py-3 pl-12 pr-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                                {loginForm.formState.errors.email && <p className="text-[9px] text-red-500 font-bold ml-1">{loginForm.formState.errors.email.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-black/30 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={16} />
                                    <input 
                                        {...loginForm.register('password')}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-black/5 border border-black/5 rounded-xl py-3 pl-12 pr-12 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors">
                                    Password dimenticata?
                                </button>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-black text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Accedi
                                        <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        /* Register Form */
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-black/30 ml-1">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={16} />
                                    <input 
                                        {...registerForm.register('name')}
                                        placeholder="Pietro M."
                                        className="w-full bg-black/5 border border-black/5 rounded-xl py-3 pl-12 pr-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                                {registerForm.formState.errors.name && <p className="text-[9px] text-red-500 font-bold ml-1">{registerForm.formState.errors.name.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-black/30 ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={16} />
                                    <input 
                                        {...registerForm.register('email')}
                                        type="email"
                                        placeholder="storia@hashi.cx"
                                        className="w-full bg-black/5 border border-black/5 rounded-xl py-3 pl-12 pr-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                                {registerForm.formState.errors.email && <p className="text-[9px] text-red-500 font-bold ml-1">{registerForm.formState.errors.email.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-black/30 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={16} />
                                    <input 
                                        {...registerForm.register('password')}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-black/5 border border-black/5 rounded-xl py-3 pl-12 pr-12 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 ml-1 leading-none">
                                    <div className={`flex items-center gap-1 text-[8px] font-bold uppercase transition-colors ${registerForm.watch('password')?.length >= 8 ? 'text-green-500' : 'text-black/20'}`}>
                                        <CheckCircle2 size={8} /> 8+ caratteri
                                    </div>
                                    <div className={`flex items-center gap-1 text-[8px] font-bold uppercase transition-colors ${/[A-Z]/.test(registerForm.watch('password') || '') ? 'text-green-500' : 'text-black/20'}`}>
                                        <CheckCircle2 size={8} /> 1 Maiuscola
                                    </div>
                                    <div className={`flex items-center gap-1 text-[8px] font-bold uppercase transition-colors ${/[0-9]/.test(registerForm.watch('password') || '') ? 'text-green-500' : 'text-black/20'}`}>
                                        <CheckCircle2 size={8} /> 1 Numero
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-black/30 ml-1">Conferma Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={16} />
                                    <input 
                                        {...registerForm.register('confirmPassword')}
                                        type="password"
                                        className="w-full bg-black/5 border border-black/5 rounded-xl py-3 pl-12 pr-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                                {registerForm.formState.errors.confirmPassword && <p className="text-[9px] text-red-500 font-bold ml-1">{registerForm.formState.errors.confirmPassword.message}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-black text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Crea Account
                                        <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Footer switch */}
                    <div className="text-center mt-8">
                        <button 
                            onClick={() => setAuthModalView(authModalView === 'login' ? 'register' : 'login')}
                            className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors"
                        >
                            {authModalView === 'login' ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
