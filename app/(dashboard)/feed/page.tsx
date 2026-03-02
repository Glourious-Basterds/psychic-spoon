'use client';

import { useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share2, X, Users, Briefcase, Star, UserPlus, Check, Search } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Post {
    id: number;
    author: Author;
    content: string;
    time: string;
    image?: string;
    badge?: { label: string; color: string; bg: string };
    likes: number;
    replies: number;
    liked?: boolean;
}

interface Author {
    name: string;
    initials: string;
    color: string;
    role: string;
}

interface UserProfile {
    name: string;
    initials: string;
    color: string;
    role: string;
    bio: string;
    rating: number;
    ratingBreakdown: Record<string, number>;
    projects: { title: string; role: string; date: string; stars: number }[];
    ips: { title: string; status: string }[];
}

interface Toast {
    id: number;
    message: string;
    type?: 'success' | 'info';
}

// ─── Static data ───────────────────────────────────────────────────────────────
const AUTHORS: Record<string, Author> = {
    'Bruce W.': { name: 'Bruce W.', initials: 'BW', color: '#1a3a2a', role: 'Noir Director · Cinematographer' },
    'Pietro M.': { name: 'Pietro M.', initials: 'PM', color: '#1e3a5f', role: 'Creative Director · Producer' },
    'Lord Helmet': { name: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', role: 'Actor · Executive Producer' },
    'Tony S.': { name: 'Tony S.', initials: 'TS', color: '#3a1e1e', role: 'R&D Engineer · Gadget Designer' },
    // External creators
    'Mia K.': { name: 'Mia K.', initials: 'MK', color: '#2a1a2e', role: 'Production Designer' },
    'Rafael G.': { name: 'Rafael G.', initials: 'RG', color: '#1a2e20', role: 'Score Composer' },
    'Yuki T.': { name: 'Yuki T.', initials: 'YT', color: '#1a1e3a', role: 'Concept Artist · Illustrator' },
    'Dani M.': { name: 'Dani M.', initials: 'DM', color: '#2e1e14', role: 'Cinematographer · DP' },
    'Ash V.': { name: 'Ash V.', initials: 'AV', color: '#141e2e', role: 'Creative Producer' },
};

const PROFILES: Record<string, UserProfile> = {
    'Bruce W.': {
        name: 'Bruce W.', initials: 'BW', color: '#1a3a2a',
        role: 'Noir Director · Cinematographer',
        bio: 'I make films about silence, shadow, and everything in between. Everything needs more shadow.',
        rating: 4.8,
        ratingBreakdown: { Reliability: 5, Communication: 4.5, Quality: 5, Creativity: 5, 'Team Player': 4.5 },
        projects: [
            { title: 'The Bar-Man', role: 'Director', date: 'Dec 2025', stars: 5 },
            { title: 'Ghost Protocol Noir', role: 'Cinematographer', date: 'Aug 2024', stars: 5 },
        ],
        ips: [
            { title: 'The Bar-Man IP', status: 'Public' },
            { title: 'Shadow & Light Method', status: 'Pitch Only' },
        ],
    },
    'Pietro M.': {
        name: 'Pietro M.', initials: 'PM', color: '#1e3a5f',
        role: 'Creative Director · Producer',
        bio: 'Three projects. Two worlds. One platform. Building the future of creative collaboration.',
        rating: 4.9,
        ratingBreakdown: { Reliability: 5, Communication: 5, Quality: 4.5, Creativity: 5, 'Team Player': 5 },
        projects: [
            { title: 'The Bar-Man', role: 'Executive Producer', date: 'Dec 2025', stars: 5 },
            { title: 'Space-Balls S2', role: 'Creative Director', date: 'Ongoing', stars: 5 },
        ],
        ips: [
            { title: 'The Bar-Man IP', status: 'Public' },
            { title: 'Space-Balls IP', status: 'Pitch Only' },
        ],
    },
    'Lord Helmet': {
        name: 'Lord Helmet', initials: 'LH', color: '#3a1a3a',
        role: 'Actor · Executive Producer',
        bio: 'In space, no one can hear you slurp spaghetti. But I can. I always can.',
        rating: 4.7,
        ratingBreakdown: { Reliability: 4.5, Communication: 5, Quality: 5, Creativity: 5, 'Team Player': 4 },
        projects: [
            { title: 'Space-Balls S2', role: 'Lead Actor / EP', date: 'Ongoing', stars: 5 },
            { title: 'Dark Helmet Rises', role: 'Director', date: 'Jun 2024', stars: 4 },
        ],
        ips: [{ title: 'Space-Balls IP', status: 'Pitch Only' }],
    },
    'Tony S.': {
        name: 'Tony S.', initials: 'TS', color: '#3a1e1e',
        role: 'R&D Engineer · Gadget Designer',
        bio: 'I build tools that no one asked for and everyone ends up needing. Patent pending. Always.',
        rating: 4.6,
        ratingBreakdown: { Reliability: 4, Communication: 4.5, Quality: 5, Creativity: 5, 'Team Player': 4.5 },
        projects: [
            { title: 'The Bar-Man', role: 'Prop Engineer', date: 'Dec 2025', stars: 5 },
            { title: 'Space-Balls S2', role: 'R&D Consultant', date: 'Ongoing', stars: 5 },
        ],
        ips: [
            { title: 'Zero-Gravity Fork', status: 'Private' },
            { title: 'Carbon-Fiber Shaker', status: 'Public' },
        ],
    },
};

const INITIAL_POSTS: Post[] = [
    { id: 1, author: AUTHORS['Bruce W.'], content: 'Finished the storyboard for act 2. The silence before the reveal is going to destroy people.', time: '2h ago', image: '/images/storyboard_noir.png', likes: 14, replies: 3 },
    { id: 2, author: AUTHORS['Pietro M.'], content: 'Looking for a sound designer for a noir short film. Must understand silence as well as sound. Apply via Hashi.', time: '4h ago', badge: { label: 'OPEN ROLE', color: '#a3e635', bg: 'rgba(163,230,53,0.12)' }, likes: 28, replies: 7 },
    { id: 11, author: AUTHORS['Mia K.'], content: 'Just dropped the complete set design for The Nighthawk Blues. Jazz bar, two floors, hidden backstage. Every surface tells a story. Blueprint attached.', time: '3h ago', image: '/images/set_design_blueprint.png', likes: 52, replies: 8 },
    { id: 3, author: AUTHORS['Lord Helmet'], content: 'The pasta cannon achieved orbit. Production on Space-Balls continues as planned.', time: '5h ago', likes: 67, replies: 12 },
    { id: 12, author: AUTHORS['Rafael G.'], content: 'Recording the score for The Nightingale\'s Tale today. Steinway D, two mics, zero samples. If it doesn\'t sound human it doesn\'t go in.', time: '6h ago', image: '/images/studio_score_session.png', likes: 71, replies: 11 },
    { id: 4, author: AUTHORS['Tony S.'], content: 'New tool prototype: a zero-gravity fork. Patent pending. DM for licensing.', time: '8h ago', image: '/images/zerogravity_fork.png', likes: 45, replies: 9 },
    { id: 13, author: AUTHORS['Ash V.'], content: 'Three pitches in one week. Two passed, one destroyed us. The one that destroyed us was the best idea. We are rebuilding it and coming back stronger.', time: '9h ago', likes: 93, replies: 17 },
    { id: 5, author: AUTHORS['Bruce W.'], content: 'The Bar-Man wrapped principal photography. Crew was exceptional. Full credits on Hashi.', time: '1d ago', badge: { label: 'PROJECT COMPLETE', color: '#f9fafb', bg: 'rgba(255,255,255,0.08)' }, likes: 103, replies: 21 },
    { id: 14, author: AUTHORS['Yuki T.'], content: 'Concept art for the garden sequence in my new animated short. An astronaut finds a living ecosystem on a dead moon. Took 3 weeks to get the lighting right.', time: '1d ago', image: '/images/concept_art_moon.png', likes: 118, replies: 23 },
    { id: 6, author: AUTHORS['Pietro M.'], content: 'IP page for The Bar-Man is now live. If you want to pitch a sequel or spinoff, the door is open.', time: '1d ago', badge: { label: 'IP PAGE LIVE', color: '#93c5fd', bg: 'rgba(147,197,253,0.1)' }, likes: 56, replies: 4 },
    { id: 15, author: AUTHORS['Dani M.'], content: 'Golden hour on set — the kind of light that makes you forget you have a call sheet. Shot on anamorphic glass. No grade yet. This is straight off the log.', time: '2d ago', image: '/images/bts_cinematographer.png', likes: 134, replies: 19 },
    { id: 7, author: AUTHORS['Tony S.'], content: 'The shaker exploded again. Fortunately I had already filed the patent. The Bar-Man production continues.', time: '2d ago', likes: 38, replies: 6 },
    { id: 16, author: AUTHORS['Mia K.'], content: 'Reminder: production design is not decoration. It is the architecture of emotion. Every prop, every color temperature, every sight line is a decision that affects performance.', time: '2d ago', likes: 87, replies: 14 },
    { id: 8, author: AUTHORS['Lord Helmet'], content: 'In space, no one can hear you slurp spaghetti. But I can. I always can.', time: '02:33', likes: 89, replies: 14 },
    { id: 17, author: AUTHORS['Rafael G.'], content: 'Unpopular opinion: the best film scores are the ones you only notice when they are gone.', time: '3d ago', likes: 203, replies: 41 },
    { id: 18, author: AUTHORS['Ash V.'], content: 'Looking for an editor who can cut drama without losing the silence between the lines. Hashi profile required. Serious inquiries only.', time: '3d ago', badge: { label: 'OPEN ROLE', color: '#a3e635', bg: 'rgba(163,230,53,0.12)' }, likes: 47, replies: 6 },
    { id: 9, author: AUTHORS['Pietro M.'], content: 'Three projects. Two worlds. One platform. Hashi.', time: '3d ago', likes: 201, replies: 34 },
    { id: 10, author: AUTHORS['Bruce W.'], content: 'If you are serious about your craft, you commit. No excuses. No disappearing. Hashi holds you to that.', time: '4d ago', likes: 144, replies: 19 },
];

const TRENDING = [
    { name: 'The Bar-Man', members: 8, href: '/comms?project=bar-man' },
    { name: 'Space-Balls S2', members: 6, href: '/comms?project=space-balls' },
    { name: 'Ghost Protocol Noir', members: 3, href: '/missions' },
];

const SUGGESTED = [
    { name: 'Sara R.', role: 'Sound Designer', initials: 'SR', color: '#1a2a3a' },
    { name: 'Marco V.', role: 'VFX Compositor', initials: 'MV', color: '#2a1a1a' },
    { name: 'Elena K.', role: 'Score Composer', initials: 'EK', color: '#1a1a2a' },
];

const OPEN_ROLES = [
    { title: 'Sound Designer', project: 'The Bar-Man', type: 'Freelance' },
    { title: 'VFX Lead', project: 'Space-Balls S2', type: 'Full-time' },
    { title: 'Script Editor', project: 'Ghost Protocol', type: 'Contract' },
];

// ─── Toast system ─────────────────────────────────────────────────────────────
function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none' }}>
            {toasts.map(t => (
                <div key={t.id} style={{
                    pointerEvents: 'auto',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '11px 16px',
                    background: '#0d0d0d',
                    border: `1px solid ${t.type === 'success' ? 'rgba(163,230,53,0.35)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                    animation: 'toast-in 0.3s ease',
                    minWidth: '200px',
                }}>
                    <span style={{ fontSize: '14px' }}>{t.type === 'success' ? '✓' : 'ℹ'}</span>
                    <span style={{ fontSize: '13px', color: t.type === 'success' ? '#a3e635' : '#d1d5db', fontFamily: 'Courier New, monospace', letterSpacing: '0.04em' }}>{t.message}</span>
                    <button onClick={() => onDismiss(t.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', padding: '0 2px' }}>
                        <X size={12} />
                    </button>
                </div>
            ))}
        </div>
    );
}

function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);
    let nextId = 0;

    const show = useCallback((message: string, type: 'success' | 'info' = 'success') => {
        const id = Date.now() + nextId++;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dismiss = useCallback((id: number) => setToasts(prev => prev.filter(t => t.id !== id)), []);

    return { toasts, show, dismiss };
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ author, size = 36, onClick }: { author: Author; size?: number; onClick?: () => void }) {
    return (
        <div onClick={onClick} title={author.name} style={{
            width: size, height: size, borderRadius: '50%', background: author.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.28, fontWeight: 700, color: 'rgba(255,255,255,0.85)',
            flexShrink: 0, cursor: onClick ? 'pointer' : 'default',
            border: '1px solid rgba(255,255,255,0.08)', transition: 'opacity 0.15s',
        }}
            onMouseEnter={e => onClick && (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
            {author.initials}
        </div>
    );
}

// ─── Profile Modal ────────────────────────────────────────────────────────────
function ProfileModal({ name, onClose, onFollow, followed, showToast }: {
    name: string; onClose: () => void;
    onFollow: (name: string) => void; followed: Set<string>;
    showToast: (msg: string, type?: 'success' | 'info') => void;
}) {
    const profile = PROFILES[name];
    const [activeTab, setActiveTab] = useState<'posts' | 'projects' | 'ip' | 'reviews'>('posts');
    const [hoverStar, setHoverStar] = useState<string | null>(null);
    const isFollowing = followed.has(name);

    if (!profile) return null;
    const tabs: { id: typeof activeTab; label: string }[] = [
        { id: 'posts', label: 'Posts' },
        { id: 'projects', label: 'Projects' },
        { id: 'ip', label: 'IP' },
        { id: 'reviews', label: 'Reviews' },
    ];

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
            <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', width: '100%', maxWidth: '520px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                <div style={{ padding: '20px 24px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                        <Avatar author={profile} size={56} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '17px', fontWeight: 700, color: '#f9fafb', marginBottom: '2px' }}>{profile.name}</div>
                            <div style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'Courier New, monospace', letterSpacing: '0.06em', marginBottom: '8px' }}>{profile.role}</div>
                            <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.5 }}>{profile.bio}</div>
                        </div>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', padding: '4px' }}><X size={18} /></button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', gap: '3px' }}>
                            {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: '14px', color: s <= Math.round(profile.rating) ? '#a3e635' : '#374151' }}>★</span>)}
                        </div>
                        <span style={{ fontSize: '12px', fontFamily: 'Courier New, monospace', color: '#6b7280' }}>{profile.rating}/5</span>
                        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                            <button onClick={() => { onFollow(name); showToast(isFollowing ? `Unfollowed ${name}` : `Now following ${name}`, 'success'); }}
                                style={{ padding: '6px 16px', background: isFollowing ? 'rgba(163,230,53,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isFollowing ? 'rgba(163,230,53,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '20px', color: isFollowing ? '#a3e635' : '#9ca3af', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Courier New, monospace', letterSpacing: '0.06em', transition: 'all 0.15s' }}>
                                {isFollowing ? <><Check size={10} /> FOLLOWING</> : <><UserPlus size={10} /> FOLLOW</>}
                            </button>
                            <button onClick={() => showToast(`Invite sent to ${name}`, 'success')}
                                style={{ padding: '6px 16px', background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: '20px', color: '#a3e635', fontSize: '11px', cursor: 'pointer', fontFamily: 'Courier New, monospace', letterSpacing: '0.06em' }}>
                                INVITE
                            </button>
                        </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        {tabs.map(t => (
                            <button key={t.id} onClick={() => setActiveTab(t.id)}
                                style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === t.id ? '#a3e635' : 'transparent'}`, color: activeTab === t.id ? '#f9fafb' : '#4b5563', fontSize: '12px', fontWeight: activeTab === t.id ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Courier New, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
                    {activeTab === 'posts' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {INITIAL_POSTS.filter(p => p.author.name === profile.name).map(p => (
                                <div key={p.id} style={{ padding: '12px', background: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                                    <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.55 }}>{p.content}</div>
                                    <div style={{ marginTop: '8px', display: 'flex', gap: '12px', fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#374151' }}>
                                        <span>♥ {p.likes}</span><span>◎ {p.replies}</span><span>{p.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'projects' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {profile.projects.map((p, i) => (
                                <div key={i} style={{ padding: '14px 16px', background: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', cursor: 'pointer', transition: 'border-color 0.15s' }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)')}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#f9fafb', marginBottom: '3px' }}>{p.title}</div>
                                            <div style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#6b7280' }}>{p.role} · {p.date}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: '12px', color: s <= p.stars ? '#a3e635' : '#374151' }}>★</span>)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'ip' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {profile.ips.map((ip, i) => (
                                <div key={i} style={{ padding: '14px 16px', background: '#111111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(163,230,53,0.2)')}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#d1d5db' }}>{ip.title}</div>
                                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '9px', fontFamily: 'Courier New, monospace', letterSpacing: '0.1em', background: ip.status === 'Public' ? 'rgba(163,230,53,0.1)' : ip.status === 'Private' ? 'rgba(255,255,255,0.04)' : 'rgba(147,197,253,0.1)', color: ip.status === 'Public' ? '#a3e635' : ip.status === 'Private' ? '#6b7280' : '#93c5fd', border: `1px solid ${ip.status === 'Public' ? 'rgba(163,230,53,0.2)' : ip.status === 'Private' ? 'rgba(255,255,255,0.08)' : 'rgba(147,197,253,0.2)'}` }}>
                                        {ip.status.toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {Object.entries(profile.ratingBreakdown).map(([cat, val]) => (
                                <div key={cat} onMouseEnter={() => setHoverStar(cat)} onMouseLeave={() => setHoverStar(null)}
                                    style={{ padding: '12px 16px', background: hoverStar === cat ? 'rgba(255,255,255,0.03)' : '#111111', border: `1px solid ${hoverStar === cat ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '10px', transition: 'all 0.15s' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'Courier New, monospace', letterSpacing: '0.06em' }}>{cat.toUpperCase()}</span>
                                        <span style={{ fontSize: '12px', color: '#a3e635', fontFamily: 'Courier New, monospace' }}>{val}/5</span>
                                    </div>
                                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${(val / 5) * 100}%`, background: '#a3e635', borderRadius: '2px', transition: 'width 0.4s ease' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Role Modal ───────────────────────────────────────────────────────────────
function RoleModal({ title, project, type, onClose, showToast }: {
    title: string; project: string; type: string; onClose: () => void;
    showToast: (msg: string, type?: 'success' | 'info') => void;
}) {
    const [applied, setApplied] = useState(false);
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
            <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '28px' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#f9fafb', marginBottom: '4px' }}>{title}</div>
                        <div style={{ fontSize: '12px', fontFamily: 'Courier New, monospace', color: '#6b7280' }}>{project} · {type}</div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                <div style={{ padding: '16px', background: '#111111', borderRadius: '10px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.7 }}>
                        We are looking for a talented {title} to join the {project} production team. If you have the skills and the drive, apply via Hashi and let your work speak for itself.
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => { if (!applied) { setApplied(true); showToast(`Application sent for ${title}`, 'success'); } }}
                        style={{ flex: 1, padding: '12px', background: applied ? 'rgba(163,230,53,0.06)' : 'rgba(163,230,53,0.15)', border: '1px solid rgba(163,230,53,0.3)', borderRadius: '10px', color: '#a3e635', fontSize: '12px', fontFamily: 'Courier New, monospace', letterSpacing: '0.1em', cursor: applied ? 'default' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        {applied ? <><Check size={12} /> APPLIED</> : 'APPLY NOW'}
                    </button>
                    <button onClick={onClose} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#6b7280', fontSize: '12px', cursor: 'pointer' }}>CLOSE</button>
                </div>
            </div>
        </div>
    );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);
    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', cursor: 'zoom-out' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="full view" onClick={e => e.stopPropagation()} style={{ maxWidth: '92vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '12px', cursor: 'default', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }} />
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function FeedPage() {
    const { toasts, show: showToast, dismiss } = useToast();
    const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
    const [search, setSearch] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');
    const [openProfile, setOpenProfile] = useState<string | null>(null);
    const [openRole, setOpenRole] = useState<{ title: string; project: string; type: string } | null>(null);
    const [followed, setFollowed] = useState<Set<string>>(new Set());
    const [sharedPosts, setSharedPosts] = useState<Set<number>>(new Set());
    const [lightbox, setLightbox] = useState<string | null>(null);

    const toggleLike = (id: number) => {
        setPosts(prev => prev.map(p => {
            if (p.id === id) {
                const nowLiked = !p.liked;
                showToast(nowLiked ? '♥ Liked' : 'Like removed', 'success');
                return { ...p, liked: nowLiked, likes: nowLiked ? p.likes + 1 : p.likes - 1 };
            }
            return p;
        }));
    };

    const submitReply = (id: number, author: string) => {
        if (!replyText.trim()) return;
        setPosts(prev => prev.map(p => p.id === id ? { ...p, replies: p.replies + 1 } : p));
        showToast(`Reply sent to ${author}`, 'success');
        setReplyingTo(null);
        setReplyText('');
    };

    const toggleFollow = (name: string) => {
        setFollowed(prev => {
            const next = new Set(prev);
            if (next.has(name)) { next.delete(name); showToast(`Unfollowed ${name}`, 'info'); }
            else { next.add(name); showToast(`Now following ${name}`, 'success'); }
            return next;
        });
    };

    const sharePost = (id: number, author: string) => {
        setSharedPosts(prev => new Set(prev).add(id));
        showToast(`Post by ${author} shared`, 'success');
    };

    const filteredPosts = posts.filter(p =>
        search === '' || p.content.toLowerCase().includes(search.toLowerCase()) || p.author.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ height: '100vh', overflowY: 'auto', background: '#080808', display: 'flex' }}>
            {/* CSS animations */}
            <style>{`
                @keyframes toast-in {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* ── 2-col layout (feed + sidebar) ─── */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 300px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

                {/* ── Center feed ──────────────────── */}
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
                    {/* Sticky search */}
                    <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(12px)', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#374151', letterSpacing: '0.2em', marginBottom: '10px' }}>PUBLIC FEED</div>
                        <div style={{ position: 'relative' }}>
                            <Search size={13} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search posts, people, projects..."
                                style={{ width: '100%', padding: '9px 14px 9px 32px', background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', color: '#f9fafb', fontSize: '13px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                                onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.18)')}
                                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')} />
                        </div>
                    </div>

                    {/* Posts */}
                    {filteredPosts.length === 0 && (
                        <div style={{ padding: '48px', textAlign: 'center', color: '#374151', fontFamily: 'Courier New, monospace', fontSize: '12px', letterSpacing: '0.1em' }}>NO POSTS FOUND</div>
                    )}
                    {filteredPosts.map(post => (
                        <div key={post.id} style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.01)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Avatar author={post.author} onClick={() => setOpenProfile(post.author.name)} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
                                        <span onClick={() => setOpenProfile(post.author.name)}
                                            style={{ fontSize: '14px', fontWeight: 600, color: '#f9fafb', cursor: 'pointer', transition: 'color 0.15s' }}
                                            onMouseEnter={e => (e.currentTarget.style.color = '#a3e635')}
                                            onMouseLeave={e => (e.currentTarget.style.color = '#f9fafb')}>
                                            {post.author.name}
                                        </span>
                                        <span style={{ fontSize: '10px', color: '#4b5563', fontFamily: 'Courier New, monospace' }}>{post.author.role}</span>
                                        <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#374151', fontFamily: 'Courier New, monospace' }}>{post.time}</span>
                                    </div>

                                    <p style={{ fontSize: '14px', color: '#d1d5db', lineHeight: 1.65, marginBottom: '10px' }}>{post.content}</p>

                                    {post.badge && (
                                        <div style={{ marginBottom: '12px' }}>
                                            <span
                                                onClick={() => {
                                                    if (post.badge?.label === 'OPEN ROLE') {
                                                        setOpenRole({ title: 'Sound Designer', project: 'The Bar-Man', type: 'Freelance' });
                                                    } else {
                                                        showToast(`${post.badge?.label} — details coming soon`, 'info');
                                                    }
                                                }}
                                                style={{ padding: '4px 12px', background: post.badge.bg, border: `1px solid ${post.badge.color}33`, borderRadius: '20px', fontSize: '10px', fontFamily: 'Courier New, monospace', color: post.badge.color, letterSpacing: '0.1em', cursor: 'pointer', display: 'inline-block', transition: 'opacity 0.15s' }}
                                                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                                                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                                            >{post.badge.label}</span>
                                        </div>
                                    )}

                                    {post.image && (
                                        <div onClick={() => setLightbox(post.image!)} style={{ marginBottom: '12px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', cursor: 'zoom-in', position: 'relative' }}
                                            onMouseEnter={e => { (e.currentTarget.querySelector('img') as HTMLImageElement).style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
                                            onMouseLeave={e => { (e.currentTarget.querySelector('img') as HTMLImageElement).style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={post.image} alt="attachment" style={{ width: '100%', maxHeight: '260px', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }} />
                                            <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', borderRadius: '6px', padding: '4px 8px', fontSize: '9px', fontFamily: 'Courier New, monospace', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', backdropFilter: 'blur(4px)' }}>CLICK TO EXPAND</div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '20px', marginTop: '4px' }}>
                                        <button onClick={e => { e.stopPropagation(); toggleLike(post.id); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: post.liked ? '#fb923c' : '#4b5563', fontSize: '12px', fontFamily: 'Courier New, monospace', transition: 'color 0.15s', padding: 0 }}
                                            onMouseEnter={e => { if (!post.liked) e.currentTarget.style.color = '#9ca3af'; }}
                                            onMouseLeave={e => { if (!post.liked) e.currentTarget.style.color = '#4b5563'; }}>
                                            <Heart size={14} fill={post.liked ? '#fb923c' : 'none'} />{post.likes}
                                        </button>
                                        <button onClick={e => { e.stopPropagation(); setReplyingTo(replyingTo === post.id ? null : post.id); setReplyText(''); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: replyingTo === post.id ? '#93c5fd' : '#4b5563', fontSize: '12px', fontFamily: 'Courier New, monospace', transition: 'color 0.15s', padding: 0 }}>
                                            <MessageCircle size={14} />{post.replies}
                                        </button>
                                        <button onClick={e => { e.stopPropagation(); sharePost(post.id, post.author.name); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: sharedPosts.has(post.id) ? '#a3e635' : '#4b5563', fontSize: '12px', fontFamily: 'Courier New, monospace', transition: 'color 0.15s', padding: 0 }}>
                                            <Share2 size={14} />Share
                                        </button>
                                    </div>

                                    {replyingTo === post.id && (
                                        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }} onClick={e => e.stopPropagation()}>
                                            <input autoFocus type="text" value={replyText} onChange={e => setReplyText(e.target.value)}
                                                onKeyDown={e => { if (e.key === 'Enter') submitReply(post.id, post.author.name); if (e.key === 'Escape') { setReplyingTo(null); setReplyText(''); } }}
                                                placeholder={`Reply to ${post.author.name}...`}
                                                style={{ flex: 1, padding: '8px 14px', background: '#111111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: '#f9fafb', fontSize: '13px', outline: 'none' }} />
                                            <button onClick={() => submitReply(post.id, post.author.name)}
                                                style={{ padding: '8px 16px', background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.25)', borderRadius: '20px', color: '#a3e635', fontSize: '11px', cursor: 'pointer', fontFamily: 'Courier New, monospace' }}>SEND</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Right sidebar ─────────────────── */}
                <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: 0, height: '100vh', overflow: 'auto' }}>

                    {/* Trending */}
                    <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: '#4b5563', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Briefcase size={10} /> Trending Projects
                        </div>
                        {TRENDING.map((t, i) => (
                            <a key={i} href={t.href} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 8px', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.15s', marginBottom: '2px' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                <span style={{ fontSize: '13px', fontWeight: 500, color: '#d1d5db' }}>{t.name}</span>
                                <span style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: '#4b5563' }}>{t.members}m</span>
                            </a>
                        ))}
                    </div>

                    {/* Suggested */}
                    <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: '#4b5563', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Users size={10} /> Suggested Collaborators
                        </div>
                        {SUGGESTED.map((s, i) => {
                            const isFollowed = followed.has(s.name);
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < SUGGESTED.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', flexShrink: 0 }}>{s.initials}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '12px', fontWeight: 500, color: '#d1d5db' }}>{s.name}</div>
                                        <div style={{ fontSize: '10px', color: '#4b5563', fontFamily: 'Courier New, monospace' }}>{s.role}</div>
                                    </div>
                                    <button onClick={() => toggleFollow(s.name)}
                                        style={{ padding: '3px 10px', background: isFollowed ? 'rgba(163,230,53,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isFollowed ? 'rgba(163,230,53,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '20px', color: isFollowed ? '#a3e635' : '#6b7280', fontSize: '9px', cursor: 'pointer', fontFamily: 'Courier New, monospace', letterSpacing: '0.06em', transition: 'all 0.15s', flexShrink: 0 }}>
                                        {isFollowed ? '✓' : 'FOLLOW'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Open roles */}
                    <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: '#4b5563', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Star size={10} /> Open Roles
                        </div>
                        {OPEN_ROLES.map((r, i) => (
                            <div key={i} onClick={() => setOpenRole(r)}
                                style={{ padding: '9px 8px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', border: '1px solid rgba(255,255,255,0.04)', transition: 'all 0.15s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', fontWeight: 500, color: '#d1d5db', marginBottom: '2px' }}>{r.title}</div>
                                        <div style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: '#4b5563' }}>{r.project}</div>
                                    </div>
                                    <span style={{ padding: '2px 7px', background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: '8px', fontSize: '9px', color: '#a3e635', fontFamily: 'Courier New, monospace' }}>OPEN</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {openProfile && (
                <ProfileModal name={openProfile} onClose={() => setOpenProfile(null)}
                    onFollow={toggleFollow} followed={followed} showToast={showToast} />
            )}
            {openRole && (
                <RoleModal title={openRole.title} project={openRole.project} type={openRole.type}
                    onClose={() => setOpenRole(null)} showToast={showToast} />
            )}
            {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}

            {/* Toast notifications */}
            <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </div>
    );
}
