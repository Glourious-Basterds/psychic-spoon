'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Zap, Target } from 'lucide-react';
import { useUI } from '@/context/UIContext';

export default function DashboardPage() {
    const { data: session } = useSession();
    const { hashiMode } = useUI();

    const mockChats = [
        { id: 1, user: 'Tony S.', message: "The new carbon-fiber shaker is ready for field testing. Don't shake it too hard, it might explode.", time: '10:00' },
        { id: 2, user: 'Lord Helmet', message: "The merchandising strategy is ludicrous! We need more flamethrowers.", time: '12:01' },
    ];

    return (
        <div className="p-6 md:p-12 min-h-full">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 relative">
                <div>
                    <h1 className="text-6xl uppercase tracking-[0.1em] font-normal drop-shadow-[0_0_30px_rgba(0,0,0,0.05)] hashi-font text-[#1a1a1a]">
                        DASHBOARD
                    </h1>
                    <p className="mt-2 font-normal uppercase text-xs hashi-font text-[#c20000] tracking-[0.4em] border-l-2 border-[#c20000] pl-3">
                        The world awaits, {session?.user?.name || 'Traveler'}
                    </p>
                </div>
                <div className="hashi-font cyber-border text-[#1a1a1a] bg-[#c20000]/5 tracking-[0.2em] font-bold uppercase text-xs shadow-[0_0_30px_rgba(0,0,0,0.02)] px-8 py-3 backdrop-blur-xl status-pulse">
                    Status: Branded
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                {/* Card 1 */}
                <div className="card overflow-hidden h-full flex flex-col justify-center p-1 transition-all">
                    <div className="p-8 relative overflow-hidden">
                        <div className="absolute -right-2 -bottom-3 opacity-[0.02] font-black text-9xl text-[#c20000] hashi-font pointer-events-none">I</div>
                        <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] mb-4 hashi-font text-[#1a1a1a]/60">HOME BASE</h3>
                        <div className="text-6xl font-black hashi-font text-[#c20000] tracking-tight neon-text not-italic">12</div>
                    </div>
                </div>
                {/* Card 2 */}
                <div className="card overflow-hidden h-full flex flex-col justify-center p-1 transition-all">
                    <div className="p-8 relative overflow-hidden">
                        <div className="absolute -right-2 -bottom-3 opacity-[0.02] font-black text-9xl text-[#9a0000] hashi-font pointer-events-none">II</div>
                        <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] mb-4 hashi-font text-[#1a1a1a]/60">ALERTS</h3>
                        <div className="text-6xl font-black hashi-font text-[#c20000] neon-text tracking-tight not-italic">03</div>
                    </div>
                </div>
                {/* Card 3 */}
                <div className="card overflow-hidden h-full flex flex-col justify-center p-1 transition-all border-[#c20000]/10 hover:border-[#c20000]/30">
                    <div className="p-8 relative overflow-hidden">
                        <div className="absolute -right-2 -bottom-3 opacity-[0.02] font-black text-9xl text-[#c20000] pointer-events-none">III</div>
                        <h3 className="text-[10px] font-normal tracking-[0.3em] hashi-font text-[#1a1a1a]/60 uppercase">VAULT SEC</h3>
                        <div className="text-6xl font-black hashi-font text-[#c20000] neon-text tracking-tight not-italic">MAX</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Projects Section */}
                <div className="flex-[2]">
                    <div className="text-xs text-[#c20000] uppercase tracking-[0.4em] mb-8 border-l-2 border-[#c20000] pl-3 font-bold">
                        PROJECTS
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                        {[
                            { id: 'bar-man', title: 'The Bar-man', icon: Zap, description: 'Hero reinvented: from fighting villains to mixing the perfect clandestine cocktail.' },
                            { id: 'space-balls', title: 'Space-balls', icon: Target, description: 'Authentic Italian cuisine in sub-orbital logistics. Real pasta for real astronauts.' }
                        ].map(proj => (
                            <div key={proj.id} className="card transition-all">
                                <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div>
                                        <div className="text-4xl uppercase tracking-[0.1em] font-bold text-[#1a1a1a] hashi-font">{proj.title}</div>
                                        <div className="text-xs uppercase mt-2 hashi-font text-[#c20000] tracking-[0.15em] font-medium flex items-center gap-2">
                                            <proj.icon size={14} className="text-[#c20000]" /> {proj.description}
                                        </div>
                                    </div>
                                    <Link href="/missions" className="w-full md:w-auto">
                                        <Button className="hashi-font cyber-border bg-[#c20000]/5 text-[#c20000] hover:bg-[#c20000]/10 hover:text-[#1a1a1a] rounded-none px-8 font-bold tracking-[0.15em] uppercase text-[10px] shadow-[inset_0_0_10px_rgba(255,255,255,0.5)] w-full md:w-auto">
                                            JUMP IN
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Messages Sidebar Component */}
                <div className="flex-1">
                    <div className="text-xs text-[#c20000]/80 uppercase tracking-[0.4em] mb-8 border-l-2 border-[#c20000] pl-3 font-bold">
                        DIRECT INQUIRIES
                    </div>
                    <div className="card p-6 space-y-6 relative overflow-hidden">
                        {mockChats.map((chat) => (
                            <div key={chat.id} className="p-4 border-l-2 border-l-[#c20000]/60 bg-[#c20000]/5 hover:border-l-[#c20000]/90 transition-all shadow-[inset_0_0_15px_rgba(255,255,255,0.5)]">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="hashi-font text-[#c20000] font-bold tracking-[0.2em] text-xs uppercase">{chat.user}</span>
                                    <span className="hashi-font text-[#1a1a1a]/40 text-[9px] font-bold">{chat.time}</span>
                                </div>
                                <p className="hashi-font text-[#1a1a1a] font-normal text-lg leading-tight">&quot;{chat.message}&quot;</p>
                            </div>
                        ))}
                        <Link href="/comms" className="w-full">
                            <Button className="w-full cyber-border hashi-font bg-[#c20000]/5 text-[#c20000] hover:bg-[#c20000]/10 hover:text-[#1a1a1a] rounded-none tracking-[0.15em] font-bold h-12 uppercase flex items-center justify-center gap-2 transition-all text-[10px]">
                                CONNECT TO WORKSPACE <ChevronRight size={16} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
