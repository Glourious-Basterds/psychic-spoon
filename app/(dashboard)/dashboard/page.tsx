'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
    Users, 
    MessageSquare, 
    Heart, 
    MessageCircle, 
    CheckCircle2, 
    Clock, 
    ArrowUpRight, 
    Star, 
    ShieldCheck, 
    Layers, 
    Globe,
    UserPlus,
    LayoutDashboard,
    Share2,
    Eye,
    TrendingUp,
    Briefcase,
    Zap,
    ChevronRight
} from 'lucide-react';
import { useProjects } from '@/app/context/ProjectContext';
import { useUI } from '@/context/UIContext';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

// --- Types ---
interface Activity {
    id: string;
    type: 'like' | 'comment' | 'comment_like' | 'dm' | 'group_msg' | 'join' | 'connect';
    user: {
        name: string;
        photo: string;
    };
    content?: string;
    timestamp: string;
}

interface Visitor {
    id: string;
    name: string;
    role: string;
    photo: string;
    timestamp: string;
}

// --- Mock Data ---
const MOCK_STATS = [
    { label: 'Profile Views', value: '1,240', icon: Eye, change: '+12%', color: '#3b82f6' },
    { label: 'Posts Published', value: '42', icon: Globe, change: '+4', color: '#65a30d' },
    { label: 'Active Projects', value: '3', icon: Layers, change: '0', color: '#1f2937' },
    { label: 'Average Reputation', value: '4.8', icon: Star, change: '(24 reviews)', color: '#f59e0b' },
];

const MOCK_VISITORS: Visitor[] = [
    { id: '1', name: 'Sara R.', role: 'Creative Director', photo: 'https://i.pravatar.cc/150?u=1', timestamp: '2h ago' },
    { id: '2', name: 'Marco V.', role: 'Sound Engineer', photo: 'https://i.pravatar.cc/150?u=2', timestamp: '4h ago' },
    { id: '3', name: 'Tony S.', role: 'Lead Developer', photo: 'https://i.pravatar.cc/150?u=3', timestamp: '6h ago' },
    { id: '4', name: 'Elena K.', role: 'Concept Artist', photo: 'https://i.pravatar.cc/150?u=4', timestamp: '8h ago' },
    { id: '5', name: 'James B.', role: 'Producer', photo: 'https://i.pravatar.cc/150?u=5', timestamp: '12h ago' },
    { id: '6', name: 'Luca F.', role: 'Editor', photo: 'https://i.pravatar.cc/150?u=6', timestamp: '15h ago' },
    { id: '7', name: 'Marta G.', role: 'Colorist', photo: 'https://i.pravatar.cc/150?u=7', timestamp: '18h ago' },
    { id: '8', name: 'Silvia M.', role: 'Animator', photo: 'https://i.pravatar.cc/150?u=8', timestamp: '21h ago' },
    { id: '9', name: 'Fabio D.', role: 'DOP', photo: 'https://i.pravatar.cc/150?u=9', timestamp: '24h ago' },
    { id: '10', name: 'Anna L.', role: 'Writer', photo: 'https://i.pravatar.cc/150?u=10', timestamp: '26h ago' },
    { id: '11', name: 'Stefano P.', role: 'Grip', photo: 'https://i.pravatar.cc/150?u=11', timestamp: '28h ago' },
    { id: '12', name: 'Paola C.', role: 'Stylist', photo: 'https://i.pravatar.cc/150?u=12', timestamp: '30h ago' },
];

const MOCK_ACTIVITIES: Activity[] = [
    { id: 'a1', type: 'like', user: { name: 'Marco V.', photo: '' }, timestamp: '15m ago' },
    { id: 'a2', type: 'comment', user: { name: 'Sara R.', photo: '' }, content: 'Fantastico questo shaker in fibra di carbonio!', timestamp: '45m ago' },
    { id: 'a3', type: 'comment_like', user: { name: 'Elena K.', photo: '' }, timestamp: '1h ago' },
    { id: 'a4', type: 'dm', user: { name: 'Bruce W.', photo: '' }, content: 'Ti ho inviato i dettagli per il mock-up.', timestamp: '2h ago' },
    { id: 'a5', type: 'group_msg', user: { name: 'Tony S.', photo: '' }, content: 'Scritto in #Home-Base di The Bar-Man', timestamp: '3h ago' },
    { id: 'a6', type: 'join', user: { name: 'Pietro M.', photo: '' }, content: 'Si è unito a Project Woody', timestamp: '5h ago' },
    { id: 'a7', type: 'connect', user: { name: 'Sara R.', photo: '' }, timestamp: '1d ago' },
    { id: 'a8', type: 'like', user: { name: 'Luca F.', photo: '' }, timestamp: '1d ago' },
];

