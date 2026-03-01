'use client';

import { useState } from 'react';
import {
    Send, Hash, User, Pin, ChevronRight, Compass, Skull,
    Video, Image as ImageIcon, Phone, MessageSquare,
    Settings, Bell, Search, PlusCircle, Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUI } from '@/context/UIContext';

type Tab = 'messages' | 'video' | 'photos' | 'calls' | 'soundtracks';

// Mock Data
const MOCK_PROJECTS = [
    {
        id: 'bar-man',
        name: 'The Bar-man',
        status: 'Existential Crisis & Reinvention',
        channels: [
            { id: 'general', name: 'HOME BASE', isGroup: true },
            { id: 'intel', name: 'clandestine-intel', isGroup: true },
            { id: 'user-bruce', name: 'Bruce W.', isGroup: false },
            { id: 'user-tony', name: 'Tony S.', isGroup: false },
        ]
    },
    {
        id: 'space-balls',
        name: 'Space-balls',
        status: 'Italian Space Cuisine',
        channels: [
            { id: 'kitchen', name: 'HOME BASE', isGroup: true },
            { id: 'logistics', name: 'sub-orbital-pasta', isGroup: true },
            { id: 'user-helmet', name: 'Lord Helmet', isGroup: false },
            { id: 'user-lonestar', name: 'Chef Lonestar', isGroup: false },
        ]
    }
];

