'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, SkipForward, X, Clapperboard, Film } from 'lucide-react';
import { useUI, CINEMATIC_TRACKS } from '@/context/UIContext';

export function CinematicTrigger() {
    const [isOpen, setIsOpen] = useState(false);
    const { currentTrack, isPlaying, togglePlayPause, playTrack, playRandom } = useUI();

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="hashi-font cyber-border bg-[#c20000]/5 text-[#c20000] border-[#c20000]/20 hover:bg-[#c20000]/10 hover:text-[#1a1a1a] shadow-[inset_0_0_10px_rgba(255,255,255,0.5)] font-bold tracking-[0.1em] rounded-none px-4 py-2 uppercase text-xs transition-all flex items-center gap-2"
            >
                <Clapperboard size={14} strokeWidth={1.5} /> SOUNDTRACKS
            </Button>

            {/* Modal della Libreria Musicale */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md p-1 relative animate-in zoom-in-95 duration-200 card border-[#c20000]/20 shadow-2xl overflow-hidden">
                        <button onClick={() => setIsOpen(false)} className="absolute -top-4 -right-4 p-2 border-4 transition-all z-10 bg-[#fafafa] text-[#c20000] border-[#c20000]/20 hover:text-[#1a1a1a]">
                            <X size={20} />
                        </button>

                        <div className="bg-white/40 p-6 backdrop-blur-xl flex flex-col max-h-[70vh]">
                            <div className="flex justify-between items-center mb-6 border-b-2 pb-4 border-[#c20000]/10">
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-[#c20000] hashi-font">
                                    RELIQUARY
                                </h2>
                                <Button onClick={() => playRandom()} className="font-black uppercase text-xs p-2 h-auto rounded-none border flex items-center gap-1 bg-[#c20000]/5 text-[#c20000] border-[#c20000]/20 hover:bg-[#c20000]/10 hashi-font">
                                    <SkipForward size={14} /> Mix
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-4 space-y-4">
                                {CINEMATIC_TRACKS.map((track) => (
                                    <button
                                        key={track.id}
                                        onClick={() => playTrack(track)}
                                        className={`w-full p-4 text-left border-2 transition-all flex items-center justify-between group 
                                            ${currentTrack?.id === track.id
                                                ? 'border-[#c20000]/40 bg-[#c20000]/5 shadow-[inset_0_0_20px_rgba(194,0,0,0.05)] text-[#1a1a1a]'
                                                : 'border-[#c20000]/5 hover:border-[#c20000]/20 hover:bg-white text-[#1a1a1a]/60 hover:text-[#c20000]'}`}
                                    >
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Film size={12} className={currentTrack?.id === track.id ? 'text-[#c20000]' : 'text-[#1a1a1a]/30 group-hover:text-[#c20000]'} />
                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 hashi-font">{track.movie}</p>
                                            </div>
                                            <p className={`text-xl font-bold italic hashi-font not-italic ${currentTrack?.id === track.id ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/70'}`}>"{track.title}"</p>
                                            <p className="text-xs uppercase mt-1 opacity-60 hashi-font">by {track.composer}</p>
                                        </div>
                                        {currentTrack?.id === track.id && isPlaying && (
                                            <div className="flex gap-1 items-end h-6">
                                                <div className="w-1.5 h-full animate-pulse bg-[#c20000]" />
                                                <div className="w-1.5 h-2/3 animate-pulse bg-[#c20000]" style={{ animationDelay: '0.1s' }} />
                                                <div className="w-1.5 h-5/6 animate-pulse bg-[#c20000]" style={{ animationDelay: '0.2s' }} />
                                            </div>
                                        )}
                                        {currentTrack?.id === track.id && !isPlaying && (
                                            <Pause size={20} className="text-[#c20000]" />
                                        )}
                                        {currentTrack?.id !== track.id && (
                                            <Play size={20} className="opacity-0 group-hover:opacity-100" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Persistent Mini Player placed in layout bottom right
export function GlobalMiniPlayer() {
    const { currentTrack, isPlaying, togglePlayPause, playRandom } = useUI();

    if (!currentTrack) return null; // Non mostrare se non c'è nulla in coda

    return (
        <div className="fixed bottom-6 right-6 z-[90] flex items-center gap-4 p-3 animate-in fade-in slide-in-from-bottom-5 duration-300 card border-[#c20000]/20 bg-white shadow-2xl scale-100">

            <div className="flex items-center gap-3 px-2 max-w-[200px] overflow-hidden">
                <Music size={20} className="text-[#c20000] animate-pulse" />
                <div className="flex flex-col truncate">
                    <span className="text-sm font-bold truncate leading-none hashi-font text-[#1a1a1a]">
                        {currentTrack.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase truncate hashi-font opacity-60">
                        {currentTrack.composer}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-1 border-l-2 pl-3 border-[#c20000]/10">
                <button
                    onClick={togglePlayPause}
                    className="p-2 rounded-full transition-colors hover:bg-[#c20000]/5 text-[#c20000]"
                >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                </button>
                <button
                    onClick={playRandom}
                    className="p-2 rounded-full transition-colors hover:bg-[#c20000]/5 text-[#c20000]"
                >
                    <SkipForward size={18} fill="currentColor" />
                </button>
            </div>
        </div>
    );
}
