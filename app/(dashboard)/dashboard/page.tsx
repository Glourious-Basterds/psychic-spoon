'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Zap, Target, ShieldCheck } from 'lucide-react';
import { useUI } from '@/context/UIContext';

export default function DashboardPage() {
    const { data: session } = useSession();
    const { comicMode, japaneseMode, neonMode, hashiMode } = useUI();

    const mockChats = [
        { id: 1, user: 'Tony S.', message: "The new carbon-fiber shaker is ready for field testing. Don't shake it too hard, it might explode.", time: '10:00' },
        { id: 2, user: 'Lord Helmet', message: "The merchandising strategy is ludicrous! We need more flamethrowers.", time: '12:01' },
    ];

    return (
        <div className="p-6 md:p-12 min-h-full">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 relative">
                {comicMode && <div className="onomatopoeia boom absolute -top-10 -right-10 text-8xl opacity-20 pointer-events-none uppercase">Boom!</div>}
                <div>
                    <h1 className={`text-6xl font-black uppercase italic tracking-tighter ${comicMode ? 'comic-font drop-shadow-[6px_6px_0px_rgba(230,36,41,0.2)]' : japaneseMode ? 'japanese-font not-italic text-[#BE1E2D] tracking-[0.1em] drop-shadow-sm' : neonMode ? 'neon-font text-[#FAF0E6] tracking-tight drop-shadow-[0_0_20px_rgba(245,166,35,0.3)]' : hashiMode ? 'hashi-font text-[#d3ccc0] tracking-[0.1em] font-normal drop-shadow-[0_0_15px_rgba(138,3,3,0.8)]' : 'tracking-tight'}`}>
                        {hashiMode ? 'Neo-Gothica Overview' : comicMode ? 'Command Center' : 'Dashboard Overview'}
                    </h1>
                    <p className={`mt-2 font-bold uppercase text-xs ${japaneseMode ? 'japanese-font text-[#1A2639] tracking-[0.3em] not-italic' : neonMode ? 'neon-font text-[#F5A623]/60 tracking-widest' : hashiMode ? 'hashi-font text-[#c20000] tracking-[0.3em] font-normal' : 'text-zinc-600 tracking-widest'}`}>The world awaits, {session?.user?.name || 'Traveler'}</p>
                </div>
                <div className={`${comicMode
                    ? 'comic-font bg-comic-yellow text-black border-4 border-black shadow-[6px_6px_0px_#000] transform rotate-2 italic font-black uppercase tracking-tighter'
                    : japaneseMode
                        ? 'japanese-font border border-[#BE1E2D] text-[#BE1E2D] bg-transparent rounded-none tracking-[0.2em]'
                        : neonMode
                            ? 'neon-font border border-[#F5A623]/30 text-[#F5A623] bg-[#F5A623]/5 tracking-widest uppercase text-sm shadow-[0_0_16px_rgba(245,166,35,0.1)]'
                            : hashiMode
                                ? 'hashi-font cyber-border text-[#d3ccc0] bg-[#1a0b1f]/80 tracking-[0.2em] font-bold uppercase text-xs shadow-[0_0_20px_rgba(138,3,3,0.5)] px-6 backdrop-blur-md'
                                : 'bg-zinc-100 text-zinc-900 rounded-full italic font-black uppercase tracking-tighter'
                    } px-8 py-3 text-2xl`}>
                    {hashiMode ? 'Status: Branded' : neonMode ? '● Active' : 'Status: Vigilant'}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                {/* Card 1 */}
                <div className={`p-1 transition-all ${comicMode ? 'bg-white border-4 border-black shadow-[12px_12px_0px_#000] hover:scale-105' : japaneseMode ? 'bg-transparent border border-[#E0D8C8] hover:border-[#BE1E2D]' : neonMode ? 'bg-[#111118] border border-[#F5A623]/15 hover:border-[#F5A623]/40 shadow-[0_0_24px_rgba(245,166,35,0.04)]' : hashiMode ? 'card overflow-hidden h-full flex flex-col justify-center' : 'bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-md'}`}>
                    <div className={`${comicMode ? 'bg-hero-blue p-8' : japaneseMode ? 'bg-[#FAF8F5]/80 backdrop-blur-sm p-8 relative overflow-hidden' : neonMode || hashiMode ? 'p-8 relative overflow-hidden' : 'p-8'} text-black`}>
                        {japaneseMode && <div className="absolute -right-2 -bottom-3 opacity-5 japanese-font text-8xl text-[#1A2639] pointer-events-none">I</div>}
                        {neonMode && <div className="absolute -right-2 -bottom-3 opacity-[0.04] font-black text-9xl text-[#F5A623] neon-font pointer-events-none">12</div>}
                        {hashiMode && <div className="absolute -right-2 -bottom-3 opacity-[0.06] font-black text-9xl text-[#c20000] hashi-font pointer-events-none">I</div>}
                        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${comicMode ? 'comic-font text-white/60' : japaneseMode ? 'japanese-font text-[#1A2639] tracking-[0.3em] not-italic' : neonMode ? 'neon-font text-[#F5A623]/50' : hashiMode ? 'hashi-font text-[#d3ccc0]/60 tracking-[0.3em] font-normal' : 'text-zinc-400'}`}>{hashiMode ? 'Cyber-Cathedrals' : 'Active Operations'}</h3>
                        <div className={`text-6xl font-black italic ${comicMode ? 'text-white comic-font' : japaneseMode ? 'japanese-font not-italic text-[#BE1E2D]' : neonMode ? 'neon-font text-[#FAF0E6] drop-shadow-[0_0_10px_rgba(245,166,35,0.4)]' : hashiMode ? 'hashi-font text-[#c20000] tracking-tight neon-text not-italic' : ''}`}>12</div>
                    </div>
                </div>
                {/* Card 2 */}
                <div className={`p-1 transition-all ${comicMode ? 'bg-white border-4 border-black shadow-[12px_12px_0px_#000] hover:scale-105' : japaneseMode ? 'bg-transparent border border-[#E0D8C8] hover:border-[#1A2639]' : neonMode ? 'bg-[#111118] border border-[#E8547A]/15 hover:border-[#E8547A]/40 shadow-[0_0_24px_rgba(232,84,122,0.04)]' : hashiMode ? 'card overflow-hidden h-full flex flex-col justify-center border-[#8a0303]/30 hover:border-[#c20000]/60' : 'bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-md'}`}>
                    <div className={`${comicMode ? 'bg-marvel-red p-8' : japaneseMode ? 'bg-[#FAF8F5]/80 backdrop-blur-sm p-8 relative overflow-hidden' : neonMode || hashiMode ? 'p-8 relative overflow-hidden' : 'p-8'} text-black`}>
                        {japaneseMode && <div className="absolute -right-2 -bottom-3 opacity-5 japanese-font text-8xl text-[#1A2639] pointer-events-none">II</div>}
                        {neonMode && <div className="absolute -right-2 -bottom-3 opacity-[0.04] font-black text-9xl text-[#E8547A] neon-font pointer-events-none">03</div>}
                        {hashiMode && <div className="absolute -right-2 -bottom-3 opacity-[0.06] font-black text-9xl text-[#c20000] hashi-font pointer-events-none">II</div>}
                        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${comicMode ? 'comic-font text-white/60' : japaneseMode ? 'japanese-font text-[#1A2639] tracking-[0.3em] not-italic' : neonMode ? 'neon-font text-[#E8547A]/50' : hashiMode ? 'hashi-font text-[#d3ccc0]/60 font-normal tracking-[0.3em]' : 'text-zinc-400'}`}>{hashiMode ? 'Omen Protocols' : 'Strategic Alerts'}</h3>
                        <div className={`text-6xl font-black italic ${comicMode ? 'text-white comic-font' : japaneseMode ? 'japanese-font not-italic text-[#BE1E2D]' : neonMode ? 'neon-font text-[#E8547A] drop-shadow-[0_0_10px_rgba(232,84,122,0.5)]' : hashiMode ? 'hashi-font text-[#c20000] neon-text tracking-tight not-italic' : 'text-marvel-red'}`}>03</div>
                    </div>
                </div>
                {/* Card 3 */}
                <div className={`p-1 transition-all ${comicMode ? 'bg-white border-4 border-black shadow-[12px_12px_0px_#000] hover:scale-105' : japaneseMode ? 'bg-transparent border border-[#E0D8C8] hover:border-[#1A2639]' : neonMode ? 'bg-[#111118] border border-[#F5A623]/10 hover:border-[#F5A623]/30' : hashiMode ? 'card overflow-hidden h-full flex flex-col justify-center border-[#8a0303]/40 hover:border-[#c20000]/60' : 'bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-md'}`}>
                    <div className={`${comicMode ? 'bg-comic-yellow p-8' : japaneseMode ? 'bg-[#FAF8F5]/80 backdrop-blur-sm p-8 relative overflow-hidden' : neonMode || hashiMode ? 'p-8 relative overflow-hidden' : 'p-8'} text-black`}>
                        {japaneseMode && <div className="absolute -right-4 -bottom-3 opacity-5 font-serif text-8xl text-[#1A2639] pointer-events-none">III</div>}
                        {hashiMode && <div className="absolute -right-2 -bottom-3 opacity-[0.06] font-black text-9xl text-[#c20000] pointer-events-none">III</div>}
                        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${comicMode ? 'text-black/50' : japaneseMode ? 'text-[#1A2639] font-serif tracking-[0.3em] not-italic' : neonMode ? 'text-[#F5A623]/50' : hashiMode ? 'text-[#d3ccc0]/60 font-normal tracking-[0.3em] hashi-font' : 'text-zinc-400'}`}>{hashiMode ? 'Neon Grimoires' : 'Vault Security'}</h3>
                        <div className={`text-6xl font-black italic ${comicMode ? 'marvel-font' : japaneseMode ? 'font-serif not-italic text-[#1A2639]' : neonMode ? 'text-[#FAF0E6]/80 tracking-tight' : hashiMode ? 'text-[#c20000] neon-text tracking-tight not-italic hashi-font' : ''} tracking-tight`}>MAX</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Projects Section */}
                <div className="flex-[2]">
                    <div className={`${comicMode
                        ? 'inline-block px-6 py-2 bg-black text-white transform -rotate-1 skew-x-12 border-4 border-transparent hover:border-comic-yellow font-black uppercase italic'
                        : japaneseMode
                            ? 'text-xl font-serif text-[#BE1E2D] tracking-[0.2em] border-b border-[#BE1E2D] inline-block pb-2 px-2 uppercase'
                            : neonMode
                                ? 'text-sm text-[#F5A623]/60 uppercase tracking-[0.3em] mb-2'
                                : hashiMode
                                    ? 'text-xs text-[#8a0303] uppercase tracking-[0.4em] mb-4 border-l-2 border-[#8a0303] pl-3 font-bold'
                                    : 'text-xl font-bold font-black uppercase italic'
                        } mb-8 transition-all`}>
                        {hashiMode ? 'Dark City Syndicates' : 'High-Stakes Missions'}
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                        {[
                            { id: 'bar-man', title: 'The Bar-man', color: 'marvel-red', icon: Zap, status: 'Crafting Secret Cocktails' },
                            { id: 'space-balls', title: 'Space-balls', color: 'hero-blue', icon: Target, status: 'Ludicrous Speed Research' }
                        ].map(proj => (
                            <div key={proj.id} className={`${comicMode ? 'bg-white p-1 border-4 border-black shadow-[8px_8px_0px_#000] hover:scale-[1.01]' : japaneseMode ? 'bg-transparent border border-[#E0D8C8] hover:border-[#1A2639]' : neonMode ? 'bg-[#111118] border border-[#F5A623]/10 hover:border-[#F5A623]/30 hover:shadow-[0_0_20px_rgba(245,166,35,0.06)]' : hashiMode ? 'card' : 'bg-white border border-zinc-100 rounded-2xl shadow-sm hover:border-zinc-300'} transition-all`}>
                                <div className={`${comicMode ? 'bg-white/50 p-8 flex justify-between items-center border-2 border-dashed border-zinc-200' : japaneseMode ? 'bg-[#FAF8F5]/50 p-8 flex flex-col md:flex-row justify-between items-start md:items-center' : neonMode || hashiMode ? 'p-6 flex justify-between items-center' : 'p-8 flex justify-between items-center'} gap-6`}>
                                    <div>
                                        <div className={`text-4xl uppercase tracking-tighter transition-colors ${comicMode ? `font-black italic group-hover:text-${proj.color} text-black` : japaneseMode ? 'font-serif tracking-[0.1em] text-[#1A2639]' : neonMode ? 'font-black text-[#FAF0E6]' : hashiMode ? 'hashi-font font-bold text-[#d3ccc0] tracking-[0.1em]' : 'font-black italic text-black'}`}>{proj.title}</div>
                                        <div className={`text-xs uppercase mt-2 italic flex items-center gap-2 ${japaneseMode ? 'text-[#1A2639]/70 font-serif tracking-[0.2em] not-italic' : neonMode ? 'text-[#FAF0E6]/30 not-italic tracking-widest' : hashiMode ? 'hashi-font text-[#c20000] not-italic tracking-[0.2em] font-normal' : 'text-zinc-500 font-bold tracking-widest'}`}>
                                            <proj.icon size={14} className={comicMode ? (proj.id === 'bar-man' ? 'animate-pulse text-marvel-red' : `text-${proj.color}`) : neonMode ? 'text-[#F5A623]/50' : japaneseMode ? 'text-[#BE1E2D]' : hashiMode ? 'text-[#c20000]' : ''} /> {hashiMode ? 'Extracting Relics' : proj.status}
                                        </div>
                                    </div>
                                    <Link href="/missions">
                                        <Button className={comicMode
                                            ? `comic-font bg-${proj.color} text-white border-4 border-black hover:bg-black hover:scale-110 font-black uppercase italic tracking-tighter text-xl h-16 px-10 rounded-none shadow-[8px_8px_0px_#000]`
                                            : japaneseMode
                                                ? 'japanese-font bg-transparent text-[#BE1E2D] border border-[#BE1E2D] hover:bg-[#BE1E2D] hover:text-white rounded-none tracking-[0.2em] uppercase px-8 h-12'
                                                : neonMode
                                                    ? 'neon-font bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20 hover:bg-[#F5A623]/15 hover:border-[#F5A623]/40 rounded-none px-6 h-10 tracking-widest text-xs uppercase'
                                                    : hashiMode
                                                        ? 'hashi-font cyber-border bg-[#1a0b1f]/50 text-[#c20000] hover:bg-[#8a0303]/40 hover:text-[#d3ccc0] rounded-none px-8 font-bold tracking-[0.15em] uppercase text-[10px]'
                                                        : "rounded-full px-6"}>
                                            {hashiMode ? 'INITIATE PROTOCOL' : 'ENTER INTEL'}
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
                        ? 'inline-block px-6 py-2 bg-marvel-red text-white transform rotate-1 -skew-x-12 border-4 border-transparent hover:border-black font-black uppercase italic'
                        : japaneseMode
                            ? 'text-xl font-serif text-[#1A2639] tracking-[0.2em] border-b border-[#1A2639] inline-block pb-2 px-2 uppercase'
                            : neonMode
                                ? 'text-sm text-[#E8547A]/60 uppercase tracking-[0.3em] mb-2'
                                : hashiMode
                                    ? 'text-xs text-[#8a0303]/80 uppercase tracking-[0.4em] mb-4 border-l-2 border-[#8a0303] pl-3 font-bold'
                                    : 'text-xl font-bold font-black uppercase italic'
                        } mb-8 transition-all`}>
                        {hashiMode ? 'Underworld Network' : 'Live Comms'}
                    </div>
                    <div className={`${comicMode ? 'bg-white border-4 border-black rounded-none p-6 shadow-[12px_12px_0px_#000]' : japaneseMode ? 'bg-[#FAF8F5]/80 backdrop-blur-sm border border-[#E0D8C8] p-6' : neonMode ? 'bg-[#111118] border border-[#E8547A]/10 p-6 shadow-[0_0_30px_rgba(232,84,122,0.04)]' : hashiMode ? 'card p-6' : 'bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm'} space-y-6 relative overflow-hidden`}>
                        {comicMode && <div className="absolute top-0 right-0 onomatopoeia pow opacity-30 text-4xl -rotate-12">Click!</div>}
                        {mockChats.map((chat) => (
                            <div key={chat.id} className={`${comicMode ? 'p-5 bg-zinc-50 border-l-8 border-comic-yellow transform hover:scale-[1.02] hover:-rotate-1 border-y-2 border-r-2 border-black shadow-sm' : japaneseMode ? 'p-4 border-l border-l-[#BE1E2D] bg-[#FDFBF7]' : neonMode ? 'p-4 border-l-2 border-l-[#E8547A]/40 bg-[#E8547A]/[0.02] hover:border-l-[#E8547A]/60' : hashiMode ? 'p-4 border-l-2 border-l-[#8a0303]/60 bg-[#1a0b1f]/20 hover:border-l-[#c20000]/90 transition-all shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]' : 'p-4 bg-zinc-50 rounded-xl'} transition-all`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs uppercase ${comicMode ? 'text-hero-blue font-black tracking-[0.2em]' : japaneseMode ? 'text-[#BE1E2D] font-serif tracking-[0.1em]' : neonMode ? 'text-[#F5A623]/70 tracking-[0.15em]' : hashiMode ? 'hashi-font text-[#c20000] font-bold tracking-[0.2em]' : 'text-zinc-600 font-black tracking-[0.2em]'}`}>{chat.user}</span>
                                    <span className={`text-[9px] ${japaneseMode ? 'text-[#1A2639]/50 font-serif' : neonMode ? 'text-[#FAF0E6]/20' : hashiMode ? 'hashi-font text-[#d3ccc0]/40' : 'text-zinc-400 font-black italic'}`}>{chat.time}</span>
                                </div>
                                <p className={`text-lg leading-tight ${comicMode ? 'text-black font-bold italic' : japaneseMode ? 'text-[#1A2639] font-serif not-italic' : neonMode ? 'text-[#FAF0E6]/70' : hashiMode ? 'hashi-font text-[#d3ccc0] font-normal' : 'text-zinc-800 font-bold italic'}`}>"{chat.message}"</p>
                            </div>
                        ))}
                        <Link href="/comms" className="w-full">
                            <Button className={`${comicMode ? 'comic-font bg-black text-white border-4 border-black rounded-none h-14 hover:bg-marvel-red text-xl shadow-[4px_4px_0px_rgba(230,36,41,0.5)] font-black italic' : japaneseMode ? 'w-full japanese-font bg-transparent text-[#1A2639] border border-[#1A2639] rounded-none hover:bg-[#1A2639] hover:text-white tracking-[0.2em]' : hashiMode ? 'w-full cyber-border hashi-font bg-[#1a0b1f]/80 text-[#c20000] hover:bg-[#8a0303]/40 hover:text-[#d3ccc0] rounded-none tracking-[0.2em] font-bold h-12' : 'w-full rounded-xl font-black italic'} uppercase flex items-center justify-center gap-2 transition-all`}>
                                {hashiMode ? 'CONNECT TO GRID' : 'OPEN WAR ROOM'} <ChevronRight size={20} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

