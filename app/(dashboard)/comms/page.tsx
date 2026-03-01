'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Send, Hash, User,
    Video, Image as ImageIcon, Phone,
    Music, Layout, ChevronDown, PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Tab = 'photos' | 'soundtracks' | 'calls' | 'messages' | 'video';

// --- MOCK DATA (STRICTLY ISOLATED BY PROJECT) ---

const MOCK_PROJECTS = [
    {
        id: 'bar-man',
        name: 'The Bar-man',
        initials: 'BAR',
        status: 'Noir Cinema Project',
        channels: [
            { id: 'general', name: 'HOME BASE', isGroup: true },
            { id: 'intel', name: 'CLANDESTINE-INTEL', isGroup: true },
            { id: 'user-bruce', name: 'Bruce W.', isGroup: false },
        ]
    },
    {
        id: 'space-balls',
        name: 'The Space Balls',
        initials: 'SPC',
        status: 'Space Comedy Animation',
        channels: [
            { id: 'kitchen', name: 'HOME BASE', isGroup: true },
            { id: 'logistics', name: 'SUB-ORBITAL-PASTA', isGroup: true },
            { id: 'user-helmet', name: 'Lord Helmet', isGroup: false },
        ]
    }
];

type MockMessage = { id: number; sender: string; content: string; type: string; time: string; avatar: string };
const MOCK_MESSAGES: Record<string, MockMessage[]> = {
    'bar-man-general': [
        { id: 1, sender: 'Pietro M.', content: "How's the project going on so far?", type: 'me', time: '10:00 AM', avatar: 'PM' },
        { id: 2, sender: 'Bruce W.', content: "Idk, have a look around dumbass", type: 'ally', time: '10:05 AM', avatar: 'BW' },
    ],
    'space-balls-kitchen': [
        { id: 1, sender: 'Pietro M.', content: "How's the food guys?", type: 'me', time: '12:15 PM', avatar: 'PM' },
        { id: 2, sender: 'Lord Helmet', content: "Mamma Mia! It's the best cuisine in the world", type: 'enemy', time: '12:20 PM', avatar: 'LH' }
    ]
};

const MOCK_MEDIA: Record<string, { type: 'image' | 'video'; url: string }[]> = {
    'bar-man': [
        { type: 'image', url: '/images/batman_barman_james_bond.png' },
        { type: 'image', url: '/images/barman_james_bond.png' },
        { type: 'image', url: '/images/joker_bar_noir.png' }
    ],
    'space-balls': [
        { type: 'image', url: '/images/space_food_4k.png' },
        { type: 'image', url: '/images/space_pasta_rotation.png' }
    ]
};

const MOCK_SOUNDTRACKS: Record<string, { title: string; duration: string; author: string }[]> = {
    'bar-man': [
        { title: 'The Shadow Bartender', duration: '3:45', author: 'B. Wayne' },
        { title: 'Clandestine Martini', duration: '2:50', author: 'T. Stark' }
    ],
    'space-balls': [
        { title: 'Ludicrous Speed Italian', duration: '4:20', author: 'L. Helmet' },
        { title: 'Zero-G Spaghetti Theme', duration: '5:10', author: 'Chef Lonestar' }
    ]
};

const MOCK_CALLS: Record<string, { user: string; type: string; time: string; status: string }[]> = {
    'bar-man': [
        { user: 'Bruce W.', type: 'Outgoing', time: '10:45 AM', status: 'Completed' },
        { user: 'Tony S.', type: 'Outgoing', time: 'Feb 26', status: 'Completed' }
    ],
    'space-balls': [
        { user: 'Lord Helmet', type: 'Incoming', time: 'Yesterday', status: 'Missed' },
        { user: 'Chef Lonestar', type: 'Outgoing', time: '2h ago', status: 'Completed' }
    ]
};