const MOCK_MESSAGES: Record<string, any[]> = {
    'bar-man-general': [
        { id: 1, sender: 'Tony S.', content: "I've finished the interface for the carbon-fiber shakers. Minimalist, bold, and perfectly responsive. Just like your old suit, but it serves drinks.", type: 'ally', time: '10:00' },
        { id: 2, sender: 'Pietro M.', content: "Great work Tony. Bruce, how's the 'Cinema' theme coming along? We need that movie-star vibe for the relaunch.", type: 'me', time: '10:05' },
    ],
    'bar-man-user-bruce': [
        { id: 1, sender: 'Bruce W.', content: "The 'Cinema' theme is rooted in shadow and light. I'm thinking of a scene: the barman is a ghost in a tactical tuxedo, serving justice—and a perfect martini—to an old friend in a white suit. Think Bond, but with more gadgets.", type: 'ally', time: '11:20' },
        { id: 2, sender: 'Bruce W.', content: "I've attached a concept frame of the bar interaction. It needs to feel iper-realistic.", type: 'ally', time: '11:21', image: '/images/batman_barman_james_bond.png' }
    ],
    'bar-man-user-tony': [
        { id: 1, sender: 'Tony S.', content: "Boss, I'm focusing on the font rendering. We need a typeface that screams 'Billionaire Industrialist' but also 'I have a secret cave'. Serious business, but with style.", type: 'ally', time: '09:00' },
        { id: 2, sender: 'Pietro M.', content: "Keep it serious but sharp, Tony. The demo is tomorrow.", type: 'me', time: '09:15' }
    ],
    'space-balls-kitchen': [
        { id: 1, sender: 'Chef Lonestar', content: "The sub-orbital logistics are green. We are ready to launch the first batch of pasta. Rotating towards the astronauts as we speak.", type: 'ally', time: '12:15', image: '/images/space_pasta_rotation.png' },
        { id: 2, sender: 'Pietro M.', content: "Incredible image quality. Everyone should have access to this view in the Photos tab.", type: 'me', time: '12:20' }
    ],
    'space-balls-logistics': [
        { id: 1, sender: 'Artist Alpha', content: "The physics of the rotating spaghetti are mesmerizing. A true masterpiece of zero-G engineering.", type: 'ally', time: '14:00' },
        { id: 2, sender: 'Artist Beta', content: "I'm updating the thermal textures. It needs to look fresh out of the kitchen even in the vacuum of space.", type: 'ally', time: '14:10' }
    ],
    'space-balls-user-helmet': [
        { id: 1, sender: 'Lord Helmet', content: "I've reviewed the soundtrack selection. We need something with the epic scale of Star Wars but with a hint of Italian opera. I've uploaded some test tracks to the Soundtracks folder.", type: 'enemy', time: '13:00' },
        { id: 2, sender: 'Lord Helmet', content: "Make sure the audio is high-fidelity. I don't want to hear space dust in my strings.", type: 'enemy', time: '13:05' }
    ]
};
export default function CommsPage() {
    const { hashiMode } = useUI();
    const [activeProject, setActiveProject] = useState(MOCK_PROJECTS[0].id);
    const [activeChannel, setActiveChannel] = useState('general');
    const [activeTab, setActiveTab] = useState<Tab>('messages');

    const [isTyping, setIsTyping] = useState(false);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        setNewMessage('');
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
    };

    const currentProject = MOCK_PROJECTS.find(p => p.id === activeProject);
    const channelKey = `${activeProject}-${activeChannel}`;
    const messages = MOCK_MESSAGES[channelKey] || [];

    return (
        <div className="h-full flex flex-row overflow-hidden bg-white/50 backdrop-blur-3xl border-t border-[#c20000]/5">

            {/* 1. SEVER LIST (Discord style left strip - Refined Hashi) */}
            <div className="w-20 bg-white/30 backdrop-blur-md border-r border-[#c20000]/10 flex flex-col items-center py-4 gap-4 z-30">
                <div className="w-12 h-12 bg-[#c20000] rounded-none flex items-center justify-center text-white cursor-pointer hover:bg-[#1a1a1a] transition-all shadow-[0_10px_20px_rgba(194,0,0,0.2)]">
                    <Layout size={24} />
                </div>
                <div className="w-8 h-[1px] bg-[#c20000]/10 rounded-full" />
                {MOCK_PROJECTS.map(p => (
                    <div
                        key={p.id}
                        onClick={() => {
                            setActiveProject(p.id);
                            setActiveChannel('general');
                            setActiveTab('messages');
                        }}
                        className={`w-12 h-12 flex items-center justify-center cursor-pointer transition-all hashi-font font-black text-xs border
                            ${activeProject === p.id
                                ? 'bg-[#c20000] text-white rounded-none border-[#c20000] shadow-[0_10px_20px_rgba(194,0,0,0.15)]'
                                : 'bg-white/50 text-[#1a1a1a]/40 rounded-none border-[#c20000]/10 hover:border-[#c20000] hover:text-[#c20000]'
                            }`}
                    >
                        {p.name.charAt(0).toUpperCase()}
                    </div>
                ))}
            </div>

            {/* 2. CHANNEL LIST (Hashi Ethereal) */}
            <div className="w-64 bg-white/20 backdrop-blur-xl border-r border-[#c20000]/10 flex flex-col z-20">
                <div className="p-4 border-b border-[#c20000]/10 flex justify-between items-center bg-white/30">
                    <h2 className="hashi-font font-black uppercase tracking-tighter text-[#1a1a1a] text-sm truncate w-40">
                        {currentProject?.name}
                    </h2>
                    <ChevronDown className="h-4 w-4 text-[#c20000]" />
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                    <div className="space-y-1">
                        <div className="px-2 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold mb-1">
                            <span>Text Channels</span>
                            <PlusCircle size={12} className="cursor-pointer hover:text-[#c20000]" />
                        </div>
                        {currentProject?.channels.map(c => (
                            <div
                                key={c.id}
                                onClick={() => setActiveChannel(c.id)}
                                className={`group flex items-center gap-2 px-2 py-1.5 rounded-none cursor-pointer hashi-font font-bold transition-all border-l-2
                                    ${activeChannel === c.id
                                        ? 'bg-[#c20000]/10 text-[#c20000] border-[#c20000]'
                                        : 'text-[#1a1a1a]/60 border-transparent hover:bg-[#c20000]/5 hover:text-[#1a1a1a]'
                                    }`}
                            >
                                {c.isGroup ? <Hash size={14} className="opacity-40" /> : <User size={14} className="opacity-40" />}
                                <span className="text-sm">{c.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 space-y-2">
                        <div className="px-2 text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold mb-1">Media & Assets</div>
                        <div
                            onClick={() => setActiveTab('soundtracks')}
                            className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer hashi-font font-bold text-sm transition-all
                                ${activeTab === 'soundtracks' ? 'bg-[#c20000]/10 text-[#c20000]' : 'text-[#1a1a1a]/60 hover:bg-[#c20000]/5'}`}
                        >
                            <Phone size={14} className="opacity-40" />
                            <span>SOUNDTRACKS</span>
                        </div>
                    </div>
                </div>

                {/* User Section */}
                <div className="p-4 bg-white/60 border-t border-[#c20000]/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-none bg-[#c20000] cyber-border flex items-center justify-center text-white text-[10px] font-black">P</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-black hashi-font text-[#1a1a1a] truncate">Pietro M.</p>
                        <p className="text-[10px] text-[#c20000] hashi-font tracking-tighter">#0001</p>
                    </div>
                </div>
            </div>

            {/* 3. MAIN CHAT AREA */}
            <div className="flex-1 flex flex-col bg-transparent relative">

                {/* Header / Tabs */}
                <header className="h-12 border-b border-[#c20000]/10 flex items-center justify-between px-4 bg-white/20 backdrop-blur-md z-10">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border-r border-[#c20000]/20 pr-4">
                            <Hash size={18} className="text-[#1a1a1a]/40" />
                            <span className="hashi-font font-black uppercase tracking-tighter text-[#1a1a1a]">{activeChannel}</span>
                        </div>

                        <nav className="flex gap-6">
                            {(['messages', 'video', 'photos', 'calls'] as Tab[]).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-[10px] uppercase tracking-[0.2em] font-black hashi-font transition-all relative py-4
                                        ${activeTab === tab
                                            ? 'text-[#c20000]'
                                            : 'text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60'
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c20000] shadow-[0_0_10px_rgba(194,0,0,0.5)]" />}
                                </button>
                            ))}
                        </nav>
                    </div>
                </header>

                {/* Content based on tab */}
                <div className="flex-1 overflow-y-auto p-8 relative flex flex-col-reverse justify-end scrollbar-hide">
                    {activeTab === 'messages' && (
                        <div className="space-y-8 max-w-4xl mx-auto w-full">
                            {messages.map((msg) => (
                                <div key={msg.id} className="flex gap-4 group">
                                    <div className={`w-10 h-10 shrink-0 flex items-center justify-center font-black hashi-font text-xs border-2
                                        ${msg.sender === 'Pietro M.' ? 'bg-white text-[#c20000] border-[#c20000]' :
                                            msg.type === 'enemy' ? 'bg-[#c20000] text-white border-[#1a1a1a]' : 'bg-[#1a1a1a] text-[#c20000] border-[#c20000]/20'}`}>
                                        {msg.sender.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className={`text-sm font-black hashi-font ${msg.type === 'enemy' ? 'text-[#c20000]' : 'text-[#1a1a1a]'}`}>
                                                {msg.sender}
                                            </span>
                                            <span className="text-[9px] font-bold text-[#1a1a1a]/30 uppercase tracking-tighter">{msg.time}</span>
                                        </div>
                                        <div className="text-lg hashi-font tracking-wide text-[#1a1a1a]/80 leading-snug">
                                            {msg.content}
                                        </div>
                                        {msg.image && (
                                            <div className="mt-4 border border-[#c20000]/10 shadow-[20px_20px_40px_rgba(0,0,0,0.05)] max-w-lg aspect-video overflow-hidden group">
                                                <img src={msg.image} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" alt="4K Asset" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-4 animate-pulse">
                                    <div className="w-10 h-10 bg-[#c20000]/10 flex items-center justify-center text-[#c20000] font-black text-xs">...</div>
                                    <div className="flex flex-col gap-1">
                                        <div className="h-4 w-20 bg-[#c20000]/5" />
                                        <div className="h-6 w-32 bg-[#c20000]/10" />
                                    </div>
                                </div>
                            )}

                            <div className="pt-20">
                                <h1 className="text-4xl font-black hashi-font text-[#1a1a1a] tracking-tighter uppercase border-b-2 border-[#c20000] inline-block mb-2">
                                    Welcome to WORKSPACE
                                </h1>
                                <p className="text-sm hashi-font text-[#1a1a1a]/40 font-bold uppercase tracking-[0.3em]">
                                    Project: {currentProject?.name} // {currentProject?.status}
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'photos' && (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto w-full py-10">
                            {[
                                '/images/batman_barman_james_bond.png',
                                '/images/space_pasta_rotation.png',
                                '/images/space_pasta_4k.jpg'
                            ].map((img, i) => (
                                <div key={i} className="aspect-video border border-[#c20000]/10 overflow-hidden hover:border-[#c20000] transition-all cursor-zoom-in">
                                    <img src={img} className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all" alt="Shared asset" />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'soundtracks' && (
                        <div className="max-w-4xl mx-auto w-full space-y-4 py-20">
                            <h2 className="text-3xl font-black hashi-font text-[#1a1a1a] uppercase tracking-tighter border-l-4 border-[#c20000] pl-6 mb-10">
                                Global Soundtracks // {currentProject?.name}
                            </h2>
                            {[
                                { title: 'The Shadow Bartender', duration: '3:45', author: 'B. Wayne' },
                                { title: 'Ludicrous Speed Italian', duration: '4:20', author: 'L. Helmet' },
                                { title: 'Clandestine Martini', duration: '2:50', author: 'T. Stark' }
                            ].map((track, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-white/40 border border-[#c20000]/10 hover:bg-[#c20000]/5 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 border border-[#c20000]/20 flex items-center justify-center text-[#c20000] group-hover:bg-[#c20000] group-hover:text-white transition-all">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="font-black hashi-font text-[#1a1a1a] uppercase tracking-wide">{track.title}</p>
                                            <p className="text-[10px] text-[#c20000] font-bold uppercase tracking-widest">{track.author}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-[#1a1a1a]/30">{track.duration}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'calls' && (
                        <div className="max-w-4xl mx-auto w-full space-y-4 py-20 animate-in fade-in duration-700">
                            <h2 className="text-3xl font-black hashi-font text-[#1a1a1a] uppercase tracking-tighter border-l-4 border-[#c20000] pl-6 mb-10">
                                Call History // Secure Log
                            </h2>
                            {[
                                { user: 'Bruce W.', type: 'Outgoing', time: '10:45 AM', status: 'Completed' },
                                { user: 'Lord Helmet', type: 'Incoming', time: 'Yesterday', status: 'Missed' },
                                { user: 'Tony S.', type: 'Outgoing', time: 'Feb 26', status: 'Completed' }
                            ].map((call, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-white/40 border border-[#c20000]/10 hover:bg-[#c20000]/5 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-10 h-10 border border-[#c20000]/20 flex items-center justify-center ${call.status === 'Missed' ? 'text-red-500' : 'text-[#c20000]'} group-hover:bg-[#c20000] group-hover:text-white transition-all`}>
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="font-black hashi-font text-[#1a1a1a] uppercase tracking-wide">{call.user}</p>
                                            <p className="text-[10px] text-[#c20000] font-bold uppercase tracking-widest">{call.type} • {call.status}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-[#1a1a1a]/30">{call.time}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'video' && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-20 animate-in fade-in duration-700">
                            <div className="w-24 h-24 mb-6 text-[#c20000]/20">
                                <Video size={96} />
                            </div>
                            <h2 className="text-2xl font-black hashi-font text-[#1a1a1a] uppercase tracking-tighter">
                                Video Records Offline
                            </h2>
                            <p className="text-xs hashi-font text-[#c20000]/60 font-bold uppercase tracking-[0.4em] mt-4 shadow-sm border border-[#c20000]/10 px-6 py-2 bg-[#c20000]/5">
                                Secure storage encrypted
                            </p>
                        </div>
                    )}

                </div>
            </div>

            {/* Footer Input */}
            <div className="p-6 bg-white/20 backdrop-blur-3xl border-t border-[#c20000]/10">
                <div className="max-w-4xl mx-auto flex gap-4">
                    <div className="w-full relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={`Message #${activeChannel}`}
                            className="w-full bg-white/40 border border-[#c20000]/20 px-6 py-4 hashi-font font-bold text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:outline-none focus:ring-1 focus:ring-[#c20000]/20 shadow-[inset_0_0_15px_rgba(194,0,0,0.02)]"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-4 text-[#1a1a1a]/30">
                            <ImageIcon size={20} className="hover:text-[#c20000] cursor-pointer" />
                            <PlusCircle size={20} className="hover:text-[#c20000] cursor-pointer" />
                        </div>
                    </div>
                    <Button
                        onClick={handleSendMessage}
                        className="h-[58px] px-8 bg-[#c20000] text-white hover:bg-[#1a1a1a] rounded-none transition-all hashi-font font-black uppercase tracking-widest text-xs"
                    >
                        <Send size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

const ChevronDown = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m6 9 6 6 6-6" />
    </svg>
);
