'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ChevronRight, Layers, Bell, ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
    const { data: session } = useSession();

    const stats = [
        { label: 'HOME BASE', value: '12', sub: 'Active channels', href: '/comms', icon: Layers },
        { label: 'ALERTS', value: '03', sub: 'Unread items', href: '/missions', icon: Bell },
        { label: 'VAULT SEC', value: 'MAX', sub: 'IP Protection', href: '/vault', icon: ShieldCheck },
    ];

    const projects = [
        { id: 'bar-man', title: 'The Bar-man', description: 'Hero reinvented: from fighting villains to mixing the perfect clandestine cocktail.' },
        { id: 'space-balls', title: 'Space-balls', description: 'Authentic Italian cuisine in sub-orbital logistics. Real pasta for real astronauts.' },
    ];

    const chats = [
        { id: 1, user: 'Tony S.', message: "The new carbon-fiber shaker is ready for field testing. Don't shake it too hard, it might explode.", time: '10:00', project: 'bar-man', channel: 'general' },
        { id: 2, user: 'Lord Helmet', message: "The merchandising strategy is ludicrous! We need more flamethrowers.", time: '12:01', project: 'space-balls', channel: 'kitchen' },
    ];

    const cardStyle = {
        background: '#111111',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        padding: '24px',
        transition: 'border-color 0.15s, background 0.15s',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'block',
        color: 'inherit',
    } as React.CSSProperties;

    return (
        <div style={{ padding: '32px', minHeight: '100%', background: '#0a0a0a', color: '#e5e7eb', fontFamily: 'Inter, sans-serif' }}>

            {/* Header */}
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#f9fafb', margin: 0, letterSpacing: '-0.02em' }}>Dashboard</h1>
                <p style={{ marginTop: '6px', fontSize: '12px', color: '#6b7280', fontFamily: 'Courier New, monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    The world awaits, {session?.user?.name || 'Traveler'}
                </p>
            </div>

            {/* Stats — each card navigates to its section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '40px' }}>
                {stats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <Link key={i} href={s.href} style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(163,230,53,0.3)')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
                            <div style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4b5563', marginBottom: '12px' }}>
                                {s.label}
                            </div>
                            <div style={{ fontSize: '36px', fontWeight: 800, color: '#f9fafb', lineHeight: 1, letterSpacing: '-0.02em' }}>{s.value}</div>
                            <div style={{ marginTop: '6px', fontSize: '11px', color: '#6b7280' }}>{s.sub}</div>
                            <Icon size={40} style={{ position: 'absolute', right: '16px', bottom: '16px', color: 'rgba(255,255,255,0.03)' }} />
                        </Link>
                    );
                })}
            </div>

            {/* Projects + Messages */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>

                {/* Projects */}
                <div>
                    <div style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4b5563', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '2px', height: '12px', background: '#a3e635', display: 'inline-block', borderRadius: '1px' }} />
                        Projects
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {projects.map(p => (
                            <div key={p.id} style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
                                <div>
                                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#f9fafb', marginBottom: '4px' }}>{p.title}</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>{p.description}</div>
                                </div>
                                <Link
                                    href={`/comms?project=${p.id}`}
                                    style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 16px', background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: '8px', color: '#a3e635', fontSize: '11px', fontWeight: 700, fontFamily: 'Courier New, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', textDecoration: 'none', transition: 'background 0.15s' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(163,230,53,0.15)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(163,230,53,0.08)')}
                                >
                                    Jump In <ChevronRight size={12} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Messages */}
                <div>
                    <div style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4b5563', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '2px', height: '12px', background: '#a3e635', display: 'inline-block', borderRadius: '1px' }} />
                        Direct Inquiries
                    </div>
                    <div style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
                        {chats.map(c => (
                            <Link
                                key={c.id}
                                href={`/comms?project=${c.project}&channel=${c.channel}`}
                                style={{ display: 'block', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none', transition: 'background 0.15s' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'Courier New, monospace', color: '#a3e635', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{c.user}</span>
                                    <span style={{ fontSize: '10px', color: '#4b5563' }}>{c.time}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                    &quot;{c.message}&quot;
                                </p>
                            </Link>
                        ))}
                        <Link
                            href="/comms"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '14px 20px', fontSize: '11px', fontWeight: 700, fontFamily: 'Courier New, monospace', color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.15s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#a3e635')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
                        >
                            Connect to Workspace <ChevronRight size={12} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
