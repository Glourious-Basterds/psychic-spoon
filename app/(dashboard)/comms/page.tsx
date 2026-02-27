'use client';

import { useState } from 'react';
import {
    Send, Hash, User, Pin, ChevronRight, Compass, Skull,
    Video, Image as ImageIcon, Phone, MessageSquare,
    Settings, Bell, Search, PlusCircle, Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUI } from '@/context/UIContext';

type Tab = 'messages' | 'video' | 'photos' | 'calls';

// Mock Data
const MOCK_PROJECTS = [
    {
        id: 'bar-man',
        name: 'The Bar-man',
        status: 'Existential Crisis & Reinvention',
        channels: [
            { id: 'general', name: 'HOME BASE', isGroup: true },
            { id: 'intel', name: 'clandestine-intel', isGroup: true },
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
        ]
    }
];

const MOCK_MESSAGES: Record<string, any[]> = {
    'bar-man-general': [
        { id: 1, sender: 'Tony S.', content: "I'm done with the gadgets. From now on, the only thing I'm shaking is a martini. Bond-style, but smoother.", type: 'ally', time: '10:00' },
        { id: 2, sender: 'System', content: "REINVENTION PROTOCOL: Soul search in progress.", type: 'system', time: '10:05' },
    ],
    'space-balls-kitchen': [
        { id: 1, sender: 'Lord Helmet', content: "The spaghetti is cold! Do you know what we do to cold spaghetti in space?!", type: 'enemy', time: '12:01' },
        { id: 2, sender: 'Chef Lonestar', content: "The 4K Pasta Drive is at 100%. Quality is literally out of this world.", type: 'ally', time: '12:15', image: '/images/space_pasta_4k.jpg' }
    ]
};

