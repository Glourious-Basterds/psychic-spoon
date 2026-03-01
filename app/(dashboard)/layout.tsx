'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { LayoutDashboard, FolderKanban, MessageSquare, ShieldCheck, LogOut, Menu, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { CinematicTrigger, GlobalMiniPlayer } from '@/components/ui/cinematic-player';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { hashiMode, sidebarCollapsed, toggleSidebar } = useUI();

    const navItems = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/missions', label: 'Missions', icon: FolderKanban },
        { href: '/comms', label: 'WORKSPACE', icon: MessageSquare },
        { href: '/vault', label: 'IP Vault', icon: ShieldCheck },
    ];

    // Determine specific background image based on route for Hashi mode
    const getHashiBg = () => {
        if (pathname.includes('/dashboard')) return '/images/hashi/overview.png';
        if (pathname.includes('/missions')) return '/images/hashi/missions.png';
        if (pathname.includes('/comms')) return '/images/hashi/comms.png';
        if (pathname.includes('/vault')) return '/images/hashi/vault.png';
        return '/images/hashi/overview.png';
    };

    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        const demoNotifications = [
            { id: 1, title: 'Bruce W.', message: 'The tactical tuxedo is ready for the demo.', time: 'Just now' },
            { id: 2, title: 'Lord Helmet', message: 'Ludicrous speed reached. Spaghetti synced.', time: '2m ago' }
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < demoNotifications.length) {
                const newNotif = demoNotifications[index];
                setNotifications(prev => [...prev, newNotif]);
                index++;

                // Auto-remove after 5s
                setTimeout(() => {
                    setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
                }, 5000);
            } else {
                clearInterval(interval);
            }
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#fafafa] text-black flex flex-col md:flex-row overflow-hidden relative transition-colors duration-500">
            {/* Hashi Background - 4K 16:9 Optimized */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-100"
                style={{
                    backgroundImage: `url('${getHashiBg()}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />
            <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-[#fafafa]/20 to-[#fafafa]/60" />

            {/* Sidebar Toggle Button (Floating when collapsed) - Ergonomic Refresh */}
            <button
                onClick={toggleSidebar}
                className={`fixed top-8 left-0 z-[100] group flex items-center gap-2 pl-2 pr-4 py-2 bg-white/60 backdrop-blur-xl border border-[#c20000]/20 text-[#c20000] shadow-[10px_0_30px_rgba(194,0,0,0.1)] hover:bg-[#c20000] hover:text-white transition-all duration-500 rounded-r-full
                    ${sidebarCollapsed ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}
            >
                <PanelLeftOpen size={18} strokeWidth={2} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] hashi-font">Open Menu</span>
            </button>

            {/* Global Notification Container (Top Right) */}
            <div id="global-notifications" className="fixed top-6 right-6 z-[200] flex flex-col gap-4 pointer-events-none">
                {notifications.map(notif => (
                    <div key={notif.id} className="w-80 bg-white/80 backdrop-blur-2xl border-l-4 border-[#c20000] p-4 shadow-[20px_20px_60px_rgba(0,0,0,0.1)] pointer-events-auto animate-in slide-in-from-right duration-500">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c20000] hashi-font">{notif.title}</h4>
                            <span className="text-[9px] font-bold text-[#1a1a1a]/30 uppercase">{notif.time}</span>
                        </div>
                        <p className="text-sm font-bold text-[#1a1a1a] hashi-font tracking-tight">{notif.message}</p>
                    </div>
                ))}
            </div>

            {/* Sidebar */}
            <aside className={`fixed md:relative top-0 bottom-0 left-0 z-40 p-6 flex flex-col gap-8 transition-all duration-500 ease-in-out bg-rgba(255, 255, 255, 0.9) backdrop-blur-3xl border-r border-[#c20000]/10 text-[#1a1a1a] shadow-[10px_0_40px_rgba(0,0,0,0.02)]
                ${sidebarCollapsed ? 'w-0 -translate-x-full opacity-0 p-0 overflow-hidden' : 'w-full md:w-64 translate-x-0 opacity-100'}`}>

                <div className="flex flex-col gap-6">
                    {/* Logo & Close Toggle */}
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="text-2xl font-black tracking-[0.2em] text-[#ff1a1a] drop-shadow-[0_0_12px_rgba(255,26,26,0.6)] hashi-font hover:opacity-80 transition-all">
                            hashi.
                        </Link>
                        <button onClick={toggleSidebar} className="text-[#1a1a1a]/20 hover:text-[#c20000] transition-colors md:hidden">
                            <PanelLeftClose size={20} />
                        </button>
                        <button onClick={toggleSidebar} className="hidden md:block text-[#1a1a1a]/20 hover:text-[#c20000] transition-colors">
                            <PanelLeftClose size={20} />
                        </button>
                    </div>

                    <CinematicTrigger />
                </div>

                <nav className="flex flex-col gap-2 flex-1 relative z-10 overflow-x-hidden">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 transition-all transform border-2 border-transparent group ${isActive
                                    ? 'hashi-font bg-[#c20000]/5 text-[#c20000] border-l-2 border-l-[#c20000] rounded-none shadow-[0_0_20px_rgba(194,0,0,0.1)]'
                                    : 'text-[#1a1a1a]/40 hover:text-[#c20000] hover:bg-[#c20000]/5'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? '' : 'group-hover:rotate-12 transition-transform'} strokeWidth={1.5} />
                                <span className={isActive ? 'text-sm font-medium tracking-wide' : 'text-sm'}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex flex-col gap-2 pt-8 z-10 border-t border-[#c20000]/10">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-3 px-4 py-3 transition-all w-full text-left hashi-font text-[#1a1a1a]/30 hover:text-[#c20000] hover:bg-[#c20000]/5"
                    >
                        <LogOut size={20} strokeWidth={1.5} />
                        <span>Sign Out</span>
                    </button>
                    <div className="mt-4 px-4 py-2 bg-[#c20000]/5 border border-[#c20000]/10">
                        <p className="text-[10px] font-bold text-[#c20000]/40 tracking-widest uppercase italic">The World Awaits.</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-x-hidden overflow-y-auto z-10 p-0">
                {children}
            </main>

            <GlobalMiniPlayer />
        </div>
    );
}
