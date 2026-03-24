'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Image as ImageIcon, Music, Phone, MessageSquare, Video, Play, Pause, Phone as PhoneIcon, X, Send, ChevronDown, Trash2, Upload, Camera, AlertTriangle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useProjects, Message, Photo, Track, Call } from '@/app/context/ProjectContext';
import { useRouter } from 'next/navigation';

type TabId = 'PHOTOS' | 'SOUNDTRACKS' | 'CALLS' | 'MESSAGES' | 'VIDEO';
type ProjectId = string;


// PROJECTS constant removed - using ProjectContext

function CommsInner() {
    const { workspaces, deleteProject, addPhotoToProject, addMessageToProject } = useProjects();
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectParam = searchParams.get('project') || 'bar-man';
    const channelParam = searchParams.get('channel');

    const [activeProject, setActiveProject] = useState<ProjectId>(projectParam);
    const [activeChannel, setActiveChannel] = useState(channelParam || workspaces[projectParam]?.channels[0] || 'Home-Base');
    const [activeTab, setActiveTab] = useState<TabId>('MESSAGES');
    const [playingTrack, setPlayingTrack] = useState<string | null>(null);
    const [lightbox, setLightbox] = useState<Photo | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const sentCountRef = useRef(0);
    const { status } = useSession();

    useEffect(() => {
        if (projectParam !== activeProject) {
            setActiveProject(projectParam);
            if (!channelParam) {
                setActiveChannel(workspaces[projectParam]?.channels[0] || 'Home-Base');
            }
        }
        if (channelParam && channelParam !== activeChannel) {
            setActiveChannel(channelParam);
            setActiveTab('MESSAGES');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectParam, channelParam]);

    // Intentionally NOT depending on activeChannel/activeTab — only scroll on new sent messages
    useEffect(() => {
        if (sentCountRef.current > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sentCountRef.current]);

    const proj = workspaces[activeProject] || workspaces['bar-man'];
    const currentMessages = proj?.messages?.[activeChannel] ?? [];

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                addPhotoToProject(activeProject, {
                    src: reader.result as string,
                    alt: file.name
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteProject = () => {
        deleteProject(activeProject);
        setIsDeleting(false);
        router.push('/feed');
    };

    const sendMessage = () => {
        if (status === 'unauthenticated') {
            alert('Please log in to send a message.');
            return;
        }
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
        addMessageToProject(activeProject, activeChannel, msg);
        sentCountRef.current += 1;
        setNewMessage('');
    };

    const mediaTabDef: { id: TabId; icon: React.ElementType; label: string }[] = [
        { id: 'PHOTOS', icon: ImageIcon, label: 'Photos' },
        { id: 'SOUNDTRACKS', icon: Music, label: 'Soundtracks' },
        { id: 'CALLS', icon: Phone, label: 'Calls' },
        { id: 'MESSAGES', icon: MessageSquare, label: 'Messages' },
        { id: 'VIDEO', icon: Video, label: 'Video' },
    ];

    const callStatusColor = { incoming: '#3b82f6', outgoing: '#22c55e', missed: '#ef4444' } as const;
    const callStatusLabel = { incoming: '↙ Incoming', outgoing: '↗ Outgoing', missed: '✕ Missed' } as const;

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#ffffff', color: '#1f2937', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>

            {/* Project strip */}
            <div style={{ width: '64px', background: '#f9fafb', borderRight: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', gap: '12px', flexShrink: 0 }}>
                {Object.keys(workspaces).map((pid: string) => {
                    const isActive = activeProject === pid;
                    const initials = pid === 'bar-man' ? 'BAR' : pid === 'space-balls' ? 'SPC' : pid.slice(0, 3).toUpperCase();
                    return (
                        <button
                            key={pid}
                            onClick={() => { setActiveProject(pid); setActiveChannel(workspaces[pid].channels[0]); setActiveTab('MESSAGES'); setPlayingTrack(null); }}
                            title={workspaces[pid].name}
                            style={{ width: '44px', height: '44px', borderRadius: isActive ? '12px' : '22px', border: isActive ? '2px solid rgba(163,230,53,0.4)' : '1px solid rgba(0,0,0,0.08)', background: isActive ? 'rgba(163,230,53,0.08)' : '#ffffff', color: isActive ? '#65a30d' : '#4b5563', fontSize: '9px', fontWeight: 800, fontFamily: 'Courier New, monospace', letterSpacing: '0.02em', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderRadius = '14px'; e.currentTarget.style.color = '#1f2937'; } }}
                            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderRadius = '22px'; e.currentTarget.style.color = '#4b5563'; } }}
                        >
                            {initials}
                        </button>
                    );
                })}
            </div>

            {/* Channel sidebar */}
            <div style={{ width: '200px', background: '#ffffff', borderRight: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
                <div style={{ padding: '16px 14px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, fontFamily: 'Courier New, monospace', color: '#030712', letterSpacing: '0.08em' }}>{proj.name}</div>
                        <div style={{ fontSize: '9px', color: '#4b5563', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px', fontFamily: 'Courier New, monospace' }}>{proj.subtitle}</div>
                    </div>
                    <button 
                        onClick={() => setIsDeleting(true)}
                        style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                        title="Project Settings"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>

                {isDeleting && (
                    <div style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.05)', borderBottom: '1px solid rgba(239,68,68,0.1)' }}>
                        <div style={{ fontSize: '9px', fontWeight: 800, color: '#ef4444', fontFamily: 'Courier New, monospace', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={10} /> DELETE WORKSPACE?
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button onClick={handleDeleteProject} style={{ flex: 1, padding: '4px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '9px', fontWeight: 800 }}>YES</button>
                            <button onClick={() => setIsDeleting(false)} style={{ flex: 1, padding: '4px', background: 'rgba(0,0,0,0.05)', color: '#4b5563', border: 'none', borderRadius: '4px', fontSize: '9px', fontWeight: 800 }}>NO</button>
                        </div>
                    </div>
                )}

                <div style={{ padding: '12px 14px 4px', fontSize: '9px', color: '#4b5563', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Courier New, monospace', fontWeight: 700 }}>Intelligence Hub</div>
                {proj.channels.map((ch: string) => {
                    const isCh = activeChannel === ch && activeTab === 'MESSAGES';
                    const isOnline = proj.onlineUsers.includes(ch);
                    return (
                        <button key={ch} onClick={() => { setActiveChannel(ch); setActiveTab('MESSAGES'); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: isCh ? 'rgba(0,0,0,0.05)' : 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: isCh ? '#030712' : '#4b5563', transition: 'all 0.15s' }}
                            onMouseEnter={e => { if (!isCh) e.currentTarget.style.color = '#6b7280'; }}
                            onMouseLeave={e => { if (!isCh) e.currentTarget.style.color = '#4b5563'; }}>
                            <span style={{ fontSize: '11px', color: '#1f2937', flexShrink: 0 }}>{isOnline ? '◉' : '#'}</span>
                            <span style={{ fontSize: '12px', fontWeight: isCh ? 600 : 400 }}>{ch}</span>
                            {isOnline && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 4px #22c55e', marginLeft: 'auto', flexShrink: 0 }} />}
                        </button>
                    );
                })}

                <div style={{ padding: '16px 14px 4px', fontSize: '9px', color: '#4b5563', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Courier New, monospace', fontWeight: 700 }}>Media Vault</div>
                {mediaTabDef.map(t => {
                    const Icon = t.icon;
                    const isActive = activeTab === t.id && activeTab !== 'MESSAGES';
                    return (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: activeTab === t.id && activeTab !== 'MESSAGES' ? 'rgba(0,0,0,0.04)' : 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: isActive ? '#030712' : '#4b5563', transition: 'all 0.15s' }}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#6b7280'; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#4b5563'; }}>
                            <Icon size={12} />
                            <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400, textTransform: 'uppercase', fontFamily: 'Courier New, monospace', letterSpacing: '0.06em' }}>{t.label}</span>
                        </button>
                    );
                })}

                <div style={{ marginTop: 'auto', padding: '12px 14px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: '#93c5fd', flexShrink: 0 }}>PM</div>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#1f2937' }}>Pietro Maggiotto</div>
                        <div style={{ fontSize: '9px', color: '#4b5563', fontFamily: 'Courier New, monospace', letterSpacing: '0.06em' }}>SYNC // HIGH_COMMAND</div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Tabs bar */}
                <div style={{ height: '48px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '4px', background: '#ffffff', flexShrink: 0 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6', marginRight: '12px' }} />
                    {mediaTabDef.map(t => {
                        const Icon = t.icon;
                        const isActive = activeTab === t.id;
                        return (
                            <button key={t.id} onClick={() => setActiveTab(t.id)}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: isActive ? '#030712' : '#4b5563', fontSize: '11px', fontWeight: isActive ? 700 : 400, fontFamily: 'Courier New, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: isActive ? '2px solid #65a30d' : '2px solid transparent', transition: 'all 0.15s', marginBottom: '-1px' }}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#6b7280'; }}
                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#4b5563'; }}>
                                <Icon size={12} />
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content area */}
                <div style={{ flex: 1, overflow: activeTab === 'MESSAGES' ? 'hidden' : 'auto', padding: activeTab === 'MESSAGES' ? 0 : '28px', display: 'flex', flexDirection: 'column' }}>

                    {/* PHOTOS */}
                    {activeTab === 'PHOTOS' && (
                        <div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handlePhotoUpload} 
                                accept="image/*" 
                                style={{ display: 'none' }} 
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#4b5563', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                    VISUAL.ARCHIVE &nbsp; <span style={{ color: '#1f2937' }}>{proj.photos.length} OBJECTS_LOCALIZED</span>
                                </div>
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{ padding: '6px 14px', background: '#65a30d', border: 'none', borderRadius: '20px', color: '#ffffff', fontSize: '10px', fontWeight: 800, fontFamily: 'Courier New, monospace', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <Upload size={12} /> UPLOAD PHOTO
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                                {proj.photos.map((p: Photo, i: number) => (
                                    <button key={i} onClick={() => setLightbox(p)}
                                        style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '12px', aspectRatio: '4/3', cursor: 'pointer', overflow: 'hidden', position: 'relative', padding: 0, transition: 'border-color 0.15s, transform 0.15s' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={p.src} alt={p.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 12px', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', fontSize: '10px', fontFamily: 'Courier New, monospace', color: 'rgba(0,0,0,0.5)', textAlign: 'left', letterSpacing: '0.06em' }}>
                                            {p.alt}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SOUNDTRACKS */}
                    {activeTab === 'SOUNDTRACKS' && (() => {
                        const nowPlaying = proj.tracks.find(t => t.id === playingTrack) ?? null;
                        return (
                            <div style={{ display: 'flex', gap: '20px', height: '100%' }}>

                                {/* Now Playing card */}
                                <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0' }}>
                                    <div style={{ fontSize: '9px', fontFamily: 'Courier New, monospace', color: '#1f2937', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
                                        {nowPlaying ? 'NOW PLAYING' : 'AUDIO.VAULT'}
                                    </div>
                                    <div style={{ background: '#ffffff', border: `1px solid ${nowPlaying ? 'rgba(163,230,53,0.25)' : 'rgba(0,0,0,0.07)'}`, borderRadius: '14px', overflow: 'hidden', transition: 'border-color 0.3s' }}>
                                        {/* Album art area */}
                                        <div style={{ height: '180px', background: nowPlaying ? 'linear-gradient(135deg, #0f1a0f, #1a2e0a)' : 'linear-gradient(135deg, #ffffff, #ffffff)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                            {/* Vinyl record visual */}
                                            <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'radial-gradient(circle, #ffffff 30%, #111 31%, #222 40%, #111 41%, #222 60%, #111 61%, #222 80%, #111 81%)', border: `2px solid ${nowPlaying ? 'rgba(163,230,53,0.2)' : 'rgba(0,0,0,0.06)'}`, boxShadow: nowPlaying ? '0 0 30px rgba(163,230,53,0.1)' : 'none', animation: nowPlaying ? 'spin 4s linear infinite' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: nowPlaying ? '#65a30d' : '#333', transition: 'background 0.3s' }} />
                                            </div>
                                            {/* EQ bars (visible when playing) */}
                                            {nowPlaying && (
                                                <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '3px', alignItems: 'flex-end', height: '20px' }}>
                                                    {[10, 16, 12, 18, 14, 20, 10].map((h, j) => (
                                                        <div key={j} style={{ width: '3px', background: '#65a30d', borderRadius: '2px', height: `${h}px`, animation: `eq-bar ${0.4 + j * 0.11}s infinite alternate ease-in-out` }} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Track info */}
                                        <div style={{ padding: '16px' }}>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: nowPlaying ? '#030712' : '#4b5563', marginBottom: '4px', transition: 'color 0.3s', minHeight: '20px' }}>
                                                {nowPlaying ? nowPlaying.title : 'No track selected'}
                                            </div>
                                            <div style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#4b5563', marginBottom: '16px' }}>
                                                {nowPlaying ? nowPlaying.artist : '—'}
                                            </div>

                                            {/* Progress bar (decorative for now) */}
                                            <div style={{ height: '3px', background: 'rgba(0,0,0,0.06)', borderRadius: '2px', marginBottom: '12px', overflow: 'hidden' }}>
                                                {nowPlaying && <div style={{ height: '100%', background: '#65a30d', borderRadius: '2px', width: '40%', animation: 'progress-slide 8s linear infinite' }} />}
                                            </div>

                                            {/* Controls */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                                <button
                                                    onClick={() => {
                                                        if (!nowPlaying) return;
                                                        const idx = proj.tracks.findIndex(t => t.id === nowPlaying.id);
                                                        const prev = proj.tracks[Math.max(0, idx - 1)];
                                                        setPlayingTrack(prev.id);
                                                    }}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', padding: '4px', transition: 'color 0.15s', fontSize: '16px' }}
                                                    onMouseEnter={e => (e.currentTarget.style.color = '#6b7280')}
                                                    onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}
                                                >⏮</button>
                                                <button
                                                    onClick={() => setPlayingTrack(nowPlaying ? null : proj.tracks[0].id)}
                                                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: nowPlaying ? '#65a30d' : 'rgba(0,0,0,0.06)', border: `1px solid ${nowPlaying ? '#65a30d' : 'rgba(0,0,0,0.1)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: nowPlaying ? '#000' : '#6b7280', transition: 'all 0.15s' }}
                                                >
                                                    {nowPlaying ? <Pause size={16} /> : <Play size={16} />}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const idx = proj.tracks.findIndex(t => t.id === playingTrack);
                                                        const next = proj.tracks[Math.min(proj.tracks.length - 1, idx + 1)];
                                                        setPlayingTrack(next.id);
                                                    }}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', padding: '4px', transition: 'color 0.15s', fontSize: '16px' }}
                                                    onMouseEnter={e => (e.currentTarget.style.color = '#6b7280')}
                                                    onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}
                                                >⏭</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Track list */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0' }}>
                                    <div style={{ fontSize: '9px', fontFamily: 'Courier New, monospace', color: '#1f2937', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
                                        TRACKLIST &nbsp; <span style={{ color: '#1f2937' }}>{proj.tracks.length} TRACKS</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {proj.tracks.map((t: Track, i: number) => {
                                            const isPlaying = playingTrack === t.id;
                                            return (
                                                <div
                                                    key={t.id}
                                                    onClick={() => setPlayingTrack(isPlaying ? null : t.id)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: isPlaying ? 'rgba(163,230,53,0.06)' : '#ffffff', border: `1px solid ${isPlaying ? 'rgba(163,230,53,0.2)' : 'rgba(0,0,0,0.06)'}`, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s' }}
                                                    onMouseEnter={e => { if (!isPlaying) e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; }}
                                                    onMouseLeave={e => { if (!isPlaying) e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; }}
                                                >
                                                    <span style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: isPlaying ? '#65a30d' : '#1f2937', minWidth: '20px' }}>
                                                        {isPlaying ? '▶' : String(i + 1).padStart(2, '0')}
                                                    </span>
                                                    {/* Tiny album rect */}
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: isPlaying ? 'linear-gradient(135deg, #1a2e0a, #0f1a0f)' : 'linear-gradient(135deg, #161616, #ffffff)', border: `1px solid ${isPlaying ? 'rgba(163,230,53,0.2)' : 'rgba(0,0,0,0.05)'}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Music size={14} style={{ color: isPlaying ? '#65a30d' : '#1f2937' }} />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: '13px', fontWeight: isPlaying ? 600 : 400, color: isPlaying ? '#030712' : '#1f2937', marginBottom: '2px' }}>{t.title}</div>
                                                        <div style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: '#1f2937' }}>{t.artist}</div>
                                                    </div>
                                                    <span style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#1f2937', flexShrink: 0 }}>{t.duration}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* CALLS */}
                    {activeTab === 'CALLS' && (
                        <div>
                            <div style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#4b5563', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px' }}>
                                CALL.LOG &nbsp; <span style={{ color: '#1f2937' }}>{proj.calls.length} RECORDS</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {proj.calls.map((c: Call) => (
                                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 18px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '10px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `rgba(${c.status === 'missed' ? '239,68,68' : c.status === 'incoming' ? '59,130,246' : '34,197,94'},0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <PhoneIcon size={16} style={{ color: callStatusColor[c.status] }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '14px', fontWeight: 500, color: '#030712', marginBottom: '2px' }}>{c.user}</div>
                                            <div style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#4b5563' }}>{c.date}</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                            <span style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: callStatusColor[c.status], letterSpacing: '0.06em' }}>{callStatusLabel[c.status]}</span>
                                            <span style={{ fontSize: '11px', color: '#4b5563' }}>{c.duration}</span>
                                        </div>
                                        <button style={{ padding: '6px 12px', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', color: '#6b7280', fontSize: '11px', cursor: 'pointer', fontFamily: 'Courier New, monospace', letterSpacing: '0.06em', transition: 'all 0.15s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(163,230,53,0.08)'; e.currentTarget.style.color = '#65a30d'; e.currentTarget.style.borderColor = 'rgba(163,230,53,0.2)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; }}>
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
                            {/* Channel header */}
                            <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', flexShrink: 0 }}>
                                <span style={{ fontSize: '12px', color: '#4b5563', fontFamily: 'Courier New, monospace' }}>#</span>
                                <select value={activeChannel} onChange={e => setActiveChannel(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', color: '#030712', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                                    {proj.channels.map((ch: string) => <option key={ch} value={ch} style={{ background: '#ffffff' }}>{ch}</option>)}
                                </select>
                                <ChevronDown size={12} style={{ color: '#4b5563' }} />
                            </div>

                            {/* Message list */}
                            <div style={{ flex: 1, overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {currentMessages.map((msg: Message) => (
                                    <div key={msg.id} style={{ display: 'flex', gap: '10px', flexDirection: msg.mine ? 'row-reverse' : 'row', opacity: msg.isEasterEgg ? 0.7 : 1 }}>
                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: msg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: 'rgba(0,0,0,0.85)', flexShrink: 0, border: msg.isEasterEgg ? '1px solid rgba(0,0,0,0.15)' : 'none' }}>
                                            {msg.initials}
                                        </div>
                                        <div style={{ maxWidth: '70%' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexDirection: msg.mine ? 'row-reverse' : 'row' }}>
                                                <span style={{ fontSize: '11px', fontWeight: 600, color: msg.isEasterEgg ? '#4b5563' : '#1f2937' }}>{msg.sender}</span>
                                                <span style={{ fontSize: '9px', color: '#1f2937', fontFamily: 'Courier New, monospace' }}>{msg.time}</span>
                                                {msg.isEasterEgg && <span style={{ fontSize: '9px', color: '#1f2937', fontFamily: 'Courier New, monospace', fontStyle: 'italic' }}>· late night</span>}
                                            </div>
                                            <div style={{ padding: '9px 13px', borderRadius: msg.mine ? '12px 3px 12px 12px' : '3px 12px 12px 12px', background: msg.isEasterEgg ? 'rgba(0,0,0,0.02)' : msg.mine ? 'rgba(163,230,53,0.07)' : '#ffffff', border: `1px solid ${msg.isEasterEgg ? 'rgba(0,0,0,0.05)' : msg.mine ? 'rgba(163,230,53,0.13)' : 'rgba(0,0,0,0.06)'}`, fontSize: '13px', color: msg.isEasterEgg ? '#4b5563' : '#1f2937', lineHeight: 1.55, fontStyle: msg.isEasterEgg ? 'italic' : 'normal' }}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: '10px', background: '#ffffff', flexShrink: 0 }}>
                                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                    placeholder={`Message #${activeChannel}...`}
                                    style={{ flex: 1, background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '10px 16px', color: '#030712', fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.15s' }}
                                    onFocus={e => (e.target.style.borderColor = 'rgba(0,0,0,0.18)')}
                                    onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.08)')} />
                                <button onClick={sendMessage}
                                    style={{ padding: '10px 16px', background: newMessage.trim() ? 'rgba(163,230,53,0.1)' : 'rgba(0,0,0,0.03)', border: `1px solid ${newMessage.trim() ? 'rgba(163,230,53,0.25)' : 'rgba(0,0,0,0.06)'}`, borderRadius: '10px', color: newMessage.trim() ? '#65a30d' : '#1f2937', cursor: newMessage.trim() ? 'pointer' : 'default', transition: 'all 0.15s' }}>
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* VIDEO */}
                    {activeTab === 'VIDEO' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px', color: '#1f2937' }}>
                            <Video size={48} style={{ opacity: 0.2 }} />
                            <div style={{ fontSize: '12px', fontFamily: 'Courier New, monospace', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Video archive — coming soon</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLightbox(null)}>
                    <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '8px', color: '#6b7280', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={lightbox.src} alt={lightbox.alt} style={{ maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: '12px' }} onClick={e => e.stopPropagation()} />
                    <div style={{ position: 'absolute', bottom: '20px', color: '#6b7280', fontFamily: 'Courier New, monospace', fontSize: '11px', letterSpacing: '0.1em' }}>{lightbox.alt}</div>
                </div>
            )}

            <style>{`
                @keyframes eq-bar {
                    from { transform: scaleY(0.4) }
                    to { transform: scaleY(1) }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes progress-slide {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </div>
    );
}

export default function CommsPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#ffffff', color: '#4b5563', fontFamily: 'Courier New, monospace', fontSize: '11px', letterSpacing: '0.1em' }}>LOADING WORKSPACE...</div>}>
            <CommsInner />
        </Suspense>
    );
}
