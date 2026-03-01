'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    ChevronLeft, Zap, Target, Layers, LayoutGrid,
    Shield, ArrowRight, Play, CheckCircle2,
    Lock, Star, Music, Activity
} from 'lucide-react';

export default function MissionDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [activeModule, setActiveModule] = useState<number | null>(null);

    type MissionModule = { id: number; title: string; icon: React.ElementType; status: string; desc: string; };
    type MissionData = { title: string; status: string; desc: string; themeColor: string; modules: MissionModule[]; narrative?: string; };

    const missionDetails: Record<string, MissionData> = {
        'bar-man': {
            title: 'The Bar-man',
            status: 'PROTOCOL: REINVENTION',
            desc: 'Fusing tactical gadgets with high-end mixology. Batman redefined for the ultimate cocktail experience.',
            themeColor: '#c20000',
            modules: [
                { id: 1, title: 'Carbon-Fiber Shakers', icon: Zap, status: 'Active', desc: 'Lightweight, stealthy, and perfect for cold martinis.' },
                { id: 2, title: 'Motion-Track Injectors', icon: Activity, status: 'Testing', desc: 'Precision pouring using infrared sensors.' },
                { id: 3, title: 'Tactical Tuxedo V2', icon: Shield, status: 'Ready', desc: 'Kevlar weave with liquid-resistant coating.' }
            ],
            narrative: "Bruce W. has turned the Cave into a Laboratory of taste. Every drink is a mission. Every customer is a target—of hospitality."
        },
        'space-balls': {
            title: 'Space-balls',
            status: 'ORBITAL GASTRONOMY',
            desc: 'Delivering authentic Italian pasta to the stars. Ludicrous speed meets al dente perfection.',
            themeColor: '#c20000',
            modules: [
                { id: 1, title: 'Sub-Orbital Pasta Drive', icon: Activity, status: 'Online', desc: 'Centrifugal spaghetti stabilization at 12G.' },
                { id: 2, title: 'Lord Helmet Soundtracks', icon: Music, status: 'Synced', desc: 'Epic orchestral tracks for space dining.' },
                { id: 3, title: 'The Flame-thrower', icon: Lock, status: 'Restricted', desc: 'Multi-purpose kitchen tool / weapon.' }
            ],
            narrative: "Chef Lonestar ensures that no astronaut ever has to eat dehydrated paste again. The pasta rotates. The universe smiles."
        }
    };

    const mission = missionDetails[id] || {
        title: 'Mission Nexus',
        status: 'UNKNOWN',
        desc: 'Classified data. Access denied.',
        modules: [],
        themeColor: '#c20000'
    };

    return (
        <div className="min-h-screen p-8 md:p-16 flex flex-col gap-12 max-w-7xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-[#c20000]/10 pb-12">
                <div className="space-y-6">
                    <Link href="/missions" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#c20000] hover:translate-x-[-4px] transition-transform">
                        <ChevronLeft size={16} />
                        Back to Missions
                    </Link>
                    <h1 className="text-7xl md:text-8xl font-black hashi-font text-[#1a1a1a] tracking-tightest uppercase leading-none">
                        {mission.title}
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="px-4 py-1 bg-[#c20000] text-white text-[10px] font-black uppercase tracking-widest shadow-[10px_10px_30px_rgba(194,0,0,0.2)]">
                            {mission.status}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/30">
                            Sector: 07-N
                        </span>
                    </div>
                </div>
                <div className="max-w-md italic text-lg text-[#1a1a1a]/60 leading-relaxed font-medium">
                    &quot;{mission.desc}&quot;
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                {/* Modules Section */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="space-y-6">
                        <h2 className="text-sm font-black uppercase tracking-[0.5em] text-[#c20000]">Active Modules</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {mission.modules.map((m) => (
                                <div
                                    key={m.id}
                                    onClick={() => setActiveModule(activeModule === m.id ? null : m.id)}
                                    className={`group p-8 border hover:border-[#c20000] transition-all cursor-pointer relative overflow-hidden
                                        ${activeModule === m.id ? 'bg-[#c20000] border-[#c20000] text-white' : 'bg-white/40 border-[#c20000]/10 text-[#1a1a1a]'}`}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-3 border ${activeModule === m.id ? 'border-white/20 bg-white/10' : 'border-[#c20000]/10 bg-[#c20000]/5 text-[#c20000]'}`}>
                                            <m.icon size={24} />
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 ${activeModule === m.id ? 'bg-white text-[#c20000]' : 'bg-[#1a1a1a] text-white'}`}>
                                            {m.status}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black uppercase hashi-font mb-2">{m.title}</h3>
                                    <p className={`text-xs font-bold leading-relaxed ${activeModule === m.id ? 'text-white/70' : 'text-[#1a1a1a]/40'}`}>
                                        {m.desc}
                                    </p>
                                    <ArrowRight className={`absolute bottom-8 right-8 transition-all ${activeModule === m.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-12 bg-white/30 border border-[#c20000]/10 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                            <Star size={128} className="text-[#c20000]" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-[0.5em] text-[#c20000] mb-6">Narrative Insight</h3>
                        <p className="text-2xl font-black hashi-font text-[#1a1a1a] leading-tight italic">
                            {mission.narrative}
                        </p>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <aside className="space-y-12">
                    <div className="bg-[#1a1a1a] p-8 text-white space-y-8">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                            <div className="w-12 h-12 bg-[#c20000] flex items-center justify-center font-black hashi-font text-xl">88%</div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Sync Rate</p>
                                <p className="font-bold uppercase tracking-tighter">Synchronized</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Personnel Assigned</p>
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 border-2 border-[#1a1a1a] bg-zinc-800 flex items-center justify-center font-black hashi-font text-[10px]">U{i}</div>
                                ))}
                                <div className="w-10 h-10 border-2 border-[#1a1a1a] bg-[#c20000] flex items-center justify-center font-black hashi-font text-[10px]">+</div>
                            </div>
                        </div>

                        <Button className="w-full bg-[#c20000] hover:bg-white hover:text-black text-white rounded-none py-8 font-black uppercase tracking-[0.2em] transition-all hashi-font text-xs">
                            <Play size={16} className="mr-2" />
                            Initialize Phase
                        </Button>
                    </div>

                    <div className="p-8 border border-[#c20000]/10 bg-white/20 space-y-4">
                        <div className="flex items-center gap-2 text-[#c20000]">
                            <Lock size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Note</span>
                        </div>
                        <p className="text-xs font-bold text-[#1a1a1a]/60 leading-relaxed italic">
                            &quot;The transition from shadows to shakers is nearly complete. Ensure the martini mix matches the tactical specs.&quot;
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
