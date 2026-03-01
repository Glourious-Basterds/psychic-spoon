'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown, Calendar, Image as ImageIcon, CheckCircle2, PlayCircle, Clock } from 'lucide-react';

type Category = 'In Progress' | 'Completed' | 'In Consideration';

interface Mission {
    id: string;
    title: string;
    role: string;
    status: Category;
    progress: number;
    summary: string;
    media: { type: 'image' | 'video'; url: string }[];
    deadlines: { label: string; date: string; color?: string }[];
}

const MOCK_MISSIONS: Mission[] = [
    {
        id: 'bar-man',
        title: 'The Bar Man',
        role: 'Lead Director · Project #0041',
        status: 'In Progress',
        progress: 62,
        summary: 'A noir short film following a bartender who slowly realizes his regulars are ghosts. Visual tone: desaturated, high contrast. Sound design is central.',
        media: [
            { type: 'image', url: '/images/batman_barman_james_bond.png' },
            { type: 'image', url: '/images/barman_james_bond.png' },
            { type: 'image', url: '/images/joker_bar_noir.png' }
        ],
        deadlines: [
            { label: 'SOUND MIX', date: 'Dec 20', color: 'text-red-500' },
            { label: 'ROUGH CUT', date: 'Dec 27', color: 'text-orange-500' },
            { label: 'COLOR GRADE', date: 'Jan 05', color: 'text-green-500' },
            { label: 'FINAL DELIVERY', date: 'Jan 10', color: 'text-cyan-500' }
        ]
    },
    {
        id: 'space-balls',
        title: 'Space Balls — Season 2',
        role: 'Animator · Project #0038',
        status: 'In Progress',
        progress: 40,
        summary: 'An animated comedy focusing on orbital logistics and fine Italian dining. High-fidelity textures and absurdist culinary physics across the galaxy.',
        media: [
            { type: 'image', url: '/images/space_food_4k.png' },
            { type: 'image', url: '/images/lord_helmet_kitchen.png' }
        ],
        deadlines: [
            { label: 'STORYBOARD', date: 'Feb 12', color: 'text-blue-500' },
            { label: 'ANIMATION', date: 'Mar 15', color: 'text-purple-500' }
        ]
    },
    {
        id: 'nexus',
        title: 'Project Nexus',
        role: 'System Architect',
        status: 'In Consideration',
        progress: 0,
        summary: 'A secret initiative exploring distributed intelligence and encrypted communication protocols. Currently evaluating the feasibility of a decentralized neural workspace.',
        media: [],
        deadlines: [
            { label: 'Feasibility Study', date: '02/14/28' }
        ]
    }
];

export default function MissionsPage() {
    const [activeCategory, setActiveCategory] = useState<Category>('In Progress');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredMissions = MOCK_MISSIONS.filter(m => m.status === activeCategory);

    return (
        <div className="p-8 md:p-16 min-h-screen bg-black text-white/90 hashi-font selection:bg-white/10">
            {/* Header / Navigation Categories */}
            <header className="mb-24">
                <div className="flex flex-wrap gap-12 items-baseline mb-6 border-b border-white/5 pb-6">
                    {(['In Progress', 'Completed', 'In Consideration'] as Category[]).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveCategory(cat);
                                setExpandedId(null);
                            }}
                            className={`text-xs uppercase tracking-[0.4em] font-black transition-all relative py-2
                                ${activeCategory === cat
                                    ? 'text-white'
                                    : 'text-white/20 hover:text-white/40'}`}
                        >
                            {cat}
                            {activeCategory === cat && (
                                <div className="absolute -bottom-[25px] left-0 right-0 h-[2px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                            )}
                        </button>
                    ))}
                </div>
                <p className="text-white/10 tracking-[0.6em] hashi-font text-[9px] uppercase font-bold italic">
                    Eclipse creative workflow // secure terminal
                </p>
            </header>

            {/* Mission Grid */}
            <div className="space-y-4">
                {filteredMissions.length === 0 ? (
                    <div className="py-20 text-center border border-dashed border-white/5 rounded-none">
                        <p className="text-white/20 tracking-[0.2em] uppercase text-[10px] font-bold">No missions detected in this sector</p>
                    </div>
                ) : (
                    filteredMissions.map((mission) => (
                        <MissionCard
                            key={mission.id}
                            mission={mission}
                            isExpanded={expandedId === mission.id}
                            onToggle={() => setExpandedId(expandedId === mission.id ? null : mission.id)}
                        />
                    ))
                )}
            </div>

            <footer className="mt-40 border-t border-white/5 pt-12 text-center opacity-20">
                <p className="font-black text-white tracking-[1.5em] text-[9px] uppercase italic">Immortalize the legacy.</p>
            </footer>
        </div>
    );
}

