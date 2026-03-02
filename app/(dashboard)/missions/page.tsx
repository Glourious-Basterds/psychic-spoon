'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';

type MissionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'IN_CONSIDERATION';
type FilterTab = 'ALL' | 'CURRENT' | 'PAST' | 'FUTURE';

interface Milestone {
    label: string;
    state: 'done' | 'active' | 'future';
    tooltip: string;
}

interface DueDate {
    label: string;
    date: string;
    urgency: 'overdue' | 'soon' | 'ok';
    detail: string;
}

interface Mission {
    id: string;
    title: string;
    role: string;
    projectNumber: string;
    status: MissionStatus;
    progress?: number;
    summary?: string;
    members?: { initials: string; color: string; name: string }[];
    extraMembers?: number;
    milestones?: Milestone[];
    photos?: { emoji: string; bg: string }[];
    dueDates?: DueDate[];
    rating?: number;
    views?: string;
    repPts?: number;
    offer?: string;
}

const MISSIONS: Mission[] = [
    {
        id: 'bar-man',
        title: 'The Bar Man',
        role: 'Lead Director',
        projectNumber: '#0041',
        status: 'IN_PROGRESS',
        progress: 62,
        summary: 'A noir short film following a bartender who slowly realizes his regulars are ghosts. Visual tone: desaturated, high contrast. Sound design is central.',
        members: [
            { initials: 'JK', color: '#1e3a5f', name: 'James K.' },
            { initials: 'SR', color: '#1a4731', name: 'Sara R.' },
            { initials: 'MT', color: '#4a1a1a', name: 'Marco T.' },
            { initials: 'AL', color: '#4a2e0a', name: 'Anna L.' },
        ],
        extraMembers: 2,
        milestones: [
            { label: 'Script 11/23', state: 'done', tooltip: 'Completed on Nov 23 · Approved by director' },
            { label: 'Storyboard 12/01', state: 'done', tooltip: 'Completed on Dec 1 · All scenes locked' },
            { label: 'Rough Cut 12/27', state: 'active', tooltip: 'Next step: Deliver rough cut to editor by Dec 27. 3 scenes remaining.' },
            { label: 'Final 01/10', state: 'future', tooltip: 'Final delivery — Jan 10' },
        ],
        photos: [
            { emoji: '🎬', bg: 'linear-gradient(135deg, #0d1b2a, #1a2d42)' },
            { emoji: '🎭', bg: 'linear-gradient(135deg, #0d2a1a, #1a4228)' },
            { emoji: '🎙', bg: 'linear-gradient(135deg, #2a1e0d, #3d2c12)' },
        ],
        dueDates: [
            { label: 'SOUND MIX', date: 'Dec 20', urgency: 'overdue', detail: 'OVERDUE — Sound mix was due Dec 20. Contact audio team immediately.' },
            { label: 'ROUGH CUT', date: 'Dec 27', urgency: 'soon', detail: 'Due in 3 days — Rough cut delivery to editing suite.' },
            { label: 'COLOR GRADE', date: 'Jan 05', urgency: 'ok', detail: 'On track — Color grading session booked Jan 5.' },
            { label: 'FINAL DELIVERY', date: 'Jan 10', urgency: 'ok', detail: 'Final delivery to distributor, Jan 10.' },
        ],
    },
    {
        id: 'space-balls',
        title: 'Space Balls — Season 2',
        role: 'Animator',
        projectNumber: '#0038',
        status: 'IN_PROGRESS',
        progress: 40,
        summary: 'A space comedy in which Lord Helmet and his crew attempt to cook authentic Italian cuisine in zero gravity. Visual tone: vibrant, wide-angle, full of chaos. Animation pipeline in full swing.',
        members: [
            { initials: 'LH', color: '#3a1a3a', name: 'Lord Helmet' },
            { initials: 'TS', color: '#3a1e1e', name: 'Tony S.' },
            { initials: 'PM', color: '#1e3a5f', name: 'Pietro M.' },
            { initials: 'EK', color: '#1a1a2a', name: 'Elena K.' },
        ],
        extraMembers: 3,
        milestones: [
            { label: 'Concept 10/15', state: 'done', tooltip: 'Completed Oct 15 · Concept approved by full cast' },
            { label: 'Animatic 11/30', state: 'done', tooltip: 'Completed Nov 30 · All scenes storyboarded and timed' },
            { label: 'Animation 01/20', state: 'active', tooltip: 'In progress — 40% of animation complete. Pasta cannon sequence pending.' },
            { label: 'Post 02/28', state: 'future', tooltip: 'Post-production and VFX — Feb 28' },
        ],
        photos: [
            { emoji: '🚀', bg: 'linear-gradient(135deg, #0d0f2a, #1a1d42)' },
            { emoji: '🍝', bg: 'linear-gradient(135deg, #2a1a0d, #3d2c12)' },
            { emoji: '🪖', bg: 'linear-gradient(135deg, #1a0d2a, #2d1a42)' },
        ],
        dueDates: [
            { label: 'ANIMATIC', date: 'Nov 30', urgency: 'ok' as const, detail: 'Completed — Animatic delivered and approved.' },
            { label: 'ANIMATION', date: 'Jan 20', urgency: 'soon' as const, detail: 'Due Jan 20 — 40% complete. Pasta cannon sequence is the critical path.' },
            { label: 'VFX PASS', date: 'Feb 10', urgency: 'ok' as const, detail: 'On track — VFX team briefed. Zero-gravity pasta effects in production.' },
            { label: 'FINAL CUT', date: 'Feb 28', urgency: 'ok' as const, detail: 'Final delivery — Feb 28. Distribution via Hashi IP Vault.' },
        ],
    },
    {
        id: 'sweet-angel',
        title: 'Sweet Angel',
        role: 'Sound Designer',
        projectNumber: '#0029',
        status: 'COMPLETED',
        progress: 100,
        rating: 4,
        views: '2.4k',
        repPts: 18,
    },
    {
        id: 'project-nexus',
        title: 'Project Nexus',
        role: 'Performer',
        projectNumber: '',
        status: 'IN_CONSIDERATION',
        offer: '$100',
    },
];

