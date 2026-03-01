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
        { href: '/comms', label: 'Workspace', icon: MessageSquare },
        { href: '/vault', label: 'IP Vault', icon: ShieldCheck },
    ];

    // Determine specific background for Pure Black mode (subtle)
    const getHashiBg = () => {
        return '/images/hashi/overview.png';
    };

    type AppNotification = { id: number; title: string; message: string; time: string; projectId: string; channelId: string; };
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    useEffect(() => {
        const demoNotifications = [
            {
                id: 1,
                title: 'Bruce W.',
                message: "How's the project going on so far? ... Idk, have a look around dumbass",
                time: 'Just now',
                projectId: 'bar-man',
                channelId: 'general'
            },
            {
                id: 2,
                title: 'Lord Helmet',
                message: "How's the food guys? ... Mamma Mia! It's the best cuisine in the world",
                time: '2m ago',
                projectId: 'space-balls',
                channelId: 'kitchen'
            }
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < demoNotifications.length) {
                const newNotif = demoNotifications[index];
                setNotifications(prev => [...prev, newNotif]);
                index++;

                // Auto-remove after 8s
                setTimeout(() => {
                    setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
                }, 8000);
            } else {
                clearInterval(interval);
            }
        }, 12000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden relative selection:bg-white/10 selection:text-white">
            {/* Pure Black Background - Subtle Gradients from CSS hashi-theme-bg */}
            <div className="absolute inset-0 z-0 pointer-events-none hashi-theme-bg opacity-40" />

            {/* Sidebar Toggle Button (Floating when collapsed) */}
            <button
                onClick={toggleSidebar}
                className={`fixed top-8 left-0 z-[100] group flex items-center gap-2 pl-2 pr-4 py-2 bg-[#0a0a0a] backdrop-blur-xl border border-white/5 text-white/40 shadow-[20px_0_50px_rgba(0,0,0,0.5)] hover:text-white transition-all duration-500 rounded-r-full
                    ${sidebarCollapsed ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}
            >
                <PanelLeftOpen size={18} strokeWidth={1.5} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] hashi-font">Open Menu</span>
            </button>

            {/* Global Notification Container (Top Right) */}
            <div id="global-notifications" className="fixed top-6 right-6 z-[200] flex flex-col gap-4 pointer-events-none">
                {notifications.map(notif => (
                    <Link
                        key={notif.id}
                        href={`/comms?project=${notif.projectId}&channel=${notif.channelId}`}
                        className="w-80 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/5 p-4 shadow-[30px_30px_70px_rgba(0,0,0,0.8)] pointer-events-auto animate-in slide-in-from-right duration-700 hover:border-white/20 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors hashi-font">{notif.title}</h4>
                            <span className="text-[9px] font-bold text-white/20 uppercase">{notif.time}</span>
                        </div>
                        <p className="text-sm font-medium text-white/80 hashi-font tracking-tight leading-relaxed line-clamp-2">{notif.message}</p>
                    </Link>
                ))}
            </div>

            {/* Sidebar */}
            <aside className={`fixed md:relative top-0 bottom-0 left-0 z-40 p-6 flex flex-col gap-8 transition-all duration-500 ease-in-out bg-black border-r border-white/5 text-white/60 shadow-[20px_0_60px_rgba(0,0,0,0.3)]
                ${sidebarCollapsed ? 'w-0 -translate-x-full opacity-0 p-0 overflow-hidden' : 'w-full md:w-64 translate-x-0 opacity-100'}`}>

                <div className="flex flex-col gap-6">
                    {/* Logo & Close Toggle */}
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="text-2xl font-black tracking-[0.3em] text-white hover:opacity-80 transition-all hashi-font">
                            hashi.
                        </Link>
                        <button onClick={toggleSidebar} className="text-white/20 hover:text-white transition-colors">
                            <PanelLeftClose size={20} strokeWidth={1.5} />
                        </button>
                    </div>

                    <CinematicTrigger />
                </div>

                <nav className="flex flex-col gap-1 flex-1 relative z-10 overflow-x-hidden">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group border ${isActive
                                    ? 'border-[rgba(163,230,53,0.25)] text-[#a3e635]'
                                    : 'border-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
                                    }`}
                                style={isActive ? { background: 'rgba(163,230,53,0.08)' } : undefined}
                            >
                                <Icon size={16} strokeWidth={1.5} style={isActive ? { color: '#a3e635' } : undefined} />
                                <span className={`text-xs tracking-wide ${isActive ? 'font-semibold' : 'font-normal'}`}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex flex-col gap-2 pt-8 z-10 border-t border-white/5">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-3 px-4 py-3 transition-all w-full text-left hashi-font text-white/20 hover:text-white hover:bg-white/[0.02]"
                    >
                        <LogOut size={18} strokeWidth={1.5} />
                        <span className="text-xs uppercase tracking-widest font-bold">Sign Out</span>
                    </button>
                    <div className="mt-4 px-4 py-3 bg-white/[0.02] border border-white/5">
                        <p className="text-[9px] font-black text-white/10 tracking-[0.3em] uppercase italic">Immortalize your IP.</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-x-hidden overflow-y-auto z-10 p-0 bg-black">
                {children}
            </main>

            <GlobalMiniPlayer />
        </div>
    );
}
