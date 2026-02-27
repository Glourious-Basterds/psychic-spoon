'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { LayoutDashboard, FolderKanban, MessageSquare, ShieldCheck, LogOut, Zap, ChevronDown } from 'lucide-react';
import { useUI, Theme } from '@/context/UIContext';
import { CinematicTrigger, GlobalMiniPlayer } from '@/components/ui/cinematic-player';

const THEMES: { value: Theme; label: string; icon: string }[] = [
    { value: 'hashi', label: 'Stile Hashi', icon: '⛩️' },
    { value: 'boring', label: 'Clean', icon: '◻' },
    { value: 'comic', label: 'Comic Book', icon: '💥' },
    { value: 'japanese', label: 'Japanese', icon: '🏔' },
    { value: 'neon', label: 'Tokyo Nights', icon: '🏮' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { theme, selectTheme, comicMode, japaneseMode, neonMode, hashiMode } = useUI();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const currentThemeLabel = THEMES.find(t => t.value === theme)?.label ?? 'Theme';

    const navItems = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/missions', label: 'Missions', icon: FolderKanban },
        { href: '/comms', label: 'The War Room', icon: MessageSquare },
        { href: '/vault', label: 'IP Vault', icon: ShieldCheck },
    ];

    // Determine specific background image based on route for Hashi mode
    const getHashiBg = () => {
        if (pathname.includes('/dashboard')) return '/bg-hashi-overview.jpg';
        if (pathname.includes('/missions')) return '/bg-hashi-missions.jpg';
        if (pathname.includes('/comms')) return '/bg-hashi-comms.jpg';
        if (pathname.includes('/vault')) return '/bg-hashi-vault.jpg';
        return '/bg-hashi-overview.jpg';
    };

    return (
        <div className={`min-h-screen ${comicMode ? 'bg-[#f0f0f0]' : japaneseMode ? 'bg-[#FDFBF7]' : neonMode ? 'bg-[#0D0D12]' : hashiMode ? 'bg-[#fafafa]' : 'bg-gray-50'} text-black flex flex-col md:flex-row overflow-hidden relative transition-colors duration-500`}>
            {/* Hashi Background */}
            {hashiMode && (
                <>
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.4]"
                        style={{ backgroundImage: `url('${getHashiBg()}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
                    />
                    <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-[#fafafa]/20 to-[#fafafa]/60" />
                </>
            )}

            {/* Comic Background */}
            {comicMode && (
                <>
                    <div className="absolute inset-0 comic-page-bg opacity-100 z-0" />
                    <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] sunburst opacity-10 z-0 rounded-full" />
                    <div className="onomatopoeia punch absolute top-20 right-[15%] opacity-15 z-0 text-9xl select-none">Punch!</div>
                    <div className="onomatopoeia kapow absolute bottom-40 left-[5%] opacity-10 z-0 text-[15rem] select-none">KAPOW!</div>
                    <div className="onomatopoeia wham absolute top-[40%] left-[30%] opacity-5 z-0 text-[10rem] select-none">WHAM!</div>
                    <div className="onomatopoeia boom absolute bottom-10 right-[10%] opacity-10 z-0 text-8xl select-none">BOOM!</div>
                </>
            )}

            {/* Japanese Background */}
            {japaneseMode && (
                <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]"
                    style={{ backgroundImage: "url('/images/japanese_bg.png')", backgroundSize: 'cover', backgroundPosition: 'center bottom', backgroundRepeat: 'no-repeat' }}
                />
            )}

            {/* Neon Background */}
            {neonMode && (
                <>
                    {/* Deep fog layers */}
                    <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(245,166,35,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(232,84,122,0.05) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(245,166,35,0.04) 0%, transparent 50%)' }} />
                    {/* Subtle noise grain for texture */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }} />
                    {/* Distant warm glow spots */}
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                    <div className="absolute bottom-1/3 left-1/3 w-64 h-64 rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(232,84,122,0.03) 0%, transparent 70%)', filter: 'blur(30px)' }} />
                </>
            )}

            {/* Sidebar */}
            <aside className={`w-full md:w-64 p-6 flex flex-col gap-8 z-20 transition-all duration-300 ${comicMode
                ? 'bg-white border-r-4 border-black shadow-[8px_0px_0px_#000]'
                : japaneseMode
                    ? 'bg-[#FAF8F5]/90 backdrop-blur-sm border-r border-[#E0D8C8] shadow-sm'
                    : neonMode
                        ? 'bg-[#0D0D12]/95 backdrop-blur-md border-r border-[#F5A623]/15 text-[#FAF0E6]'
                        : hashiMode
                            ? 'bg-rgba(255, 255, 255, 0.9) backdrop-blur-3xl border-r border-[#c20000]/10 text-[#1a1a1a] shadow-[10px_0_40px_rgba(0,0,0,0.02)]'
                            : 'bg-white border-r border-gray-200'
                }`}>
                <div className="flex flex-col gap-6">
                    {/* Logo */}
                    <Link href="/dashboard" className={`${comicMode ? 'comic-font marvel-logo scale-75 origin-left' : japaneseMode ? 'text-3xl japanese-font text-[#BE1E2D] tracking-widest' : neonMode ? 'text-2xl font-black tracking-tight text-[#F5A623] neon-font' : hashiMode ? 'text-2xl font-black tracking-[0.2em] text-[#ff1a1a] drop-shadow-[0_0_12px_rgba(255,26,26,0.6)] hashi-font' : 'text-2xl font-black tracking-tight'} hover:opacity-80 transition-all`}>
                        {comicMode ? 'HASHI' : 'hashi.'}
                    </Link>

                    {/* THEMES DROPDOWN */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(prev => !prev)}
                            className={`w-full py-3 px-4 flex items-center justify-between gap-2 transition-all ${comicMode
                                ? 'comic-font bg-comic-yellow text-black border-4 border-black font-black uppercase italic shadow-[4px_4px_0px_#000] rotate-1 active:scale-95'
                                : japaneseMode
                                    ? 'japanese-font bg-[#1A2639] text-[#FDFBF7] tracking-[0.15em] border border-[#1A2639] hover:bg-[#BE1E2D]'
                                    : neonMode
                                        ? 'neon-font bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/30 hover:bg-[#F5A623]/15 hover:border-[#F5A623]/50 font-medium tracking-wide'
                                        : hashiMode
                                            ? 'hashi-font bg-[#c20000]/5 text-[#c20000] border border-[#c20000]/20 hover:bg-[#c20000]/10 hover:border-[#c20000]/40 font-bold tracking-[0.1em] shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]'
                                            : 'bg-zinc-900 text-white font-black uppercase rounded-lg hover:bg-black'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                {comicMode && <Zap size={16} className="animate-pulse" />}
                                {!comicMode && !japaneseMode && !neonMode && !hashiMode && <Zap size={16} />}
                                {neonMode && <span className="text-base">🏮</span>}
                                {hashiMode && <span className="text-base">⛩️</span>}
                                {currentThemeLabel}
                            </span>
                            <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className={`absolute top-full left-0 right-0 mt-1 z-50 overflow-hidden transition-all ${comicMode
                                ? 'bg-white border-4 border-black shadow-[6px_6px_0px_#000]'
                                : japaneseMode
                                    ? 'bg-[#FAF8F5] border border-[#E0D8C8] shadow-md'
                                    : neonMode
                                        ? 'bg-[#111118] border border-[#F5A623]/20 shadow-[0_8px_32px_rgba(245,166,35,0.1)]'
                                        : hashiMode
                                            ? 'bg-[#ffffff] border border-[#c20000]/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)]'
                                            : 'bg-white border border-zinc-200 rounded-lg shadow-xl'
                                }`}>
                                {THEMES.map(t => (
                                    <button
                                        key={t.value}
                                        onClick={() => { selectTheme(t.value); setDropdownOpen(false); }}
                                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all ${theme === t.value
                                            ? (comicMode ? 'comic-font bg-marvel-red text-white font-black uppercase italic' : japaneseMode ? 'japanese-font bg-[#BE1E2D] text-white' : neonMode ? 'neon-font bg-[#F5A623]/15 text-[#F5A623] font-medium' : hashiMode ? 'hashi-font bg-[#9a0000]/20 text-[#ff1a1a] font-bold' : 'bg-zinc-900 text-white font-bold')
                                            : (comicMode ? 'comic-font hover:bg-comic-yellow hover:text-black font-black uppercase italic' : japaneseMode ? 'japanese-font hover:bg-[#F0EBE1] text-[#1A2639] tracking-[0.1em]' : neonMode ? 'neon-font text-[#FAF0E6]/60 hover:text-[#FAF0E6] hover:bg-[#F5A623]/5' : hashiMode ? 'hashi-font text-[#1a1a1a]/60 hover:text-[#c20000] hover:bg-[#c20000]/5' : 'hover:bg-zinc-50 text-zinc-700 font-medium')
                                            }`}
                                    >
                                        <span>{t.icon}</span>
                                        <span>{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <CinematicTrigger />
                </div>

                <nav className="flex flex-col gap-2 flex-1 relative z-10">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setDropdownOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 transition-all transform border-2 border-transparent group ${isActive
                                    ? (comicMode
                                        ? 'comic-font bg-marvel-red text-white comic-border border-none shadow-none -rotate-2 italic font-black uppercase tracking-tighter'
                                        : japaneseMode
                                            ? 'japanese-font bg-transparent text-[#BE1E2D] border-l-4 border-l-[#BE1E2D] rounded-none tracking-[0.1em]'
                                            : neonMode
                                                ? 'neon-font bg-[#F5A623]/10 text-[#F5A623] border-l-2 border-l-[#F5A623] rounded-none shadow-[0_0_12px_rgba(245,166,35,0.15)]'
                                                : hashiMode
                                                    ? 'hashi-font bg-[#c20000]/5 text-[#c20000] border-l-2 border-l-[#c20000] rounded-none shadow-[0_0_20px_rgba(194,0,0,0.1)]'
                                                    : 'bg-zinc-100 text-zinc-900 rounded-lg font-bold')
                                    : (comicMode
                                        ? 'text-zinc-600 hover:text-hero-blue hover:border-black font-black uppercase tracking-widest'
                                        : japaneseMode
                                            ? 'text-[#1A2639]/70 font-serif hover:text-[#BE1E2D] tracking-[0.1em]'
                                            : neonMode
                                                ? 'text-[#FAF0E6]/40 hover:text-[#FAF0E6]/80 hover:bg-[#F5A623]/5'
                                                : hashiMode
                                                    ? 'text-[#1a1a1a]/40 hover:text-[#c20000] hover:bg-[#c20000]/5'
                                                    : 'text-zinc-500 hover:bg-zinc-50 rounded-lg')
                                    }`}
                            >
                                <Icon size={20} className={isActive ? '' : 'group-hover:rotate-12 transition-transform'} strokeWidth={japaneseMode || hashiMode ? 1.5 : 2} />
                                <span className={isActive ? (comicMode ? 'text-lg' : hashiMode ? 'text-sm font-medium tracking-wide' : 'text-sm') : 'text-sm'}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className={`flex flex-col gap-2 pt-8 z-10 ${comicMode ? 'border-t-4 border-black' : japaneseMode ? 'border-t border-[#E0D8C8]' : neonMode ? 'border-t border-[#F5A623]/10' : hashiMode ? 'border-t border-[#00f2ff]/10' : 'border-t border-zinc-100'}`}>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className={`flex items-center gap-3 px-4 py-3 transition-all w-full text-left ${comicMode
                            ? 'comic-font text-red-600 hover:bg-black hover:text-white border-2 border-transparent hover:border-black font-black uppercase tracking-tighter italic'
                            : japaneseMode
                                ? 'japanese-font text-[#BE1E2D] tracking-[0.1em] hover:bg-[#F0EBE1]'
                                : neonMode
                                    ? 'neon-font text-[#FAF0E6]/30 hover:text-[#E8547A] hover:bg-[#E8547A]/5'
                                    : hashiMode
                                        ? 'hashi-font text-[#1a1a1a]/30 hover:text-[#c20000] hover:bg-[#c20000]/5'
                                        : 'text-zinc-400 hover:text-red-600'
                            }`}
                    >
                        <LogOut size={20} strokeWidth={japaneseMode || hashiMode ? 1.5 : 2} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-x-hidden overflow-y-auto z-10 p-0" onClick={() => setDropdownOpen(false)}>
                {children}
            </main>

            <GlobalMiniPlayer />
        </div>
    );
}

