'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { LayoutDashboard, FolderKanban, MessageSquare, ShieldCheck, LogOut, Zap } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { TarantinoSoundboard } from '@/components/ui/tarantino-soundboard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { comicMode, toggleComicMode } = useUI();

    const navItems = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/missions', label: 'Missions', icon: FolderKanban },
        { href: '/comms', label: 'The War Room', icon: MessageSquare },
        { href: '/vault', label: 'IP Vault', icon: ShieldCheck },
    ];

    return (
        <div className={`min-h-screen ${comicMode ? 'bg-[#f0f0f0]' : 'bg-gray-50'} text-black flex flex-col md:flex-row overflow-hidden relative transition-colors duration-500`}>
            {/* Comic Background Layers (Visible only in comicMode) */}
            {comicMode && (
                <>
                    <div className="absolute inset-0 comic-page-bg opacity-100 z-0" />
                    <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] sunburst opacity-10 z-0 rounded-full" />

                    {/* Decorative Onomatopoeias in Background */}
                    <div className="onomatopoeia punch absolute top-20 right-[15%] opacity-15 z-0 text-9xl select-none">Punch!</div>
                    <div className="onomatopoeia kapow absolute bottom-40 left-[5%] opacity-10 z-0 text-[15rem] select-none">KAPOW!</div>
                    <div className="onomatopoeia wham absolute top-[40%] left-[30%] opacity-5 z-0 text-[10rem] select-none">WHAM!</div>
                    <div className="onomatopoeia boom absolute bottom-10 right-[10%] opacity-10 z-0 text-8xl select-none">BOOM!</div>
                </>
            )}

            {/* Sidebar */}
            <aside className={`w-full md:w-64 p-6 flex flex-col gap-8 z-20 transition-all duration-300 ${comicMode
                    ? 'bg-white border-r-4 border-black shadow-[8px_0px_0px_#000]'
                    : 'bg-white border-r border-gray-200'
                }`}>
                <div className="flex flex-col gap-6">
                    <Link href="/" className={`${comicMode ? 'marvel-logo scale-75 origin-left' : 'text-2xl font-black tracking-tight'} hover:opacity-80 transition-all`}>
                        {comicMode ? 'HASHI' : 'hashi.'}
                    </Link>

                    {/* ACTION TOGGLE */}
                    <button
                        onClick={toggleComicMode}
                        className={`w-full py-3 px-4 flex items-center justify-center gap-2 font-black uppercase italic transition-all ${comicMode
                                ? 'bg-comic-yellow text-black border-4 border-black shadow-[4px_4px_0px_#000] rotate-1 active:scale-95'
                                : 'bg-zinc-900 text-white rounded-lg hover:bg-black'
                            }`}
                    >
                        <Zap size={18} className={comicMode ? 'animate-pulse' : ''} />
                        {comicMode ? 'ESTREMIZZA UI' : 'ACTION!'}
                    </button>

                    <TarantinoSoundboard />
                </div>

                <nav className="flex flex-col gap-2 flex-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 transition-all transform border-2 border-transparent group ${isActive
                                        ? (comicMode ? 'bg-marvel-red text-white comic-border border-none shadow-none -rotate-2 italic font-black uppercase tracking-tighter' : 'bg-zinc-100 text-zinc-900 rounded-lg font-bold')
                                        : (comicMode ? 'text-zinc-600 hover:text-hero-blue hover:border-black font-black uppercase tracking-widest' : 'text-zinc-500 hover:bg-zinc-50 rounded-lg')
                                    }`}
                            >
                                <Icon size={20} className={isActive ? '' : 'group-hover:rotate-12 transition-transform'} />
                                <span className={isActive ? (comicMode ? 'text-lg' : 'text-sm') : 'text-sm'}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className={`flex flex-col gap-2 pt-8 ${comicMode ? 'border-t-4 border-black' : 'border-t border-zinc-100'}`}>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className={`flex items-center gap-3 px-4 py-3 transition-all w-full text-left font-black uppercase tracking-tighter italic ${comicMode ? 'text-red-600 hover:bg-black hover:text-white border-2 border-transparent hover:border-black' : 'text-zinc-400 hover:text-red-600'
                            }`}
                    >
                        <LogOut size={20} />
                        <span>Abbandona Base</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-x-hidden overflow-y-auto z-10 p-0">
                {children}
            </main>
        </div>
    );
}