const MOCK_PROJECTS = [
    { id: 'bar-man', name: 'The Bar-Man', role: 'Mixologist Elite', progress: 85, status: 'IN_PROGRESS', cover: '/images/abstract_hashi_overview.png' },
    { id: 'space-balls', name: 'Space Balls S2', role: 'Kitchen Lead', progress: 45, status: 'IN_PROGRESS', cover: '/images/astronaut_pasta_space_1772409766288.png' },
    { id: 'ghost-protocol', name: 'Ghost Protocol', role: 'Shadow Agent', progress: 15, status: 'IN_PROGRESS', cover: '/images/abstract_hashi_missions_1772199713266.png' },
];

const MOCK_POSTS = [
    { id: 1, text: 'Testando il nuovo shaker in fibra di carbonio per il Bar-Man project. La reazione del liquido è incredibile.', likes: 124, comments: 18, image: '/images/batman_barman_ultra_hq_1772400333099.png' },
    { id: 2, text: 'Space Balls S2: la pasta in assenza di gravità richiede parametri idrici molto particolari.', likes: 89, comments: 12, image: '/images/astronaut_pasta_space_1772409766288.png' },
    { id: 3, text: 'Oggi workshop su design stealth e interfacce immersive.', likes: 56, comments: 4, image: '/images/abstract_theme_verification_1772199812702.webp' },
]
export default function DashboardPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { workspaces, missions } = useProjects();
    const { setAuthModalOpen } = useUI();

    const activeMissionsCount = missions.filter(m => m.status === 'IN_PROGRESS').length;
    const stats = [
        { label: 'Profile Views', value: '1,240', icon: Eye, change: '+12%', color: '#3b82f6' },
        { label: 'Posts Published', value: '42', icon: Globe, change: '+4', color: '#65a30d' },
        { label: 'Active Projects', value: activeMissionsCount.toString(), icon: Layers, change: '0', color: '#1f2937' },
        { label: 'Average Reputation', value: '4.8', icon: Star, change: '(24 reviews)', color: '#f59e0b' },
    ];

    const renderActivityIcon = (type: Activity['type']) => {
        switch (type) {
            case 'like': return <Heart size={12} className="text-pink-500 fill-pink-500" />;
            case 'comment': return <MessageCircle size={12} className="text-blue-500" />;
            case 'comment_like': return <Heart size={12} className="text-pink-500 fill-pink-500" />;
            case 'dm': return <MessageSquare size={12} className="text-purple-500" />;
            case 'group_msg': return <Users size={12} className="text-indigo-500" />;
            case 'join': return <Zap size={12} className="text-yellow-500 fill-yellow-500" />;
            case 'connect': return <UserPlus size={12} className="text-green-500" />;
            default: return null;
        }
    };

    const renderActivityText = (act: Activity) => {
        switch (act.type) {
            case 'like': return `${act.user.name} ha messo like al tuo post`;
            case 'comment': return `${act.user.name} ha commentato il tuo post: "${act.content}"`;
            case 'comment_like': return `${act.user.name} ha messo like al tuo commento`;
            case 'dm': return `${act.user.name} ti ha inviato un messaggio`;
            case 'group_msg': return act.content || '';
            case 'join': return act.content || '';
            case 'connect': return `${act.user.name} vuole connettersi con te`;
            default: return '';
        }
    };

    if (status === 'unauthenticated') {
        return (
            <div className="h-full bg-white flex items-center justify-center p-8">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-black/20">
                        <ShieldCheck size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-[#030712] hashi-font uppercase tracking-tight mb-4">Accesso Richiesto</h2>
                    <p className="text-sm text-black/50 leading-relaxed mb-10">
                        L'Area Overview è riservata ai membri della rete Hashi. Accedi per visualizzare le tue statistiche, gestire i tuoi progetti e monitorare le attività in tempo reale.
                    </p>
                    <button 
                        onClick={() => setAuthModalOpen(true)}
                        className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-gray-900 transition-all shadow-xl shadow-black/10"
                    >
                        Accedi alla Piattaforma
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-white hashi-scrollbar overflow-y-auto p-8 relative flex flex-col">
            
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl font-black text-[#030712] hashi-font uppercase tracking-tight mb-2">Overview</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">Active Session: {session?.user?.name || 'Utente Anonimo'}</p>
            </div>

            {/* Section 1: Stats Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500 group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-black/5 group-hover:scale-110 transition-transform duration-500">
                                <stat.icon size={20} className="text-[#030712]" />
                            </div>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.change.includes('+') ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="text-3xl font-black text-[#030712] mb-1">{stat.value}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-black/20">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Column: Visitors & Activity */}
                <div className="lg:col-span-8 space-y-12">
                    
                    {/* Section 2: Who profile viewed */}
                    <section>
                        <div className="flex justify-between items-end mb-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/60 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Chi ha visualizzato il tuo profilo
                            </h3>
                            <span className="text-[10px] font-black text-black/20 uppercase tracking-widest">Ultimi 30h</span>
                        </div>
                        <div className="bg-white rounded-[2.5rem] border border-black/5 p-2 overflow-hidden shadow-sm">
                            {MOCK_VISITORS.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {MOCK_VISITORS.map((v) => (
                                        <div 
                                            key={v.id} 
                                            onClick={() => router.push(`/profile/${encodeURIComponent(v.id)}`)}
                                            className="p-4 rounded-[2rem] hover:bg-black/[0.02] transition-colors cursor-pointer text-center group"
                                        >
                                            <div className="w-12 h-12 rounded-full overflow-hidden mx-auto mb-3 border border-black/5 group-hover:scale-110 transition-transform shadow-sm">
                                                {v.photo ? (
                                                    <img src={v.photo} className="w-full h-full object-cover" alt={v.name} />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-sm font-black text-black/30">
                                                        {v.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-[11px] font-black text-[#030712] mb-0.5 truncate">{v.name}</div>
                                            <div className="text-[9px] font-bold text-black/20 uppercase tracking-tight mb-1 truncate">{v.role}</div>
                                            <div className="text-[8px] font-black text-black/20 bg-gray-50 rounded-full py-1 px-2 inline-block uppercase">{v.timestamp}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center text-xs font-bold text-black/20 uppercase tracking-widest italic">Nessuna visita recente al profilo.</div>
                            )}
                        </div>
                    </section>

                    {/* Section 3: Recent Activity Feed */}
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/60 mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                            Attività Recente
                        </h3>
                        <div className="space-y-4">
                            {MOCK_ACTIVITIES.map((act) => (
                                <div key={act.id} className="flex items-center gap-4 p-5 bg-white rounded-[2rem] border border-black/5 hover:border-black/10 hover:shadow-md transition-all group">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-black text-black/30 border border-black/5 group-hover:scale-105 transition-transform">
                                            {act.user.name.charAt(0)}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-black/5 flex items-center justify-center shadow-sm">
                                            {renderActivityIcon(act.type)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] text-[#030712] font-medium leading-tight">
                                            <span className="font-black">{act.user.name}</span> {renderActivityText(act).replace(act.user.name, '').trim()}
                                        </p>
                                        <p className="text-[9px] font-black text-black/20 uppercase tracking-widest mt-1">{act.timestamp}</p>
                                    </div>
                                    <button className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center text-black/20 hover:text-black hover:bg-gray-50 transition-all">
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Projects & Posts */}
                <div className="lg:col-span-4 space-y-12">
                    
                    {/* Section 4: Your Projects */}
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/60 mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                            I Tuoi Progetti
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(workspaces).map(([id, ws]) => {
                                const mission = missions.find(m => m.id === id);
                                if (!mission || mission.status !== 'IN_PROGRESS') return null;
                                return (
                                    <div 
                                        key={id} 
                                        onClick={() => router.push(`/comms?project=${id}`)}
                                        className="p-5 bg-white border border-black/5 rounded-[2.5rem] hover:shadow-xl hover:border-black/10 transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-black/5 group-hover:scale-105 transition-transform duration-500">
                                                <img src={ws.coverImage || '/images/abstract_hashi_overview.png'} className="w-full h-full object-cover" alt={ws.name} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[14px] font-black uppercase tracking-tight text-[#030712] truncate">{ws.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest truncate">{mission.role}</span>
                                                    <div className="w-1 h-1 rounded-full bg-black/10" />
                                                    <span className="text-[8px] font-black text-green-600 bg-green-50 px-2 rounded-full uppercase">{mission.status.replace('_', ' ')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-black/20 px-1">
                                                <span>Progresso</span>
                                                <span>{mission.progress || 0}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-[#030712] rounded-full transition-all duration-1000 group-hover:bg-[#65a30d]" 
                                                    style={{ width: `${mission.progress || 0}%` }} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Section 5: Your Recent Posts */}
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/60 mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                            I Tuoi Post Recenti
                        </h3>
                        <div className="space-y-6">
                            {MOCK_POSTS.map((post) => (
                                <div 
                                    key={post.id} 
                                    onClick={() => router.push('/feed')}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-black/5 mb-3 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-500">
                                        <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Post" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <span className="text-white text-[10px] font-black uppercase tracking-tighter flex items-center gap-2">
                                                View in Feed <ArrowUpRight size={14} />
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-[12px] text-black/60 line-clamp-2 leading-snug px-2 mb-2 italic">"{post.text}"</p>
                                    <div className="flex items-center gap-4 px-2">
                                        <div className="flex items-center gap-1.5">
                                            <Heart size={12} className="text-black/20" />
                                            <span className="text-[10px] font-black text-black/30">{post.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MessageCircle size={12} className="text-black/20" />
                                            <span className="text-[10px] font-black text-black/30">{post.comments}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
