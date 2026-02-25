'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, Target, Zap, AlertTriangle } from 'lucide-react';

export default function MissionsPage() {
    const missions = [
        { id: 'bar-man', title: 'The Bar-man', status: 'In Progress', progress: 65, priority: 'CRITICAL', shadow: 'shadow-[12px_12px_0px_#e62429]' },
        { id: 'space-balls', title: 'Space-balls', status: 'Planning', progress: 30, priority: 'HIGH', shadow: 'shadow-[12px_12px_0px_#003399]' },
        { id: 'nexus', title: 'Operation Nexus', status: 'Standby', progress: 0, priority: 'LOW', shadow: 'shadow-[12px_12px_0px_#fde802]' },
    ];

    return (
        <div className="p-6 md:p-12 min-h-screen">
            <header className="mb-20 relative">
                <div className="onomatopoeia kapow absolute -top-10 -left-10 text-[10rem] opacity-10 pointer-events-none uppercase">Kapow!</div>
                <h1 className="text-8xl font-black uppercase italic tracking-tighter marvel-font leading-none mb-4 drop-shadow-[8px_8px_0px_rgba(230,36,41,0.2)]">Active Operations</h1>
                <p className="text-zinc-600 font-black tracking-[0.3em] uppercase text-xs">Strategic deployment & mission monitoring</p>
            </header>

            <div className="space-y-16">
                {missions.map((mission) => (
                    <div
                        key={mission.id}
                        className={`bg-white p-1 border-4 border-black ${mission.shadow} transition-all hover:translate-x-2 hover:-translate-y-2 hover:shadow-[20px_20px_0px_#000] group relative overflow-hidden`}
                    >
                        <div className="absolute top-0 right-0 onomatopoeia punch opacity-5 text-9xl -rotate-12 pointer-events-none">Hit!</div>
                        <div className="bg-white p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-12 border-2 border-dashed border-zinc-100">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`px-4 py-1 border-2 border-black font-black uppercase text-[10px] italic skew-x-[-15deg] ${mission.priority === 'CRITICAL' ? 'bg-marvel-red text-white' :
                                            mission.priority === 'HIGH' ? 'bg-hero-blue text-white' : 'bg-comic-yellow text-black'
                                        }`}>
                                        {mission.priority} PRIORITY
                                    </div>
                                    <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">ID: {mission.id.toUpperCase()}</span>
                                </div>
                                <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-4 transition-colors group-hover:text-marvel-red">{mission.title}</h2>
                                <p className="text-zinc-500 font-bold italic text-lg max-w-xl mb-8">Deploying intellectual assets for rapid expansion and multi-verse coordination.</p>

                                <div className="w-full max-w-md h-8 bg-zinc-100 border-4 border-black relative overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${mission.id === 'bar-man' ? 'bg-marvel-red' :
                                                mission.id === 'space-balls' ? 'bg-hero-blue' : 'bg-comic-yellow'
                                            }`}
                                        style={{ width: `${mission.progress}%` }}
                                    />
                                    <span className="absolute inset-0 flex items-center justify-center font-black text-[10px] italic uppercase tracking-widest mix-blend-difference text-white">
                                        {mission.progress}% Synchronized
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-6">
                                <Link href={`/missions/${mission.id}`} className="w-full md:w-auto">
                                    <Button className="w-full md:w-auto bg-black text-white hover:bg-marvel-red border-4 border-black font-black uppercase italic tracking-tighter text-3xl h-24 px-12 rounded-none shadow-[10px_10px_0px_rgba(0,0,0,0.2)] hover:shadow-none transition-all">
                                        ENTER INTEL <ChevronRight className="h-10 w-10 ml-4 group-hover:translate-x-2 transition-transform" />
                                    </Button>
                                </Link>
                                <div className="flex items-center gap-3 text-zinc-400 font-black italic uppercase text-xs">
                                    <Target size={16} /> 24 Collaborators Assigned
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-32 border-t-8 border-black pt-16 flex flex-col md:flex-row justify-between items-center gap-8 bg-comic-yellow p-12 border-4 rotate-1">
                <div>
                    <h3 className="text-5xl font-black uppercase italic tracking-tighter mb-2">Nexus Terminal</h3>
                    <p className="text-black/60 font-bold italic text-xl">Warning: All transmissions are monitored by The Watcher.</p>
                </div>
                <div className="onomatopoeia boom text-7xl animate-bounce">Boom!</div>
            </div>
        </div>
    );
}
