'use client';

import { Shield, Lock, FileKey, HardDrive } from 'lucide-react';

export default function VaultPage() {
    return (
        <div className="p-6 md:p-12 min-h-screen ben-day-dots-red">
            <header className="mb-20">
                <div className="onomatopoeia boom text-8xl opacity-10 pointer-events-none absolute -top-10 right-20 uppercase">Locked!</div>
                <h1 className="text-8xl font-black uppercase italic marvel-font leading-[0.8] mb-6 drop-shadow-[8px_8px_0px_#e62429]">IP Vault</h1>
                <p className="text-zinc-500 max-w-xl font-bold tracking-widest uppercase text-xs">Maximum security storage for all intellectual property assets across the multi-verse.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                <div className="bg-white p-1 border-4 border-black shadow-[12px_12px_0px_#000]">
                    <div className="bg-black p-12 text-center flex flex-col items-center">
                        <Lock className="text-marvel-red h-24 w-24 mb-8" />
                        <h3 className="text-3xl font-black uppercase italic mb-4">Total Lockdown</h3>
                        <p className="text-zinc-400 font-bold italic">No assets currently accessible by your rank.</p>
                    </div>
                </div>

                <div className="bg-white p-1 border-4 border-black shadow-[12px_12px_0px_#003399]">
                    <div className="bg-black p-12 text-center flex flex-col items-center">
                        <Shield className="text-comic-yellow h-24 w-24 mb-8" />
                        <h3 className="text-3xl font-black uppercase italic mb-4">Guardian Intel</h3>
                        <p className="text-zinc-400 font-bold italic">Reviewing security protocols for "The Bar-man" blueprints.</p>
                    </div>
                </div>
            </div>

            <div className="mt-20 flex justify-center">
                <div className="onomatopoeia wham text-3xl">Coming Soon!</div>
            </div>
        </div>
    );
}
