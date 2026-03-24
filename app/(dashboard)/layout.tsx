'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { LayoutDashboard, FolderKanban, MessageSquare, ShieldCheck, LogOut, Menu, PanelLeftOpen, PanelLeftClose, Globe } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { CinematicTrigger, GlobalMiniPlayer } from '@/components/ui/cinematic-player';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { hashiMode, sidebarCollapsed, toggleSidebar } = useUI();

    const navItems = [
        { href: '/feed', label: 'Feed', icon: Globe },
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
                channelId: 'Bruce-W.'
            },
            {
                id: 2,
                title: 'Lord Helmet',
                message: "How's the food guys? ... Mamma Mia! It's the best cuisine in the world",
                time: '2m ago',
                projectId: 'space-balls',
                channelId: 'Home-Base'
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
        <div className="h-screen bg-[#f9fafb] text-[#030712] flex flex-col md:flex-row overflow-hidden relative selection:bg-black/10 selection:text-[#030712]">
            {/* Pure Black Background - Subtle Gradients from CSS hashi-theme-bg */}
            <div className="absolute inset-0 z-0 pointer-events-none hashi-theme-bg opacity-40" />

            {/* Sidebar Toggle Button (Floating when collapsed) */}
            <button
                onClick={toggleSidebar}
                className={`fixed top-8 left-0 z-[100] group flex items-center gap-2 pl-2 pr-4 py-2 bg-[#ffffff] backdrop-blur-xl border border-black/5 text-black/40 shadow-[20px_0_50px_rgba(0,0,0,0.05)] hover:text-[#030712] transition-all duration-500 rounded-r-full
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
                        className="w-80 bg-[#ffffff]/90 backdrop-blur-2xl border border-black/5 p-4 shadow-[30px_30px_70px_rgba(0,0,0,0.05)] pointer-events-auto animate-in slide-in-from-right duration-700 hover:border-black/20 transition-all group cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 group-hover:text-[#030712] transition-colors hashi-font">{notif.title}</h4>
                            <span className="text-[9px] font-bold text-black/20 uppercase">{notif.time}</span>
                        </div>
                        <p className="text-sm font-medium text-black/80 hashi-font tracking-tight leading-relaxed line-clamp-2">{notif.message}</p>
                    </Link>
                ))}
            </div>

            {/* Sidebar */}
            <aside className={`fixed md:relative top-0 bottom-0 left-0 z-40 p-6 flex flex-col gap-8 transition-all duration-500 ease-in-out bg-[#ffffff] border-r border-black/5 text-black/60 shadow-[20px_0_60px_rgba(0,0,0,0.05)]
                ${sidebarCollapsed ? 'w-0 -translate-x-full opacity-0 p-0 overflow-hidden' : 'w-full md:w-64 translate-x-0 opacity-100'}`}>

                <div className="flex flex-col gap-6">
                    {/* Logo & Close Toggle */}
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="text-2xl font-black tracking-[0.3em] text-[#030712] hover:opacity-80 transition-all hashi-font">
                            hashi.
                        </Link>
                        <button onClick={toggleSidebar} className="text-black/40 hover:text-[#030712] transition-colors">
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
                                    ? 'border-[rgba(163,230,53,0.5)] text-[#65a30d]'
                                    : 'border-transparent text-black/60 hover:text-black/90 hover:bg-black/[0.03]'
                                    }`}
                                style={isActive ? { background: 'rgba(163,230,53,0.1)' } : undefined}
                            >
                                <Icon size={16} strokeWidth={1.5} style={isActive ? { color: '#65a30d' } : undefined} />
                                <span className={`text-xs tracking-wide ${isActive ? 'font-semibold' : 'font-normal'}`}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex flex-col gap-2 pt-8 z-10 border-t border-black/10">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left text-black/60 hover:text-[#030712] hover:bg-black/[0.03]"
                    >
                        <LogOut size={16} strokeWidth={1.5} />
                        <span className="text-xs tracking-wide">Sign Out</span>
                    </button>
                    <Link href="/vault" className="mt-2 px-4 py-3 rounded-lg bg-black/[0.02] border border-black/10 hover:border-[rgba(163,230,53,0.4)] hover:bg-[rgba(163,230,53,0.08)] transition-all block">
                        <p className="text-[9px] font-bold text-black/50 tracking-[0.25em] uppercase hover:text-[#65a30d] transition-colors">Immortalize your IP →</p>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden z-10 p-0 bg-[#f9fafb]">
                {children}
            </main>

            <GlobalMiniPlayer />
        </div>
    );
}
