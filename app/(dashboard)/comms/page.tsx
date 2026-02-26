'use client';

import { useState } from 'react';
import { Send, Terminal, Zap, Shield, Sparkles, Hash, User, Pin, ChevronRight, Compass, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUI } from '@/context/UIContext';

// Mock Data Strutturato per Progetti e Canali
const MOCK_PROJECTS = [
    {
        id: 'bar-man',
        name: 'The Bar-man',
        channels: [
            { id: 'group', name: 'Celestial Hub', isGroup: true },
            { id: 'user-tony', name: 'Tony S.', isGroup: false },
            { id: 'user-bruce', name: 'Bruce W.', isGroup: false },
        ]
    },
    {
        id: 'space-balls',
        name: 'Space-balls',
        channels: [
            { id: 'group', name: 'Infinite Bridge', isGroup: true },
            { id: 'user-helmet', name: 'Lord Helmet', isGroup: false },
            { id: 'user-skroob', name: 'President Skroob', isGroup: false },
        ]
    }
];

const MOCK_MESSAGES: Record<string, any[]> = {
    'bar-man-group': [
        { id: 1, sender: 'Tony S.', content: "The new carbon-fiber shaker is ready for field testing. Don't shake it too hard, it might explode.", type: 'ally', time: '10:00' },
        { id: 2, sender: 'System', content: "INTEGRITY ALERT: Martini pressure critical.", type: 'system', time: '10:05' },
        { id: 3, sender: 'Bruce W.', content: "Training simulation successful. Bond approves.", type: 'ally', time: '10:10', image: '/images/barman_james_bond.png' }
    ],
    'bar-man-user-tony': [
        { id: 1, sender: 'Tony S.', content: "I need the blueprints for the olive dispenser ASAP.", type: 'ally', time: '09:30' },
    ],
    'bar-man-user-bruce': [
        { id: 1, sender: 'Bruce W.', content: "Does it come in black?", type: 'ally', time: '11:00' },
    ],
    'space-balls-group': [
        { id: 1, sender: 'Lord Helmet', content: "The merchandising strategy is ludicrous! We need more flamethrowers.", type: 'enemy', time: '12:01' },
        { id: 2, sender: 'President Skroob', content: "Did you see anything? No sir, I didn't see you playing with your dolls again.", type: 'enemy', time: '12:05' },
        { id: 3, sender: 'Chef Lonestar', content: "Pasta drive activated! We're jumping to Ludicrous Speed!", type: 'ally', time: '12:15', image: '/images/space_balls_spaghetti.png' }
    ],
    'space-balls-user-helmet': [
        { id: 1, sender: 'Lord Helmet', content: "Prepare the ship for ludicrous speed! Fasten all seatbelts, seal all entrances and exits!", type: 'enemy', time: '13:00' },
    ],
    'space-balls-user-skroob': [
        { id: 1, sender: 'President Skroob', content: "Why didn't somebody tell me my ass was so big?!", type: 'enemy', time: '14:20' },
    ]
};

