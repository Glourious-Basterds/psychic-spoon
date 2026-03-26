'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, FolderKanban, Briefcase, ChevronRight, Star } from 'lucide-react';
import { useProjects, TrendingProject, OpenRole, UserProfile } from '@/app/context/ProjectContext';
import { useRouter } from 'next/navigation';
import { VerificationBadge } from './VerificationBadge';

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectProject: (project: TrendingProject) => void;
}

export function GlobalSearch({ isOpen, onClose, onSelectProject }: GlobalSearchProps) {
    const router = useRouter();
    const { trendingProjects, openRoles, otherUsers, userProfile } = useProjects();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{
        projects: TrendingProject[];
        roles: OpenRole[];
        users: UserProfile[];
    }>({ projects: [], roles: [], users: [] });
    
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery('');
            setResults({ projects: [], roles: [], users: [] });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (query.trim().length < 2) {
            setResults({ projects: [], roles: [], users: [] });
            return;
        }

        const q = query.toLowerCase();

        // Filter Projects
        const filteredProjects = trendingProjects.filter(p => 
            p.name.toLowerCase().includes(q) || 
            p.tagline?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q)
        );

        // Filter Roles
        const filteredRoles = openRoles.filter(r => 
            r.title.toLowerCase().includes(q) || 
            r.project.toLowerCase().includes(q)
        );

        // Filter Users
        const allUsers: UserProfile[] = [userProfile, ...Object.values(otherUsers)];
        const filteredUsers = allUsers.filter(u => 
            u.name?.toLowerCase().includes(q) || 
            u.role?.toLowerCase().includes(q) ||
            u.bio?.toLowerCase().includes(q) ||
            u.skills?.some((s: string) => s.toLowerCase().includes(q))
        );

        setResults({
            projects: filteredProjects.slice(0, 5),
            roles: filteredRoles.slice(0, 5),
            users: filteredUsers as UserProfile[]
        });
    }, [query, trendingProjects, openRoles, otherUsers, userProfile]);

    if (!isOpen) return null;

    const hasResults = results.projects.length > 0 || results.roles.length > 0 || results.users.length > 0;

    return (
        <div className="fixed inset-0 z-[100000] flex items-start justify-center pt-24 px-4 sm:px-6 lg:px-8">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-2xl animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Search Container */}
            <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-black/5 overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Search Bar */}
                <div className="flex items-center p-6 border-b border-black/5 gap-4">
                    <Search className="text-black/20" size={24} />
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Cerca progetti, ruoli, creativi..."
                        className="flex-1 bg-transparent border-none outline-none text-xl font-bold placeholder:text-black/10"
                    />
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-black/5 rounded-full text-black/30 hover:text-black transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Results Area */}
                <div className="max-h-[70vh] overflow-y-auto p-6 scrollbar-hide">
                    {query.trim().length < 2 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-4 opacity-30">
                            <Search size={48} strokeWidth={1} />
                            <p className="text-sm font-bold uppercase tracking-widest">Inizia a digitare per cercare...</p>
                        </div>
                    ) : !hasResults ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                            <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center text-black/20">
                                <Search size={32} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-lg font-black text-[#030712]">Nessun risultato per "{query}"</p>
                                <p className="text-sm font-medium text-black/40 italic">Prova con termini diversi o più generici.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            
                            {/* Progetti */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#65a30d] px-2">Progetti ({results.projects.length})</h3>
                                <div className="flex flex-col gap-2">
                                    {results.projects.map(p => (
                                        <button 
                                            key={p.id}
                                            onClick={() => { onSelectProject(p); onClose(); }}
                                            className="group flex items-center gap-3 p-3 bg-black/[0.02] border border-black/5 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all text-left"
                                        >
                                            <div className="w-12 h-12 bg-black/5 rounded-xl overflow-hidden shrink-0 border border-black/5">
                                                {p.coverImage && <img src={p.coverImage} className="w-full h-full object-cover" alt="" />}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <p className="text-sm font-black text-[#030712] truncate group-hover:text-[#65a30d] transition-colors uppercase tracking-tight">{p.name}</p>
                                                <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">{p.category || 'Film'}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Utenti */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#65a30d] px-2">Utenti ({results.users.length})</h3>
                                <div className="flex flex-col gap-2">
                                    {results.users.map(u => (
                                        <button 
                                            key={u.id}
                                            onClick={() => { router.push(`/profile/${u.id}`); onClose(); }}
                                            className="group flex items-center gap-3 p-3 bg-black/[0.02] border border-black/5 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all text-left"
                                        >
                                            <div className="w-10 h-10 bg-black/5 rounded-full overflow-hidden shrink-0 border border-black/5 ring-2 ring-transparent group-hover:ring-[#65a30d]/20 transition-all">
                                                {u.photo ? <img src={u.photo} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center font-black text-black/20">{u.name.charAt(0)}</div>}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-1">
                                                    <p className="text-sm font-black text-[#030712] truncate group-hover:text-[#65a30d] transition-colors">{u.name}</p>
                                                    {u.rating >= 4.5 && <VerificationBadge size={12} rating={u.rating} />}
                                                </div>
                                                <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest truncate">{u.role}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Ruoli */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#65a30d] px-2">Ruoli Aperti ({results.roles.length})</h3>
                                <div className="flex flex-col gap-2">
                                    {results.roles.map((r, i) => {
                                        const project = trendingProjects.find(tp => tp.name === r.project);
                                        return (
                                            <button 
                                                key={`${r.title}-${i}`}
                                                onClick={() => { if (project) { onSelectProject(project); onClose(); } }}
                                                className="group flex flex-col gap-1 p-4 bg-black/[0.02] border border-black/5 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all text-left"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-black text-[#030712] group-hover:text-[#65a30d] transition-colors uppercase tracking-tight">{r.title}</p>
                                                    <Briefcase size={14} className="text-black/20" />
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-[10px] font-bold text-black/40 truncate italic">{r.project}</p>
                                                    <span className="text-[9px] font-black px-1.5 py-0.5 bg-black/5 rounded-md text-black/40 uppercase tracking-widest">{r.type}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Tip */}
                <div className="p-4 bg-black/5 border-t border-black/5 flex justify-between items-center px-8">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/30 italic">Usa ↑ ↓ per navigare • Invio per selezionare</p>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-[9px] font-black text-black/30 border border-black/10 px-2 py-1 rounded-md uppercase tracking-widest">Esc chiudi</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
