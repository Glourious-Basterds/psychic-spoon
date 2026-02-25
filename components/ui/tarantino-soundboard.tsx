'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, X } from 'lucide-react';
import { useUI } from '@/context/UIContext';

const quotes = [
    { film: 'Pulp Fiction', text: "Say 'what' again. I dare you, I double dare you...", author: 'Jules Winnfield' },
    { film: 'Kill Bill', text: "Revenge is never a straight line. It's a forest...", author: 'Hattori Hanzo' },
    { film: 'Inglourious Basterds', text: "Each and every man under my command owes me one hundred Nazi scalps.", author: 'Lt. Aldo Raine' },
    { film: 'Django Unchained', text: "I like the way you die, boy.", author: 'Django' },
];

export function TarantinoSoundboard() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeQuote, setActiveQuote] = useState<typeof quotes[0] | null>(null);
    const { comicMode } = useUI();

    const playQuote = (quote: typeof quotes[0]) => {
        setActiveQuote(quote);
        const utterance = new window.SpeechSynthesisUtterance(quote.text);
        utterance.pitch = 0.8;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className={`${comicMode ? 'bg-black text-white comic-border scale-90 -rotate-2 hover:rotate-0' : 'bg-zinc-100 text-zinc-900 border border-zinc-200 hover:bg-zinc-200'} rounded-none px-4 py-2 font-black uppercase text-xs transition-all flex items-center gap-2`}
            >
                <Volume2 size={14} /> Tarantino Comms
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className={`w-full max-w-lg bg-white p-1 border-4 border-black ${comicMode ? 'shadow-[20px_20px_0px_#e62429]' : 'shadow-2xl'} relative animate-in zoom-in-95 duration-200`}>
                <button onClick={() => setIsOpen(false)} className="absolute -top-6 -right-6 bg-black text-white p-2 border-4 border-white hover:bg-marvel-red transition-all">
                    <X size={24} />
                </button>

                <div className="bg-black p-8">
                    <h2 className={`text-4xl font-black italic uppercase tracking-tighter mb-8 ${comicMode ? 'text-comic-yellow marvel-font' : 'text-white'}`}>
                        Quentin's Records
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        {quotes.map((q) => (
                            <button
                                key={q.text}
                                onClick={() => playQuote(q)}
                                className={`p-4 text-left border-2 border-white/20 hover:bg-white hover:text-black transition-all group ${activeQuote?.text === q.text ? 'bg-white text-black' : 'text-zinc-500'}`}
                            >
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">{q.film}</p>
                                <p className="text-sm font-bold italic">"{q.text}"</p>
                            </button>
                        ))}
                    </div>

                    {activeQuote && (
                        <div className="mt-8 pt-8 border-t border-white/10 text-center animate-in slide-in-from-bottom-5">
                            <p className="text-white text-xs font-black uppercase tracking-[0.3em]">Now Playing: {activeQuote.author}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