export default function CommsPage() {
    const { hashiMode } = useUI();
    const [activeProject, setActiveProject] = useState(MOCK_PROJECTS[0].id);
    const [activeChannel, setActiveChannel] = useState('general');
    const [activeTab, setActiveTab] = useState<Tab>('messages');

    const currentProject = MOCK_PROJECTS.find(p => p.id === activeProject);
    const channelKey = `${activeProject}-${activeChannel}`;
    const messages = MOCK_MESSAGES[channelKey] || [];

    return (
        <div className="h-full flex flex-row overflow-hidden bg-white/50 backdrop-blur-3xl border-t border-[#c20000]/5">

            {/* 1. SEVER LIST (Discord style left strip) */}
            <div className="w-20 bg-[#1a1a1a] flex flex-col items-center py-4 gap-4 z-30">
                <div className="w-12 h-12 bg-[#c20000] rounded-2xl flex items-center justify-center text-white cursor-pointer hover:rounded-xl transition-all shadow-[0_0_15px_rgba(194,0,0,0.5)]">
                    <Layout size={24} />
                </div>
                <div className="w-8 h-[2px] bg-white/10 rounded-full" />
                {MOCK_PROJECTS.map(p => (
                    <div
                        key={p.id}
                        onClick={() => {
                            setActiveProject(p.id);
                            setActiveChannel('general');
                        }}
                        className={`w-12 h-12 flex items-center justify-center cursor-pointer transition-all hashi-font font-black text-xs border-2
                            ${activeProject === p.id
                                ? 'bg-white text-[#1a1a1a] rounded-xl border-[#c20000]'
                                : 'bg-[#2a2a2a] text-white/40 rounded-3xl hover:rounded-xl hover:bg-[#c20000] hover:text-white border-transparent'
                            }`}
                    >
                        {p.name.charAt(0).toUpperCase()}
                    </div>
                ))}
                <div className="mt-auto w-12 h-12 bg-[#2a2a2a] rounded-3full flex items-center justify-center text-[#c20000] cursor-pointer hover:bg-[#c20000] hover:text-white rounded-3xl transition-all">
                    <PlusCircle size={24} />
                </div>
            </div>

            {/* 2. CHANNEL LIST */}
            <div className="w-64 bg-white/40 border-r border-[#c20000]/10 flex flex-col z-20">
                <div className="p-4 border-b border-[#c20000]/10 flex justify-between items-center bg-white/20">
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
                                        ? 'bg-[#c20000]/5 text-[#c20000] border-[#c20000]'
                                        : 'text-[#1a1a1a]/60 border-transparent hover:bg-[#c20000]/5 hover:text-[#1a1a1a]'
                                    }`}
                            >
                                {c.isGroup ? <Hash size={14} className="opacity-40" /> : <User size={14} className="opacity-40" />}
                                <span className="text-sm">{c.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 space-y-2">
                        <div className="px-2 text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold mb-1">Voice & Video</div>
                        <div className="flex items-center gap-2 px-2 py-1.5 text-[#1a1a1a]/60 hover:bg-[#c20000]/5 cursor-pointer hashi-font font-bold text-sm">
                            <Phone size={14} className="opacity-40" />
                            <span>Voice Lounge</span>
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
                    <Settings size={14} className="text-[#1a1a1a]/40 cursor-pointer hover:text-[#c20000]" />
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

                    <div className="flex items-center gap-4 text-[#1a1a1a]/40">
                        <Bell size={18} className="cursor-pointer hover:text-[#c20000]" />
                        <Pin size={18} className="cursor-pointer hover:text-[#c20000]" />
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-black/5 rounded-none px-3 py-1 text-xs border border-transparent focus:border-[#c20000]/20 focus:outline-none w-40 hashi-font"
                            />
                            <Search size={14} className="absolute right-2 top-1.5" />
                        </div>
                    </div>
                </header>

                {/* Content based on tab */}
                <div className="flex-1 overflow-y-auto p-8 relative flex flex-col-reverse justify-end scrollbar-hide">
                    {activeTab === 'messages' && (
                        <div className="space-y-8 max-w-4xl mx-auto w-full">
                            {messages.map((msg) => (
                                <div key={msg.id} className="flex gap-4 group">
                                    <div className={`w-10 h-10 shrink-0 flex items-center justify-center font-black hashi-font text-xs border-2
                                        ${msg.type === 'enemy' ? 'bg-[#c20000] text-white border-[#1a1a1a]' : 'bg-[#1a1a1a] text-[#c20000] border-[#c20000]/20'}`}>
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
                                            <div className="mt-4 border-4 border-[#c20000]/10 shadow-[20px_20px_40px_rgba(0,0,0,0.05)] max-w-lg aspect-video overflow-hidden">
                                                <img src={msg.image} className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" alt="4K Asset" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
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

                    {activeTab !== 'messages' && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-20">
                            <div className="w-24 h-24 mb-6 text-[#c20000]/20">
                                {activeTab === 'video' ? <Video size={96} /> : activeTab === 'photos' ? <ImageIcon size={96} /> : <Phone size={96} />}
                            </div>
                            <h2 className="text-2xl font-black hashi-font text-[#1a1a1a] uppercase tracking-tighter">
                                {activeTab} Feed Offline
                            </h2>
                            <p className="text-xs hashi-font text-[#c20000]/60 font-bold uppercase tracking-[0.4em] mt-4 shadow-sm border border-[#c20000]/10 px-6 py-2 bg-[#c20000]/5">
                                Awaiting high-frequency sync link
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Input */}
                <div className="p-6 bg-white/20 backdrop-blur-3xl border-t border-[#c20000]/10">
                    <div className="max-w-4xl mx-auto flex gap-4">
                        <div className="w-full relative">
                            <input
                                type="text"
                                placeholder={`Message #${activeChannel}`}
                                className="w-full bg-white/40 cyber-border px-6 py-4 hashi-font font-bold text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:outline-none focus:ring-1 focus:ring-[#c20000]/20 shadow-[inset_0_0_15px_rgba(194,0,0,0.02)]"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-4 text-[#1a1a1a]/30">
                                <ImageIcon size={20} className="hover:text-[#c20000] cursor-pointer" />
                                <PlusCircle size={20} className="hover:text-[#c20000] cursor-pointer" />
                            </div>
                        </div>
                        <Button className="h-[58px] px-8 bg-[#c20000] text-white hover:bg-[#1a1a1a] rounded-none transition-all hashi-font font-black uppercase tracking-widest text-xs">
                            <Send size={18} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ChevronDown = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6" /></svg>
);