const STATUS_CONFIG = {
    IN_PROGRESS: { dot: '#3b82f6', badge: { bg: 'rgba(59,130,246,0.1)', text: '#60a5fa', border: 'rgba(59,130,246,0.25)' }, label: 'IN PROGRESS', filter: 'CURRENT' as FilterTab },
    COMPLETED: { dot: '#22c55e', badge: { bg: 'rgba(34,197,94,0.1)', text: '#4ade80', border: 'rgba(34,197,94,0.25)' }, label: 'COMPLETED', filter: 'PAST' as FilterTab },
    IN_CONSIDERATION: { dot: '#f97316', badge: { bg: 'rgba(249,115,22,0.1)', text: '#fb923c', border: 'rgba(249,115,22,0.25)' }, label: 'PENDING', filter: 'FUTURE' as FilterTab },
};

const URGENCY_COLOR = { overdue: '#ef4444', soon: '#f97316', ok: '#22c55e' };

const FILTER_MAP: Record<FilterTab, MissionStatus[]> = {
    ALL: ['IN_PROGRESS', 'COMPLETED', 'IN_CONSIDERATION'],
    CURRENT: ['IN_PROGRESS'],
    PAST: ['COMPLETED'],
    FUTURE: ['IN_CONSIDERATION'],
};

