'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    ChevronLeft, 
    Globe, 
    Lock, 
    Eye, 
    User, 
    Mail, 
    FileText, 
    Image as ImageIcon,
    ExternalLink,
    Clock,
    Zap,
    MessageSquare,
    ChevronRight,
    ArrowUpRight,
    Check,
    Search
} from 'lucide-react';
import { useProjects, IPPrivacy, IPContactMode } from '@/app/context/ProjectContext';

export default function IPDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { ips, missions, userProfile } = useProjects();

    const ip = ips.find(item => item.id === id);
    const linkedMissions = missions.filter(m => m.ipId === id);

    if (!ip) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
                <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-black/5 text-black/10">
                    <Search size={32} />
                </div>
                <h2 className="text-2xl font-black text-[#030712] uppercase tracking-tight mb-2">IP Note Found</h2>
                <button 
                    onClick={() => router.push('/vault')}
                    className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
                >
                    Return to Vault
                </button>
            </div>
        );
    }

    const getPrivacyIcon = (privacy: IPPrivacy) => {
        switch (privacy) {
            case 'Public': return <Globe size={14} className="text-green-500" />;
            case 'Private': return <Lock size={14} className="text-red-500" />;
            case 'Selective': return <Eye size={14} className="text-blue-500" />;
        }
    };

    const getActionButtonLabel = () => {
        if (ip.contactModes.includes('Open to pitch')) return 'Pitch Idea';
        if (ip.contactModes.includes('Formal applications only')) return 'Apply for Collaboration';
        if (ip.contactModes.includes('Paid work/Licensing only')) return 'Contact for Licensing';
        return 'Contact Owner';
    };

    return (
        <div className="h-full bg-white hashi-scrollbar overflow-y-auto flex flex-col relative">
            
            {/* Hero Section */}
            <div className="relative h-[45vh] w-full group">
                <img 
                    src={ip.coverImage || '/images/abstract_hashi_overview.png'} 
                    className="w-full h-full object-cover"
                    alt={ip.title}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />
                
                {/* Back Button */}
                <button 
                    onClick={() => router.push('/vault')}
                    className="absolute top-8 left-8 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all group/back"
                >
                    <ChevronLeft size={20} className="group-hover/back:-translate-x-1 transition-transform" />
                </button>

                {/* Privacy Badge */}
                <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    {getPrivacyIcon(ip.privacy)}
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#030712]">{ip.privacy}</span>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-12 left-12 right-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-4 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full">{ip.category}</span>
                        <span className="text-white/60 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <Clock size={12} /> Initialised {ip.createdAt}
                        </span>
                    </div>
                    <h1 className="text-6xl font-black text-[#030712] hashi-font uppercase tracking-tighter mb-4">{ip.title}</h1>
                    <p className="text-xl text-black/40 font-medium italic">"{ip.tagline}"</p>
                </div>
            </div>

            <div className="px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* Left Column: Description & History */}
                <div className="lg:col-span-8 space-y-20">
                    
                    {/* Description */}
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/60 mb-8 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Concept & Essence
                        </h3>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-[#030712] leading-relaxed text-lg font-medium opacity-80 whitespace-pre-wrap">
                                {ip.description}
                            </p>
                        </div>
                    </section>

                    {/* Production History */}
                    <section>
                        <div className="flex justify-between items-end mb-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/60 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                Production History
                            </h3>
                            <span className="text-[10px] font-black text-black/20 uppercase tracking-widest">{linkedMissions.length} Connected Projects</span>
                        </div>
                        
                        {linkedMissions.length > 0 ? (
                            <div className="space-y-4">
                                {linkedMissions.map((mission) => (
                                    <div 
                                        key={mission.id}
                                        onClick={() => router.push(`/comms?project=${mission.id}`)}
                                        className="group p-6 bg-gray-50 rounded-[2.5rem] border border-black/5 hover:border-black/10 hover:bg-white hover:shadow-xl transition-all flex items-center justify-between cursor-pointer"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-black/5 bg-white shadow-sm group-hover:scale-105 transition-transform">
                                                <img src={mission.coverImage || '/images/abstract_hashi_overview.png'} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <h4 className="text-base font-black uppercase tracking-tight text-[#030712] mb-1">{mission.title}</h4>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${mission.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {mission.status.replace('_', ' ')}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest">Role: {mission.role}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 pr-4">
                                            {mission.status !== 'COMPLETED' && (
                                                <div className="text-right hidden sm:block">
                                                    <div className="text-[10px] font-black text-[#030712] mb-1">{mission.progress}%</div>
                                                    <div className="w-24 h-1 bg-black/5 rounded-full overflow-hidden">
                                                        <div className="h-full bg-black rounded-full" style={{ width: `${mission.progress}%` }} />
                                                    </div>
                                                </div>
                                            )}
                                            <ChevronRight size={18} className="text-black/10 group-hover:text-black group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 border border-dashed border-black/10 rounded-[3rem] text-center">
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black/20 italic">No public projects currently associated with this IP.</p>
                            </div>
                        )}
                    </section>
                </div>

                {/* Right Column: IP Data & Contact */}
                <div className="lg:col-span-4 space-y-12">
                    
                    {/* Creator Card */}
                    <div className="p-8 bg-gray-50 rounded-[3rem] border border-black/5">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-6">IP Creator</h4>
                        <div 
                            onClick={() => router.push(`/profile?user=${encodeURIComponent(ip.creatorName)}`)}
                            className="flex items-center gap-4 group cursor-pointer"
                        >
                            <div className="w-14 h-14 rounded-full bg-white border border-black/5 flex items-center justify-center text-black/20 group-hover:scale-110 transition-transform shadow-sm">
                                <User size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-black text-[#030712] uppercase tracking-tight flex items-center gap-2">
                                    {ip.creatorName}
                                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                                        <Check size={8} className="text-white" />
                                    </div>
                                </div>
                                <div className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Verified Hashi User</div>
                            </div>
                            <ArrowUpRight size={16} className="text-black/10 group-hover:text-black transition-colors" />
                        </div>
                    </div>

                    {/* Materials */}
                    <div className="p-8 bg-white border border-black/5 rounded-[3rem] shadow-sm">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-6 flex items-center gap-2">
                           <FileText size={12} /> Shareable Materials
                        </h4>
                        <div className="space-y-3">
                            {ip.materials.length > 0 ? ip.materials.map((m, i) => (
                                <a 
                                    key={i}
                                    href={m.url}
                                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-black/5 hover:border-black/20 hover:bg-white hover:shadow-md transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black/20 shadow-sm overflow-hidden shrink-0">
                                        {m.type === 'image' ? (
                                            <img src={m.url} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <FileText size={18} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-black text-[#030712] truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">{m.name}</p>
                                        <p className="text-[9px] font-black text-black/20 uppercase tracking-widest">{m.type}</p>
                                    </div>
                                    <ExternalLink size={14} className="text-black/10 group-hover:text-black transition-colors" />
                                </a>
                            )) : (
                                <p className="text-[10px] font-black text-black/20 uppercase tracking-widest italic text-center py-4">No materials shared publicly.</p>
                            )}
                        </div>
                    </div>

                    {/* Contact & Pitch */}
                    <div className="p-10 bg-[#030712] rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                        
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-8 flex items-center gap-2">
                            <Zap size={12} className="text-yellow-500 fill-yellow-500" /> Intellectual Property Pitch
                        </h4>

                        <div className="space-y-8 mb-10">
                            <div>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">Availability</p>
                                <div className="flex flex-wrap gap-2">
                                    {ip.contactModes.map(mode => (
                                        <span key={mode} className="px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/5">
                                            {mode}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">Owner Instructions</p>
                                <p className="text-[12px] font-medium italic text-white/70 leading-relaxed">
                                    "{ip.contactInstructions}"
                                </p>
                            </div>
                        </div>

                        <button className="w-full bg-white text-black py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                            <MessageSquare size={16} />
                            {getActionButtonLabel()}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
