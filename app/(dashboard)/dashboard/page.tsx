'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Zap, Target, ShieldCheck } from 'lucide-react';
import { useUI } from '@/context/UIContext';

export default function DashboardPage() {
    const { data: session } = useSession();
    const { comicMode } = useUI();

    const mockChats = [
        { id: 1, user: 'Tony S.', message: 'The armor design for Bar-man is ready!', time: '10:45 AM' },
        { id: 2, user: 'Lord Helmet', message: 'The merchandising for space-balls better be profitable.', time: '11:15 AM' },
    ];

    return (
        <div className="p-6 md:p-12 min-h-full">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 relative">
                {comicMode && <div className="onomatopoeia boom absolute -top-10 -right-10 text-8xl opacity-20 pointer-events-none uppercase">Boom!</div>}
                <div>
                    <h1 className={`text-6xl font-black uppercase italic tracking-tighter ${comicMode ? 'marvel-font drop-shadow-[6px_6px_0px_rgba(230,36,41,0.2)]' : 'tracking-tight'}`}>
                        {comicMode ? 'Command Center' : 'Dashboard Overview'}
                    </h1>
                    <p className="text-zinc-600 mt-2 font-bold tracking-widest uppercase text-xs">Ready for action, {session?.user?.name || 'Agent'}</p>
                </div>
                <div className={`${comicMode
                        ? 'bg-comic-yellow text-black border-4 border-black shadow-[6px_6px_0px_#000] transform rotate-2'
                        : 'bg-zinc-100 text-zinc-900 rounded-full'
                    } px-8 py-3 italic font-black uppercase tracking-tighter text-2xl`}>
                    Status: Vigilant
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <div className={`p-1 transition-all ${comicMode ? 'bg-white border-4 border-black shadow-[12px_12px_0px_#000] hover:scale-105' : 'bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-md'}`}>
                    <div className={`${comicMode ? 'bg-hero-blue p-8' : 'p-8'} text-black`}>
                        <h3 className={`${comicMode ? 'text-white/60' : 'text-zinc-400'} text-[10px] font-black uppercase tracking-[0.2em] mb-4`}>Active Operations</h3>
                        <div className={`text-6xl font-black italic ${comicMode ? 'text-white marvel-font' : ''}`}>12</div>
                    </div>
                </div>
                <div className={`p-1 transition-all ${comicMode ? 'bg-white border-4 border-black shadow-[12px_12px_0px_#000] hover:scale-105' : 'bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-md'}`}>
                    <div className={`${comicMode ? 'bg-marvel-red p-8' : 'p-8'} text-black`}>
                        <h3 className={`${comicMode ? 'text-white/60' : 'text-zinc-400'} text-[10px] font-black uppercase tracking-[0.2em] mb-4`}>Strategic Alerts</h3>
                        <div className={`text-6xl font-black italic ${comicMode ? 'text-white marvel-font' : 'text-marvel-red'}`}>03</div>
                    </div>
                </div>
                <div className={`p-1 transition-all ${comicMode ? 'bg-white border-4 border-black shadow-[12px_12px_0px_#000] hover:scale-105' : 'bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-md'}`}>
                    <div className={`${comicMode ? 'bg-comic-yellow p-8' : 'p-8'} text-black`}>
                        <h3 className={`${comicMode ? 'text-black/50' : 'text-zinc-400'} text-[10px] font-black uppercase tracking-[0.2em] mb-4`}>Vault Security</h3>
                        <div className={`text-6xl font-black italic ${comicMode ? 'marvel-font' : ''} tracking-tight`}>MAX</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Projects Section */}
                <div className="flex-[2]">
                    <div className={`${comicMode
                            ? 'inline-block px-6 py-2 bg-black text-white transform -rotate-1 skew-x-12 border-4 border-transparent hover:border-comic-yellow'
                            : 'text-xl font-bold mb-8'
                        } font-black uppercase italic mb-8 transition-all`}>
                        High-Stakes Missions
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                        {[
                            { id: 'bar-man', title: 'The Bar-man', color: 'marvel-red', icon: Zap, status: 'Crafting Secret Cocktails' },
                            { id: 'space-balls', title: 'Space-balls', color: 'hero-blue', icon: Target, status: 'Ludicrous Speed Research' }
                        ].map(proj => (
                            <div key={proj.id} className={`${comicMode ? 'bg-white p-1 border-4 border-black shadow-[8px_8px_0px_#000] hover:scale-[1.01]' : 'bg-white border border-zinc-100 rounded-2xl shadow-sm hover:border-zinc-300'} transition-all`}>
                                <div className={`${comicMode ? 'bg-white/50 p-8 flex justify-between items-center border-2 border-dashed border-zinc-200' : 'p-8 flex justify-between items-center'} gap-6`}>
                                    <div>
                                        <div className={`text-4xl font-black uppercase italic tracking-tighter text-black transition-colors ${comicMode ? `group-hover:text-${proj.color}` : ''}`}>{proj.title}</div>
                                        <div className="text-xs text-zinc-500 font-bold uppercase mt-2 tracking-widest italic flex items-center gap-2">
                                            <proj.icon size={14} className={comicMode ? (proj.id === 'bar-man' ? 'animate-pulse text-marvel-red' : `text-${proj.color}`) : ''} /> {proj.status}
                                        </div>
                                    </div>
                                    <Link href={`/missions/${proj.id}`}>
                                        <Button className={comicMode
                                            ? `bg-${proj.color} text-white border-4 border-black hover:bg-black hover:scale-110 font-black uppercase italic tracking-tighter text-xl h-16 px-10 rounded-none shadow-[8px_8px_0px_#000]`
                                            : "rounded-full px-6"}>
                                            ENTER INTEL
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Messages Sidebar Component */}
                <div className="flex-1">
                    <div className={`${comicMode
                            ? 'inline-block px-6 py-2 bg-marvel-red text-white transform rotate-1 -skew-x-12 border-4 border-transparent hover:border-black'
                            : 'text-xl font-bold mb-8'
                        } font-black uppercase italic mb-8 transition-all`}>
                        Live Comms
                    </div>
                    <div className={`${comicMode ? 'bg-white border-4 border-black rounded-none p-6 shadow-[12px_12px_0px_#000]' : 'bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm'} space-y-6 relative overflow-hidden`}>
                        {comicMode && <div className="absolute top-0 right-0 onomatopoeia pow opacity-30 text-4xl -rotate-12">Click!</div>}
                        {mockChats.map((chat) => (
                            <div key={chat.id} className={`${comicMode ? 'p-5 bg-zinc-50 border-l-8 border-comic-yellow transform hover:scale-[1.02] hover:-rotate-1 border-y-2 border-r-2 border-black shadow-sm' : 'p-4 bg-zinc-50 rounded-xl'} transition-all`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-black uppercase tracking-[0.2em] ${comicMode ? 'text-hero-blue' : 'text-zinc-600'}`}>{chat.user}</span>
                                    <span className="text-[9px] text-zinc-400 font-black italic">{chat.time}</span>
                                </div>
                                <p className={`text-lg italic font-bold leading-tight ${comicMode ? 'text-black' : 'text-zinc-800'}`}>"{chat.message}"</p>
                            </div>
                        ))}
                        <Link href="/comms">
                            <Button className={`${comicMode ? 'bg-black text-white border-4 border-black rounded-none h-14 hover:bg-marvel-red text-xl shadow-[4px_4px_0px_rgba(230,36,41,0.5)]' : 'w-full rounded-xl'} font-black uppercase italic flex items-center justify-center gap-2 transition-all`}>
                                OPEN WAR ROOM <ChevronRight size={20} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
