'use client';

import { useState } from 'react';
import { Send, Terminal, Zap, Shield, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUI } from '@/context/UIContext';

export default function CommsPage() {
    const { comicMode } = useUI();
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Lord Helmet', content: "The merchandising strategy for 'Space-balls' is ludicrous! We need more flamethrowers.", type: 'enemy', time: '12:01' },
        { id: 2, sender: 'Tony S.', content: "Don't worry, the new suit for Bar-man has a built-in martini dispenser. Tactical brilliance.", type: 'ally', time: '12:05' },
        { id: 3, sender: 'System', content: "INTEGRITY ALERT: Multi-verse leakage detected in Segment B.", type: 'system', time: '12:10' },
    ]);

    return (
        <div className="h-full flex flex-col p-6 md:p-12">
            <header className={`mb-12 flex justify-between items-end border-b-8 border-black pb-8 relative ${comicMode ? '' : 'border-b border-zinc-200'}`}>
                {comicMode && <div className="onomatopoeia wham absolute -top-10 right-20 text-8xl opacity-30 select-none">Wham!</div>}
                <div>
                    <div className={`inline-block px-4 py-1 font-black italic uppercase text-xs mb-4 ${comicMode ? 'bg-marvel-red text-white skew-x-[-10deg]' : 'bg-zinc-100 text-zinc-500'}`}>
                        Frequency: 144.92 MHz
                    </div>
                    <h1 className={`text-8xl font-black uppercase italic tracking-tighter leading-none ${comicMode ? 'marvel-font drop-shadow-[8px_8px_0px_rgba(0,0,153,0.1)]' : 'tracking-tight'}`}>
                        {comicMode ? 'The War Room' : 'Team Channels'}
                    </h1>
                </div>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row gap-12 overflow-hidden">
                {/* Chat Area */}
                <div className={`flex-[3] flex flex-col relative overflow-hidden ${comicMode
                        ? 'bg-white border-4 border-black shadow-[16px_16px_0px_#000]'
                        : 'bg-white border border-zinc-200 rounded-3xl shadow-sm'
                    }`}>
                    {comicMode && <div className="absolute inset-0 comic-page-bg opacity-40 z-0 pointer-events-none" />}

                    <div className="flex-1 p-8 space-y-12 overflow-y-auto relative z-10">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.type === 'enemy' ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-3 mb-2 px-2">
                                    <span className={`text-xs font-black uppercase tracking-widest ${msg.type === 'enemy' ? 'text-marvel-red' : msg.type === 'ally' ? 'text-hero-blue' : 'text-zinc-400'
                                        }`}>
                                        {msg.sender}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 font-bold">{msg.time}</span>
                                </div>

                                <div className={`${comicMode
                                        ? `speech-bubble max-w-md ${msg.type === 'enemy' ? 'bg-zinc-100 rotate-1' : 'rotate-[-1deg]'} shadow-[8px_8px_0px_#000] scale-100 transition-transform hover:scale-105`
                                        : `max-w-md p-4 rounded-2xl ${msg.type === 'enemy' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-black'}`
                                    }`}>
                                    <div className="flex gap-4">
                                        {msg.type === 'enemy' && <Skull className={`${comicMode ? 'text-marvel-red' : 'text-white'} h-6 w-6 shrink-0`} />}
                                        {msg.type === 'ally' && <Zap className="text-comic-yellow h-6 w-6 shrink-0" />}
                                        {msg.type === 'system' && <Terminal className="text-hero-blue h-6 w-6 shrink-0" />}
                                        <p className="text-xl leading-tight font-bold italic">{msg.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={`p-8 bg-zinc-100 border-t-4 border-black relative z-10 ${comicMode ? '' : 'border-t border-zinc-200'}`}>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="BROADCAST INTEL..."
                                className={`flex-1 px-6 py-4 font-black italic uppercase tracking-widest placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-comic-yellow/30 ${comicMode ? 'bg-white border-4 border-black' : 'bg-white border border-zinc-200 rounded-full'
                                    }`}
                            />
                            <Button className={comicMode
                                ? "bg-marvel-red text-white font-black italic uppercase border-4 border-black px-10 h-16 rounded-none shadow-[6px_6px_0px_rgba(0,0,0,0.2)] text-2xl"
                                : "rounded-full h-16 px-10"}>
                                SEND <Send size={24} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="flex-1 flex flex-col gap-12">
                    <div className={`p-8 border-4 border-black transition-all ${comicMode
                            ? 'bg-comic-yellow shadow-[8px_8px_0px_#000] rotate-2'
                            : 'bg-zinc-900 text-white border-none rounded-3xl shadow-sm'
                        }`}>
                        <h3 className={`text-3xl font-black uppercase italic mb-6 border-b-4 ${comicMode ? 'border-black' : 'border-zinc-800'} inline-block`}>Status</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm font-black italic border-b-2 border-black/10 pb-2">
                                <Shield className="text-hero-blue" /> SHIELD: ACTIVE
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
