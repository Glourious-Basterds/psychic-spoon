'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type UIContextType = {
    comicMode: boolean;
    toggleComicMode: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [comicMode, setComicMode] = useState(false);

    // Persistence (optional)
    useEffect(() => {
        const saved = localStorage.getItem('comicMode');
        if (saved === 'true') setComicMode(true);
    }, []);

    const toggleComicMode = () => {
        setComicMode((prev) => {
            const newVal = !prev;
            localStorage.setItem('comicMode', String(newVal));
            return newVal;
        });
    };

    return (
        <UIContext.Provider value={{ comicMode, toggleComicMode }}>
            <div className={comicMode ? 'comic-mode' : 'clean-mode'}>
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
