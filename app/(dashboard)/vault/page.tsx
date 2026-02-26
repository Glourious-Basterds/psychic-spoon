'use client';

import { Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUI } from '@/context/UIContext';

export default function VaultPage() {
    const { comicMode, japaneseMode, hashiMode } = useUI();

    return (
        <div className="p-6 md:p-12 min-h-screen">
            <header className="mb-20">
                {comicMode && <div className="onomatopoeia boom text-8xl opacity-10 pointer-events-none absolute -top-10 right-20 uppercase comic-font">Locked!</div>}
                <h1 className={`text-8xl font-black uppercase italic leading-[0.8] mb-6 ${comicMode ? 'comic-font drop-shadow-[8px_8px_0px_#e62429]' : japaneseMode ? 'japanese-font text-[#BE1E2D] not-italic tracking-[0.2em]' : hashiMode ? 'hashi-font text-[#d3ccc0] tracking-[0.1em] uppercase drop-shadow-[0_0_15px_rgba(138,3,3,0.8)]' : 'tracking-tighter'}`}>
                    {hashiMode ? 'Abyssal Archives' : 'IP Vault'}
                </h1>
                <p className={`max-w-xl font-bold uppercase text-xs ${japaneseMode ? 'japanese-font text-[#1A2639]/60 tracking-[0.4em] not-italic' : hashiMode ? 'hashi-font text-[#8a0303] font-bold tracking-[0.5em] border-l-2 border-[#8a0303] pl-3' : 'text-zinc-500 tracking-widest'}`}>
                    {hashiMode ? 'Sealed artifacts of ancient power' : 'Maximum security storage for all intellectual property assets across the multi-verse.'}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                <div className={`transition-all ${comicMode
                    ? 'bg-white p-1 border-4 border-black shadow-[12px_12px_0px_#000]'
                    : japaneseMode
                        ? 'bg-transparent border border-[#E0D8C8]'
                        : hashiMode
                            ? 'card border-[#8a0303]/20 hover:border-[#8a0303]/60 backdrop-blur-xl'
                            : 'bg-white border border-zinc-200 rounded-3xl overflow-hidden'
                    }`}>
                    <div className={`${comicMode || !japaneseMode && !hashiMode ? 'bg-black' : 'bg-transparent'} p-12 text-center flex flex-col items-center`}>
                        <Lock className={`${comicMode ? 'text-marvel-red' : hashiMode ? 'text-[#c20000]' : 'text-zinc-400'} h-24 w-24 mb-8`} />
                        <h3 className={`text-3xl mb-4 ${comicMode ? 'comic-font font-black uppercase italic' : japaneseMode ? 'japanese-font text-[#1A2639]' : hashiMode ? 'hashi-font font-black text-[#d3ccc0] tracking-widest uppercase' : 'font-bold'}`}>
                            {hashiMode ? 'Sacrificial Seal' : 'Total Lockdown'}
                        </h3>
                        <p className={`font-bold italic ${hashiMode ? 'hashi-font text-[#8a0303] not-italic' : 'text-zinc-400'}`}>{hashiMode ? 'Tread carefully. Only the branded may enter.' : 'No assets currently accessible by your rank.'}</p>
                    </div>
                </div>

                <div className={`transition-all ${comicMode
                    ? 'bg-white p-1 border-4 border-black shadow-[12px_12px_0px_#003399]'
                    : japaneseMode
                        ? 'bg-transparent border border-[#E0D8C8]'
                        : hashiMode
                            ? 'card border-[#8a0303]/30 hover:border-[#c20000]/60 backdrop-blur-xl'
                            : 'bg-white border border-zinc-200 rounded-3xl overflow-hidden'
                    }`}>
                    <div className={`${comicMode || !japaneseMode && !hashiMode ? 'bg-black' : 'bg-transparent'} p-12 text-center flex flex-col items-center`}>
                        <Shield className={`${comicMode ? 'text-comic-yellow' : hashiMode ? 'text-[#8a0303]' : 'text-zinc-400'} h-24 w-24 mb-8`} />
                        <h3 className={`text-3xl mb-4 ${comicMode ? 'comic-font font-black uppercase italic' : japaneseMode ? 'japanese-font text-[#1A2639]' : hashiMode ? 'hashi-font font-black text-[#d3ccc0] tracking-widest uppercase' : 'font-bold'}`}>
                            {hashiMode ? 'Dark Relics' : 'Guardian Intel'}
                        </h3>
                        <p className={`font-bold italic ${hashiMode ? 'hashi-font text-[#c20000]/80 not-italic' : 'text-zinc-400'}`}>{hashiMode ? 'Whispers of a cursed sword forged in blood.' : 'Reviewing security protocols for "The Bar-man" blueprints.'}</p>
                    </div>
                </div>
            </div>

            <div className="mt-20 flex justify-center">
                <div className={`onomatopoeia wham text-3xl ${hashiMode ? 'hashi-font text-[#8a0303]/30 tracking-[1em] font-black uppercase' : comicMode ? 'comic-font' : 'text-zinc-300'}`}>
                    {hashiMode ? 'BEYOND THE ECLIPSE' : 'Coming Soon!'}
                </div>
            </div>
        </div>
    );
}