export default function MissionsPage() {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['bar-man']));
    const [filter, setFilter] = useState<FilterTab>('ALL');
    const [search, setSearch] = useState('');
    const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
    const [dueDateDetail, setDueDateDetail] = useState<string | null>(null);

    const toggle = (id: string) => setExpandedIds(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    const handleBadgeClick = (e: React.MouseEvent, status: MissionStatus) => {
        e.stopPropagation();
        const tab = STATUS_CONFIG[status].filter;
        setFilter(prev => prev === tab ? 'ALL' : tab);
    };

    const filteredMissions = MISSIONS.filter(m =>
        FILTER_MAP[filter].includes(m.status) &&
        m.title.toLowerCase().includes(search.toLowerCase())
    );

    const grouped = {
        IN_PROGRESS: filteredMissions.filter(m => m.status === 'IN_PROGRESS'),
        COMPLETED: filteredMissions.filter(m => m.status === 'COMPLETED'),
        IN_CONSIDERATION: filteredMissions.filter(m => m.status === 'IN_CONSIDERATION'),
    };

    const filterTabs: FilterTab[] = ['ALL', 'CURRENT', 'PAST', 'FUTURE'];

    const showTooltip = (e: React.MouseEvent, text: string) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setTooltip({ text, x: rect.left + rect.width / 2, y: rect.top - 8 });
    };
    const hideTooltip = () => setTooltip(null);

    return (
        <div className="missions-root">
            {/* Topbar */}
            <div className="missions-topbar">
                <h1 className="missions-title">Missions</h1>
                <div className="missions-search-wrap">
                    <Search size={14} className="missions-search-icon" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search missions..."
                        className="missions-search"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', padding: 0 }}>
                            <X size={12} />
                        </button>
                    )}
                </div>
                <div className="missions-filters">
                    {filterTabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`missions-filter-tab ${filter === tab ? 'active' : ''}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="missions-content">
                {(Object.entries(grouped) as [MissionStatus, Mission[]][]).map(([status, missions]) => {
                    if (missions.length === 0) return null;
                    const sectionLabel = status === 'IN_PROGRESS' ? 'In Progress' : status === 'COMPLETED' ? 'Completed' : 'In Consideration';
                    return (
                        <div key={status} className="missions-section">
                            <div className="missions-divider">
                                <span className="missions-divider-label">{sectionLabel}</span>
                                <div className="missions-divider-line" />
                            </div>

                            {missions.map(mission => {
                                const cfg = STATUS_CONFIG[mission.status];
                                const isExpanded = expandedIds.has(mission.id);
                                return (
                                    <div key={mission.id} className="mission-card">
                                        {/* Header */}
                                        <div className="mission-card-header" onClick={() => toggle(mission.id)}>
                                            <div className="mission-header-left">
                                                <span className="mission-status-dot" style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }} />
                                                <div>
                                                    <div className="mission-title">{mission.title}</div>
                                                    <div className="mission-sub">
                                                        {mission.role}
                                                        {mission.projectNumber && <> · Project {mission.projectNumber}</>}
                                                        {mission.status === 'IN_CONSIDERATION' && !mission.projectNumber && <> · Role application pending</>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mission-header-right">
                                                {mission.progress !== undefined && (
                                                    <>
                                                        <div className="mission-mini-bar">
                                                            <div className="mission-mini-bar-fill" style={{ width: `${mission.progress}%` }} />
                                                        </div>
                                                        <span className="mission-pct" style={{ color: cfg.dot }}>{mission.progress}%</span>
                                                    </>
                                                )}
                                                {mission.offer && <span className="mission-offer">{mission.offer} offer</span>}
                                                <button
                                                    className="mission-badge"
                                                    style={{ background: cfg.badge.bg, color: cfg.badge.text, border: `1px solid ${cfg.badge.border}`, cursor: 'pointer' }}
                                                    onClick={e => handleBadgeClick(e, mission.status)}
                                                    title={`Filter by ${cfg.label}`}
                                                >
                                                    {cfg.label}
                                                </button>
                                                {isExpanded ? <ChevronUp size={16} className="mission-chevron" /> : <ChevronDown size={16} className="mission-chevron" />}
                                            </div>
                                        </div>

                                        {/* Rating Row (collapsed completed) */}
                                        {mission.status === 'COMPLETED' && !isExpanded && (
                                            <div className="mission-rating-row">
                                                <div className="mission-stars">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <span key={s} style={{ color: s <= (mission.rating || 0) ? '#facc15' : '#374151' }}>★</span>
                                                    ))}
                                                </div>
                                                <span className="mission-rating-label">Your project rating</span>
                                                <span className="mission-views">👁 {mission.views} views</span>
                                                <span className="mission-rep">+{mission.repPts} rep pts</span>
                                            </div>
                                        )}

                                        {/* Expanded Body */}
                                        {isExpanded && mission.summary && (
                                            <div className="mission-body">
                                                <div className="mission-body-line" />
                                                <div className="mission-body-inner">
                                                    {/* LEFT */}
                                                    <div className="mission-col-left">
                                                        <div className="mission-section-block">
                                                            <div className="mission-section-label">SUMMARY</div>
                                                            <p className="mission-summary-text">{mission.summary}</p>
                                                            {mission.members && (
                                                                <div className="mission-members">
                                                                    {mission.members.map((m, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className="mission-avatar"
                                                                            style={{ background: m.color }}
                                                                            onMouseEnter={e => showTooltip(e, m.name)}
                                                                            onMouseLeave={hideTooltip}
                                                                        >
                                                                            {m.initials}
                                                                        </div>
                                                                    ))}
                                                                    {mission.extraMembers && <span className="mission-extra-members">+{mission.extraMembers} members</span>}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {mission.progress !== undefined && (
                                                            <div className="mission-section-block">
                                                                <div className="mission-section-label">PROGRESS</div>
                                                                <div className="mission-progress-bar">
                                                                    <div className="mission-progress-fill" style={{ width: `${mission.progress}%` }} />
                                                                </div>
                                                                <div className="mission-progress-meta">
                                                                    <span>Script → Edit → Sound → Grade</span>
                                                                    <span style={{ color: '#60a5fa', fontWeight: 700 }}>{mission.progress}%</span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {mission.milestones && (
                                                            <div className="mission-section-block">
                                                                <div className="mission-section-label">MILESTONES</div>
                                                                <div className="mission-milestones">
                                                                    {mission.milestones.map((ms, i) => (
                                                                        <span
                                                                            key={i}
                                                                            className={`mission-milestone mission-milestone-${ms.state}`}
                                                                            onMouseEnter={e => showTooltip(e, ms.tooltip)}
                                                                            onMouseLeave={hideTooltip}
                                                                            style={{ cursor: 'help' }}
                                                                        >
                                                                            {ms.state === 'done' ? <s>{ms.label}</s> : ms.label}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mission-col-divider" />

                                                    {/* RIGHT */}
                                                    <div className="mission-col-right">
                                                        {mission.photos && (
                                                            <div className="mission-section-block">
                                                                <div className="mission-section-label">PROJECT PHOTOS</div>
                                                                <div className="mission-photos-grid">
                                                                    {mission.photos.map((p, i) => (
                                                                        <div key={i} className={`mission-photo ${i === 0 ? 'mission-photo-main' : 'mission-photo-sm'}`} style={{ background: p.bg, cursor: 'default' }}>
                                                                            <span className="mission-photo-emoji">{p.emoji}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {mission.dueDates && (
                                                            <div className="mission-section-block">
                                                                <div className="mission-section-label">DUE DATES</div>
                                                                <div className="mission-due-grid">
                                                                    {mission.dueDates.map((d, i) => (
                                                                        <button
                                                                            key={i}
                                                                            className="mission-due-box"
                                                                            onClick={() => setDueDateDetail(d.detail)}
                                                                            style={{ cursor: 'pointer', background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '10px 12px', textAlign: 'left', transition: 'border-color 0.15s' }}
                                                                            onMouseEnter={e => (e.currentTarget.style.borderColor = `${URGENCY_COLOR[d.urgency]}40`)}
                                                                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                                                                        >
                                                                            <div className="mission-due-label">{d.label}</div>
                                                                            <div className="mission-due-date" style={{ color: URGENCY_COLOR[d.urgency] }}>{d.date}</div>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Rating row expanded */}
                                        {isExpanded && mission.status === 'COMPLETED' && (
                                            <div className="mission-rating-row">
                                                <div className="mission-stars">
                                                    {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ color: s <= (mission.rating || 0) ? '#facc15' : '#374151' }}>★</span>)}
                                                </div>
                                                <span className="mission-rating-label">Your project rating</span>
                                                <span className="mission-views">👁 {mission.views} views</span>
                                                <span className="mission-rep">+{mission.repPts} rep pts</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}

                {filteredMissions.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px 24px', color: '#4b5563', fontFamily: 'Courier New, monospace', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        No missions match your filters
                    </div>
                )}
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div style={{
                    position: 'fixed',
                    left: tooltip.x,
                    top: tooltip.y,
                    transform: 'translate(-50%, -100%)',
                    background: '#1c1c1c',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '11px',
                    color: '#d1d5db',
                    fontFamily: 'Courier New, monospace',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    maxWidth: '280px',
                    whiteSpace: 'pre-wrap' as const,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                }}>
                    {tooltip.text}
                </div>
            )}

            {/* Due Date Detail Modal */}
            {dueDateDetail && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setDueDateDetail(null)}>
                    <div style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '28px', maxWidth: '380px', width: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setDueDateDetail(null)} style={{ position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={16} /></button>
                        <div style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: '#4b5563', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Due Date Details</div>
                        <p style={{ fontSize: '14px', color: '#d1d5db', lineHeight: 1.7, margin: 0 }}>{dueDateDetail}</p>
                    </div>
                </div>
            )}

            <style>{`
                .missions-root { display: flex; flex-direction: column; height: 100%; background: #0a0a0a; color: #e5e7eb; font-family: 'Inter', sans-serif; }
                .missions-topbar { display: flex; align-items: center; gap: 16px; padding: 0 24px; height: 56px; background: #111111; border-bottom: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; }
                .missions-title { font-size: 15px; font-weight: 600; color: #f9fafb; margin: 0; white-space: nowrap; }
                .missions-search-wrap { position: relative; flex: 1; max-width: 360px; }
                .missions-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #4b5563; pointer-events: none; }
                .missions-search { width: 100%; background: #0d0d0d; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 6px 30px 6px 32px; font-size: 12px; font-family: 'Courier New', monospace; color: #d1d5db; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
                .missions-search::placeholder { color: #4b5563; }
                .missions-search:focus { border-color: rgba(255,255,255,0.16); }
                .missions-filters { display: flex; gap: 4px; margin-left: auto; }
                .missions-filter-tab { padding: 4px 12px; font-size: 10px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); background: transparent; color: #6b7280; cursor: pointer; transition: all 0.15s; }
                .missions-filter-tab:hover { color: #d1d5db; border-color: rgba(255,255,255,0.2); }
                .missions-filter-tab.active { background: rgba(163,230,53,0.12); color: #a3e635; border-color: rgba(163,230,53,0.3); }
                .missions-content { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 32px; }
                .missions-section { display: flex; flex-direction: column; gap: 8px; }
                .missions-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
                .missions-divider-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'Courier New', monospace; color: #4b5563; white-space: nowrap; }
                .missions-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
                .mission-card { background: #111111; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; overflow: hidden; transition: border-color 0.2s; }
                .mission-card:hover { border-color: rgba(255,255,255,0.12); }
                .mission-card-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; cursor: pointer; gap: 16px; user-select: none; }
                .mission-header-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
                .mission-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
                .mission-title { font-size: 15px; font-weight: 600; color: #f9fafb; line-height: 1.2; }
                .mission-sub { font-size: 11px; font-family: 'Courier New', monospace; color: #6b7280; margin-top: 2px; letter-spacing: 0.05em; }
                .mission-header-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
                .mission-mini-bar { width: 80px; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
                .mission-mini-bar-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #60a5fa); border-radius: 2px; }
                .mission-pct { font-size: 11px; font-family: 'Courier New', monospace; font-weight: 700; min-width: 32px; text-align: right; }
                .mission-offer { font-size: 11px; font-family: 'Courier New', monospace; font-weight: 700; color: #fb923c; }
                .mission-badge { font-size: 10px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 0.06em; padding: 3px 10px; border-radius: 20px; white-space: nowrap; transition: opacity 0.15s; }
                .mission-badge:hover { opacity: 0.75; }
                .mission-chevron { color: #4b5563; flex-shrink: 0; }
                .mission-rating-row { display: flex; align-items: center; gap: 10px; padding: 10px 18px; background: #0e0e0e; border-top: 1px solid rgba(255,255,255,0.06); font-family: 'Courier New', monospace; font-size: 11px; }
                .mission-stars { font-size: 14px; letter-spacing: 1px; }
                .mission-rating-label { color: #4b5563; flex: 1; }
                .mission-views { color: #6b7280; }
                .mission-rep { color: #4ade80; font-weight: 700; }
                .mission-body-line { height: 1px; background: rgba(255,255,255,0.06); }
                .mission-body-inner { display: flex; padding: 20px 18px; background: #0e0e0e; }
                .mission-col-left { flex: 1; display: flex; flex-direction: column; gap: 20px; padding-right: 20px; }
                .mission-col-divider { width: 1px; background: rgba(255,255,255,0.06); flex-shrink: 0; }
                .mission-col-right { flex: 1; display: flex; flex-direction: column; gap: 20px; padding-left: 20px; }
                .mission-section-block { display: flex; flex-direction: column; gap: 8px; }
                .mission-section-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'Courier New', monospace; color: #4b5563; }
                .mission-summary-text { font-size: 13px; line-height: 1.6; color: #9ca3af; margin: 0; }
                .mission-members { display: flex; align-items: center; gap: 4px; margin-top: 4px; }
                .mission-avatar { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #0e0e0e; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.8); margin-left: -4px; cursor: default; transition: transform 0.15s; }
                .mission-avatar:first-child { margin-left: 0; }
                .mission-avatar:hover { transform: scale(1.2); z-index: 10; }
                .mission-extra-members { font-size: 11px; font-family: 'Courier New', monospace; color: #6b7280; margin-left: 6px; }
                .mission-progress-bar { height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
                .mission-progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #60a5fa); border-radius: 2px; }
                .mission-progress-meta { display: flex; justify-content: space-between; font-size: 11px; font-family: 'Courier New', monospace; color: #6b7280; }
                .mission-milestones { display: flex; flex-wrap: wrap; gap: 6px; }
                .mission-milestone { font-size: 11px; font-family: 'Courier New', monospace; padding: 3px 10px; border-radius: 20px; font-weight: 600; transition: opacity 0.15s; }
                .mission-milestone:hover { opacity: 0.75; }
                .mission-milestone-done { background: rgba(34,197,94,0.08); color: #4b5563; border: 1px solid rgba(34,197,94,0.15); }
                .mission-milestone-active { background: rgba(163,230,53,0.1); color: #a3e635; border: 1px solid rgba(163,230,53,0.3); }
                .mission-milestone-future { background: rgba(255,255,255,0.04); color: #4b5563; border: 1px solid rgba(255,255,255,0.06); }
                .mission-photos-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 6px; height: 100px; }
                .mission-photo { border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; }
                .mission-photo-emoji { font-size: 20px; }
                .mission-due-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
                .mission-due-label { font-size: 9px; font-family: 'Courier New', monospace; letter-spacing: 0.1em; text-transform: uppercase; color: #4b5563; margin-bottom: 4px; }
                .mission-due-date { font-size: 14px; font-weight: 700; font-family: 'Courier New', monospace; }
                .missions-content::-webkit-scrollbar { width: 4px; }
                .missions-content::-webkit-scrollbar-track { background: transparent; }
                .missions-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
            `}</style>
        </div>
    );
}
