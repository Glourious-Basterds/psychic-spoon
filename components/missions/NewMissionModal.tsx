'use client';

import React, { useState } from 'react';
import { X, Camera, Plus, Check, Calendar } from 'lucide-react';
import { useProjects } from '@/app/context/ProjectContext';

interface NewMissionModalProps {
    onClose: () => void;
}

const ROLES = [
    'Director', 'Producer', 'Cinematographer', 'Sound Designer', 
    'VFX Artist', 'Composer', 'Actor', 'Animator', 'Scriptwriter'
];

const DEADLINE_LABELS = [
    'Script', 'Storyboard', 'Principal Photography', 'Rough Cut', 
    'Sound Mix', 'Color Grade', 'Final Delivery'
];

export function NewMissionModal({ onClose }: NewMissionModalProps) {
    const { publishMission } = useProjects();
    const [name, setName] = useState('');
    const [summary, setSummary] = useState('');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [deadlines, setDeadlines] = useState<{ label: string; date: string }[]>([]);
    const [isPublic, setIsPublic] = useState(true);

    const toggleRole = (role: string) => {
        setSelectedRoles(prev => 
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };

    const addDeadline = () => {
        if (deadlines.length >= DEADLINE_LABELS.length) return;
        const nextLabel = DEADLINE_LABELS.find(l => !deadlines.find(d => d.label === l)) || 'Other';
        setDeadlines([...deadlines, { label: nextLabel, date: new Date().toISOString().split('T')[0] }]);
    };

    const updateDeadline = (index: number, field: 'label' | 'date', value: string) => {
        const next = [...deadlines];
        next[index][field] = value;
        setDeadlines(next);
    };

    const removeDeadline = (index: number) => {
        setDeadlines(deadlines.filter((_, i) => i !== index));
    };

    const handlePublish = () => {
        if (!name.trim()) return;
        publishMission({
            name,
            summary,
            coverImage,
            roles: selectedRoles,
            deadlines
        });
        onClose();
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', animation: 'fade-in 0.3s ease' }} onClick={onClose}>
            <div style={{ background: '#ffffff', width: '100%', maxWidth: '640px', height: '90vh', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', animation: 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, fontFamily: 'Courier New, monospace', color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase' }}>New Mission // Initializing</div>
                    <button onClick={onClose} style={{ padding: '8px', background: 'rgba(0,0,0,0.04)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: '#4b5563' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 40px 0' }} className="custom-scroll">
                    
                    {/* Cover Section */}
                    <div 
                        onClick={() => setCoverImage('/images/bg_hashi_overview.png')} // Simulated upload
                        style={{ width: '100%', height: '200px', background: coverImage ? `url(${coverImage}) center/cover` : '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', borderBottom: '1px solid rgba(0,0,0,0.06)', transition: 'all 0.3s' }}
                    >
                        {!coverImage && (
                            <>
                                <div style={{ padding: '12px', background: '#ffffff', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                    <Camera size={24} style={{ color: '#9ca3af' }} />
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'Courier New, monospace', color: '#9ca3af', letterSpacing: '0.05em' }}>ADD A COVER IMAGE</span>
                            </>
                        )}
                        {coverImage && (
                             <div style={{ background: 'rgba(0,0,0,0.4)', padding: '6px 12px', borderRadius: '20px', fontSize: '9px', fontWeight: 800, color: '#ffffff', fontFamily: 'Courier New, monospace', letterSpacing: '0.1em', backdropFilter: 'blur(4px)' }}>CLICK TO REPLACE</div>
                        )}
                    </div>

                    <div style={{ padding: '32px 40px' }}>
                        
                        {/* Project Name */}
                        <div style={{ marginBottom: '32px' }}>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)}
                                placeholder="Name your mission."
                                style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '32px', fontWeight: 900, color: '#030712', outline: 'none', padding: 0, letterSpacing: '-0.03em' }}
                            />
                            <div style={{ height: '1px', background: 'rgba(0,0,0,0.1)', marginTop: '8px' }} />
                        </div>

                        {/* Summary */}
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 800, fontFamily: 'Courier New, monospace', color: '#6b7280', letterSpacing: '0.1em', marginBottom: '12px', textTransform: 'uppercase' }}>Mission Summary</div>
                            <textarea 
                                value={summary}
                                onChange={e => setSummary(e.target.value)}
                                placeholder="Describe the mission, the world, and the core challenge."
                                style={{ width: '100%', height: '100px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', fontSize: '14px', lineHeight: 1.6, color: '#030712', outline: 'none', resize: 'none', background: '#f9fafb' }}
                            />
                        </div>

                        {/* Roles */}
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 800, fontFamily: 'Courier New, monospace', color: '#6b7280', letterSpacing: '0.1em', marginBottom: '12px', textTransform: 'uppercase' }}>Crew Needed</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {ROLES.map(role => {
                                    const selected = selectedRoles.includes(role);
                                    return (
                                        <button 
                                            key={role}
                                            onClick={() => toggleRole(role)}
                                            style={{ padding: '6px 14px', borderRadius: '20px', background: selected ? 'rgba(163,230,53,0.1)' : 'transparent', border: selected ? '1px solid rgba(163,230,53,0.3)' : '1px solid rgba(0,0,0,0.08)', color: selected ? '#65a30d' : '#6b7280', fontSize: '11px', fontWeight: selected ? 800 : 500, fontFamily: 'Courier New, monospace', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            {selected && <Check size={10} />}
                                            {role.toUpperCase()}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Deadlines */}
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <div style={{ fontSize: '10px', fontWeight: 800, fontFamily: 'Courier New, monospace', color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Project Deadlines</div>
                                <button onClick={addDeadline} style={{ background: 'none', border: 'none', color: '#65a30d', fontSize: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Courier New, monospace' }}>
                                    <Plus size={12} /> ADD MILESTONE
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {deadlines.map((d, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <select 
                                            value={d.label} 
                                            onChange={e => updateDeadline(i, 'label', e.target.value)}
                                            style={{ flex: 1, height: '40px', background: '#f9fafb', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '0 12px', fontSize: '12px', fontWeight: 600, color: '#030712' }}
                                        >
                                            {DEADLINE_LABELS.map(l => <option key={l} value={l}>{l}</option>)}
                                            {!DEADLINE_LABELS.includes(d.label) && <option value={d.label}>{d.label}</option>}
                                        </select>
                                        <div style={{ position: 'relative', width: '130px' }}>
                                            <input 
                                                type="date" 
                                                value={d.date}
                                                onChange={e => updateDeadline(i, 'date', e.target.value)}
                                                style={{ width: '100%', height: '40px', background: '#f9fafb', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '0 12px 0 32px', fontSize: '12px', color: '#030712', cursor: 'pointer' }}
                                            />
                                            <Calendar size={12} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                        </div>
                                        <button onClick={() => removeDeadline(i)} style={{ padding: '8px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Status Toggle */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)' }}>
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#030712', marginBottom: '2px' }}>Publication: Open</div>
                                <div style={{ fontSize: '11px', color: '#6b7280' }}>Visible to all Hashi creators who match crew roles.</div>
                            </div>
                            <button 
                                onClick={() => setIsPublic(!isPublic)}
                                style={{ width: '40px', height: '22px', borderRadius: '20px', background: isPublic ? '#65a30d' : '#d1d5db', position: 'relative', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
                            >
                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#ffffff', position: 'absolute', top: '3px', left: isPublic ? '21px' : '3px', transition: 'all 0.3s' }} />
                            </button>
                        </div>

                    </div>
                </div>

                {/* Footer Actions */}
                <div style={{ padding: '20px 40px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: '16px', flexShrink: 0 }}>
                    <button 
                        onClick={onClose}
                        style={{ flex: 1, padding: '14px', border: '1px solid rgba(0,0,0,0.08)', background: 'transparent', borderRadius: '14px', fontSize: '12px', fontWeight: 700, fontFamily: 'Courier New, monospace', color: '#6b7280', cursor: 'pointer', letterSpacing: '0.1em' }}
                    >
                        ABORT
                    </button>
                    <button 
                        onClick={handlePublish}
                        disabled={!name.trim()}
                        style={{ flex: 2, padding: '14px', background: name.trim() ? '#65a30d' : '#f3f4f6', border: 'none', borderRadius: '14px', fontSize: '12px', fontWeight: 800, fontFamily: 'Courier New, monospace', color: name.trim() ? '#ffffff' : '#9ca3af', cursor: name.trim() ? 'pointer' : 'default', letterSpacing: '0.1em', boxShadow: name.trim() ? '0 8px 24px rgba(163,230,53,0.3)' : 'none', transition: 'all 0.2s' }}
                    >
                        PUBLISH MISSION
                    </button>
                </div>

            </div>

            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .custom-scroll::-webkit-scrollbar { width: 6px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 10px; }
            `}</style>
        </div>
    );
}
