'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Circle } from 'lucide-react';

type MissionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'IN_CONSIDERATION';
type FilterTab = 'ALL' | 'CURRENT' | 'PAST' | 'FUTURE';

interface Milestone {
    label: string;
    date: string;
    state: 'done' | 'active' | 'future';
}

interface DueDate {
    label: string;
    date: string;
    urgency: 'overdue' | 'soon' | 'ok';
}

interface Mission {
    id: string;
    title: string;
    role: string;
    projectNumber: string;
    status: MissionStatus;
    progress?: number;
    summary?: string;
    members?: { initials: string; color: string }[];
    extraMembers?: number;
    milestones?: Milestone[];
    photos?: { emoji: string; bg: string }[];
    dueDates?: DueDate[];
    // Completed fields
    rating?: number;
    views?: string;
    repPts?: number;
    // In consideration fields
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
            { initials: 'JK', color: '#1e3a5f' },
            { initials: 'SR', color: '#1a4731' },
            { initials: 'MT', color: '#4a1a1a' },
            { initials: 'AL', color: '#4a2e0a' },
        ],
        extraMembers: 2,
        milestones: [
            { label: 'Script 11/23', date: '', state: 'done' },
            { label: 'Storyboard 12/01', date: '', state: 'done' },
            { label: 'Rough Cut 12/27', date: '', state: 'active' },
            { label: 'Final 01/10', date: '', state: 'future' },
        ],
        photos: [
            { emoji: '🎬', bg: 'linear-gradient(135deg, #0d1b2a, #1a2d42)' },
            { emoji: '🎭', bg: 'linear-gradient(135deg, #0d2a1a, #1a4228)' },
            { emoji: '🎙', bg: 'linear-gradient(135deg, #2a1e0d, #3d2c12)' },
        ],
        dueDates: [
            { label: 'SOUND MIX', date: 'Dec 20', urgency: 'overdue' },
            { label: 'ROUGH CUT', date: 'Dec 27', urgency: 'soon' },
            { label: 'COLOR GRADE', date: 'Jan 05', urgency: 'ok' },
            { label: 'FINAL DELIVERY', date: 'Jan 10', urgency: 'ok' },
        ],
    },
    {
        id: 'space-balls',
        title: 'Space Balls — Season 2',
        role: 'Animator',
        projectNumber: '#0038',
        status: 'IN_PROGRESS',
        progress: 40,
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
    IN_PROGRESS: { dot: '#3b82f6', badge: { bg: 'rgba(59,130,246,0.1)', text: '#60a5fa', border: 'rgba(59,130,246,0.25)' }, label: 'IN PROGRESS' },
    COMPLETED: { dot: '#22c55e', badge: { bg: 'rgba(34,197,94,0.1)', text: '#4ade80', border: 'rgba(34,197,94,0.25)' }, label: 'COMPLETED' },
    IN_CONSIDERATION: { dot: '#f97316', badge: { bg: 'rgba(249,115,22,0.1)', text: '#fb923c', border: 'rgba(249,115,22,0.25)' }, label: 'PENDING' },
};

const URGENCY_COLOR = {
    overdue: '#ef4444',
    soon: '#f97316',
    ok: '#22c55e',
};

