'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Image as ImageIcon, Music, Phone, MessageSquare, Video, Play, Pause, Phone as PhoneIcon, X, Send, ChevronDown } from 'lucide-react';

type TabId = 'PHOTOS' | 'SOUNDTRACKS' | 'CALLS' | 'MESSAGES' | 'VIDEO';
type ProjectId = 'bar-man' | 'space-balls';

interface Track { id: string; title: string; duration: string; artist: string; }
interface Call { id: string; user: string; date: string; duration: string; status: 'incoming' | 'outgoing' | 'missed'; }
interface Message { id: string; sender: string; initials: string; color: string; content: string; time: string; mine: boolean; }
interface Photo { src: string; alt: string; emoji: string; bg: string; }

const PROJECTS = {
    'bar-man': {
        name: 'THE BAR-MAN',
        subtitle: 'NOIR CINEMA PROJECT',
        channels: ['Home Base', 'Clandestine-Intel', 'Bruce W.'],
        onlineUsers: ['Bruce W.'],
        photos: [
            { src: '/images/batman_barman_james_bond.png', alt: 'Bar Man Scene', emoji: '🎬', bg: '' },
            { src: '/images/batman_barman_james_bond.png', alt: 'Bar-Man Comic', emoji: '📖', bg: '' },
            { src: '/images/joker_bar_noir.png', alt: 'Joker Bar', emoji: '🃏', bg: '' },
        ] as Photo[],
        tracks: [
            { id: '1', title: 'Noir Intro', duration: '2:34', artist: 'Hashi Audio' },
            { id: '2', title: 'Bartender Theme', duration: '3:12', artist: 'Hashi Audio' },
            { id: '3', title: 'Ghost Waltz', duration: '4:01', artist: 'Hashi Audio' },
            { id: '4', title: 'Last Call', duration: '1:58', artist: 'Hashi Audio' },
        ] as Track[],
        calls: [
            { id: '1', user: 'Bruce W.', date: 'Dec 20, 10:00', duration: '14 min', status: 'incoming' },
            { id: '2', user: 'Tony S.', date: 'Dec 19, 18:42', duration: '7 min', status: 'outgoing' },
            { id: '3', user: 'Sara R.', date: 'Dec 18, 09:15', duration: '—', status: 'missed' },
        ] as Call[],
        messages: {
            'Home Base': [
                { id: '1', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "How's the project going on so far?", time: '10:00 AM', mine: true },
                { id: '2', sender: 'Bruce W.', initials: 'BW', color: '#1a4731', content: "Idk, have a look around dumbass", time: '10:05 AM', mine: false },
            ],
            'Clandestine-Intel': [
                { id: '1', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "How's the food guys?", time: '11:00 AM', mine: true },
                { id: '2', sender: 'Lord Helmet', initials: 'LH', color: '#4a1a1a', content: "Mamma Mia! It's the best cuisine in the world", time: '11:04 AM', mine: false },
            ],
            'Bruce W.': [
                { id: '1', sender: 'Bruce W.', initials: 'BW', color: '#1a4731', content: "Hey, saw the rough cut. Looking good!", time: '09:30 AM', mine: false },
                { id: '2', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Thanks! Still working on the sound mix.", time: '09:31 AM', mine: true },
            ],
        } as Record<string, Message[]>,
    },
    'space-balls': {
        name: 'SPACE BALLS',
        subtitle: 'SEASON 2 · SCI-FI PRODUCTION',
        channels: ['Kitchen', 'Mission Control', 'Lord Helmet'],
        onlineUsers: ['Lord Helmet'],
        photos: [
            { src: '/images/space_food_4k.png', alt: 'Space Food', emoji: '🍝', bg: '' },
            { src: '', alt: 'Space Suit', emoji: '🚀', bg: 'linear-gradient(135deg, #0a0a1a, #1a1a3a)' },
            { src: '', alt: 'Spaceship', emoji: '🛸', bg: 'linear-gradient(135deg, #0a1a0a, #0a2a0a)' },
        ] as Photo[],
        tracks: [
            { id: '1', title: 'Spaceballs Theme', duration: '3:45', artist: 'Hashi Audio' },
            { id: '2', title: 'Orbital Drift', duration: '2:58', artist: 'Hashi Audio' },
            { id: '3', title: 'Pasta in Zero-G', duration: '4:22', artist: 'Hashi Audio' },
        ] as Track[],
        calls: [
            { id: '1', user: 'Lord Helmet', date: 'Dec 21, 14:00', duration: '22 min', status: 'outgoing' },
            { id: '2', user: 'Dark Helmet Jr.', date: 'Dec 20, 11:10', duration: '—', status: 'missed' },
        ] as Call[],
        messages: {
            'Kitchen': [
                { id: '1', sender: 'Lord Helmet', initials: 'LH', color: '#4a1a1a', content: "The merchandising strategy is ludicrous! We need more flamethrowers.", time: '12:01 PM', mine: false },
                { id: '2', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Helmet, focus on the pasta scene first.", time: '12:03 PM', mine: true },
            ],
            'Mission Control': [
                { id: '1', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Season 2 launch window confirmed: Q1 next year.", time: '09:00 AM', mine: true },
                { id: '2', sender: 'Lord Helmet', initials: 'LH', color: '#4a1a1a', content: "Ludicrous speed! Go!", time: '09:02 AM', mine: false },
            ],
            'Lord Helmet': [
                { id: '1', sender: 'Lord Helmet', initials: 'LH', color: '#4a1a1a', content: "I am your father's brother's nephew's cousin's former roommate.", time: '08:00 AM', mine: false },
                { id: '2', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "What does that make us?", time: '08:01 AM', mine: true },
            ],
        } as Record<string, Message[]>,
    },
};

function CommsInner() {
    const searchParams = useSearchParams();
    const projectParam = (searchParams.get('project') as ProjectId) || 'bar-man';

    const [activeProject, setActiveProject] = useState<ProjectId>(projectParam);
    const [activeChannel, setActiveChannel] = useState(PROJECTS[projectParam].channels[0]);
    const [activeTab, setActiveTab] = useState<TabId>('PHOTOS');
    const [playingTrack, setPlayingTrack] = useState<string | null>(null);
    const [lightbox, setLightbox] = useState<Photo | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [localMessages, setLocalMessages] = useState<Record<string, Record<string, Message[]>>>({
        'bar-man': { ...PROJECTS['bar-man'].messages },
        'space-balls': { ...PROJECTS['space-balls'].messages },
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (projectParam !== activeProject) {
            setActiveProject(projectParam);
            setActiveChannel(PROJECTS[projectParam].channels[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectParam]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [localMessages, activeChannel, activeProject]);

    const proj = PROJECTS[activeProject];
    const currentMessages = localMessages[activeProject]?.[activeChannel] ?? [];

    const sendMessage = () => {
        if (!newMessage.trim()) return;
        const msg: Message = {
            id: Date.now().toString(),
            sender: 'Pietro M.',
            initials: 'PM',
            color: '#1e3a5f',
            content: newMessage.trim(),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            mine: true,
        };
        setLocalMessages(prev => ({
            ...prev,
            [activeProject]: {
                ...prev[activeProject],
                [activeChannel]: [...(prev[activeProject]?.[activeChannel] ?? []), msg],
            },
        }));
        setNewMessage('');
    };

    const tabs: { id: TabId; icon: React.ElementType; label: string }[] = [
        { id: 'PHOTOS', icon: ImageIcon, label: 'Photos' },
        { id: 'SOUNDTRACKS', icon: Music, label: 'Soundtracks' },
        { id: 'CALLS', icon: Phone, label: 'Calls' },
        { id: 'MESSAGES', icon: MessageSquare, label: 'Messages' },
        { id: 'VIDEO', icon: Video, label: 'Video' },
    ];

    const callStatusColor = { incoming: '#3b82f6', outgoing: '#22c55e', missed: '#ef4444' } as const;
    const callStatusLabel = { incoming: '↙ Incoming', outgoing: '↗ Outgoing', missed: '✕ Missed' } as const;

    return (
        <div style={{ display: 'flex', height: '100%', background: '#0a0a0a', color: '#e5e7eb', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>

            {/* ── Project strip ── */}
            <div style={{ width: '64px', background: '#080808', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', gap: '12px', flexShrink: 0 }}>
                {(['bar-man', 'space-balls'] as ProjectId[]).map(pid => {
                    const isActive = activeProject === pid;
                    const initials = pid === 'bar-man' ? 'BAR' : 'SPC';
                    return (
                        <button
                            key={pid}
                            onClick={() => { setActiveProject(pid); setActiveChannel(PROJECTS[pid].channels[0]); setActiveTab('PHOTOS'); }}
                            title={PROJECTS[pid].name}
                            style={{
                                width: '44px', height: '44px', borderRadius: isActive ? '12px' : '22px', border: isActive ? '2px solid rgba(163,230,53,0.4)' : '1px solid rgba(255,255,255,0.08)',
                                background: isActive ? 'rgba(163,230,53,0.08)' : '#111111', color: isActive ? '#a3e635' : '#4b5563',
                                fontSize: '10px', fontWeight: 800, fontFamily: 'Courier New, monospace', letterSpacing: '0.02em',
                                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderRadius = '14px'; e.currentTarget.style.color = '#d1d5db'; } }}
                            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderRadius = '22px'; e.currentTarget.style.color = '#4b5563'; } }}
                        >
                            {initials}
                        </button>
                    );
                })}
            </div>

            {/* ── Channel sidebar ── */}
            <div style={{ width: '200px', background: '#0d0d0d', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
                {/* Project header */}
                <div style={{ padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, fontFamily: 'Courier New, monospace', color: '#f9fafb', letterSpacing: '0.08em' }}>{proj.name}</div>
                    <div style={{ fontSize: '9px', color: '#4b5563', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px', fontFamily: 'Courier New, monospace' }}>{proj.subtitle}</div>
                </div>

                {/* Intelligence Hub */}
                <div style={{ padding: '12px 14px 4px', fontSize: '9px', color: '#4b5563', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Courier New, monospace', fontWeight: 700 }}>
                    Intelligence Hub
                </div>
                {proj.channels.map(ch => {
                    const isActive = activeChannel === ch;
                    const isOnline = proj.onlineUsers.includes(ch);
                    return (
                        <button
                            key={ch}
                            onClick={() => { setActiveChannel(ch); setActiveTab('MESSAGES'); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px',
                                background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
                                border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                                color: isActive ? '#f9fafb' : '#4b5563', transition: 'all 0.15s', borderRadius: 0,
                            }}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#9ca3af'; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#4b5563'; }}
                        >
                            <span style={{ fontSize: '12px', color: '#4b5563' }}>{isOnline ? '' : '#'}</span>
                            <span style={{ fontSize: '12px', fontWeight: isActive ? 600 : 400 }}>{ch}</span>
                            {isOnline && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 4px #22c55e', marginLeft: 'auto', flexShrink: 0 }} />}
                        </button>
                    );
                })}

                {/* Media Vault */}
                <div style={{ padding: '16px 14px 4px', fontSize: '9px', color: '#4b5563', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Courier New, monospace', fontWeight: 700 }}>
                    Media Vault
                </div>
                {tabs.map(t => {
                    const Icon = t.icon;
                    const isActive = activeTab === t.id && activeChannel !== proj.channels[0] ? false : activeTab === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px',
                                background: activeTab === t.id ? 'rgba(255,255,255,0.04)' : 'transparent',
                                border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                                color: activeTab === t.id ? '#f9fafb' : '#4b5563', transition: 'all 0.15s', borderRadius: 0,
                            }}
                            onMouseEnter={e => { if (activeTab !== t.id) e.currentTarget.style.color = '#9ca3af'; }}
                            onMouseLeave={e => { if (activeTab !== t.id) e.currentTarget.style.color = '#4b5563'; }}
                        >
                            <Icon size={12} />
                            <span style={{ fontSize: '10px', fontWeight: activeTab === t.id ? 600 : 400, textTransform: 'uppercase', fontFamily: 'Courier New, monospace', letterSpacing: '0.06em' }}>{t.label}</span>
                        </button>
                    );
                })}

                {/* User profile */}
                <div style={{ marginTop: 'auto', padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: '#93c5fd', flexShrink: 0 }}>PM</div>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#d1d5db' }}>Pietro Maggiotto</div>
                        <div style={{ fontSize: '9px', color: '#4b5563', fontFamily: 'Courier New, monospace', letterSpacing: '0.06em' }}>SYNC // HIGH_COMMAND</div>
                    </div>
                </div>
            </div>

            {/* ── Main content area ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Tabs bar */}
                <div style={{ height: '48px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '4px', background: '#0d0d0d', flexShrink: 0 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6', marginRight: '12px' }} />
                    {tabs.map(t => {
                        const Icon = t.icon;
                        const isActive = activeTab === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: isActive ? '#f9fafb' : '#4b5563',
                                    fontSize: '11px', fontWeight: isActive ? 700 : 400,
                                    fontFamily: 'Courier New, monospace', letterSpacing: '0.08em', textTransform: 'uppercase',
                                    borderBottom: isActive ? '2px solid #a3e635' : '2px solid transparent',
                                    transition: 'all 0.15s', marginBottom: '-1px',
                                }}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#9ca3af'; }}
                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#4b5563'; }}
                            >
                                <Icon size={12} />
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab content */}
                <div style={{ flex: 1, overflow: 'auto', padding: activeTab === 'MESSAGES' ? 0 : '28px' }}>

                    {/* PHOTOS */}
                    {activeTab === 'PHOTOS' && (
                        <div>
                            <div style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#4b5563', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
                                VISUAL.ARCHIVE &nbsp;&nbsp; <span style={{ color: '#374151' }}>{proj.photos.length} OBJECTS_LOCALIZED</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginTop: '20px' }}>
                                {proj.photos.map((p, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setLightbox(p)}
                                        style={{
                                            background: p.bg || '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px',
                                            aspectRatio: '4/3', cursor: 'pointer', overflow: 'hidden', position: 'relative',
                                            transition: 'border-color 0.15s, transform 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'scale(1)'; }}
                                    >
                                        {p.src ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={p.src} alt={p.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                        ) : (
                                            <span style={{ fontSize: '40px' }}>{p.emoji}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SOUNDTRACKS */}
                    {activeTab === 'SOUNDTRACKS' && (
                        <div>
                            <div style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#4b5563', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px' }}>
                                AUDIO.VAULT &nbsp;&nbsp; <span style={{ color: '#374151' }}>{proj.tracks.length} TRACKS</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {proj.tracks.map((t, i) => {
                                    const isPlaying = playingTrack === t.id;
                                    return (
                                        <div
                                            key={t.id}
                                            style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 18px', background: isPlaying ? 'rgba(163,230,53,0.06)' : '#111111', border: `1px solid ${isPlaying ? 'rgba(163,230,53,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '10px', transition: 'all 0.15s' }}
                                        >
                                            <span style={{ fontSize: '12px', fontFamily: 'Courier New, monospace', color: '#374151', minWidth: '24px', textAlign: 'center' }}>{String(i + 1).padStart(2, '0')}</span>
                                            <button
                                                onClick={() => setPlayingTrack(isPlaying ? null : t.id)}
                                                style={{ width: '32px', height: '32px', borderRadius: '50%', background: isPlaying ? '#a3e635' : 'rgba(255,255,255,0.06)', border: `1px solid ${isPlaying ? '#a3e635' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isPlaying ? '#000' : '#9ca3af', flexShrink: 0, transition: 'all 0.15s' }}
                                            >
                                                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                                            </button>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '14px', fontWeight: isPlaying ? 600 : 400, color: isPlaying ? '#f9fafb' : '#d1d5db' }}>{t.title}</div>
                                                <div style={{ fontSize: '11px', color: '#4b5563', fontFamily: 'Courier New, monospace' }}>{t.artist}</div>
                                            </div>
                                            <span style={{ fontSize: '12px', fontFamily: 'Courier New, monospace', color: '#4b5563' }}>{t.duration}</span>
                                            {isPlaying && (
                                                <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '16px' }}>
                                                    {[1, 2, 3, 4].map((_, j) => (
                                                        <div key={j} style={{ width: '3px', background: '#a3e635', borderRadius: '2px', animation: `eq-bar ${0.5 + j * 0.15}s infinite alternate ease-in-out`, height: `${8 + j * 2}px` }} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* CALLS */}
                    {activeTab === 'CALLS' && (
                        <div>
                            <div style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#4b5563', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px' }}>
                                CALL.LOG &nbsp;&nbsp; <span style={{ color: '#374151' }}>{proj.calls.length} RECORDS</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {proj.calls.map(c => (
                                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 18px', background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `rgba(${c.status === 'missed' ? '239,68,68' : c.status === 'incoming' ? '59,130,246' : '34,197,94'},0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <PhoneIcon size={16} style={{ color: callStatusColor[c.status] }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '14px', fontWeight: 500, color: '#f9fafb', marginBottom: '2px' }}>{c.user}</div>
                                            <div style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#4b5563' }}>{c.date}</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                            <span style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: callStatusColor[c.status], letterSpacing: '0.06em' }}>{callStatusLabel[c.status]}</span>
                                            <span style={{ fontSize: '11px', color: '#4b5563' }}>{c.duration}</span>
                                        </div>
                                        <button
                                            style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#9ca3af', fontSize: '11px', cursor: 'pointer', fontFamily: 'Courier New, monospace', letterSpacing: '0.06em', transition: 'all 0.15s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(163,230,53,0.08)'; e.currentTarget.style.color = '#a3e635'; e.currentTarget.style.borderColor = 'rgba(163,230,53,0.2)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                                        >
                                            {c.status === 'missed' ? 'CALL BACK' : 'REPLAY'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* MESSAGES */}
                    {activeTab === 'MESSAGES' && (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            {/* Channel selector */}
                            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px', background: '#0d0d0d', flexShrink: 0 }}>
                                <div style={{ fontSize: '11px', color: '#4b5563', fontFamily: 'Courier New, monospace' }}>#</div>
                                <select
                                    value={activeChannel}
                                    onChange={e => setActiveChannel(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', color: '#f9fafb', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
                                >
                                    {proj.channels.map(ch => <option key={ch} value={ch} style={{ background: '#111111' }}>{ch}</option>)}
                                </select>
                                <ChevronDown size={12} style={{ color: '#4b5563' }} />
                            </div>

                            {/* Messages list */}
                            <div style={{ flex: 1, overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {currentMessages.map(msg => (
                                    <div key={msg.id} style={{ display: 'flex', gap: '10px', flexDirection: msg.mine ? 'row-reverse' : 'row' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: msg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', flexShrink: 0 }}>
                                            {msg.initials}
                                        </div>
                                        <div style={{ maxWidth: '70%' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexDirection: msg.mine ? 'row-reverse' : 'row' }}>
                                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#d1d5db' }}>{msg.sender}</span>
                                                <span style={{ fontSize: '10px', color: '#374151', fontFamily: 'Courier New, monospace' }}>{msg.time}</span>
                                            </div>
                                            <div style={{
                                                padding: '10px 14px', borderRadius: msg.mine ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                                                background: msg.mine ? 'rgba(163,230,53,0.08)' : '#111111',
                                                border: `1px solid ${msg.mine ? 'rgba(163,230,53,0.15)' : 'rgba(255,255,255,0.07)'}`,
                                                fontSize: '13px', color: '#d1d5db', lineHeight: 1.5,
                                            }}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '10px', background: '#0a0a0a', flexShrink: 0 }}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                    placeholder={`Message #${activeChannel}...`}
                                    style={{ flex: 1, background: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 16px', color: '#f9fafb', fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.15s' }}
                                    onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.18)')}
                                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                                />
                                <button
                                    onClick={sendMessage}
                                    style={{ padding: '10px 16px', background: newMessage.trim() ? 'rgba(163,230,53,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${newMessage.trim() ? 'rgba(163,230,53,0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '10px', color: newMessage.trim() ? '#a3e635' : '#374151', cursor: newMessage.trim() ? 'pointer' : 'default', transition: 'all 0.15s' }}
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* VIDEO */}
                    {activeTab === 'VIDEO' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', color: '#374151' }}>
                            <Video size={48} style={{ opacity: 0.3 }} />
                            <div style={{ fontSize: '12px', fontFamily: 'Courier New, monospace', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#374151' }}>
                                Video archive — coming soon
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setLightbox(null)}
                >
                    <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px', color: '#9ca3af', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                    {lightbox.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={lightbox.src} alt={lightbox.alt} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '12px' }} />
                    ) : (
                        <div style={{ width: '400px', height: '400px', background: lightbox.bg, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>
                            {lightbox.emoji}
                        </div>
                    )}
                    <div style={{ position: 'absolute', bottom: '24px', color: '#6b7280', fontFamily: 'Courier New, monospace', fontSize: '11px', letterSpacing: '0.1em' }}>{lightbox.alt}</div>
                </div>
            )}

            <style>{`
                @keyframes eq-bar {
                    from { transform: scaleY(0.3); }
                    to { transform: scaleY(1); }
                }
            `}</style>
        </div>
    );
}

export default function CommsPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#0a0a0a', color: '#4b5563', fontFamily: 'Courier New, monospace', fontSize: '11px', letterSpacing: '0.1em' }}>LOADING WORKSPACE...</div>}>
            <CommsInner />
        </Suspense>
    );
}
