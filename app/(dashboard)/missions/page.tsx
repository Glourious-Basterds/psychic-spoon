'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, Target } from 'lucide-react';
import { useUI } from '@/context/UIContext';

export default function MissionsPage() {
    const { comicMode, japaneseMode, hashiMode } = useUI();

    const missions = [
        { id: 'bar-man', title: 'The Bar-man', status: 'In Progress', progress: 65, priority: 'CRITICAL', shadow: 'shadow-[12px_12px_0px_#e62429]' },
        { id: 'space-balls', title: 'Space-balls', status: 'Planning', progress: 30, priority: 'HIGH', shadow: 'shadow-[12px_12px_0px_#003399]' },
        { id: 'nexus', title: 'Operation Nexus', status: 'Standby', progress: 0, priority: 'LOW', shadow: 'shadow-[12px_12px_0px_#fde802]' },
    ];

    const priorityColors = {
        CRITICAL: {
            comic: 'bg-marvel-red text-white',
            japanese: 'bg-[#BE1E2D] text-white',
            hashi: 'bg-[#8a0303]/40 text-[#c20000] border-[#8a0303]/60',
            boring: 'bg-red-100 text-red-700'
        },
        HIGH: {
            comic: 'bg-hero-blue text-white',
            japanese: 'bg-[#1A2639] text-white',
            hashi: 'bg-[#1a0b1f]/60 text-[#8a0303] border-[#8a0303]/30',
            boring: 'bg-blue-100 text-blue-800'
        },
        LOW: {
            comic: 'bg-comic-yellow text-black',
            japanese: 'bg-[#E0D8C8] text-[#1A2639]',
            hashi: 'bg-[#030304]/80 text-[#d3ccc0]/50 border-[#1a0b1f]/80',
            boring: 'bg-zinc-100 text-zinc-600'
        },
    };

    const progressColors = {
        'bar-man': { comic: 'bg-marvel-red', japanese: 'bg-[#BE1E2D]', hashi: 'bg-gradient-to-r from-[#8a0303] to-[#c20000]', boring: 'bg-zinc-800' },
        'space-balls': { comic: 'bg-hero-blue', japanese: 'bg-[#1A2639]', hashi: 'bg-gradient-to-r from-[#1a0b1f] to-[#8a0303]', boring: 'bg-zinc-600' },
        nexus: { comic: 'bg-comic-yellow', japanese: 'bg-[#E0D8C8]', hashi: 'bg-gradient-to-r from-[#1a0b1f] to-[#030304]', boring: 'bg-zinc-300' },
    };

    const t = comicMode ? 'comic' : japaneseMode ? 'japanese' : hashiMode ? 'hashi' : 'boring';

    return (
        <div className="p-6 md:p-12 min-h-screen">
            <header className="mb-20 relative">
                {comicMode && <div className="onomatopoeia kapow absolute -top-10 -left-10 text-[10rem] opacity-10 pointer-events-none uppercase">Kapow!</div>}
                <h1 className={`leading-none mb-4 ${comicMode
                    ? 'text-8xl font-black uppercase italic tracking-tighter comic-font drop-shadow-[8px_8px_0px_rgba(230,36,41,0.2)]'
                    : japaneseMode
                        ? 'text-6xl japanese-font text-[#BE1E2D] tracking-[0.05em]'
                        : hashiMode
                            ? 'text-8xl font-black uppercase tracking-[0.1em] text-[#d3ccc0] neon-text hashi-font italic'
                            : 'text-8xl font-black uppercase italic tracking-tighter'}`}>
                    {hashiMode ? 'Astral Expeditions' : 'Active Operations'}
                </h1>
                <p className={`text-xs uppercase ${comicMode
                    ? 'text-zinc-600 font-black tracking-[0.3em] comic-font'
                    : japaneseMode
                        ? 'text-[#1A2639]/60 japanese-font tracking-[0.3em]'
                        : hashiMode
                            ? 'text-[#8a0303] tracking-[0.4em] border-l-2 border-[#8a0303] pl-3 hashi-font font-bold'
                            : 'text-zinc-600 font-black tracking-[0.3em]'}`}>
                    {hashiMode ? 'Descending into the abyss for blood and glory' : 'Strategic deployment & mission monitoring'}
                </p>
            </header>

            <div className="space-y-10">
                {missions.map((mission) => (
                    <div
                        key={mission.id}
                        className={`transition-all group relative overflow-hidden ${comicMode
                            ? `bg-white p-1 border-4 border-black ${mission.shadow} hover:translate-x-2 hover:-translate-y-2 hover:shadow-[20px_20px_0px_#000]`
                            : japaneseMode
                                ? 'bg-[#FAF8F5]/70 border border-[#E0D8C8] hover:border-[#BE1E2D] backdrop-blur-sm'
                                : hashiMode
                                    ? 'card border-[#8a0303]/20 hover:border-[#8a0303]/60'
                                    : 'bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-md'}`}
                    >
                        {comicMode && <div className="absolute top-0 right-0 onomatopoeia punch opacity-5 text-9xl -rotate-12 pointer-events-none">Hit!</div>}
                        {japaneseMode && (
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-8xl font-serif opacity-5 text-[#1A2639] pointer-events-none select-none">
                                {mission.id === 'bar-man' ? 'I' : mission.id === 'space-balls' ? 'II' : 'III'}
                            </div>
                        )}
                        {hashiMode && (
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-9xl font-black opacity-[0.04] text-[#8a0303] pointer-events-none select-none tracking-tighter">
                                {mission.id === 'bar-man' ? '01' : mission.id === 'space-balls' ? '02' : '03'}
                            </div>
                        )}
                        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-8 ${comicMode
                            ? 'bg-white p-8 md:p-12 border-2 border-dashed border-zinc-100'
                            : 'p-8 md:p-10'}`}>
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`px-4 py-1 text-[10px] uppercase tracking-widest ${comicMode
                                        ? `font-black italic skew-x-[-15deg] border-2 border-black comic-font ${priorityColors[mission.priority as keyof typeof priorityColors].comic}`
                                        : japaneseMode
                                            ? `japanese-font tracking-[0.2em] ${priorityColors[mission.priority as keyof typeof priorityColors].japanese}`
                                            : hashiMode
                                                ? `border ${priorityColors[mission.priority as keyof typeof priorityColors].hashi} tracking-[0.2em] px-3 hashi-font`
                                                : `font-bold rounded-full ${priorityColors[mission.priority as keyof typeof priorityColors].boring}`}`}>
                                        {hashiMode ? 'BRAND OF SACRIFICE' : mission.priority}
                                    </div>
                                    <span className={`text-[10px] uppercase tracking-widest ${japaneseMode ? 'text-[#1A2639]/50 japanese-font' : hashiMode ? 'text-[#d3ccc0]/30 tracking-[0.3em] hashi-font font-bold' : 'text-zinc-400 font-bold'}`}>
                                        {hashiMode ? 'CURSE' : 'RESONANCE'}: {mission.id.toUpperCase()}
                                    </span>
                                </div>

                                <h2 className={`mb-3 tracking-tighter ${comicMode
                                    ? 'text-6xl font-black uppercase italic transition-colors group-hover:text-marvel-red comic-font'
                                    : japaneseMode
                                        ? 'text-4xl japanese-font text-[#1A2639] group-hover:text-[#BE1E2D] transition-colors'
                                        : hashiMode
                                            ? 'text-5xl font-black text-[#e2e2e7] group-hover:text-[#00f2ff] transition-all tracking-[0.05em] drop-shadow-[0_0_10px_rgba(0,242,255,0.2)] hashi-font'
                                            : 'text-4xl font-black uppercase'}`}>
                                    {mission.title}
                                </h2>
                                <p className={`max-w-xl mb-8 ${japaneseMode ? 'text-[#1A2639]/70 japanese-font text-base' : hashiMode ? 'text-[#e2e2e7]/70 text-base leading-relaxed italic hashi-font' : 'text-zinc-500 font-bold italic text-lg'}`}>
                                    {hashiMode ? 'Exploring the vast boundaries of magical logic and digital dreams.' : 'Deploying intellectual assets for rapid expansion and coordination.'}
                                </p>

                                <div className={`w-full max-w-md relative overflow-hidden ${comicMode
                                    ? 'h-8 bg-zinc-100 border-4 border-black'
                                    : japaneseMode
                                        ? 'h-1 bg-[#E0D8C8]'
                                        : hashiMode
                                            ? 'h-1.5 bg-[#1a0b1f] border border-[#8a0303]/20'
                                            : 'h-2 bg-zinc-100 rounded-full'}`}>
                                    <div
                                        className={`h-full transition-all duration-1000 ${progressColors[mission.id as keyof typeof progressColors]?.[t] || 'bg-zinc-400'} ${!japaneseMode && !comicMode && !hashiMode ? 'rounded-full' : ''}`}
                                        style={{ width: `${mission.progress}%` }}
                                    />
                                    {comicMode && (
                                        <span className="absolute inset-0 flex items-center justify-center font-black text-[10px] italic uppercase tracking-widest mix-blend-difference text-white">
                                            {hashiMode ? 'Sacrifice' : 'Synchronized'} {mission.progress}%
                                        </span>
                                    )}
                                </div>
                                {(japaneseMode || hashiMode) && (
                                    <span className={`text-[10px] ${japaneseMode ? 'japanese-font' : 'hashi-font font-bold'} tracking-[0.2em] mt-1 block ${japaneseMode ? 'text-[#1A2639]/60' : 'text-[#8a0303]/60'}`}>
                                        Progress {mission.progress}%
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col items-end gap-4">
                                <Link href={`/missions/${mission.id}`} className="w-full md:w-auto">
                                    <Button className={`w-full md:w-auto transition-all ${comicMode
                                        ? 'bg-black text-white hover:bg-marvel-red border-4 border-black font-black uppercase italic tracking-tighter text-3xl h-24 px-12 rounded-none shadow-[10px_10px_0px_rgba(0,0,0,0.2)] hover:shadow-none comic-font'
                                        : japaneseMode
                                            ? 'bg-transparent text-[#BE1E2D] border border-[#BE1E2D] hover:bg-[#BE1E2D] hover:text-white rounded-none japanese-font tracking-[0.3em] uppercase h-12 px-8'
                                            : hashiMode
                                                ? 'bg-[#00f2ff]/5 text-[#00f2ff] border border-[#00f2ff]/20 hover:bg-[#00f2ff]/15 hover:border-[#00f2ff]/50 rounded-none tracking-[0.15em] uppercase h-14 px-10 text-[10px] font-black hashi-font'
                                                : 'bg-zinc-900 text-white hover:bg-black rounded-full px-8'}`}>
                                        {hashiMode ? 'BEGIN JOURNEY' : 'ENTER INTEL'} <ChevronRight className={`ml-2 group-hover:translate-x-1 transition-transform ${comicMode ? 'h-10 w-10 ml-4' : 'h-4 w-4'}`} />
                                    </Button>
                                </Link>
                                <div className={`flex items-center gap-3 text-xs ${japaneseMode ? 'text-[#1A2639]/50 japanese-font' : hashiMode ? 'text-[#ffcc33]/40 tracking-[0.1em] hashi-font' : 'text-zinc-400 font-black italic uppercase'}`}>
                                    <Target size={14} strokeWidth={japaneseMode || hashiMode ? 1.5 : 2} /> {hashiMode ? 'Fellow Travelers' : '24 Collaborators Assigned'}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Banner */}
            {
                comicMode && (
                    <div className="mt-32 border-t-8 border-black pt-16 flex flex-col md:flex-row justify-between items-center gap-8 bg-comic-yellow p-12 border-4 rotate-1">
                        <div>
                            <h3 className="text-5xl font-black uppercase italic tracking-tighter mb-2">Nexus Terminal</h3>
                            <p className="text-black/60 font-bold italic text-xl">Warning: All transmissions are monitored by The Watcher.</p>
                        </div>
                        <div className="onomatopoeia boom text-7xl animate-bounce">Boom!</div>
                    </div>
                )
            }
            {
                japaneseMode && (
                    <div className="mt-24 border-t border-[#E0D8C8] pt-10 text-center">
                        <p className="font-serif text-[#1A2639]/40 tracking-[0.4em] text-sm uppercase">Silence is strength</p>
                    </div>
                )
            }
            {hashiMode && (
                <div className="mt-24 border-t border-[#8a0303]/20 pt-10 text-center">
                    <p className="font-black text-[#c20000]/30 tracking-[1em] text-[10px] uppercase italic hashi-font">The Eclipse demands sacrifice</p>
                </div>
            )}
        </div>
    );
}


