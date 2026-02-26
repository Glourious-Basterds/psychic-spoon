'use client';

import { Shield, Lock, FileKey, HardDrive } from 'lucide-react';
import { useUI } from '@/context/UIContext';

export default function VaultPage() {
    const { comicMode, japaneseMode, hashiMode } = useUI();

    return (
        <div className="p-6 md:p-12 min-h-screen">
            <header className="mb-20">
                {comicMode && <div className="onomatopoeia boom text-8xl opacity-10 pointer-events-none absolute -top-10 right-20 uppercase">Locked!</div>}
                <h1 className={`text-8xl font-black uppercase italic leading-[0.8] mb-6 ${comicMode ? 'marvel-font drop-shadow-[8px_8px_0px_#e62429]' : japaneseMode ? 'font-serif not-italic text-[#BE1E2D] tracking-[0.2em]' : hashiMode ? 'text-[#e2e2e7] tracking-[0.1em] neon-text uppercase' : 'tracking-tighter'}`}>
                    {hashiMode ? 'Deep Archive' : 'IP Vault'}
                </h1>
                <p className={`max-w-xl font-bold uppercase text-xs ${japaneseMode ? 'text-[#1A2639] tracking-[0.4em] font-serif not-italic' : hashiMode ? 'text-[#00f2ff]/60 tracking-[0.5em] border-l-2 border-[#00f2ff] pl-3' : 'text-zinc-500 tracking-widest'}`}>Maximum security storage for all intellectual property assets across the multi-verse.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                <div className={`transition-all ${comicMode
                    ? 'bg-white p-1 border-4 border-black shadow-[12px_12px_0px_#000]'
                    : japaneseMode
                        ? 'bg-transparent border border-[#E0D8C8]'
                        : hashiMode
                            ? 'card border-[#00f2ff]/10 backdrop-blur-xl'
                            : 'bg-white border border-zinc-200 rounded-3xl overflow-hidden'
                    }`}>
                    <div className={`${comicMode || !japaneseMode && !hashiMode ? 'bg-black' : 'bg-transparent'} p-12 text-center flex flex-col items-center`}>
                        <Lock className={`${comicMode ? 'text-marvel-red' : hashiMode ? 'text-[#9d00ff]' : 'text-zinc-400'} h-24 w-24 mb-8`} />
                        <h3 className={`text-3xl mb-4 ${comicMode ? 'font-black uppercase italic' : japaneseMode ? 'font-serif text-[#1A2639]' : hashiMode ? 'font-black text-[#e2e2e7] tracking-widest uppercase' : 'font-bold'}`}>
                            Total Lockdown
                        </h3>
                        <p className={`font-bold italic ${hashiMode ? 'text-[#e2e2e7]/20 not-italic' : 'text-zinc-400'}`}>No assets currently accessible by your rank.</p>
                    </div>
                </div>

                <div className={`transition-all ${comicMode
                    ? 'bg-white p-1 border-4 border-black shadow-[12px_12px_0px_#003399]'
                    : japaneseMode
                        ? 'bg-transparent border border-[#E0D8C8]'
                        : hashiMode
                            ? 'card border-[#00f2ff]/10 backdrop-blur-xl'
                            : 'bg-white border border-zinc-200 rounded-3xl overflow-hidden'
                    }`}>
                    <div className={`${comicMode || !japaneseMode && !hashiMode ? 'bg-black' : 'bg-transparent'} p-12 text-center flex flex-col items-center`}>
                        <Shield className={`${comicMode ? 'text-comic-yellow' : hashiMode ? 'text-[#00f2ff]' : 'text-zinc-400'} h-24 w-24 mb-8`} />
                        <h3 className={`text-3xl mb-4 ${comicMode ? 'font-black uppercase italic' : japaneseMode ? 'font-serif text-[#1A2639]' : hashiMode ? 'font-black text-[#e2e2e7] tracking-widest uppercase' : 'font-bold'}`}>
                            Guardian Intel
                        </h3>
                        <p className={`font-bold italic ${hashiMode ? 'text-[#e2e2e7]/20 not-italic' : 'text-zinc-400'}`}>Reviewing security protocols for "The Bar-man" blueprints.</p>
                    </div>
                </div>
            </div>

            <div className="mt-20 flex justify-center">
                <div className={`onomatopoeia wham text-3xl ${hashiMode ? 'text-[#00f2ff]/20 tracking-[1em] font-black uppercase' : comicMode ? '' : 'text-zinc-300'}`}>
                    {hashiMode ? 'INCOMING ACCESS' : 'Coming Soon!'}
                </div>
            </div>
        </div>
    );
}

