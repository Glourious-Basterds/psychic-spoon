'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { LayoutDashboard, FolderKanban, MessageSquare, ShieldCheck, LogOut, PanelLeftOpen, PanelLeftClose, Globe, X, User, Compass } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useProjects } from '@/app/context/ProjectContext';
import { CinematicTrigger, GlobalMiniPlayer } from '@/components/ui/cinematic-player';
import AuthModal from '@/components/auth/AuthModal';
import { OnboardingModal } from '@/components/ui/OnboardingModal';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import { ProjectPreviewModal } from '@/components/ui/ProjectPreviewModal';
import { Search } from 'lucide-react';
import { TrendingProject } from '@/app/context/ProjectContext';
import { Suspense } from 'react';

function SearchParamsHandler({ setAuthModalOpen, setAuthModalView }: { setAuthModalOpen: (open: boolean) => void, setAuthModalView: (view: 'login' | 'register') => void }) {
    const searchParams = useSearchParams();
    
    useEffect(() => {
        const authAction = searchParams.get('auth');
        if (authAction === 'login' || authAction === 'register') {
            setAuthModalView(authAction);
            setAuthModalOpen(true);
            
            // Clear the query param without full navigation
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, [searchParams, setAuthModalOpen, setAuthModalView]);
    
    return null;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    // Moved searchParams to SearchParamsHandler
    const router = useRouter();
    const { hashiMode, sidebarCollapsed, toggleSidebar, setAuthModalOpen, setAuthModalView } = useUI();
    const { notifications, removeNotification, unreadCounts, addMessageToProject, userProfile, joinProject, reachOut, isLoaded } = useProjects();

    const totalUnread = Object.values(unreadCounts).reduce((acc, projectCounts) => {
        return acc + Object.values(projectCounts).reduce((pAcc, count) => pAcc + count, 0);
    }, 0);

    const navItems = [
        { href: '/feed', label: 'Feed', icon: Globe },
        { href: '/discover', label: 'Discover', icon: Compass },
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/missions', label: 'Missions', icon: FolderKanban },
        { href: '/profile', label: 'Profile', icon: User },
        { href: '/comms', label: 'Workspace', icon: MessageSquare, badge: totalUnread > 0 ? totalUnread : null },
        { href: '/vault', label: 'IP Vault', icon: ShieldCheck },
    ];

    // Determine specific background for Pure Black mode (subtle)
    const getHashiBg = () => {
        return '/images/hashi/overview.png';
    };

    const [showOnboarding, setShowOnboarding] = useState(false);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedSearchProject, setSelectedSearchProject] = useState<TrendingProject | null>(null);

    useEffect(() => {
        if (status === 'authenticated' && userProfile.hasCompletedOnboarding === false) {
            setShowOnboarding(true);
        } else {
            setShowOnboarding(false);
        }
    }, [session, userProfile.hasCompletedOnboarding]);

    return (
        <div className="h-screen bg-[#f9fafb] text-[#030712] flex flex-col md:flex-row overflow-hidden relative selection:bg-black/10 selection:text-[#030712]">
            {/* Auth Modal */}
            <AuthModal />
            
            {/* Onboarding Modal (Auto-trigger) */}
            {isLoaded && session && !userProfile.hasCompletedOnboarding && (
                <OnboardingModal onComplete={() => setShowOnboarding(false)} />
            )}

            {/* Global Search */}
            <GlobalSearch 
                isOpen={isSearchOpen} 
                onClose={() => setIsSearchOpen(false)} 
                onSelectProject={(p) => setSelectedSearchProject(p)}
            />

            {/* Project Preview (from Search) */}
            {selectedSearchProject && (
                <ProjectPreviewModal 
                    project={selectedSearchProject} 
                    onClose={() => setSelectedSearchProject(null)} 
                    onJoin={joinProject}
                    onReachOut={reachOut}
                    status={session ? 'authenticated' : 'unauthenticated'}
                    setAuthModalOpen={setAuthModalOpen}
                />
            )}

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

                {/* Global Search Trigger */}
                <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center gap-3 px-4 py-3 mx-[-4px] rounded-xl bg-black/[0.03] border border-black/5 text-[#030712]/40 hover:text-[#65a30d] hover:bg-[#65a30d]/5 hover:border-[#65a30d]/20 transition-all group"
                >
                    <Search size={16} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cerca...</span>
                </button>

                <nav className="flex flex-col gap-1 flex-1 relative z-10 overflow-x-hidden">
                    <Suspense fallback={null}>
                        <SearchParamsHandler setAuthModalOpen={setAuthModalOpen} setAuthModalView={setAuthModalView} />
                    </Suspense>
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

                <div className="flex flex-col gap-4 pt-8 z-10 border-t border-black/10">
                    {status === 'authenticated' ? (
                        <div className="flex flex-col gap-4">
                            {/* User Info Footer */}
                            <Link 
                                href="/profile"
                                className="flex items-center gap-3 px-4 py-3 bg-black/[0.02] border border-black/5 rounded-2xl hover:bg-black/[0.04] transition-all group"
                            >
                                <div className="w-10 h-10 rounded-full border border-black/5 overflow-hidden bg-gray-100 shrink-0">
                                    {(userProfile.photo) ? (
                                        <img 
                                            src={userProfile.photo} 
                                            className="w-full h-full object-cover" 
                                            style={{
                                                transform: `translate(${userProfile.photoX || 0}px, ${userProfile.photoY || 0}px) scale(${userProfile.photoScale || 1})`
                                            }}
                                            alt="User" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-black/40 font-bold uppercase">
                                            {userProfile.name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-black text-[#030712] truncate uppercase tracking-tight group-hover:text-[#65a30d] transition-colors">{userProfile.name || 'Utente'}</p>
                                    <p className="text-[9px] font-bold text-black/30 truncate">{userProfile.email}</p>
                                </div>
                            </Link>
                            
                            <button
                                onClick={() => signOut({ callbackUrl: window.location.origin + window.location.pathname })}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left text-black/60 hover:text-[#ef4444] hover:bg-red-50/50"
                            >
                                <LogOut size={16} strokeWidth={1.5} />
                                <span className="text-xs tracking-wide">Sign Out</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setAuthModalOpen(true)}
                            className="flex items-center gap-3 px-4 py-4 bg-black text-white rounded-2xl transition-all w-full text-center justify-center hover:bg-gray-900 shadow-xl shadow-black/10 group"
                        >
                            <User size={16} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Accedi / Registrati</span>
                        </button>
                    )}
                    
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