function MissionCard({ mission, isExpanded, onToggle }: { mission: Mission; isExpanded: boolean; onToggle: () => void }) {
    return (
        <div className={`transition-all duration-700 bg-black border border-white/5 rounded-[2rem] overflow-hidden mb-6 ${isExpanded ? 'ring-1 ring-white/10' : ''}`}>
            {/* Essential Info / Collapsed State */}
            <div className="p-10 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className={`w-3 h-3 rounded-full ${mission.status === 'In Progress' ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : mission.status === 'Completed' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]'}`} />
                    <div>
                        {/* ONLY Title click triggers expansion */}
                        <button
                            onClick={onToggle}
                            className="text-3xl font-bold text-white hover:text-white/80 transition-colors flex items-center gap-6 group"
                        >
                            {mission.title}
                            <ChevronDown className={`h-6 w-6 opacity-20 group-hover:opacity-100 transition-all ${isExpanded ? 'rotate-180 opacity-100 text-white' : ''}`} />
                        </button>
                        <p className="text-white/20 text-xs tracking-[0.4em] uppercase mt-2 font-black italic">Lead Director · Project #00{mission.id === 'bar-man' ? '41' : '38'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-16">
                    {/* Progress preview from mockup */}
                    <div className="hidden xl:flex items-center gap-6">
                        <div className="w-56 h-[2px] bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500/40 transition-all duration-1000" style={{ width: `${mission.progress}%` }} />
                        </div>
                        <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em] italic">{mission.progress}%</span>
                    </div>

                    <div className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border ${mission.id === 'nexus' ? 'border-orange-500/20 text-orange-500/80 bg-orange-500/5' :
                        mission.status === 'In Progress' ? 'border-blue-500/20 text-blue-500/80 bg-blue-500/5' :
                            'border-green-500/20 text-green-500/80 bg-green-500/5'
                        }`}>
                        {mission.id === 'nexus' ? 'PENDING' : mission.status.toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Expanded Content (Dropdown) */}
            <div className={`overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isExpanded ? 'max-h-[2500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-10 pb-16 pt-10 border-t border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">

                    {/* Upper Level: Summary + Slideshow */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-20 mb-16">
                        {/* Left: Summary Section */}
                        <div className="space-y-8">
                            <h3 className="text-white/10 uppercase tracking-[0.5em] text-[10px] font-black italic">Summary</h3>
                            <p className="text-lg text-white/50 leading-relaxed font-medium max-w-2xl">
                                {mission.summary}
                            </p>

                            {/* Team Avatars from mockup */}
                            <div className="flex items-center gap-3 mt-12">
                                {['JK', 'SR', 'MT', 'AL'].map((init, i) => (
                                    <div key={i} className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black border border-white/5
                                        ${i === 0 ? 'bg-blue-900/40 text-blue-400' : i === 1 ? 'bg-green-900/40 text-green-400' : i === 2 ? 'bg-red-900/40 text-red-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
                                        {init}
                                    </div>
                                ))}
                                <span className="text-white/10 text-[10px] font-bold ml-3 uppercase tracking-widest">+2 members</span>
                            </div>
                        </div>

                        {/* Right: Project Photos Grid from mockup */}
                        <div className="space-y-8">
                            <h3 className="text-white/10 uppercase tracking-[0.5em] text-[10px] font-black italic">Project Photos</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {mission.media.slice(0, 3).map((item, i) => (
                                    <div key={i} className="aspect-[4/5] bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden group/item cursor-pointer">
                                        <img src={item.url} className="w-full h-full object-cover opacity-40 group-hover/item:opacity-100 transition-all duration-700" alt="Asset" />
                                    </div>
                                ))}
                                {/* Mock placeholders to match grid if media is short */}
                                {[...Array(Math.max(0, 3 - mission.media.length))].map((_, i) => (
                                    <div key={i} className={`aspect-[4/5] bg-white/[0.02] rounded-2xl border border-white/5 flex items-center justify-center
                                        ${i % 3 === 0 ? 'bg-blue-500/5' : i % 3 === 1 ? 'bg-green-500/5' : 'bg-yellow-500/5'}`}>
                                        {i === 0 ? <PlayCircle className="text-white/5 w-8 h-8" /> : <ImageIcon className="text-white/5 w-8 h-8" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Lower Level 1: Full-width Progress Section from mockup */}
                    <div className="mb-16">
                        <h3 className="text-white/10 uppercase tracking-[0.5em] text-[10px] font-black italic mb-10">Progress</h3>
                        <div className="relative w-full h-[6px] bg-white/[0.03] rounded-full overflow-hidden mb-6">
                            <div className="absolute top-0 left-0 h-full bg-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.8)] transition-all duration-1000" style={{ width: `${mission.progress}%` }} />
                        </div>
                        <div className="flex justify-between items-center bg-white/[0.01] p-1 border-white/5 rounded-full px-4">
                            <div className="flex gap-12">
                                {['Script', 'Edit', 'Sound', 'Grade'].map((step, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${mission.progress > (25 * (i)) ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-white/5'}`} />
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${mission.progress > (25 * (i)) ? 'text-white/40' : 'text-white/5'}`}>
                                            {step}{mission.deadlines[i]?.date && (
                                                <span className="ml-2 font-normal text-white/10 opacity-50">— {mission.deadlines[i].date.split('/')[0]}/{mission.deadlines[i].date.split('/')[1]}</span>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <span className="text-sm font-black text-blue-500 tracking-widest italic">{mission.progress}%</span>
                        </div>
                    </div>

                    {/* Lower Level 2: Due Dates Box Grid from mockup */}
                    <div>
                        <h3 className="text-white/10 uppercase tracking-[0.5em] text-[10px] font-black italic mb-10">Due Dates</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {mission.deadlines.map((dl, i) => (
                                <div key={i} className="p-8 bg-[#080808] border border-white/5 rounded-[1.5rem] hover:border-white/20 transition-all duration-500 flex flex-col gap-3 group/box">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${i === 0 ? 'text-blue-500/40 group-hover/box:text-blue-500/80' :
                                        i === 1 ? 'text-green-500/40 group-hover/box:text-green-500/80' :
                                            i === 2 ? 'text-yellow-500/40 group-hover/box:text-yellow-500/80' :
                                                'text-white/10 group-hover/box:text-white/30'
                                        }`}>{dl.label}</span>
                                    <span className="text-lg font-bold tracking-tight text-white/50 group-hover/box:text-white/90 transition-colors">{dl.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-20 flex justify-end gap-6">
                        <Link href={`/comms?project=${mission.id}`}>
                            <Button className="bg-transparent text-white/20 hover:text-white/80 rounded-full px-12 py-7 text-[9px] font-black tracking-[0.3em] uppercase border border-white/5 hover:border-white/20 transition-all">
                                Protocol Access
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