function CommsContent() {
    const searchParams = useSearchParams();
    const projectParam = searchParams.get('project') || MOCK_PROJECTS[0].id;

    const [activeProject, setActiveProject] = useState(projectParam);
    const [activeChannel, setActiveChannel] = useState(projectParam === 'bar-man' ? 'general' : 'kitchen');
    const [activeTab, setActiveTab] = useState<Tab>('photos');
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (projectParam !== activeProject) {
            setActiveProject(projectParam);
            setActiveChannel(projectParam === 'bar-man' ? 'general' : 'kitchen');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectParam]);

    const currentProject = MOCK_PROJECTS.find(p => p.id === activeProject);
    const channelKey = `${activeProject}-${activeChannel}`;
    const messages = MOCK_MESSAGES[channelKey] || [];
    const media = MOCK_MEDIA[activeProject] || [];
    const soundtracks = MOCK_SOUNDTRACKS[activeProject] || [];
    const calls = MOCK_CALLS[activeProject] || [];

    return (
        <div className="h-screen flex flex-row overflow-hidden bg-black text-white/90 hashi-font selection:bg-white/10">

            {/* 1. PROJECT STRIP (Discord style) */}
            <div className="w-24 bg-[#050505] border-r border-white/5 flex flex-col items-center py-10 gap-8 z-30">
                <Link href="/dashboard" className="w-14 h-14 bg-white flex items-center justify-center text-black hover:bg-white/90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)] rounded-2xl">
                    <Layout size={24} />
                </Link>
                <div className="w-10 h-[1px] bg-white/5" />
                {MOCK_PROJECTS.map(p => (
                    <button
                        key={p.id}
                        onClick={() => {
                            setActiveProject(p.id);
                            setActiveChannel(p.id === 'bar-man' ? 'general' : 'kitchen');
                            setActiveTab('photos');
                        }}
                        className={`w-14 h-14 flex items-center justify-center transition-all hashi-font font-black text-[10px] rounded-2xl border
                            ${activeProject === p.id
                                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105'
                                : 'bg-transparent text-white/30 border-white/5 hover:border-white/20 hover:text-white/50'
                            }`}
                    >
                        {p.initials}
                    </button>
                ))}
                <button className="w-14 h-14 flex items-center justify-center bg-white/[0.02] border border-dashed border-white/10 text-white/10 rounded-2xl hover:border-white/30 hover:text-white/40 transition-all mt-auto">
                    <PlusCircle size={20} strokeWidth={1.5} />
                </button>
            </div>

            {/* 2. CHANNELS LIST (Pure Black) */}
            <div className="w-80 bg-black border-r border-white/5 flex flex-col z-20">
                <div className="p-8 border-b border-white/5 flex justify-between items-center group cursor-pointer hover:bg-white/[0.01] transition-colors">
                    <div>
                        <h2 className="hashi-font font-black uppercase tracking-[0.2em] text-white/90 text-sm">
                            {currentProject?.name}
                        </h2>
                        <p className="text-[10px] text-white/20 font-bold tracking-widest mt-1 uppercase italic group-hover:text-white/40">{currentProject?.status}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-white/20 group-hover:text-white transition-all" />
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-10 scrollbar-hide">
                    {/* Messaging Section */}
                    <div className="space-y-2">
                        <div className="px-4 flex justify-between items-center text-[9px] uppercase tracking-[0.4em] text-white/10 font-black mb-4 italic">
                            <span>Intelligence_Hub</span>
                        </div>
                        {currentProject?.channels.map(c => (
                            <button
                                key={c.id}
                                onClick={() => {
                                    setActiveChannel(c.id);
                                    setActiveTab('messages');
                                }}
                                className={`w-full group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all
                                    ${activeChannel === c.id && activeTab === 'messages'
                                        ? 'bg-white/5 text-white ring-1 ring-white/10'
                                        : 'text-white/30 hover:text-white hover:bg-white/[0.02]'
                                    }`}
                            >
                                <div className={`w-1.5 h-1.5 rounded-full ${activeChannel === c.id && activeTab === 'messages' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`} />
                                <span className="text-[11px] font-black uppercase tracking-[0.15em]">{c.name}</span>
                                {!c.isGroup && <div className="ml-auto w-2 h-2 rounded-full bg-green-500/40" />}
                            </button>
                        ))}
                    </div>

                    {/* Media Vault Section (STRICT ORDER: Photos -> Soundtracks -> Calls) */}
                    <div className="space-y-2">
                        <div className="px-4 text-[9px] uppercase tracking-[0.4em] text-white/10 font-black mb-4 italic">Media_Vault</div>
                        <button
                            onClick={() => setActiveTab('photos')}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all
                                ${activeTab === 'photos' ? 'bg-white/5 text-white ring-1 ring-white/10' : 'text-white/30 hover:text-white hover:bg-white/[0.02]'}`}
                        >
                            <ImageIcon size={16} className={`${activeTab === 'photos' ? 'text-white' : 'text-white/20'}`} />
                            <span className="text-[11px] font-black uppercase tracking-[0.15em]">Photos</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('soundtracks')}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all
                                ${activeTab === 'soundtracks' ? 'bg-white/5 text-white ring-1 ring-white/10' : 'text-white/30 hover:text-white hover:bg-white/[0.02]'}`}
                        >
                            <Music size={16} className={`${activeTab === 'soundtracks' ? 'text-white' : 'text-white/20'}`} />
                            <span className="text-[11px] font-black uppercase tracking-[0.15em]">Soundtracks</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('calls')}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all
                                ${activeTab === 'calls' ? 'bg-white/5 text-white ring-1 ring-white/10' : 'text-white/30 hover:text-white hover:bg-white/[0.02]'}`}
                        >
                            <Phone size={16} className={`${activeTab === 'calls' ? 'text-white' : 'text-white/20'}`} />
                            <span className="text-[11px] font-black uppercase tracking-[0.15em]">Calls</span>
                        </button>
                    </div>
                </div>

                {/* Profile Footer */}
                <div className="p-8 bg-[#050505] border-t border-white/5 flex items-center gap-5">
                    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-black text-[12px] font-black shadow-[0_0_20px_rgba(255,255,255,0.05)]">P.M</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black hashi-font text-white tracking-[0.1em] uppercase">Pietro Maggiotto</p>
                        <p className="text-[9px] text-white/20 font-black tracking-widest italic uppercase">Sync // High_Command</p>
                    </div>
                </div>
            </div>

            {/* 3. WORKSPACE CONTENT (Pure Black) */}
            <div className="flex-1 flex flex-col bg-transparent relative">
                {/* Secondary Horizontal Nav (Photos -> Soundtracks -> Calls) */}
                <header className="h-20 border-b border-white/5 flex items-center px-12 bg-black/80 backdrop-blur-2xl z-10">
                    <div className="flex items-center gap-16">
                        <div className="flex items-center gap-5 border-r border-white/10 pr-12">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
                            <span className="hashi-font font-black uppercase tracking-[0.4em] text-[11px] text-white/90 italic">
                                {activeTab === 'messages' ? `Channel_${activeChannel}` : activeTab.toUpperCase()}
                            </span>
                        </div>

                        <nav className="flex gap-12">
                            {(['photos', 'soundtracks', 'calls', 'messages', 'video'] as Tab[]).map(tab => {
                                const isStrict = tab === 'photos' || tab === 'soundtracks' || tab === 'calls';
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`text-[10px] uppercase tracking-[0.4em] font-black hashi-font transition-all relative py-8
                                            ${activeTab === tab
                                                ? 'text-white scale-105'
                                                : isStrict ? 'text-white/30 hover:text-white/60' : 'text-white/10'
                                            }`}
                                    >
                                        {tab}
                                        {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)]" />}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto relative p-12 scrollbar-hide">

                    {activeTab === 'messages' && (
                        <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
                            <div className="flex-1 space-y-12 pb-20">
                                <div className="mb-20 space-y-4">
                                    <h1 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
                                        Terminal_{activeChannel}
                                    </h1>
                                    <div className="w-16 h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                    <p className="text-[11px] text-white/20 font-black uppercase tracking-[0.6em] italic">
                                        Establish connection // {currentProject?.name}_Core
                                    </p>
                                </div>

                                {messages.map((msg) => (
                                    <div key={msg.id} className="flex gap-8 group animate-in slide-in-from-bottom-5 duration-1000">
                                        <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center font-black hashi-font text-[12px] border transition-all duration-500
                                            ${msg.type === 'me' ? 'bg-white text-black border-white' : 'bg-transparent text-white/30 border-white/5 group-hover:border-white/20 group-hover:text-white'}`}>
                                            {msg.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-4 mb-3">
                                                <span className={`text-[11px] font-black uppercase tracking-widest italic transition-colors ${msg.type === 'me' ? 'text-white/90' : 'text-white/40 group-hover:text-white/70'}`}>
                                                    {msg.sender}
                                                </span>
                                                <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.3em]">{msg.time}</span>
                                            </div>
                                            <div className={`text-2xl font-medium tracking-tight leading-relaxed max-w-3xl ${msg.type === 'me' ? 'text-white' : 'text-white/50 group-hover:text-white/80 transition-colors italic'}`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className="sticky bottom-0 bg-black/80 backdrop-blur-xl pt-10 pb-4 border-t border-white/5">
                                <div className="flex gap-6 max-w-4xl mx-auto w-full">
                                    <div className="flex-1 relative group">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder={`Input command to ${activeChannel}_protocol...`}
                                            className="w-full bg-[#080808] border border-white/5 hover:border-white/10 py-6 px-10 rounded-2xl font-bold text-white text-base placeholder:text-white/10 focus:outline-none focus:border-white/20 transition-all focus:ring-1 focus:ring-white/5"
                                        />
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex gap-8 text-white/10 group-hover:text-white/20 transition-colors">
                                            <ImageIcon size={20} className="hover:text-white cursor-pointer transition-colors" />
                                            <PlusCircle size={20} className="hover:text-white cursor-pointer transition-colors" />
                                        </div>
                                    </div>
                                    <Button className="h-[68px] w-[90px] bg-white text-black hover:bg-white/90 rounded-2xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                        <Send size={24} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'photos' && (
                        <div>
                            <div className="flex justify-between items-baseline mb-20 border-b border-white/5 pb-10">
                                <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic">Visual.Archive</h1>
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em]">{media.length} OBJECTS_LOCALIZED</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl">
                                {media.map((item, i) => (
                                    <div key={i} className="aspect-[4/5] bg-white/[0.01] border border-white/5 rounded-[2rem] overflow-hidden group relative cursor-zoom-in hover:border-white/20 transition-all duration-700">
                                        <img src={item.url} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all duration-1000 scale-[1.02] group-hover:scale-100" alt="Asset" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 p-10 flex flex-col justify-end">
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-4">M0DE: 4K_RAW_SOURCE</span>
                                            <p className="text-xl font-bold text-white uppercase tracking-widest leading-none truncate">
                                                {item.url.split('/').pop()?.split('.')[0].replace(/_/g, ' ')}
                                            </p>
                                        </div>
                                        <div className="absolute top-8 left-8 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 opacity-40 group-hover:opacity-100 transition-opacity">
                                            {item.type === 'video' ? <Video size={18} className="text-blue-400" /> : <ImageIcon size={18} className="text-white" />}
                                        </div>
                                    </div>
                                ))}
                                {/* Empty Grid state */}
                                {[...Array(Math.max(0, 3 - media.length))].map((_, i) => (
                                    <div key={i} className="aspect-[4/5] bg-white/[0.01] border border-dashed border-white/10 rounded-[2rem] flex items-center justify-center opacity-10">
                                        <PlusCircle size={40} strokeWidth={1} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'soundtracks' && (
                        <div className="max-w-5xl">
                            <div className="flex justify-between items-baseline mb-20 border-b border-white/5 pb-10">
                                <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic">Audio.Matrix</h1>
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em]">{soundtracks.length} SIGNALS_REFINED</span>
                            </div>
                            <div className="space-y-6">
                                {soundtracks.map((track, i) => (
                                    <div key={i} className="flex items-center justify-between p-10 bg-[#060606] border border-white/5 rounded-[2rem] hover:bg-white/[0.02] hover:border-white/20 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-10">
                                            <div className="w-16 h-16 rounded-[1.2rem] border border-white/10 flex items-center justify-center text-white/10 group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-xl">
                                                <Music size={28} strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-black text-white uppercase tracking-[0.05em] transition-colors">{track.title}</p>
                                                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em] italic mt-2 group-hover:text-white/40">{track.author}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-16">
                                            <div className="hidden lg:flex gap-1 items-end h-8">
                                                {[...Array(12)].map((_, i) => (
                                                    <div key={i} className={`w-1 bg-white/10 transition-all duration-300 ${i % 3 === 0 ? 'h-full group-hover:h-2 group-hover:bg-blue-500/50' : 'h-1/2 group-hover:h-full group-hover:bg-white/30'}`} />
                                                ))}
                                            </div>
                                            <span className="text-sm font-black text-white/40 tracking-[0.2em] group-hover:text-white transition-colors">{track.duration}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'calls' && (
                        <div className="max-w-5xl">
                            <div className="flex justify-between items-baseline mb-20 border-b border-white/5 pb-10">
                                <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic">Void.Comm</h1>
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em]">DECRYPT_LOGS</span>
                            </div>
                            <div className="space-y-6">
                                {calls.map((call, i) => (
                                    <div key={i} className="flex items-center justify-between p-10 bg-[#060606] border border-white/5 rounded-[2.5rem] hover:border-white/20 transition-all duration-500 cursor-pointer group overflow-hidden">
                                        <div className="flex items-center gap-10">
                                            <div className={`w-16 h-16 rounded-[1.5rem] border border-white/5 flex items-center justify-center transition-all duration-700
                                                ${call.status === 'Missed' ? 'text-red-500/20 group-hover:bg-red-500/10' : 'text-blue-500/20 group-hover:bg-blue-500/10'}`}>
                                                <Phone size={26} strokeWidth={1} />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-black text-white uppercase tracking-tighter truncate max-w-xs">{call.user}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className={`text-[10px] font-black uppercase tracking-[0.4em] italic ${call.status === 'Missed' ? 'text-red-900' : 'text-white/20'}`}>
                                                        {call.type} / {call.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[11px] font-black text-white/30 tracking-[0.3em] uppercase">{call.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'video' && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-40 opacity-5 space-y-12">
                            <Video size={120} strokeWidth={0.5} className="text-white" />
                            <div className="space-y-4">
                                <h2 className="text-5xl font-black text-white uppercase tracking-[0.8em] italic">
                                    NULL.V0ID
                                </h2>
                                <p className="text-[11px] font-black uppercase tracking-[1em] py-5 px-16 border border-white/10 rounded-full inline-block">
                                    Establishing Signal...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CommsPage() {
    return (
        <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-white/20 uppercase tracking-[0.5em] text-[10px] animate-pulse">Initializing_Void...</div>}>
            <CommsContent />
        </Suspense>
    );
}
