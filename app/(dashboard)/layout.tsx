'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { LayoutDashboard, FolderKanban, MessageSquare, ShieldCheck, LogOut, Menu, PanelLeftOpen, PanelLeftClose, Globe, X } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useProjects } from '@/app/context/ProjectContext';
import { CinematicTrigger, GlobalMiniPlayer } from '@/components/ui/cinematic-player';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { hashiMode, sidebarCollapsed, toggleSidebar } = useUI();
    const { notifications, removeNotification, unreadCounts, addMessageToProject } = useProjects();

    const totalUnread = Object.values(unreadCounts).reduce((acc, projectCounts) => {
        return acc + Object.values(projectCounts).reduce((pAcc, count) => pAcc + count, 0);
    }, 0);

    const navItems = [
        { href: '/feed', label: 'Feed', icon: Globe },
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/missions', label: 'Missions', icon: FolderKanban },
        { href: '/comms', label: 'Workspace', icon: MessageSquare, badge: totalUnread > 0 ? totalUnread : null },
        { href: '/vault', label: 'IP Vault', icon: ShieldCheck },
    ];

    // Determine specific background for Pure Black mode (subtle)
    const getHashiBg = () => {
        return '/images/hashi/overview.png';
    };

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

            {/* Global Notification Container (Top Right - WhatsApp Mac Style) */}
            <div id="global-notifications" className="fixed top-6 right-6 z-[500] flex flex-col gap-3 pointer-events-none">
                {notifications.map(notif => (
                    <div key={notif.id} className="relative group pointer-events-auto">
                        <Link
                            href={`/comms?project=${notif.projectId}&channel=${notif.channelId}`}
                            className="flex items-center gap-4 w-80 bg-white border border-black/10 p-4 rounded-xl shadow-[0_15px_60px_rgba(0,0,0,0.15)] transition-all cursor-pointer hover:shadow-[0_20px_70px_rgba(0,0,0,0.2)] overflow-hidden"
                            style={{ animation: 'slideIn 0.4s ease-out' }}
                        >
                            {/* Profile Image / Initials */}
                            <div 
                                style={{ background: notif.senderColor || '#1e3a5f' }}
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-inner"
                            >
                                {notif.senderInitials || notif.title.charAt(0)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h4 className="text-[13px] font-bold text-[#030712] truncate">{notif.title}</h4>
                                    <span className="text-[10px] text-black/30 font-medium ml-2">{notif.time}</span>
                                </div>
                                <p className="text-[12px] text-black/60 leading-tight line-clamp-2 pr-2">{notif.message}</p>
                            </div>
                        </Link>
                        
                        {/* Close Button X (Visible on Hover) */}
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeNotification(notif.id); }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-black/5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md hover:bg-gray-50 transition-all z-10"
                        >
                            <X size={12} className="text-black/40" />
                        </button>
                    </div>
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
                                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all group border ${isActive
                                    ? 'border-[rgba(163,230,53,0.5)] text-[#65a30d]'
                                    : 'border-transparent text-black/60 hover:text-black/90 hover:bg-black/[0.03]'
                                    }`}
                                style={isActive ? { background: 'rgba(163,230,53,0.1)' } : undefined}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={16} strokeWidth={1.5} style={isActive ? { color: '#65a30d' } : undefined} />
                                    <span className={`text-xs tracking-wide ${isActive ? 'font-semibold' : 'font-normal'}`}>{item.label}</span>
                                </div>
                                {item.badge && (
                                    <span className="w-5 h-5 bg-[#ef4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                                        {item.badge}
                                    </span>
                                )}
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
