'use client';

import React from 'react';
import { X, Check } from 'lucide-react';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { TrendingProject } from '@/app/context/ProjectContext';

interface ProjectPreviewModalProps {
    project: TrendingProject | null;
    onClose: () => void;
    onJoin: (projectId: string) => void;
    onReachOut: (projectId: string, message: string) => void;
    status: 'authenticated' | 'unauthenticated' | 'loading';
    setAuthModalOpen: (open: boolean) => void;
}

export function ProjectPreviewModal({
    project,
    onClose,
    onJoin,
    onReachOut,
    status,
    setAuthModalOpen
}: ProjectPreviewModalProps) {
    if (!project) return null;

    const handleJoin = () => {
        if (status === 'unauthenticated') {
            setAuthModalOpen(true);
        } else {
            onJoin(project.id);
        }
    };

    const handleReachOut = () => {
        if (status === 'unauthenticated') {
            setAuthModalOpen(true);
        } else {
            const msg = `Ciao, ho visto il tuo progetto ${project.name} e vorrei saperne di più.`;
            onReachOut(project.id, msg);
        }
    };

    return (
        <div 
            style={{ 
                position: 'fixed', 
                inset: 0, 
                background: 'rgba(0,0,0,0.85)', 
                zIndex: 10000, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                backdropFilter: 'blur(12px)', 
                animation: 'fade-in 0.3s ease' 
            }} 
            onClick={onClose}
        >
            <div 
                style={{ 
                    background: '#ffffff', 
                    width: '100%', 
                    maxWidth: '600px', 
                    maxHeight: '90vh', 
                    borderRadius: '24px', 
                    overflowY: 'auto', 
                    position: 'relative', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    animation: 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
                }} 
                onClick={e => e.stopPropagation()}
            >
                
                {/* Close button */}
                <button 
                    onClick={onClose} 
                    style={{ 
                        position: 'absolute', 
                        top: '16px', 
                        right: '16px', 
                        zIndex: 10, 
                        padding: '8px', 
                        background: 'rgba(0,0,0,0.4)', 
                        border: 'none', 
                        borderRadius: '50%', 
                        color: '#ffffff', 
                        cursor: 'pointer', 
                        backdropFilter: 'blur(4px)' 
                    }}
                >
                    <X size={20} />
                </button>

                {/* Banner */}
                <div style={{ width: '100%', height: '200px', position: 'relative', flexShrink: 0 }}>
                    <img 
                        src={project.coverImage || '/images/default_cover.png'} 
                        alt={project.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{ 
                        position: 'absolute', 
                        bottom: '-40px', 
                        left: '32px', 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '20px', 
                        background: '#030712', 
                        border: '4px solid #ffffff', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: '#ffffff', 
                        fontSize: '24px', 
                        fontWeight: 900, 
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)' 
                    }}>
                        {project.name.charAt(0)}
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '60px 32px 32px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#030712', margin: 0, letterSpacing: '-0.02em' }}>{project.name}</h2>
                        <p style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Courier New, monospace', color: '#65a30d', margin: '4px 0 0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{project.tagline}</p>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>{project.description}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', background: '#f9fafb', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '14px', fontWeight: 800 }}>
                                {project.creatorName?.charAt(0)}
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#030712', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {project.creatorName}
                                    <VerificationBadge rating={4.5} size={14} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Courier New, monospace', marginBottom: '8px' }}>Stiamo cercando</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {project.roles?.map(role => (
                                    <span key={role} style={{ padding: '4px 10px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '20px', fontSize: '10px', fontWeight: 700, color: '#4b5563', fontFamily: 'Courier New, monospace' }}>
                                        {role.toUpperCase()}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Courier New, monospace', marginBottom: '4px' }}>Cosa offriamo</div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#fb923c' }}>{project.offer}</div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div style={{ padding: '24px 32px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button 
                            onClick={handleJoin}
                            style={{ flex: 1, padding: '14px', background: '#65a30d', border: 'none', borderRadius: '14px', color: '#ffffff', fontSize: '13px', fontWeight: 800, fontFamily: 'Courier New, monospace', cursor: 'pointer', letterSpacing: '0.1em', boxShadow: '0 8px 24px rgba(163,230,53,0.3)', transition: 'all 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            JOIN
                        </button>
                        <button 
                            onClick={handleReachOut}
                            style={{ flex: 1, padding: '14px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '14px', color: '#030712', fontSize: '13px', fontWeight: 800, fontFamily: 'Courier New, monospace', cursor: 'pointer', letterSpacing: '0.1em', transition: 'all 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}
                        >
                            REACH OUT
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
