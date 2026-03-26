'use client';

import React, { useState } from 'react';
import { 
    X, 
    Upload, 
    Plus, 
    Globe, 
    Lock, 
    Eye, 
    Check, 
    ChevronDown,
    FileText,
    Image as ImageIcon
} from 'lucide-react';
import { 
    useProjects, 
    IPCategory, 
    IPPrivacy, 
    IPContactMode 
} from '@/app/context/ProjectContext';

interface CreateIPModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORIES: IPCategory[] = ['Film', 'Animation', 'Comic', 'Video Game', 'Music', 'TV Series', 'Podcast', 'Other'];
const PRIVACY_OPTIONS: { value: IPPrivacy; label: string; desc: string; icon: any }[] = [
    { value: 'Public', label: 'Pubblico', desc: 'Chiunque può vedere tutto', icon: Globe },
    { value: 'Private', label: 'Privato', desc: 'Solo l\'owner vede tutto', icon: Lock },
    { value: 'Selective', label: 'Selettivo', desc: 'L\'owner sceglie cosa mostrare', icon: Eye },
];
const CONTACT_MODES: IPContactMode[] = ['Open to pitch', 'Formal applications only', 'Paid work/Licensing only'];

export default function CreateIPModal({ isOpen, onClose }: CreateIPModalProps) {
    const { addIP } = useProjects();
    const [formData, setFormData] = useState({
        title: '',
        category: 'Film' as IPCategory,
        tagline: '',
        description: '',
        coverImage: null as string | null,
        privacy: 'Public' as IPPrivacy,
        contactModes: [] as IPContactMode[],
        contactInstructions: '',
        materials: [] as { name: string; url: string; type: string }[]
    });

    if (!isOpen) return null;

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, coverImage: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMaterialUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prev => ({
                        ...prev,
                        materials: [...prev.materials, {
                            name: file.name,
                            url: reader.result as string,
                            type: file.type.startsWith('image/') ? 'image' : 'document'
                        }]
                    }));
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const toggleContactMode = (mode: IPContactMode) => {
        setFormData(prev => ({
            ...prev,
            contactModes: prev.contactModes.includes(mode)
                ? prev.contactModes.filter(m => m !== mode)
                : [...prev.contactModes, mode]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return;
        
        addIP(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3.5rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="p-10 border-b border-black/5 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-3xl font-black text-[#030712] hashi-font uppercase tracking-tight mb-1">Create New IP</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">Protect and manage your creative essence</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-14 h-14 rounded-full bg-white border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all group"
                    >
                        <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 hashi-scrollbar">
                    <div className="space-y-12">
                        
                        {/* 1. Cover Image */}
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/60 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                01. Cover Banner
                            </h3>
                            <div className="relative group">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleCoverUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                                <div className={`aspect-[21/9] rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 overflow-hidden bg-gray-50 ${formData.coverImage ? 'border-transparent' : 'border-black/5 group-hover:border-black/20 group-hover:bg-gray-100'}`}>
                                    {formData.coverImage ? (
                                        <>
                                            <img src={formData.coverImage} className="w-full h-full object-cover" alt="Cover preview" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="px-6 py-3 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-[#030712]">Change Image</div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-black/20 group-hover:scale-110 transition-transform duration-500">
                                                <Upload size={24} />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[11px] font-black uppercase tracking-widest text-black/40">Upload banner image</p>
                                                <p className="text-[9px] font-bold text-black/20 uppercase mt-1">Full-width recommended (21:9)</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* 2. Basic Info */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-3 ml-2">IP Title</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="e.g. The Bar-Man"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full bg-gray-50 border border-black/5 rounded-[1.5rem] px-6 py-4 text-[13px] font-medium focus:outline-none focus:ring-4 focus:ring-black/[0.02] focus:bg-white focus:border-black/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-3 ml-2">Category</label>
                                    <div className="relative">
                                        <select 
                                            value={formData.category}
                                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as IPCategory }))}
                                            className="w-full bg-gray-50 border border-black/5 rounded-[1.5rem] px-6 py-4 text-[13px] font-medium focus:outline-none focus:appearance-none cursor-pointer focus:ring-4 focus:ring-black/[0.02] focus:bg-white focus:border-black/20 transition-all"
                                        >
                                            {CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-black/20 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-3 ml-2">Tagline</label>
                                <textarea 
                                    placeholder="One-line descriptive tagline..."
                                    value={formData.tagline}
                                    onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                                    className="w-full bg-gray-50 border border-black/5 rounded-[1.5rem] px-6 py-4 text-[13px] font-medium focus:outline-none focus:ring-4 focus:ring-black/[0.02] focus:bg-white focus:border-black/20 transition-all h-[130px] resize-none"
                                />
                            </div>
                        </section>

                        {/* 3. Description */}
                        <section>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-3 ml-2">Full Description</label>
                            <textarea 
                                placeholder="Describe the world, characters, and essence of this IP..."
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full bg-gray-50 border border-black/5 rounded-[2rem] px-8 py-6 text-[13px] font-medium focus:outline-none focus:ring-4 focus:ring-black/[0.02] focus:bg-white focus:border-black/20 transition-all h-[200px] resize-none"
                            />
                        </section>

                        {/* 4. Materials */}
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/60 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                                02. Shareable Materials
                            </h3>
                            <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mb-6">What do you want to share with visitors of this IP? (Style guides, references, scenes)</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {formData.materials.map((m, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-black/5 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black/20 shadow-sm">
                                            {m.type === 'image' ? <ImageIcon size={18} /> : <FileText size={18} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-black text-[#030712] truncate">{m.name}</p>
                                            <p className="text-[8px] font-bold text-black/20 uppercase">{m.type}</p>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, materials: prev.materials.filter((_, idx) => idx !== i) }))}
                                            className="text-black/10 hover:text-red-500 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <div className="relative group cursor-pointer">
                                    <input 
                                        type="file" 
                                        multiple 
                                        onChange={handleMaterialUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="h-full min-h-[64px] rounded-2xl border-2 border-dashed border-black/5 group-hover:border-black/20 group-hover:bg-gray-50 transition-all flex items-center justify-center gap-3 p-4">
                                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-black/20 group-hover:scale-110 transition-transform duration-500">
                                            <Plus size={16} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-black/20 group-hover:text-black/40">Add Materials</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 5. Privacy Settings */}
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/60 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                03. Privacy Settings
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {PRIVACY_OPTIONS.map(opt => (
                                    <div 
                                        key={opt.value}
                                        onClick={() => setFormData(prev => ({ ...prev, privacy: opt.value }))}
                                        className={`p-6 rounded-[2rem] border transition-all cursor-pointer group ${formData.privacy === opt.value ? 'bg-[#030712] border-[#030712] text-white shadow-xl scale-105' : 'bg-gray-50 border-black/5 hover:border-black/20 text-[#030712]'}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${formData.privacy === opt.value ? 'bg-white/10' : 'bg-white shadow-sm group-hover:scale-110 duration-500'}`}>
                                                <opt.icon size={18} className={formData.privacy === opt.value ? 'text-white' : 'text-black/30'} />
                                            </div>
                                            {formData.privacy === opt.value && <div className="p-1 bg-green-500 rounded-full"><Check size={8} className="text-white" /></div>}
                                        </div>
                                        <p className="text-[11px] font-black uppercase tracking-widest mb-1">{opt.label}</p>
                                        <p className={`text-[9px] font-bold ${formData.privacy === opt.value ? 'text-white/40' : 'text-black/20'}`}>{opt.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 6. Contact Settings */}
                        <section className="space-y-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/60 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                04. Pitch & Contact Settings
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {CONTACT_MODES.map(mode => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => toggleContactMode(mode)}
                                        className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${formData.contactModes.includes(mode) ? 'bg-[#030712] text-white border-[#030712]' : 'bg-white border border-black/10 text-black/40 hover:border-black/30'}`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-3 ml-2">Contact Instructions</label>
                                <textarea 
                                    placeholder="How do you want to be contacted for this IP?"
                                    value={formData.contactInstructions}
                                    onChange={(e) => setFormData(prev => ({ ...prev, contactInstructions: e.target.value }))}
                                    className="w-full bg-gray-50 border border-black/5 rounded-[1.5rem] px-6 py-4 text-[13px] font-medium focus:outline-none focus:ring-4 focus:ring-black/[0.02] focus:bg-white focus:border-black/20 transition-all h-[100px] resize-none"
                                />
                            </div>
                        </section>

                    </div>
                </form>

                {/* Footer */}
                <div className="p-10 border-t border-black/5 bg-gray-50/50 flex justify-end gap-4">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-black transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="px-12 py-5 bg-[#030712] text-white rounded-full hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm font-black uppercase tracking-widest shadow-lg"
                    >
                        Initialise IP
                    </button>
                </div>
            </div>
        </div>
    );
}
