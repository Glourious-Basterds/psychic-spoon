'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Zap, Target, Layers, LayoutGrid } from 'lucide-react';

export default function MissionDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const missionDetails: Record<string, any> = {
        'bar-man': {
            title: 'The Bar-man',
            status: 'Operation: Crafting',
            desc: 'Integrating carbon-fiber shakers with motion-tracking drink injectors.',
            milestones: [
                { title: 'Stealth Shaker V1', status: 'Passed', icon: Shield },
                { title: 'Drink Injector AI', status: 'In Testing', icon: Zap },
                { title: 'Tactical Tuxedo', status: 'Blueprint', icon: Layers }
            ]
        },
        'space-balls': {
            title: 'Space-balls',
            desc: 'Designing the ultimate flame-thrower and ludicrous speed drive.',
            status: 'Operation: Hyperdrive',
            milestones: [
                { title: 'The Flame-thrower', status: 'Verified', icon: Shield },
                { title: 'Merchandising Ops', status: 'Critical', icon: Target },
                { title: 'Comb Design', status: 'Planning', icon: LayoutGrid }
            ]
        }
    };

    const mission = missionDetails[id] || { title: 'Unknown Mission', desc: 'No intel found.', status: 'Unknown', milestones: [] };

    return (
        <div className="p-6 md:p-12 min-h-screen ben-day-dots">
            <Link href="/missions" className="inline-flex items-center gap-2 mb-12 group">
                <div className="bg-black border-2 border-white p-2 group-hover:bg-marvel-red transition-colors">
                    <ChevronLeft className="text-white" />
                </div>
                <span className="font-black uppercase italic tracking-widest text-sm">Back to Missions</span>
            </Link>

            <header className="mb-16 relative">
                <div className="onomatopoeia pow -top-12 left-0 text-7xl opacity-50 pointer-events-none">Intel!</div>
                <h1 className="text-8xl font-black uppercase italic marvel-font leading-[0.8] mb-4 drop-shadow-[8px_8px_0px_#e62429]">
                    {mission.title}
                </h1>
                <div className="inline-block px-10 py-3 bg-comic-yellow text-black font-black uppercase italic transform -rotate-1 comic-border border-none shadow-[6px_6px_0px_white]">
                    {mission.status}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    <section className="bg-white p-1 border-4 border-black shadow-[10px_10px_0px_#003399]">
                        <div className="bg-black p-10">
                            <h2 className="text-3xl font-black uppercase italic mb-6 text-white border-b-2 border-white/10 pb-4">Mission Blueprint</h2>
                            <p className="text-2xl font-bold italic text-zinc-300 leading-relaxed mb-8">
                                "{mission.desc}"
                            </p>

                            <div className="space-y-4">
                                <div className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 text-white">Advanced Progress Control</div>
                                <div className="relative w-full h-12 bg-zinc-900 border-4 border-white flex items-center overflow-hidden">
                                    <div className="absolute inset-0 ben-day-dots opacity-20" />
                                    <div
                                        className="h-full bg-marvel-red shadow-[inset_0_0_20px_rgba(255,255,255,0.5)] transition-all duration-1000"
                                        style={{ width: '65%' }}
                                    />
                                    <span className="relative z-10 mx-auto font-black italic text-2xl tracking-tighter">65% SYNCHRONIZED</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-3xl font-black uppercase italic mb-8 marvel-font tracking-widest">Phase Log</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {mission.milestones.map((m: any, i: number) => (
                                <div key={i} className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-6 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] transition-all group cursor-help text-black">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-marvel-red flex items-center justify-center border-4 border-black rotate-3 group-hover:rotate-0 transition-transform">
                                            <m.icon className="text-white" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-1 skew-x-[-10deg]">{m.status}</span>
                                    </div>
                                    <h4 className="text-xl font-black uppercase italic mt-2">{m.title}</h4>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="space-y-10">
                    <div className="bg-comic-yellow p-1 border-4 border-black shadow-[8px_8px_0px_white]">
                        <div className="bg-black p-6 text-center">
                            <div className="onomatopoeia wham text-4xl mb-4">Pow!</div>
                            <h4 className="text-xl font-black uppercase italic mb-2">Team Assigned</h4>
                            <div className="flex justify-center -space-x-4 mb-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-black bg-zinc-800 flex items-center justify-center font-black italic text-xs">U{i}</div>
                                ))}
                            </div>
                            <Button className="w-full bg-white text-black font-black uppercase italic border-4 border-black rounded-none shadow-none hover:bg-marvel-red hover:text-white transition-all">Summon Hero</Button>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border-4 border-black p-8 italic font-medium text-zinc-400 leading-relaxed relative">
                        <span className="absolute -top-4 -right-4 bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-tighter shadow-[3px_3px_0px_#000]">Security Note</span>
                        "Remember: A hero is only as good as their IP protection. Ensure all cocktail blueprints are encrypted before the next phase."
                    </div>
                </aside>
            </div>
        </div>
    );
}

// Mock icons for the mapper
function Shield(props: any) { return <Target {...props} /> }
