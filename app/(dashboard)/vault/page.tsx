'use client';

import React, { useState } from 'react';
import { 
    Plus, 
    MoreHorizontal, 
    Globe, 
    Lock, 
    Eye, 
    Edit2, 
    Trash2, 
    Search,
    ChevronRight,
    Filter,
    FileText,
    Image as ImageIcon
} from 'lucide-react';
import { useProjects, IntellectualProperty, IPPrivacy } from '@/app/context/ProjectContext';
import { useUI } from '@/context/UIContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import CreateIPModal from '@/components/vault/CreateIPModal';

export default function IPVaultPage() {
    const { ips, deleteIP } = useProjects();
    const { status } = useSession();
    const { setAuthModalOpen } = useUI();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const filteredIps = ips.filter(ip => 
        ip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ip.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getPrivacyIcon = (privacy: IPPrivacy) => {
        switch (privacy) {
            case 'Public': return <Globe size={12} className="text-green-500" />;
            case 'Private': return <Lock size={12} className="text-red-500" />;
            case 'Selective': return <Eye size={12} className="text-blue-500" />;
        }
    };

    if (status === 'unauthenticated') {
        return (
            <div className="h-full bg-white flex items-center justify-center p-8">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-black rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-black/20">
                        <Lock size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-[#030712] hashi-font uppercase tracking-tight mb-4">Vault Protetto</h2>
                    <p className="text-sm text-black/50 leading-relaxed mb-10">
                        L'IP Vault è un ambiente ultra-sicuro per la gestione del tuo database creativo. Accedi per visualizzare i tuoi asset, i contratti smart e i modelli di proprietà intellettuale.
                    </p>
                    <button 
                        onClick={() => setAuthModalOpen(true)}
                        className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-gray-900 transition-all shadow-xl shadow-black/10"
                    >
                        Accedi al Vault
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-white hashi-scrollbar overflow-y-auto p-8 relative flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-[#030712] hashi-font uppercase tracking-tight mb-2">IP Vault</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">Your Intellectual Property Hub</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-[#030712] text-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span className="text-xs font-black uppercase tracking-widest">Create New IP</span>
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search your IP archive..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border border-black/5 rounded-full py-4 pl-14 pr-6 text-[13px] font-medium focus:outline-none focus:ring-4 focus:ring-black/[0.02] focus:bg-white focus:border-black/20 transition-all"
                    />
                </div>
                <button className="px-6 py-4 bg-white border border-black/5 rounded-full flex items-center gap-3 text-black/40 hover:text-black hover:border-black/10 transition-all">
                    <Filter size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
                </button>
            </div>

            {/* IP Grid */}
            {filteredIps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredIps.map((ip) => (
                        <div 
                            key={ip.id}
                            className="group bg-white rounded-[2.5rem] border border-black/5 overflow-hidden hover:shadow-2xl hover:border-black/10 transition-all duration-500 flex flex-col"
                        >
                            {/* Card Cover */}
                            <div 
                                onClick={() => router.push(`/vault/${ip.id}`)}
                                className="relative aspect-[16/10] overflow-hidden cursor-pointer"
                            >
                                <img 
                                    src={ip.coverImage || '/images/abstract_hashi_overview.png'} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    alt={ip.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                    <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-tighter">
                                        View Details <ChevronRight size={14} />
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2">
                                        {getPrivacyIcon(ip.privacy)}
                                        <span className="text-[8px] font-black uppercase tracking-widest text-[#030712]">{ip.privacy}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-black/20 mb-1">{ip.category}</div>
                                    <div className="relative ip-menu-trigger">
                                        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal size={16} className="text-black/30" />
                                        </button>
                                    </div>
                                </div>
                                
                                <h3 className="text-lg font-black text-[#030712] uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors">{ip.title}</h3>
                                <p className="text-[11px] text-black/40 font-medium italic mb-6 line-clamp-1">"{ip.tagline}"</p>
                                
                                <div className="mt-auto pt-6 border-t border-black/5 flex items-center justify-between">
                                    <div className="text-[9px] font-black text-black/20 uppercase tracking-widest">
                                        Created: {ip.createdAt}
                                    </div>
                                    <div className="flex items-center gap-2 text-black/20">
                                        <div className="flex items-center gap-1">
                                            <FileText size={10} />
                                            <span className="text-[10px] font-black">{ip.materials.filter(m => m.type === 'document').length}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ImageIcon size={10} />
                                            <span className="text-[10px] font-black">{ip.materials.filter(m => m.type === 'image').length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-black/5 text-black/10">
                        <Lock size={32} />
                    </div>
                    <h3 className="text-xl font-black text-[#030712] uppercase tracking-tight mb-2">No IP Found</h3>
                    <p className="text-xs text-black/30 uppercase tracking-[0.2em]">Start protecting your creative essence today.</p>
                </div>
            )}

            {/* Create IP Modal */}
            <CreateIPModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
        </div>
    );
}
