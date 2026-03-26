'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Briefcase, Star, Clock, User, ChevronRight } from 'lucide-react';
import { useProjects, TrendingProject, OpenRole } from '@/app/context/ProjectContext';
import { useUI } from '@/context/UIContext';
import { useSession } from 'next-auth/react';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { ProjectPreviewModal } from '@/components/ui/ProjectPreviewModal';

const CATEGORIES = ['Tutti', 'Film', 'Animazione', 'Fumetto', 'Videogioco', 'Musica', 'Serie TV', 'Podcast'];
const ROLES = ['Tutti i ruoli', 'Director', 'Producer', 'Animator', 'Sound Designer', 'VFX Artist', 'Writer', 'Actor', 'Composer'];
const OFFERS = ['Tutti', 'Volontario', 'Pagato', 'Collaborazione'];

export default function DiscoverPage() {
    const { trendingProjects, openRoles, joinProject, reachOut } = useProjects();
    const { setAuthModalOpen } = useUI();
    const { status } = useSession();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tutti');
    const [selectedRole, setSelectedRole] = useState('Tutti i ruoli');
    const [selectedOffer, setSelectedOffer] = useState('Tutti');
    const [selectedProject, setSelectedProject] = useState<TrendingProject | null>(null);

    // Filtering logic
    const filteredProjects = useMemo(() => {
        return trendingProjects.filter(project => {
            const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 project.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 project.description?.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = selectedCategory === 'Tutti' || project.category === selectedCategory;
            
            const matchesRole = selectedRole === 'Tutti i ruoli' || (project.roles && project.roles.some(r => r.includes(selectedRole)));
            
            // Map offer string to broader type
            const projectOfferType = project.offer?.toLowerCase().includes('pagato') ? 'Pagato' : 
                                    project.offer?.toLowerCase().includes('volontario') ? 'Volontario' : 
                                    'Collaborazione';
            
            const matchesOffer = selectedOffer === 'Tutti' || projectOfferType === selectedOffer;

            return matchesSearch && matchesCategory && matchesRole && matchesOffer;
        });
    }, [trendingProjects, searchQuery, selectedCategory, selectedRole, selectedOffer]);

    const filteredRoles = useMemo(() => {
        return openRoles.filter(role => {
            // Find the project category for this role
            const project = trendingProjects.find(p => p.name === role.project);
            const matchesCategory = selectedCategory === 'Tutti' || (project && project.category === selectedCategory);
            
            const matchesOffer = selectedOffer === 'Tutti' || role.type === selectedOffer;
            
            const matchesRole = selectedRole === 'Tutti i ruoli' || role.title.includes(selectedRole);

            return matchesCategory && matchesOffer && matchesRole;
        });
    }, [openRoles, trendingProjects, selectedCategory, selectedOffer, selectedRole]);

    return (
        <div className="h-screen overflow-y-auto bg-[#f9fafb] p-8 pb-24 hashi-font">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">
                
                {/* Section 1: Search & Filters */}
                <div className="flex flex-col gap-8 bg-white p-8 rounded-[32px] border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#65a30d] transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Cerca progetti, ruoli, creativi..."
                            className="w-full pl-16 pr-8 py-5 bg-black/[0.02] border border-black/5 rounded-2xl text-lg font-medium outline-none focus:border-[#65a30d]/30 focus:bg-white transition-all shadow-inner"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Categories */}
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                                        selectedCategory === cat 
                                        ? 'bg-[#65a30d] text-white border-[#65a30d] shadow-lg shadow-[#65a30d]/20' 
                                        : 'bg-white text-black/40 border-black/5 hover:border-black/20'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Roles */}
                        <div className="flex flex-wrap gap-2">
                            {ROLES.map(role => (
                                <button
                                    key={role}
                                    onClick={() => setSelectedRole(role)}
                                    className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                                        selectedRole === role 
                                        ? 'bg-[#030712] text-white border-[#030712] shadow-lg shadow-black/10' 
                                        : 'bg-white text-black/30 border-black/5 hover:border-black/20'
                                    }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>

                        {/* Offers */}
                        <div className="flex flex-wrap gap-2">
                            {OFFERS.map(offer => (
                                <button
                                    key={offer}
                                    onClick={() => setSelectedOffer(offer)}
                                    className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                                        selectedOffer === offer 
                                        ? 'bg-[#fb923c] text-white border-[#fb923c] shadow-lg shadow-[#fb923c]/20' 
                                        : 'bg-white text-black/30 border-black/5 hover:border-black/20'
                                    }`}
                                >
                                    {offer}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 2: Open Projects */}
                <div className="flex flex-col gap-8">
                    <div className="flex items-end justify-between px-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-black uppercase tracking-tight text-[#030712]">Progetti Aperti</h2>
                            <p className="text-sm font-bold text-black/30 tracking-widest uppercase">Collabora con i migliori talenti</p>
                        </div>
                        <div className="text-[10px] font-black text-[#65a30d] bg-[#65a30d]/10 px-4 py-2 rounded-full tracking-widest uppercase border border-[#65a30d]/20">
                            {filteredProjects.length} PROGETTI TROVATI
                        </div>
                    </div>

                    {filteredProjects.length === 0 ? (
                        <div className="py-24 text-center bg-white rounded-[32px] border border-black/5">
                            <p className="text-black/40 font-bold uppercase tracking-widest">Nessun progetto trovato con questi filtri — prova a modificare la ricerca.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map(project => (
                                <div 
                                    key={project.id}
                                    onClick={() => setSelectedProject(project)}
                                    className="group bg-white rounded-[32px] overflow-hidden border border-black/5 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer flex flex-col"
                                >
                                    {/* Cover */}
                                    <div className="h-48 relative overflow-hidden">
                                        <img 
                                            src={project.coverImage || '/images/default_cover.png'} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                            alt={project.name}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur rounded-full text-[9px] font-black tracking-widest uppercase text-black">
                                            {project.category}
                                        </div>
                                        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                            <span className="text-white text-[10px] font-black uppercase tracking-widest">Visualizza Dettagli →</span>
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black">
                                                <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col gap-4 flex-1">
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-xl font-black text-[#030712] group-hover:text-[#65a30d] transition-colors uppercase tracking-tight line-clamp-1">{project.name}</h3>
                                            <p className="text-xs font-bold text-black/40 line-clamp-1 tracking-tight uppercase italic">{project.tagline}</p>
                                        </div>

                                        <div className="flex items-center gap-3 py-3 border-y border-black/5">
                                            <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-[10px] font-black border border-black/5">
                                                {project.creatorName?.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="text-[10px] font-black text-black uppercase tracking-tight flex items-center gap-1">
                                                    {project.creatorName}
                                                    <VerificationBadge rating={4.5} size={10} />
                                                </div>
                                                <span className="text-[8px] font-bold text-black/30 uppercase tracking-widest">{project.timestamp}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <div className="flex flex-wrap gap-1.5">
                                                {project.roles?.slice(0, 3).map(role => (
                                                    <span key={role} className="px-2 py-1 bg-black/[0.03] text-[8px] font-black text-black/40 rounded uppercase tracking-widest border border-black/5">
                                                        {role}
                                                    </span>
                                                ))}
                                                {(project.roles?.length || 0) > 3 && (
                                                    <span className="text-[8px] font-black text-[#65a30d]">+{project.roles!.length - 3}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${
                                                    project.offer?.toLowerCase().includes('pagato') ? 'text-[#fb923c]' : 'text-[#65a30d]'
                                                }`}>
                                                    {project.offer}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Section 3: Ruoli Specifici */}
                <div className="flex flex-col gap-8">
                    <div className="flex items-end justify-between px-4 border-l-4 border-[#030712] pl-6">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-black uppercase tracking-tight text-[#030712]">Ruoli Cercati</h2>
                            <p className="text-sm font-bold text-black/30 tracking-widest uppercase">Trova la tua prossima sfida creativa</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] border border-black/5 shadow-2xl shadow-black/5 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#f9fafb] border-bottom border-black/5">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">Ruolo</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">Progetto</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">Tipo Offerta</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">Azione</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRoles.map((role, idx) => (
                                    <tr 
                                        key={idx} 
                                        className="group hover:bg-black/[0.01] transition-colors border-b border-black/5 last:border-0"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center group-hover:bg-[#65a30d] transition-colors shadow-xl shadow-black/10">
                                                    <Star size={16} />
                                                </div>
                                                <span className="text-sm font-black text-[#030712] uppercase tracking-tight">{role.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-black group-hover:text-[#65a30d] transition-colors">{role.project}</span>
                                                <span className="text-[10px] font-bold text-black/30 tracking-widest uppercase">Open Position</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                role.type === 'Pagato' 
                                                ? 'bg-[#fb923c]/5 border-[#fb923c]/20 text-[#fb923c]' 
                                                : role.type === 'Volontario'
                                                ? 'bg-blue-50 border-blue-100 text-blue-500'
                                                : 'bg-[#65a30d]/5 border-[#65a30d]/20 text-[#65a30d]'
                                            }`}>
                                                {role.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => {
                                                    const project = trendingProjects.find(p => p.name === role.project);
                                                    if (project) setSelectedProject(project);
                                                }}
                                                className="px-6 py-2.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#65a30d] hover:shadow-[0_10px_20px_rgba(101,163,13,0.3)] transition-all"
                                            >
                                                Apply
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Project Preview Modal */}
            <ProjectPreviewModal 
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
                onJoin={joinProject}
                onReachOut={reachOut}
                status={status}
                setAuthModalOpen={setAuthModalOpen}
            />
        </div>
    );
}
