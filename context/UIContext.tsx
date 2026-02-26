'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export type Soundtrack = {
    id: string;
    title: string;
    movie: string;
    composer: string;
    url: string;
};

export const CINEMATIC_TRACKS: Soundtrack[] = [
    { id: 'godfather', title: 'The Godfather Theme', movie: 'The Godfather', composer: 'Nino Rota', url: 'https://ia800304.us.archive.org/33/items/the-godfather-soundtrack-07-love-theme-from-the-godfather/The%20Godfather%20Soundtrack%2007-Love%20Theme%20from%20The%20Godfather.mp3' },
    { id: 'jamesbond', title: 'James Bond Theme', movie: 'Dr. No', composer: 'John Barry', url: 'https://archive.org/download/007-james-bond-theme/007%20James%20Bond%20Theme.mp3' },
    { id: 'starwars', title: 'Star Wars Main Theme', movie: 'Star Wars', composer: 'John Williams', url: 'https://ia903407.us.archive.org/8/items/star-wars-main-theme/Star_Wars_Main_Theme.mp3' },
    { id: 'batman', title: 'The Batman Theme', movie: 'Batman (1960s)', composer: 'Neal Hefti / Jan & Dean', url: 'https://ia801400.us.archive.org/8/items/tvtunes_15079/Batman%20-%201960s%20-%20Jan%20and%20Dean%20-%20A%20Vit-A-Min%20A%20Day.mp3' },
    { id: 'lujon', title: 'Lujon', movie: 'The Big Lebowski / Various', composer: 'Henry Mancini', url: '/audio/lujon.webm' }, // Local Fallback garantito scaricato senza CORS.
    { id: 'mission', title: 'Mission Impossible', movie: 'Mission Impossible', composer: 'Lalo Schifrin', url: 'https://ia801701.us.archive.org/10/items/04.-the-sniper-lalo-schifrin/01.%20Mission_%20Impossible%20-%20Lalo%20Schifrin.mp3' },
    { id: 'pulp', title: 'Misirlou', movie: 'Pulp Fiction', composer: 'Dick Dale', url: 'https://ia600805.us.archive.org/7/items/misirlou-pulp-fiction-theme-electric-guitar-cover-by-kfir-ochaion-fender-vintera-ii-jazzmaster/Misirlou%20-%20Pulp%20Fiction%20Theme%20-%20Electric%20Guitar%20Cover%20by%20Kfir%20Ochaion%20-%20Fender%20Vintera%20II%20Jazzmaster.mp3' }
];

export type Theme = 'boring' | 'comic' | 'japanese' | 'neon' | 'hashi';

type UIContextType = {
    theme: Theme;
    selectTheme: (t: Theme) => void;
    comicMode: boolean;
    japaneseMode: boolean;
    neonMode: boolean;
    hashiMode: boolean;
    // Audio Player State
    currentTrack: Soundtrack | null;
    isPlaying: boolean;
    playTrack: (track: Soundtrack) => void;
    togglePlayPause: () => void;
    playRandom: () => void;
    audioRef: React.RefObject<HTMLAudioElement | null>;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('hashi');
    const [currentTrack, setCurrentTrack] = useState<Soundtrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Force 'hashi' if it's the first time this version is loaded
        const hashiForced = localStorage.getItem('hashi_forced_v1');
        if (!hashiForced) {
            setTheme('hashi');
            localStorage.setItem('app_theme', 'hashi');
            localStorage.setItem('hashi_forced_v1', 'true');
            return;
        }

        const saved = localStorage.getItem('app_theme') as Theme;
        if (saved && ['boring', 'comic', 'japanese', 'neon', 'hashi'].includes(saved)) {
            setTheme(saved);
        } else {
            // Migrazione dal vecchio comicMode
            const oldSaved = localStorage.getItem('comicMode');
            if (oldSaved === 'true') {
                setTheme('comic');
                localStorage.setItem('app_theme', 'comic');
            }
        }
    }, []);

    const selectTheme = (t: Theme) => {
        localStorage.setItem('app_theme', t);
        setTheme(t);
    };

    const comicMode = theme === 'comic';
    const japaneseMode = theme === 'japanese';
    const neonMode = theme === 'neon';
    const hashiMode = theme === 'hashi';

    // --- Audio Logic ---
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.onended = () => {
                setIsPlaying(false);
                // Auto play next random on end?
                playRandom();
            };
            audioRef.current.onplay = () => setIsPlaying(true);
            audioRef.current.onpause = () => setIsPlaying(false);
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        }
    }, []);

    const playTrack = (track: Soundtrack) => {
        setCurrentTrack(track);
        if (audioRef.current) {
            if (audioRef.current.src !== track.url) {
                audioRef.current.src = track.url;
            }
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    };

    const togglePlayPause = () => {
        if (!currentTrack) {
            playRandom();
            return;
        }
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error(e));
            }
        }
    };

    const playRandom = () => {
        const available = CINEMATIC_TRACKS.filter(t => t.id !== currentTrack?.id);
        const randomTrack = available[Math.floor(Math.random() * available.length)];
        playTrack(randomTrack);
    };

    return (
        <UIContext.Provider value={{
            theme,
            selectTheme,
            comicMode,
            japaneseMode,
            neonMode,
            hashiMode,
            currentTrack,
            isPlaying,
            playTrack,
            togglePlayPause,
            playRandom,
            audioRef
        }}>
            <div className={`theme-wrapper ${theme}-theme`}>
                {children}
            </div>
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}

