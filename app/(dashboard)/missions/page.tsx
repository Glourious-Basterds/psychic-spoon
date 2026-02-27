'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, Target } from 'lucide-react';
import { useUI } from '@/context/UIContext';

export default function MissionsPage() {
    const { hashiMode } = useUI();

    const missions = [
        {
            id: 'bar-man',
            title: 'The Bar-man',
            status: 'In Progress',
            progress: 65,
            priority: 'CRITICAL',
            description: 'The hero has retired. With no more villains left to fight, he has reinvented himself behind the bar—mixing justice with the finest spirits for a shadow clientele.'
        },
        {
            id: 'space-balls',
            title: 'Space-balls',
            status: 'Planning',
            progress: 30,
            priority: 'HIGH',
            description: 'Italian space cuisine at its peak. Our sub-orbital logistics ensure that even in zero-G, astronauts enjoy a real homemade pasta that tastes like home.'
        },
        {
            id: 'nexus',
            title: 'Operation Nexus',
            status: 'Standby',
            progress: 0,
            priority: 'LOW',
            description: 'Distributed intelligence protocols for operation nexus. Secure communications and asset monitoring in the digital abyss.'
        },
    ];

    const priorityColors = {
        CRITICAL: 'bg-[#c20000]/5 text-[#c20000] border-[#c20000]/20 cyber-border status-pulse',
        HIGH: 'bg-[#c20000]/5 text-[#8a0000] border-[#c20000]/10 cyber-border',
        LOW: 'bg-transparent text-[#1a1a1a]/40 border-[#c20000]/5 cyber-border',
    };

    return (
        <div className="p-6 md:p-12 min-screen">
            <header className="mb-20 relative">
                <h1 className="text-7xl font-normal uppercase tracking-[0.1em] text-[#1a1a1a] drop-shadow-[0_0_30px_rgba(0,0,0,0.05)] hashi-font italic transition-all duration-700 leading-none mb-4">
                    IN PROGRESS
                </h1>
                <p className="text-[#c20000] tracking-[0.4em] border-l-2 border-[#c20000] pl-3 hashi-font font-medium text-xs uppercase">
                    Navigating the digital abyss
                </p>
            </header>

            <div className="space-y-10">
                {missions.map((mission) => (
                    <div
                        key={mission.id}
                        className="card border-[#c20000]/10 hover:border-[#c20000]/30 p-0 shadow-sm transition-all group relative overflow-hidden"
                    >
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-9xl font-black opacity-[0.02] text-[#c20000] pointer-events-none select-none tracking-tighter hashi-font">
                            {mission.id === 'bar-man' ? '01' : mission.id === 'space-balls' ? '02' : '03'}
                        </div>
                        <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`px-4 py-2 font-bold uppercase text-[10px] shadow-sm tracking-[0.2em] ${priorityColors[mission.priority as keyof typeof priorityColors]}`}>
                                        {mission.id === 'nexus' ? 'STANDBY' : 'IN PROGRESS'}
                                    </div>
                                    <span className="text-[#c20000]/80 tracking-[0.3em] font-medium text-[10px] uppercase hashi-font">
                                        SYNC_ID: {mission.id.toUpperCase()}
                                    </span>
                                </div>

                                <h2 className="text-5xl font-bold text-[#1a1a1a] group-hover:text-[#c20000] group-hover:translate-x-2 transition-all tracking-[0.1em] mb-3">
                                    {mission.title}
                                </h2>
                                <p className="text-[#1a1a1a]/70 text-base leading-relaxed italic max-w-2xl mb-8 hashi-font">
                                    {mission.description}
                                </p>

                                <div className="w-full max-w-md relative overflow-hidden h-2 bg-[#ffffff] border border-[#c20000]/10">
                                    <div
                                        className="h-full transition-all duration-1000 bg-gradient-to-r from-[#8a0000] to-[#c20000]"
                                        style={{ width: `${mission.progress}%` }}
                                    />
                                </div>
                                <span className="font-bold tracking-[0.2em] mt-2 block text-[#c20000]/60 text-[10px] hashi-font">
                                    SYNC {mission.progress}%
                                </span>
                            </div>

                            <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                                <Link href={`/missions/${mission.id}`} className="w-full md:w-auto">
                                    <Button className="bg-transparent text-[#c20000] cyber-border hover:bg-[#c20000]/5 hover:text-[#1a1a1a] rounded-none tracking-[0.15em] uppercase h-14 px-10 text-[10px] font-bold shadow-[inset_0_0_15px_rgba(255,255,255,0.5)] transition-all w-full">
                                        JUMP IN <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform h-4 w-4" />
                                    </Button>
                                </Link>
                                <div className="flex items-center gap-3 text-xs text-[#c20000]/60 tracking-[0.1em] hashi-font">
                                    <Target size={14} strokeWidth={1.5} /> 24 Collaborators Assigned
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-24 border-t border-[#c20000]/10 pt-10 text-center">
                <p className="font-black text-[#c20000]/40 tracking-[1em] text-[10px] uppercase italic hashi-font">The Eclipse demands sacrifice</p>
            </div>
        </div>
    );
}