export default function CommsPage() {
    const { comicMode, japaneseMode, hashiMode } = useUI();

    // Stato per la navigazione
    const [activeProject, setActiveProject] = useState(MOCK_PROJECTS[0].id);
    const [activeChannel, setActiveChannel] = useState('group'); // Di default seleziona il gruppo pinnato

    const currentProject = MOCK_PROJECTS.find(p => p.id === activeProject);
    const channelKey = `${activeProject}-${activeChannel}`;
    const messages = MOCK_MESSAGES[channelKey] || [];

    return (
        <div className="h-full flex flex-col p-6 md:p-12">
            <header className={`mb-12 flex justify-between items-end pb-8 relative ${comicMode ? 'border-b-8 border-black' : japaneseMode ? 'border-b border-[#E0D8C8]' : hashiMode ? 'border-b border-[#00f2ff]/10' : 'border-b border-zinc-200'}`}>
                {comicMode && <div className="onomatopoeia wham absolute -top-10 right-20 text-8xl opacity-30 select-none">Wham!</div>}
                <div>
                    <div className={`inline-block px-4 py-1 uppercase text-xs mb-4 ${comicMode ? 'font-black italic bg-marvel-red text-white skew-x-[-10deg]' : japaneseMode ? 'font-serif tracking-[0.3em] text-[#1A2639]/40 bg-transparent' : hashiMode ? 'font-black tracking-[0.4em] text-[#00f2ff]/60 border-l-2 border-[#00f2ff] pl-3' : 'font-black bg-zinc-100 text-zinc-500'}`}>
                        {hashiMode ? 'SECURE FREQUENCY: 144.92 MHz' : 'Frequency: 144.92 MHz'}
                    </div>
                    <h1 className={`leading-none ${comicMode ? 'text-6xl md:text-8xl font-black uppercase italic tracking-tighter marvel-font drop-shadow-[8px_8px_0px_rgba(0,0,153,0.1)]' : japaneseMode ? 'text-5xl font-serif text-[#1A2639] tracking-[0.05em]' : hashiMode ? 'text-6xl md:text-8xl font-black uppercase tracking-[0.05em] text-[#e2e2e7] neon-text' : 'text-6xl md:text-8xl font-black uppercase italic tracking-tighter'}`}>
                        {hashiMode ? 'Shadow Comms' : comicMode ? 'The War Room' : 'Team Channels'}
                    </h1>
                </div>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden max-h-[70vh]">

                {/* 1. Sidebar dei Progetti e Canali */}
                <div className={`w-full lg:w-80 flex flex-col overflow-y-auto ${comicMode
                    ? 'bg-zinc-100 border-4 border-black shadow-[8px_8px_0px_#000]'
                    : japaneseMode
                        ? 'bg-[#FAF8F5]/80 backdrop-blur-sm border border-[#E0D8C8]'
                        : hashiMode
                            ? 'bg-[#050508]/60 backdrop-blur-xl border border-[#00f2ff]/10'
                            : 'bg-white border border-zinc-200 rounded-3xl shadow-sm'
                    }`}>
                    <div className={`p-6 ${comicMode ? 'bg-black text-white' : japaneseMode ? 'bg-[#1A2639] text-[#FDFBF7]' : hashiMode ? 'bg-[#9d00ff]/10 text-[#9d00ff]' : 'bg-zinc-900 text-white'}`}>
                        <h2 className={`text-2xl ${comicMode ? 'font-black uppercase italic' : japaneseMode ? 'font-serif tracking-[0.2em]' : hashiMode ? 'font-black tracking-[0.1em] uppercase' : 'font-bold'}`}>
                            Directives
                        </h2>
                    </div>

                    <div className="p-4 space-y-6">
                        {MOCK_PROJECTS.map(project => (
                            <div key={project.id} className="space-y-2">
                                {/* Header Progetto */}
                                <button
                                    onClick={() => {
                                        setActiveProject(project.id);
                                        setActiveChannel('group');
                                    }}
                                    className={`w-full text-left font-black uppercase italic text-lg pb-1 border-b-2 flex items-center justify-between transition-colors
                                        ${activeProject === project.id
                                            ? (hashiMode ? 'text-[#e2e2e7] border-[#ffcc33] border-b-4' : 'text-black border-black border-b-4')
                                            : (hashiMode ? 'text-[#e2e2e7]/20 border-[#e2e2e7]/10 hover:text-[#e2e2e7]' : 'text-zinc-400 border-zinc-200 hover:text-black')}`}
                                >
                                    {project.name}
                                    {activeProject === project.id && <ChevronRight className="h-5 w-5" />}
                                </button>

                                {/* Canali del Progetto (Visibili solo se il progetto è attivo) */}
                                {activeProject === project.id && (
                                    <div className="flex flex-col gap-1 pl-2">
                                        {/* Gruppo Pinnato */}
                                        {project.channels.filter(c => c.isGroup).map(channel => (
                                            <button
                                                key={channel.id}
                                                onClick={() => setActiveChannel(channel.id)}
                                                className={`w-full text-left px-3 py-2 flex items-center gap-2 font-bold transition-all border-2
                                                    ${activeChannel === channel.id
                                                        ? (hashiMode ? 'bg-[#00f2ff]/10 text-[#00f2ff] border-[#00f2ff]/30 shadow-[0_0_15px_rgba(0,242,255,0.1)]' : 'bg-marvel-red text-white border-black shadow-[4px_4px_0px_#000] skew-x-[-2deg]')
                                                        : (hashiMode ? 'bg-transparent text-[#e2e2e7]/40 border-transparent hover:text-[#e2e2e7]' : 'bg-white text-black border-transparent hover:border-black hover:bg-zinc-50')}`}
                                            >
                                                <Pin className="h-4 w-4 shrink-0" />
                                                <span className="truncate">{channel.name}</span>
                                            </button>
                                        ))}

                                        {/* Divider invisibile per spaziature */}
                                        <div className="h-2 w-full" />

                                        {/* Chat Individuali (1:1) */}
                                        {project.channels.filter(c => !c.isGroup).map(channel => (
                                            <button
                                                key={channel.id}
                                                onClick={() => setActiveChannel(channel.id)}
                                                className={`w-full text-left px-3 py-2 flex items-center gap-2 font-bold transition-all border-2
                                                    ${activeChannel === channel.id
                                                        ? (hashiMode ? 'bg-[#9d00ff]/10 text-[#9d00ff] border-[#9d00ff]/30 shadow-[0_0_15px_rgba(157,0,255,0.1)]' : 'bg-hero-blue text-white border-black shadow-[4px_4px_0px_#000] skew-x-[-2deg]')
                                                        : (hashiMode ? 'bg-transparent text-[#e2e2e7]/40 border-transparent hover:text-[#e2e2e7]' : 'bg-white text-zinc-600 border-transparent hover:border-black hover:bg-zinc-50')}`}
                                            >
                                                <User className="h-4 w-4 shrink-0" />
                                                <span className="truncate">{channel.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>


                {/* 2. Main Chat Area */}
                <div className={`flex-1 flex flex-col relative overflow-hidden ${comicMode
                    ? 'bg-white border-4 border-black shadow-[16px_16px_0px_#000]'
                    : japaneseMode
                        ? 'bg-[#FDFBF7]/90 backdrop-blur-sm border border-[#E0D8C8]'
                        : hashiMode
                            ? 'bg-[#050508]/40 backdrop-blur-md border border-[#00f2ff]/10'
                            : 'bg-white border border-zinc-200 rounded-3xl shadow-sm'
                    }`}>
                    {comicMode && <div className="absolute inset-0 comic-page-bg opacity-40 z-0 pointer-events-none" />}

                    {/* Chat Header interno */}
                    <div className={`p-4 z-10 flex items-center gap-3 ${comicMode ? 'border-b-4 border-black bg-white' : japaneseMode ? 'border-b border-[#E0D8C8] bg-transparent' : hashiMode ? 'border-b border-[#00f2ff]/10 bg-transparent' : 'border-b border-zinc-200 bg-white'}`}>
                        <div className={`p-2 ${comicMode ? 'bg-marvel-red text-white border-2 border-black rotate-3' : japaneseMode ? 'text-[#BE1E2D]' : hashiMode ? 'text-[#00f2ff] drop-shadow-[0_0_8px_rgba(0,242,255,0.4)]' : 'bg-zinc-100 text-zinc-600 rounded-lg'}`}>
                            {currentProject?.channels.find(c => c.id === activeChannel)?.isGroup ? <Hash className="h-6 w-6" strokeWidth={japaneseMode || hashiMode ? 1.5 : 2} /> : <User className="h-6 w-6" strokeWidth={japaneseMode || hashiMode ? 1.5 : 2} />}
                        </div>
                        <h3 className={`text-2xl ${comicMode ? 'font-black uppercase italic' : japaneseMode ? 'font-serif text-[#1A2639] tracking-[0.1em]' : hashiMode ? 'font-black text-[#e2e2e7] tracking-[0.2em] neon-text uppercase' : 'font-bold'}`}>
                            {currentProject?.channels.find(c => c.id === activeChannel)?.name}
                        </h3>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-8 space-y-12 overflow-y-auto relative z-10 scrollbar-hide">
                        {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center">
                                <span className={`font-black italic uppercase text-2xl ${hashiMode ? 'text-[#ffcc33]/10' : 'text-zinc-300'}`}>The resonance is quiet... but alive.</span>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col ${msg.type === 'enemy' ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-3 mb-2 px-2">
                                        <span className={`text-xs font-black uppercase tracking-widest ${hashiMode
                                            ? (msg.type === 'enemy' ? 'text-[#9d00ff]' : msg.type === 'ally' ? 'text-[#00f2ff]' : 'text-[#e2e2e7]/30')
                                            : (msg.type === 'enemy' ? 'text-marvel-red' : msg.type === 'ally' ? 'text-hero-blue' : 'text-zinc-400')
                                            }`}>
                                            {msg.sender}
                                        </span>
                                        <span className={`text-[10px] font-bold ${hashiMode ? 'text-[#e2e2e7]/20' : 'text-zinc-400'}`}>{msg.time}</span>
                                    </div>

                                    <div className={`${comicMode
                                        ? `speech-bubble max-w-md ${msg.type === 'enemy' ? 'bg-zinc-100 rotate-1' : 'rotate-[-1deg]'} shadow-[8px_8px_0px_#000] scale-100 transition-transform hover:scale-105`
                                        : japaneseMode
                                            ? `max-w-md p-4 border-l-2 ${msg.type === 'enemy' ? 'border-l-[#1A2639] bg-[#FAF8F5]' : msg.type === 'system' ? 'border-l-[#E0D8C8] bg-transparent' : 'border-l-[#BE1E2D] bg-[#FDFBF7]'}`
                                            : hashiMode
                                                ? `max-w-md p-5 border ${msg.type === 'enemy' ? 'bg-[#9d00ff]/5 border-[#9d00ff]/20 text-[#e2e2e7]/80' : msg.type === 'system' ? 'bg-transparent border-[#e2e2e7]/10 text-[#e2e2e7]/30 text-center italic' : 'bg-[#00f2ff]/5 border-[#00f2ff]/20 text-[#e2e2e7]/80'}`
                                                : `max-w-md p-4 rounded-2xl ${msg.type === 'enemy' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-black'}`
                                        }`}>
                                        <div className="flex gap-4">
                                            {msg.type === 'enemy' && (hashiMode ? <Compass className="text-[#ffcc33] h-6 w-6 shrink-0 mt-1" /> : <Skull className={`${comicMode ? 'text-marvel-red' : 'text-white'} h-6 w-6 shrink-0 mt-1`} />)}
                                            {msg.type === 'ally' && <Sparkles className={`${hashiMode ? 'text-[#00f2ff]' : 'text-comic-yellow'} h-6 w-6 shrink-0 mt-1`} />}
                                            {msg.type === 'system' && <Terminal className={`${hashiMode ? 'text-[#e2e2e7]/30' : 'text-hero-blue'} h-6 w-6 shrink-0 mt-1`} />}
                                            <div className="flex flex-col gap-4">
                                                <p className={`text-xl leading-tight ${japaneseMode ? 'font-serif not-italic text-[#1A2639]' : hashiMode ? 'font-medium tracking-wide text-[#e2e2e7]/90' : 'font-bold italic'}`}>{msg.content}</p>
                                                {msg.image && (
                                                    <div className={`${hashiMode ? 'border border-[#00f2ff]/20' : 'border-4 border-black'} bg-white overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] -ml-2 -rotate-1 hover:rotate-0 transition-transform w-[280px]`}>
                                                        <img src={msg.image} alt="Transmission" className="w-full h-auto object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input Area */}
                    <div className={`p-6 relative z-10 border-t ${comicMode ? 'bg-zinc-100 border-black border-t-4' : japaneseMode ? 'bg-[#FAF8F5] border-[#E0D8C8]' : hashiMode ? 'bg-[#050508]/60 border-[#00f2ff]/10 backdrop-blur-xl' : 'bg-zinc-50 border-zinc-200'}`}>
                        <div className="flex gap-4 items-center">
                            <input
                                type="text"
                                placeholder={hashiMode ? `RESONATE WITH ${currentProject?.channels.find(c => c.id === activeChannel)?.name.toUpperCase()}...` : `BROADCAST INTEL TO ${currentProject?.channels.find(c => c.id === activeChannel)?.name.toUpperCase()}...`}
                                className={`flex-1 px-6 py-4 focus:outline-none focus:ring-2 ${comicMode
                                    ? 'bg-white border-4 border-black font-black italic uppercase tracking-widest placeholder:text-zinc-400 focus:ring-comic-yellow/30'
                                    : japaneseMode
                                        ? 'bg-transparent border-b border-[#1A2639]/30 font-serif text-[#1A2639] placeholder:text-[#1A2639]/30 focus:ring-[#BE1E2D]/20 focus:border-[#BE1E2D]'
                                        : hashiMode
                                            ? 'bg-[#00f2ff]/5 border border-[#00f2ff]/20 font-black text-[#00f2ff] placeholder:text-[#00f2ff]/20 focus:ring-[#00f2ff]/10 tracking-[0.2em] text-xs'
                                            : 'bg-white border border-zinc-200 rounded-full font-medium placeholder:text-zinc-400 focus:ring-zinc-200'
                                    }`}
                            />
                            <Button className={comicMode
                                ? "bg-marvel-red text-white font-black italic uppercase border-4 border-black px-10 h-16 rounded-none shadow-[6px_6px_0px_rgba(0,0,0,0.2)] text-2xl hover:bg-red-700 hover:shadow-none hover:translate-y-1 transition-all"
                                : japaneseMode
                                    ? "bg-[#BE1E2D] text-white border-none rounded-none hover:bg-[#1A2639] h-12 px-6 font-serif tracking-[0.2em] transition-colors"
                                    : hashiMode
                                        ? "bg-[#00f2ff] text-[#050508] border-none rounded-none hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] h-14 px-8 font-black tracking-[0.2em] text-xs transition-all"
                                        : "rounded-full h-16 px-10"}>
                                SEND <Send size={japaneseMode || hashiMode ? 16 : 24} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}


