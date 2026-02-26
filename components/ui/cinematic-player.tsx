'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, SkipForward, X, Clapperboard, Film } from 'lucide-react';
import { useUI, CINEMATIC_TRACKS } from '@/context/UIContext';

export function CinematicTrigger() {
    const [isOpen, setIsOpen] = useState(false);
    const { comicMode, currentTrack, isPlaying, togglePlayPause, playTrack, playRandom } = useUI();

    return (
        <>
            <Button
                onClick={() => {
                    // Se non sta suonando nulla, la prima volta che apre fa partire qualcosa a random?
                    // L'utente dice: "ogni volta che premo mi genera qualcosa di diverso". 
                    // Facciamo in modo che cliccando semplicemente parta una random, 
                    // ma se vuole scegliere può aprire il modal...
                    // "ogni volta che premo mi genera qualcosa di diverso cosi posso far vivere un esperienza... anche se tolgo con la x la finestra... piccolo player"
                    // Interpretazione: Il bottone Header "Cinematic" apre una libreria e magari fa autoplay, oppure c'è un Play Random primario.
                    // Assumeremo apre il modal The Vault of Soundtracks.
                    setIsOpen(true);
                }}
                className={`${comicMode ? 'bg-hero-blue text-white comic-border scale-95 rotate-1 hover:rotate-0' : 'bg-zinc-100 text-zinc-900 border border-zinc-200 hover:bg-zinc-200'} rounded-none px-4 py-2 font-black uppercase text-xs transition-all flex items-center gap-2`}
            >
                <Clapperboard size={14} /> SOUNDTRACKS
            </Button>

            {/* Modal della Libreria Musicale */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-md bg-white p-1 border-4 border-black ${comicMode ? 'shadow-[12px_12px_0px_#facc15]' : 'shadow-2xl'} relative animate-in zoom-in-95 duration-200`}>
                        <button onClick={() => setIsOpen(false)} className="absolute -top-4 -right-4 bg-black text-white p-2 border-4 border-white hover:bg-marvel-red transition-all z-10">
                            <X size={20} />
                        </button>

                        <div className="bg-black p-6 flex flex-col max-h-[70vh]">
                            <div className="flex justify-between items-center mb-6 border-b-2 border-white/20 pb-4">
                                <h2 className={`text-3xl font-black italic uppercase tracking-tighter ${comicMode ? 'text-comic-yellow marvel-font' : 'text-white'}`}>
                                    Cinematic Vault
                                </h2>
                                <Button onClick={() => playRandom()} className="bg-marvel-red hover:bg-red-700 text-white font-black uppercase text-xs p-2 h-auto rounded-none border border-white flex items-center gap-1">
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
                                                ? 'border-comic-yellow bg-zinc-900 shadow-[4px_4px_0px_#facc15]'
                                                : 'border-white/20 hover:border-white hover:bg-white hover:text-black text-zinc-300'}`}
                                    >
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Film size={12} className={currentTrack?.id === track.id ? 'text-comic-yellow' : 'text-zinc-500 group-hover:text-black'} />
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{track.movie}</p>
                                            </div>
                                            <p className={`text-xl font-bold italic ${currentTrack?.id === track.id ? 'text-white' : ''}`}>"{track.title}"</p>
                                            <p className="text-xs uppercase mt-1 opacity-60">by {track.composer}</p>
                                        </div>
                                        {currentTrack?.id === track.id && isPlaying && (
                                            <div className="flex gap-1 items-end h-6">
                                                <div className="w-1.5 bg-comic-yellow h-full animate-pulse" />
                                                <div className="w-1.5 bg-comic-yellow h-2/3 animate-pulse" style={{ animationDelay: '0.1s' }} />
                                                <div className="w-1.5 bg-comic-yellow h-5/6 animate-pulse" style={{ animationDelay: '0.2s' }} />
                                            </div>
                                        )}
                                        {currentTrack?.id === track.id && !isPlaying && (
                                            <Pause size={20} className="text-comic-yellow" />
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
    const { comicMode, currentTrack, isPlaying, togglePlayPause, playRandom } = useUI();

    if (!currentTrack) return null; // Non mostrare se non c'è nulla in coda

    return (
        <div className={`fixed bottom-6 right-6 z-[90] flex items-center gap-4 p-3 animate-in fade-in slide-in-from-bottom-5 duration-300
            ${comicMode
                ? 'bg-zinc-900 border-4 border-black text-white shadow-[8px_8px_0px_#facc15] rotate-[-1deg]'
                : 'bg-white border text-black border-zinc-200 rounded-full shadow-lg'}`}>

            <div className="flex items-center gap-3 px-2 max-w-[200px] overflow-hidden">
                <Music size={20} className={comicMode ? "text-comic-yellow animate-bounce" : "text-zinc-500"} />
                <div className="flex flex-col truncate">
                    <span className="text-sm font-black italic uppercase truncate leading-none">
                        {currentTrack.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase truncate">
                        {currentTrack.composer}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-1 border-l-2 border-zinc-700 pl-3">
                <button
                    onClick={togglePlayPause}
                    className="p-2 hover:bg-white/10 hover:text-comic-yellow rounded-full transition-colors"
                >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                </button>
                <button
                    onClick={playRandom}
                    className="p-2 hover:bg-white/10 hover:text-comic-yellow rounded-full transition-colors"
                >
                    <SkipForward size={18} fill="currentColor" />
                </button>
            </div>
        </div>
    );
}
