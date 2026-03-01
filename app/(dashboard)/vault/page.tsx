'use client';

import { useState } from 'react';
import { Shield, Lock, X, Plus, Share2, Edit3, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface IPDoc {
    id: string;
    name: string;
    label: string;
    icon: React.ElementType;
    color: string;
    description: string;
    status: string;
    protected: boolean;
    collaborators: string[];
}

const IP_DOCS: IPDoc[] = [
    {
        id: 'cyber-seal',
        name: 'Cyber-Seal',
        label: 'REGISTERED IP · CLASS 7',
        icon: Lock,
        color: '#3b82f6',
        description: 'Proprietary encryption framework developed for The Bar-Man project. Includes algorithm blueprints, usage contracts and licensing terms.',
        status: 'FULLY PROTECTED',
        protected: true,
        collaborators: ['Bruce W.', 'Tony S.'],
    },
    {
        id: 'gothic-intel',
        name: 'Gothic Intel',
        label: 'ENCRYPTED BLUEPRINT · CLASS 5',
        icon: Shield,
        color: '#a3e635',
        description: 'Encrypted blueprints for magical firearms used in the Space-Balls Season 2 production. Distribution strictly controlled.',
        status: 'PROTECTED — REVIEW PENDING',
        protected: true,
        collaborators: ['Lord Helmet'],
    },
];

export default function VaultPage() {
    const [selected, setSelected] = useState<IPDoc | null>(null);
    const [showNew, setShowNew] = useState(false);
    const [newName, setNewName] = useState('');

    return (
        <div style={{ padding: '32px', minHeight: '100%', background: '#0a0a0a', color: '#e5e7eb', fontFamily: 'Inter, sans-serif' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#f9fafb', margin: 0, letterSpacing: '-0.02em' }}>IP Vault</h1>
                    <p style={{ marginTop: '6px', fontSize: '12px', color: '#6b7280', fontFamily: 'Courier New, monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Maximum security · Intellectual Property Storage
                    </p>
                </div>
                <button
                    onClick={() => setShowNew(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: '10px', color: '#a3e635', fontSize: '12px', fontWeight: 700, fontFamily: 'Courier New, monospace', letterSpacing: '0.08em', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(163,230,53,0.15)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(163,230,53,0.08)')}
                >
                    <Plus size={14} /> New IP
                </button>
            </div>

            {/* IP Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', maxWidth: '800px' }}>
                {IP_DOCS.map(doc => {
                    const Icon = doc.icon;
                    return (
                        <button
                            key={doc.id}
                            onClick={() => setSelected(doc)}
                            style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '28px', textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s', width: '100%' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${doc.id === 'cyber-seal' ? '59,130,246' : '163,230,53'},0.3)`; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                        >
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `rgba(${doc.id === 'cyber-seal' ? '59,130,246' : '163,230,53'},0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                <Icon size={24} style={{ color: doc.color }} />
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#f9fafb', marginBottom: '6px' }}>{doc.name}</div>
                            <div style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: '#4b5563', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>{doc.label}</div>
                            <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.6, marginBottom: '16px' }}>{doc.description.slice(0, 80)}...</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                                <span style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: '#22c55e', letterSpacing: '0.08em' }}>{doc.status}</span>
                            </div>
                        </button>
                    );
                })}

                {/* Add new IP card */}
                <button
                    onClick={() => setShowNew(true)}
                    style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px', padding: '28px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '200px' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(163,230,53,0.3)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                >
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={20} style={{ color: '#4b5563' }} />
                    </div>
                    <span style={{ fontSize: '12px', color: '#4b5563', fontFamily: 'Courier New, monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Add New IP</span>
                </button>
            </div>

            {/* Beyond the Neon Abyss CTA */}
            <div style={{ marginTop: '60px', textAlign: 'center' }}>
                <button
                    onClick={() => setShowNew(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontFamily: 'Courier New, monospace', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#374151', transition: 'color 0.2s', padding: '12px 24px' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#a3e635')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#374151')}
                >
                    BEYOND THE NEON ABYSS →
                </button>
            </div>

            {/* Detail Modal */}
            {selected && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
                    onClick={() => setSelected(null)}
                >
                    <div
                        style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '36px', maxWidth: '520px', width: '100%', position: 'relative' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: '6px', color: '#9ca3af' }}>
                            <X size={16} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `rgba(${selected.id === 'cyber-seal' ? '59,130,246' : '163,230,53'},0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <selected.icon size={28} style={{ color: selected.color }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: '#f9fafb' }}>{selected.name}</div>
                                <div style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: '#4b5563', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{selected.label}</div>
                            </div>
                        </div>

                        <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.7, marginBottom: '24px' }}>{selected.description}</p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '12px 16px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '10px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                            <span style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#22c55e', letterSpacing: '0.08em' }}>{selected.status}</span>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: '#4b5563', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Collaborators</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {selected.collaborators.map((c, i) => (
                                    <div key={i} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px', color: '#d1d5db' }}>{c}</div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            {[{ icon: Share2, label: 'Share' }, { icon: Edit3, label: 'Edit' }, { icon: UserPlus, label: 'Add Collaborator' }].map(({ icon: Icon, label }) => (
                                <button key={label} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#9ca3af', fontSize: '11px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Courier New, monospace' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(163,230,53,0.08)'; e.currentTarget.style.color = '#a3e635'; e.currentTarget.style.borderColor = 'rgba(163,230,53,0.2)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                                    <Icon size={13} /> {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* New IP Modal */}
            {showNew && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
                    onClick={() => setShowNew(false)}
                >
                    <div
                        style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '36px', maxWidth: '440px', width: '100%', position: 'relative' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={() => setShowNew(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: '6px', color: '#9ca3af' }}>
                            <X size={16} />
                        </button>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f9fafb', marginBottom: '8px' }}>Register New IP</h2>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '28px', fontFamily: 'Courier New, monospace' }}>Add your intellectual property to the vault.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input
                                type="text"
                                placeholder="IP Name..."
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', color: '#f9fafb', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                            />
                            <textarea
                                placeholder="Description..."
                                rows={3}
                                style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', color: '#f9fafb', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'Inter, sans-serif' }}
                            />
                            <button
                                onClick={() => setShowNew(false)}
                                style={{ padding: '12px', background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.25)', borderRadius: '10px', color: '#a3e635', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Courier New, monospace', letterSpacing: '0.08em', transition: 'background 0.15s' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(163,230,53,0.18)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(163,230,53,0.1)')}
                            >
                                REGISTER IP →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