export default function MissionsPage() {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['bar-man']));
    const [filter, setFilter] = useState<FilterTab>('ALL');
    const [search, setSearch] = useState('');

    const toggle = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const grouped = {
        IN_PROGRESS: MISSIONS.filter(m => m.status === 'IN_PROGRESS'),
        COMPLETED: MISSIONS.filter(m => m.status === 'COMPLETED'),
        IN_CONSIDERATION: MISSIONS.filter(m => m.status === 'IN_CONSIDERATION'),
    };

    const filterTabs: FilterTab[] = ['ALL', 'CURRENT', 'PAST', 'FUTURE'];

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
                    const sectionLabel =
                        status === 'IN_PROGRESS' ? 'In Progress' :
                            status === 'COMPLETED' ? 'Completed' : 'In Consideration';
                    return (
                        <div key={status} className="missions-section">
                            {/* Section Divider */}
                            <div className="missions-divider">
                                <span className="missions-divider-label">{sectionLabel}</span>
                                <div className="missions-divider-line" />
                            </div>

                            {/* Cards */}
                            {missions.map(mission => {
                                const cfg = STATUS_CONFIG[mission.status];
                                const isExpanded = expandedIds.has(mission.id);

                                return (
                                    <div key={mission.id} className="mission-card">
                                        {/* Card Header */}
                                        <div
                                            className="mission-card-header"
                                            onClick={() => toggle(mission.id)}
                                        >
                                            <div className="mission-header-left">
                                                <span
                                                    className="mission-status-dot"
                                                    style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }}
                                                />
                                                <div>
                                                    <div className="mission-title">{mission.title}</div>
                                                    <div className="mission-sub">
                                                        {mission.role}
                                                        {mission.projectNumber && (
                                                            <> &nbsp;·&nbsp; Project {mission.projectNumber}</>
                                                        )}
                                                        {mission.status === 'IN_CONSIDERATION' && !mission.projectNumber && (
                                                            <> · Role application pending</>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mission-header-right">
                                                {/* Progress bar (collapsed) */}
                                                {mission.progress !== undefined && (
                                                    <>
                                                        <div className="mission-mini-bar">
                                                            <div
                                                                className="mission-mini-bar-fill"
                                                                style={{ width: `${mission.progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="mission-pct" style={{ color: cfg.dot }}>
                                                            {mission.progress}%
                                                        </span>
                                                    </>
                                                )}

                                                {/* Offer (In Consideration) */}
                                                {mission.offer && (
                                                    <span className="mission-offer">{mission.offer} offer</span>
                                                )}

                                                {/* Status Badge */}
                                                <span
                                                    className="mission-badge"
                                                    style={{
                                                        background: cfg.badge.bg,
                                                        color: cfg.badge.text,
                                                        border: `1px solid ${cfg.badge.border}`,
                                                    }}
                                                >
                                                    {cfg.label}
                                                </span>

                                                {isExpanded ? <ChevronUp size={16} className="mission-chevron" /> : <ChevronDown size={16} className="mission-chevron" />}
                                            </div>
                                        </div>

                                        {/* Rating Row for Completed (always visible) */}
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
                                                    {/* Left Column */}
                                                    <div className="mission-col-left">
                                                        {/* Summary */}
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
                                                                        >
                                                                            {m.initials}
                                                                        </div>
                                                                    ))}
                                                                    {mission.extraMembers && (
                                                                        <span className="mission-extra-members">+{mission.extraMembers} members</span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Progress */}
                                                        {mission.progress !== undefined && (
                                                            <div className="mission-section-block">
                                                                <div className="mission-section-label">PROGRESS</div>
                                                                <div className="mission-progress-bar">
                                                                    <div
                                                                        className="mission-progress-fill"
                                                                        style={{ width: `${mission.progress}%` }}
                                                                    />
                                                                </div>
                                                                <div className="mission-progress-meta">
                                                                    <span>Script → Edit → Sound → Grade</span>
                                                                    <span style={{ color: '#60a5fa', fontWeight: 700 }}>{mission.progress}%</span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Milestones */}
                                                        {mission.milestones && (
                                                            <div className="mission-section-block">
                                                                <div className="mission-section-label">MILESTONES</div>
                                                                <div className="mission-milestones">
                                                                    {mission.milestones.map((ms, i) => (
                                                                        <span
                                                                            key={i}
                                                                            className={`mission-milestone mission-milestone-${ms.state}`}
                                                                        >
                                                                            {ms.state === 'done' && <s>{ms.label}</s>}
                                                                            {ms.state !== 'done' && ms.label}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Vertical Divider */}
                                                    <div className="mission-col-divider" />

                                                    {/* Right Column */}
                                                    <div className="mission-col-right">
                                                        {/* Project Photos */}
                                                        {mission.photos && (
                                                            <div className="mission-section-block">
                                                                <div className="mission-section-label">PROJECT PHOTOS</div>
                                                                <div className="mission-photos-grid">
                                                                    {mission.photos.map((p, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className={`mission-photo ${i === 0 ? 'mission-photo-main' : 'mission-photo-sm'}`}
                                                                            style={{ background: p.bg }}
                                                                        >
                                                                            <span className="mission-photo-emoji">{p.emoji}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Due Dates */}
                                                        {mission.dueDates && (
                                                            <div className="mission-section-block">
                                                                <div className="mission-section-label">DUE DATES</div>
                                                                <div className="mission-due-grid">
                                                                    {mission.dueDates.map((d, i) => (
                                                                        <div key={i} className="mission-due-box">
                                                                            <div className="mission-due-label">{d.label}</div>
                                                                            <div
                                                                                className="mission-due-date"
                                                                                style={{ color: URGENCY_COLOR[d.urgency] }}
                                                                            >
                                                                                {d.date}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Rating row for completed (expanded) */}
                                        {isExpanded && mission.status === 'COMPLETED' && (
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
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            <style>{`
                .missions-root {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    background: #0a0a0a;
                    color: #e5e7eb;
                    font-family: 'Inter', sans-serif;
                }

                /* ---- Topbar ---- */
                .missions-topbar {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 0 24px;
                    height: 56px;
                    background: #111111;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    flex-shrink: 0;
                }
                .missions-title {
                    font-size: 15px;
                    font-weight: 600;
                    color: #f9fafb;
                    margin: 0;
                    white-space: nowrap;
                }
                .missions-search-wrap {
                    position: relative;
                    flex: 1;
                    max-width: 360px;
                }
                .missions-search-icon {
                    position: absolute;
                    left: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #4b5563;
                    pointer-events: none;
                }
                .missions-search {
                    width: 100%;
                    background: #0d0d0d;
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 8px;
                    padding: 6px 10px 6px 32px;
                    font-size: 12px;
                    font-family: 'Courier New', monospace;
                    color: #d1d5db;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .missions-search::placeholder { color: #4b5563; }
                .missions-search:focus { border-color: rgba(255,255,255,0.16); }

                .missions-filters {
                    display: flex;
                    gap: 4px;
                    margin-left: auto;
                }
                .missions-filter-tab {
                    padding: 4px 12px;
                    font-size: 10px;
                    font-weight: 700;
                    font-family: 'Courier New', monospace;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    border-radius: 20px;
                    border: 1px solid rgba(255,255,255,0.08);
                    background: transparent;
                    color: #6b7280;
                    cursor: pointer;
                    transition: all 0.15s;
                }
                .missions-filter-tab:hover { color: #d1d5db; border-color: rgba(255,255,255,0.2); }
                .missions-filter-tab.active {
                    background: rgba(163,230,53,0.12);
                    color: #a3e635;
                    border-color: rgba(163,230,53,0.3);
                }

                /* ---- Content ---- */
                .missions-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                /* ---- Section ---- */
                .missions-section { display: flex; flex-direction: column; gap: 8px; }
                .missions-divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 4px;
                }
                .missions-divider-label {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    font-family: 'Courier New', monospace;
                    color: #4b5563;
                    white-space: nowrap;
                }
                .missions-divider-line {
                    flex: 1;
                    height: 1px;
                    background: rgba(255,255,255,0.06);
                }

                /* ---- Card ---- */
                .mission-card {
                    background: #111111;
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 12px;
                    overflow: hidden;
                    transition: border-color 0.2s;
                }
                .mission-card:hover { border-color: rgba(255,255,255,0.12); }

                .mission-card-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px 18px;
                    cursor: pointer;
                    gap: 16px;
                }
                .mission-header-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex: 1;
                    min-width: 0;
                }
                .mission-status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }
                .mission-title {
                    font-size: 15px;
                    font-weight: 600;
                    color: #f9fafb;
                    line-height: 1.2;
                }
                .mission-sub {
                    font-size: 11px;
                    font-family: 'Courier New', monospace;
                    color: #6b7280;
                    margin-top: 2px;
                    letter-spacing: 0.05em;
                }
                .mission-header-right {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-shrink: 0;
                }
                .mission-mini-bar {
                    width: 80px;
                    height: 4px;
                    background: rgba(255,255,255,0.08);
                    border-radius: 2px;
                    overflow: hidden;
                }
                .mission-mini-bar-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #3b82f6, #60a5fa);
                    border-radius: 2px;
                }
                .mission-pct {
                    font-size: 11px;
                    font-family: 'Courier New', monospace;
                    font-weight: 700;
                    min-width: 32px;
                    text-align: right;
                }
                .mission-offer {
                    font-size: 11px;
                    font-family: 'Courier New', monospace;
                    font-weight: 700;
                    color: #fb923c;
                }
                .mission-badge {
                    font-size: 10px;
                    font-weight: 700;
                    font-family: 'Courier New', monospace;
                    letter-spacing: 0.06em;
                    padding: 3px 10px;
                    border-radius: 20px;
                    white-space: nowrap;
                }
                .mission-chevron { color: #4b5563; flex-shrink: 0; }

                /* Rating Row */
                .mission-rating-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 18px;
                    background: #0e0e0e;
                    border-top: 1px solid rgba(255,255,255,0.06);
                    font-family: 'Courier New', monospace;
                    font-size: 11px;
                }
                .mission-stars { font-size: 14px; letter-spacing: 1px; }
                .mission-rating-label { color: #4b5563; flex: 1; }
                .mission-views { color: #6b7280; }
                .mission-rep { color: #4ade80; font-weight: 700; }

                /* ---- Expanded Body ---- */
                .mission-body { }
                .mission-body-line { height: 1px; background: rgba(255,255,255,0.06); }
                .mission-body-inner {
                    display: flex;
                    padding: 20px 18px;
                    gap: 0;
                    background: #0e0e0e;
                }
                .mission-col-left { flex: 1; display: flex; flex-direction: column; gap: 20px; padding-right: 20px; }
                .mission-col-divider { width: 1px; background: rgba(255,255,255,0.06); flex-shrink: 0; }
                .mission-col-right { flex: 1; display: flex; flex-direction: column; gap: 20px; padding-left: 20px; }

                .mission-section-block { display: flex; flex-direction: column; gap: 8px; }
                .mission-section-label {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    font-family: 'Courier New', monospace;
                    color: #4b5563;
                }
                .mission-summary-text {
                    font-size: 13px;
                    line-height: 1.6;
                    color: #9ca3af;
                    margin: 0;
                }
                .mission-members { display: flex; align-items: center; gap: 4px; margin-top: 4px; }
                .mission-avatar {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    border: 2px solid #0e0e0e;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 9px;
                    font-weight: 700;
                    color: rgba(255,255,255,0.8);
                    font-family: 'Inter', sans-serif;
                    margin-left: -4px;
                }
                .mission-avatar:first-child { margin-left: 0; }
                .mission-extra-members { font-size: 11px; font-family: 'Courier New', monospace; color: #6b7280; margin-left: 6px; }

                .mission-progress-bar {
                    height: 4px;
                    background: rgba(255,255,255,0.08);
                    border-radius: 2px;
                    overflow: hidden;
                }
                .mission-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #3b82f6, #60a5fa);
                    border-radius: 2px;
                    transition: width 0.5s ease;
                }
                .mission-progress-meta {
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    font-family: 'Courier New', monospace;
                    color: #6b7280;
                }

                .mission-milestones { display: flex; flex-wrap: wrap; gap: 6px; }
                .mission-milestone {
                    font-size: 11px;
                    font-family: 'Courier New', monospace;
                    padding: 3px 10px;
                    border-radius: 20px;
                    font-weight: 600;
                }
                .mission-milestone-done {
                    background: rgba(34,197,94,0.08);
                    color: #4b5563;
                    border: 1px solid rgba(34,197,94,0.15);
                }
                .mission-milestone-active {
                    background: rgba(163,230,53,0.1);
                    color: #a3e635;
                    border: 1px solid rgba(163,230,53,0.3);
                }
                .mission-milestone-future {
                    background: rgba(255,255,255,0.04);
                    color: #4b5563;
                    border: 1px solid rgba(255,255,255,0.06);
                }

                /* Photos */
                .mission-photos-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr;
                    gap: 6px;
                    height: 100px;
                }
                .mission-photo {
                    border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.06);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .mission-photo-emoji { font-size: 20px; }

                /* Due Dates */
                .mission-due-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 6px;
                }
                .mission-due-box {
                    background: #111111;
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 8px;
                    padding: 10px 12px;
                }
                .mission-due-label {
                    font-size: 9px;
                    font-family: 'Courier New', monospace;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #4b5563;
                    margin-bottom: 4px;
                }
                .mission-due-date {
                    font-size: 14px;
                    font-weight: 700;
                    font-family: 'Courier New', monospace;
                }

                /* Scrollbar */
                .missions-content::-webkit-scrollbar { width: 4px; }
                .missions-content::-webkit-scrollbar-track { background: transparent; }
                .missions-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
            `}</style>
        </div>
    );
}
