'use client';

import React, { useState } from 'react';
import { X, ChevronRight, Camera, Check, Users, Target, Rocket } from 'lucide-react';
import { useProjects } from '@/app/context/ProjectContext';

const SKILLS = ['Editing', 'Sound Design', '3D Animation', 'Writing', 'Directing', 'Composing', 'VFX', 'Acting', 'Cinematography', 'UI/UX'];
const ROLE_CATEGORIES = ['Film', 'Animazione', 'Fumetto', 'Videogioco', 'Musica', 'Serie TV', 'Podcast', 'Altro'];

interface OnboardingModalProps {
    onComplete: () => void;
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
    const { userProfile, updateProfile } = useProjects();
    const [step, setStep] = useState(1);
    
    // Form state
    const [name, setName] = useState(userProfile.name || '');
    const [role, setRole] = useState(userProfile.role || '');
    const [photo, setPhoto] = useState<string | null>(userProfile.photo || null);
    const [selectedSkills, setSelectedSkills] = useState<string[]>(userProfile.skills || []);
    const [bio, setBio] = useState(userProfile.bio || '');
    const [intent, setIntent] = useState(userProfile.intent || '');

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setPhoto(event.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev => 
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const handleComplete = () => {
        updateProfile({
            name,
            role,
            photo,
            skills: selectedSkills,
            bio,
            intent,
            hasCompletedOnboarding: true
        });
        onComplete();
    };

    const handleDismiss = () => {
        updateProfile({ hasCompletedOnboarding: true });
        onComplete();
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="flex flex-col items-center text-center gap-10 py-12 animate-in fade-in zoom-in duration-700">
                        <div className="w-32 h-32 bg-white/10 backdrop-blur-3xl rounded-[40px] flex items-center justify-center shadow-2xl border border-white/10 ring-1 ring-white/20">
                            <span className="text-white text-5xl font-black hashi-font tracking-tighter">H.</span>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h1 className="text-5xl font-black uppercase tracking-tighter text-white hashi-font">Benvenuto su Hashi</h1>
                            <p className="text-lg font-bold text-[#a3e635] uppercase tracking-[0.4em] italic opacity-90">La piattaforma per i creativi che fanno sul serio</p>
                        </div>
                        <p className="text-white/40 leading-relaxed max-w-lg text-lg">
                            Dimentica il caos dei forum. Hashi è l'hub dove le idee diventano produzioni. <br /> 
                            Connettiti con professionisti di alto livello e gestisci le tue IP in un unico ecosistema.
                        </p>
                        <button 
                            onClick={nextStep}
                            className="mt-6 px-16 py-6 bg-[#a3e635] text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(163,230,53,0.3)] hover:bg-[#bef264] hover:scale-105 transition-all active:scale-95 flex items-center gap-4"
                        >
                            Inizia il viaggio <ChevronRight size={20} />
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="flex flex-col gap-10 py-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl font-black uppercase tracking-tight text-[#030712] hashi-font">Raccontaci chi sei</h1>
                            <p className="text-xs font-bold text-black/30 tracking-widest uppercase">Pochi secondi per configurare il tuo spazio</p>
                        </div>

                        <div className="flex flex-col gap-8">
                            <div className="flex items-center gap-8">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-[36px] bg-black/5 border-2 border-dashed border-black/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#65a30d]/30 group-hover:bg-[#65a30d]/5">
                                        {photo ? (
                                            <img src={photo} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <Camera size={28} className="text-black/20 group-hover:text-[#65a30d]/50" />
                                        )}
                                    </div>
                                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-black uppercase tracking-widest text-[#030712]">Foto Profilo</span>
                                    <p className="text-[10px] font-medium text-black/30 italic">Carica un'immagine professionale.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 px-1">Nome Completo</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Es. Marco Della Valle"
                                        className="w-full p-5 bg-black/5 border border-black/5 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#65a30d]/30 focus:ring-4 focus:ring-[#65a30d]/5 transition-all"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 px-1">Ruolo Principale</label>
                                    <div className="relative">
                                        <select 
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full p-5 bg-black/5 border border-black/5 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#65a30d]/30 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Seleziona un settore</option>
                                            {ROLE_CATEGORIES.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 mt-4">
                            <button onClick={prevStep} className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-black transition-colors">Indietro</button>
                            <button onClick={nextStep} className="flex-1 p-5 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-black/10 hover:bg-[#65a30d] transition-all">Avanti</button>
                            <button onClick={nextStep} className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-black transition-colors">Salta per ora</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="flex flex-col gap-10 py-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl font-black uppercase tracking-tight text-[#030712] hashi-font">Cosa sai fare?</h1>
                            <p className="text-xs font-bold text-black/30 tracking-widest uppercase">Personalizza il tuo arsenale di skills</p>
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                            {SKILLS.map(skill => {
                                const isSelected = selectedSkills.includes(skill);
                                return (
                                    <button
                                        key={skill}
                                        onClick={() => toggleSkill(skill)}
                                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border transition-all ${
                                            isSelected 
                                            ? 'bg-black text-white border-black shadow-xl shadow-black/10' 
                                            : 'bg-white text-black/40 border-black/5 hover:border-black/20 hover:text-black'
                                        }`}
                                    >
                                        {skill}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-black/40 px-1">La tua Bio in breve</label>
                            <textarea 
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Racconta brevemente chi sei e cosa cerchi..."
                                rows={4}
                                className="w-full p-6 bg-black/5 border border-black/5 rounded-[32px] text-sm font-bold outline-none focus:bg-white focus:border-[#65a30d]/30 transition-all resize-none leading-relaxed"
                            />
                        </div>

                        <div className="flex items-center gap-6 mt-4">
                            <button onClick={prevStep} className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-black transition-colors">Indietro</button>
                            <button onClick={nextStep} className="flex-1 p-5 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-black/10 hover:bg-[#65a30d] transition-all">Avanti</button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="flex flex-col gap-10 py-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl font-black uppercase tracking-tight text-[#030712] hashi-font">Cosa cerchi su Hashi?</h1>
                            <p className="text-xs font-bold text-black/30 tracking-widest uppercase">Scegli come vuoi contribuire alla community</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { id: 'team', label: 'Cerco un team per il mio progetto', icon: Rocket, color: '#fb923c', desc: 'Hai un\'idea e vuoi renderla realtà.' },
                                { id: 'join', label: 'Voglio unirmi a progetti esistenti', icon: Users, color: '#65a30d', desc: 'Metti le tue skills a disposizione di altri.' },
                                { id: 'both', label: 'Entrambe le cose', icon: Target, color: '#030712', desc: 'Sei pronto per qualsiasi sfida creativa.' }
                            ].map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => setIntent(option.label)}
                                    className={`flex items-center gap-6 p-7 rounded-[32px] border-2 transition-all text-left ${
                                        intent === option.label 
                                        ? 'border-black bg-black/5 shadow-2xl shadow-black/5' 
                                        : 'border-black/5 bg-white hover:border-black/10'
                                    }`}
                                >
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl" style={{ background: option.color }}>
                                        <option.icon size={28} />
                                    </div>
                                    <div className="flex flex-col gap-1 flex-1">
                                        <span className="text-[13px] font-black uppercase tracking-tight text-[#030712]">{option.label}</span>
                                        <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{option.desc}</span>
                                    </div>
                                    {intent === option.label && <div className="w-8 h-8 rounded-full bg-[#65a30d] flex items-center justify-center text-white shadow-lg"><Check size={18} /></div>}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-6 mt-4">
                            <button onClick={prevStep} className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-black transition-colors">Indietro</button>
                            <button 
                                onClick={handleComplete}
                                disabled={!intent}
                                className={`flex-1 p-6 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all ${
                                    intent 
                                    ? 'bg-black text-white hover:bg-[#65a30d] shadow-[#65a30d]/30' 
                                    : 'bg-black/10 text-black/20 cursor-not-allowed'
                                }`}
                            >
                                Entra su Hashi
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-[#030712]/95 backdrop-blur-2xl animate-in fade-in duration-700 p-4 md:p-10">
            <div className={`relative w-full max-w-3xl overflow-hidden transition-all duration-700 ${
                step === 1 ? 'bg-transparent' : 'bg-white rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.5)]'
            }`}>
                
                {/* Header / Exit Button */}
                <button 
                    onClick={handleDismiss}
                    className="absolute top-10 right-10 z-50 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white/40 hover:text-white"
                >
                    <X size={24} />
                </button>

                {/* Main Content Area */}
                <div className={`transition-all duration-700 ${step === 1 ? 'p-6 md:p-0' : 'p-10 md:p-16'}`}>
                    {renderStep()}
                </div>

                {/* Progress Visualizer (Hidden on Step 1) */}
                {step > 1 && (
                    <div className="px-10 py-8 bg-[#f9fafb] border-t border-black/5 flex items-center justify-between">
                        <div className="flex gap-3">
                            {[1, 2, 3, 4].map(s => (
                                <div 
                                    key={s} 
                                    className={`h-2 transition-all duration-500 rounded-full ${
                                        s === step ? 'w-16 bg-[#65a30d]' : s < step ? 'w-8 bg-black/60' : 'w-8 bg-black/10'
                                    }`} 
                                />
                            ))}
                        </div>
                        <span className="text-[11px] font-black text-black/20 tracking-[0.3em] uppercase">{step} <span className="mx-1">/</span> 4</span>
                    </div>
                )}
            </div>
            
            <style jsx global>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes zoom-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                @keyframes slide-in-from-right-8 { from { transform: translateX(32px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                
                .hashi-font { font-family: var(--font-geist-sans), sans-serif; }
            `}</style>
        </div>
    );
}
