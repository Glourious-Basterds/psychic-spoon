'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// --- Types ---

export type MissionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'IN_CONSIDERATION';

export interface Milestone {
    label: string;
    state: 'done' | 'active' | 'future';
    tooltip: string;
}

export interface DueDate {
    label: string;
    date: string;
    urgency: 'overdue' | 'soon' | 'ok';
    detail: string;
}

export interface Mission {
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
    coverImage?: string | null;
    tagline?: string;
}

export interface TrendingProject {
    id: string;
    name: string;
    members: number;
    href: string;
    isNew?: boolean;
    coverImage?: string | null;
    tagline?: string;
    timestamp?: string;
    description?: string;
    creatorName?: string;
    creatorPhoto?: string | null;
    roles?: string[];
    offer?: string;
}

export interface OpenRole {
    title: string;
    project: string;
    type: string;
}

export interface Track { id: string; title: string; duration: string; artist: string; }
export interface Call { id: string; user: string; date: string; duration: string; status: 'incoming' | 'outgoing' | 'missed'; }
export interface Message { id: string; sender: string; initials: string; color: string; content: string; time: string; mine: boolean; isEasterEgg?: boolean; }
export interface Photo { src: string; alt: string; }

export interface ProjectWorkspace {
    name: string;
    subtitle: string;
    coverImage?: string | null;
    channels: string[];
    onlineUsers: string[];
    photos: Photo[];
    tracks: Track[];
    calls: Call[];
    messages: Record<string, Message[]>;
}

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    time: string;
    projectId: string;
    channelId: string;
    senderInitials?: string;
    senderColor?: string;
}

interface ProjectContextType {
    missions: Mission[];
    trendingProjects: TrendingProject[];
    openRoles: OpenRole[];
    workspaces: Record<string, ProjectWorkspace>;
    publishMission: (data: {
        name: string;
        summary: string;
        coverImage: string | null;
        roles: string[];
        deadlines: { label: string; date: string }[];
    }) => void;
    deleteProject: (id: string) => void;
    addPhotoToProject: (projectId: string, photo: Photo) => void;
    addMessageToProject: (projectId: string, channel: string, message: Message) => void;
    joinProject: (projectId: string) => void;
    reachOut: (projectId: string, message: string) => void;
    notifications: AppNotification[];
    removeNotification: (id: string) => void;
    unreadCounts: Record<string, Record<string, number>>;
    markAsRead: (projectId: string, channel: string) => void;
}

// --- Context & Provider ---

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
    // Basic state
    const [missions, setMissions] = useState<Mission[]>([]);
    const [trendingProjects, setTrendingProjects] = useState<TrendingProject[]>([]);
    const [openRoles, setOpenRoles] = useState<OpenRole[]>([]);
    const [workspaces, setWorkspaces] = useState<Record<string, ProjectWorkspace>>({});
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [unreadCounts, setUnreadCounts] = useState<Record<string, Record<string, number>>>({});
    const [isLoaded, setIsLoaded] = useState(false);

    // Default data (returned if localStorage is empty)
    const defaultMissions: Mission[] = [
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
            coverImage: '/images/barman_noir.png',
            tagline: 'NOIR CINEMA PROJECT'
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
                { label: 'ANIMATIC', date: 'Nov 30', urgency: 'ok', detail: 'Completed — Animatic delivered and approved.' },
                { label: 'ANIMATION', date: 'Jan 20', urgency: 'soon', detail: 'Due Jan 20 — 40% complete. Pasta cannon sequence is the critical path.' },
                { label: 'VFX PASS', date: 'Feb 10', urgency: 'ok', detail: 'On track — VFX team briefed. Zero-gravity pasta effects in production.' },
                { label: 'FINAL CUT', date: 'Feb 28', urgency: 'ok', detail: 'Final delivery — Feb 28. Distribution via Hashi IP Vault.' },
            ],
            coverImage: '/images/astronaut_pasta.png',
            tagline: 'SCI-FI PRODUCTION'
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
            summary: "An intimate short film about a musician who discovers her late grandmother's unreleased recordings. Atmospheric sound design — layered ambience, vinyl crackle, and live chamber reverb. Delivered on time and under budget.",
            members: [
                { initials: 'CL', color: '#2a1a3a', name: 'Clara L.' },
                { initials: 'RD', color: '#1a3a2a', name: 'Ravi D.' },
                { initials: 'PM', color: '#1e3a5f', name: 'Pietro M.' },
            ],
            extraMembers: 1,
            milestones: [
                { label: 'Pre-production 09/01', state: 'done', tooltip: 'Completed Sep 1 · All reference tracks approved' },
                { label: 'Recording 09/20', state: 'done', tooltip: 'Completed Sep 20 · Live session recorded at Studio V' },
                { label: 'Mix 10/05', state: 'done', tooltip: 'Completed Oct 5 · Final mix approved by director' },
                { label: 'Delivery 10/15', state: 'done', tooltip: 'Delivered Oct 15 · Accepted by distributor' },
            ],
            photos: [
                { emoji: '🎵', bg: 'linear-gradient(135deg, #1a0d2a, #2d1a42)' },
                { emoji: '🎙', bg: 'linear-gradient(135deg, #0d1a2a, #1a2d42)' },
                { emoji: '🎻', bg: 'linear-gradient(135deg, #2a1a0d, #3d2c12)' },
            ],
            dueDates: [
                { label: 'RECORDING', date: 'Sep 20', urgency: 'ok', detail: 'Completed — Live recording session delivered ahead of schedule.' },
                { label: 'FINAL MIX', date: 'Oct 05', urgency: 'ok', detail: 'Completed — Mix approved by director and Clara L.' },
                { label: 'DELIVERY', date: 'Oct 15', urgency: 'ok', detail: 'Completed — Delivered to distributor. 2.4k views in first week.' },
                { label: 'ARCHIVE', date: 'Oct 20', urgency: 'ok', detail: 'Archived in IP Vault. Rating: 4/5 stars. +18 rep pts.' },
            ],
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

    const defaultTrending: TrendingProject[] = [
        { 
            id: 'bar-man', 
            name: 'The Bar-Man', 
            members: 8, 
            href: '/comms?project=bar-man', 
            coverImage: '/images/barman_noir.png', 
            tagline: 'NOIR CINEMA PROJECT', 
            timestamp: '2h ago',
            description: 'A dark, atmospheric noir film set in the rain-soaked streets of Neo-Tokyo. Explore the life of a bartender with a secret identity.',
            creatorName: 'Bruce W.',
            creatorPhoto: null,
            roles: ['Cinematographer', 'VFX Artist', 'Composer'],
            offer: 'Shared IP Revenue + Daily Rate'
        },
        { 
            id: 'space-balls', 
            name: 'Space-Balls S2', 
            members: 6, 
            href: '/comms?project=space-balls', 
            coverImage: '/images/astronaut_pasta.png', 
            tagline: 'SCI-FI PRODUCTION', 
            timestamp: '5h ago',
            description: 'The second season of the zero-gravity cooking comedy. More pasta, more chaos, and a lot more Lord Helmet.',
            creatorName: 'Lord Helmet',
            creatorPhoto: null,
            roles: ['Animator', 'Sound Designer'],
            offer: 'Production Credit + Backend Points'
        },
    ];

    const defaultRoles: OpenRole[] = [
        { title: 'Sound Designer', project: 'The Bar-Man', type: 'Freelance' },
        { title: 'VFX Lead', project: 'Space-Balls S2', type: 'Full-time' },
        { title: 'Script Editor', project: 'Ghost Protocol', type: 'Contract' },
    ];

    const defaultWorkspaces: Record<string, ProjectWorkspace> = {
        'bar-man': {
            name: 'THE BAR-MAN',
            subtitle: 'NOIR CINEMA PROJECT',
            coverImage: '/images/barman_noir.png',
            channels: ['Home-Base', 'Clandestine-Intel', 'Bruce-W.', 'Sara-R.', 'Marco-T.'],
            onlineUsers: ['Bruce-W.', 'Sara-R.'],
            photos: [
                { src: '/images/barman_noir.png', alt: 'Noir Bartender — Bar Set' },
                { src: '/images/batman_barman.png', alt: 'Batman as The Barman' },
                { src: '/images/joker_bar.png', alt: 'Joker at the Speakeasy' },
            ],
            tracks: [
                { id: '1', title: 'Noir Intro', duration: '2:34', artist: 'Hashi Audio' },
                { id: '2', title: 'Bartender Theme', duration: '3:12', artist: 'Hashi Audio' },
                { id: '3', title: 'Ghost Waltz', duration: '4:01', artist: 'Hashi Audio' },
                { id: '4', title: 'Last Call', duration: '1:58', artist: 'Hashi Audio' },
            ],
            calls: [
                { id: '1', user: 'Bruce W.', date: 'Dec 20, 10:00', duration: '14 min', status: 'incoming' },
                { id: '2', user: 'Tony S.', date: 'Dec 19, 18:42', duration: '7 min', status: 'outgoing' },
                { id: '3', user: 'Sara R.', date: 'Dec 18, 09:15', duration: '—', status: 'missed' },
            ],
            messages: {
                'Home-Base': [
                    { id: 'hb1', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Finalizing the storyboard for Act 2 today. Any thoughts on the lighting?", time: '09:00', mine: true },
                    { id: 'hb2', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "It needs to be darker. More shadows. We're chasing ghosts, not a tan.", time: '09:05', mine: false },
                    { id: 'hb3', sender: 'Sara R.', initials: 'SR', color: '#1a4731', content: "Agreed. I'm working on the desaturation palette. High contrast is the way.", time: '09:12', mine: false },
                    { id: 'hb4', sender: 'Marco T.', initials: 'MT', color: '#4a1a1a', content: "The Foley for the ice cracking is ready. It sounds... haunting.", time: '10:45', mine: false },
                ],
                'Clandestine-Intel': [
                    { id: 'ci1', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "I've secured the location for the bar scene. It's an old speakeasy in East End.", time: '11:20', mine: false },
                    { id: 'ci2', sender: 'Anna L.', initials: 'AL', color: '#4a2e0a', content: "Perfect. Does it have the original wood paneling?", time: '11:25', mine: false },
                ],
                'Bruce-W.': [
                    { id: 'bw1', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "Pietro, the script for scene 4 needs more silence. Let the visuals speak.", time: '14:30', mine: false },
                    { id: 'bw2', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "I hear you. I'll cut the dialogue by half there.", time: '14:35', mine: true },
                ],
                'Sara-R.': [
                    { id: 'sr1', sender: 'Sara R.', initials: 'SR', color: '#1a4731', content: "Check out this grade reference. Pushing the cyans in the shadows.", time: '16:00', mine: false },
                    { id: 'sr2', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "That looks gorgeous. Fits the moody tone perfectly.", time: '16:10', mine: true },
                ],
                'Marco-T.': [
                    { id: 'mt1', sender: 'Marco T.', initials: 'MT', color: '#4a1a1a', content: "Should we use a live violin segment for the finale?", time: '17:45', mine: false },
                ]
            },
        },
        'space-balls': {
            name: 'SPACE BALLS',
            subtitle: 'SEASON 2 · SCI-FI PRODUCTION',
            coverImage: '/images/astronaut_pasta.png',
            channels: ['Home-Base', 'Galactic-Intel', 'Lord-Helmet', 'Elena-K.', 'Tony-S.'],
            onlineUsers: ['Lord-Helmet'],
            photos: [
                { src: '/images/astronaut_pasta.png', alt: 'Astronaut with Pasta in Zero Gravity' },
                { src: '/images/spaceship_cinematic.png', alt: 'Spaceship through the Nebula' },
            ],
            tracks: [],
            calls: [],
            messages: {
                'Home-Base': [
                    { id: 'sh1', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Lord Helmet, the pasta physics in scene 12 are clipping. Help?", time: '09:00', mine: true },
                    { id: 'sh2', sender: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', content: "Clip it! Who cares? As long as it looks delicious and absurd.", time: '09:05', mine: false },
                    { id: 'sh3', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "I think we need more parmesan particles in the zero-G vortex.", time: '09:12', mine: false },
                    { id: 'sh4', sender: 'Elena K.', initials: 'EK', color: '#1a1a2a', content: "I'm rendering the spaghetti tentacles now. It's truly terrifying.", time: '10:30', mine: false },
                ],
                'Galactic-Intel': [
                    { id: 'gi1', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "The catering budget is higher than the CGI budget. Is this normal?", time: '11:00', mine: false },
                ],
                'Lord-Helmet': [
                    { id: 'lh1', sender: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', content: "Pietro, where is the giant hairball? We need it for the close-up.", time: '13:45', mine: false },
                ],
                'Elena-K.': [
                    { id: 'ek1', sender: 'Elena K.', initials: 'EK', color: '#1a1a2a', content: "The zero-gravity carbonara simulation is finally stable.", time: '15:20', mine: false },
                ]
            },
        },
    };

    // Load from localStorage
    useEffect(() => {
        const savedMissions = localStorage.getItem('hashi_missions');
        const savedTrending = localStorage.getItem('hashi_trending');
        const savedRoles = localStorage.getItem('hashi_roles');
        const savedWorkspaces = localStorage.getItem('hashi_workspaces');
        const savedUnread = localStorage.getItem('hashi_unread');

        if (savedMissions) {
            const parsed = JSON.parse(savedMissions);
            const patched = parsed.map((m: Mission) => {
                const def = defaultMissions.find(d => d.id === m.id);
                if (def) {
                    return {
                        ...def,
                        ...m,
                        coverImage: m.coverImage || def.coverImage,
                        tagline: m.tagline || def.tagline,
                        dueDates: m.dueDates || def.dueDates,
                        milestones: m.milestones || def.milestones,
                        summary: m.summary || def.summary
                    };
                }
                return m;
            });
            setMissions(patched);
        } else {
            setMissions(defaultMissions);
        }

        if (savedTrending) {
            const parsed = JSON.parse(savedTrending);
            const merged = parsed.map((p: TrendingProject) => {
                const def = defaultTrending.find(d => d.id === p.id);
                if (def) {
                    return {
                        ...def,
                        ...p,
                        // Ensure these new fields are always taken from default if they don't exist in saved
                        description: p.description || def.description,
                        creatorName: p.creatorName || def.creatorName,
                        roles: p.roles || def.roles,
                        offer: p.offer || def.offer,
                        tagline: p.tagline || def.tagline,
                        coverImage: p.coverImage || def.coverImage
                    };
                }
                return p;
            });
            setTrendingProjects(merged as TrendingProject[]);
        } else {
            setTrendingProjects(defaultTrending);
        }

        if (savedRoles) setOpenRoles(JSON.parse(savedRoles));
        else setOpenRoles(defaultRoles);

        if (savedWorkspaces) {
            const parsed = JSON.parse(savedWorkspaces);
            const patched = { ...parsed };
            // Migration: Ensure new default channels/messages are merged into existing local state
            Object.keys(defaultWorkspaces).forEach(id => {
                if (patched[id]) {
                    const missingChannels = defaultWorkspaces[id].channels.filter(c => !patched[id].channels.includes(c));
                    if (missingChannels.length > 0) {
                        patched[id].channels = [...patched[id].channels, ...missingChannels];
                        missingChannels.forEach(c => {
                            if (defaultWorkspaces[id].messages[c]) {
                                patched[id].messages[c] = defaultWorkspaces[id].messages[c];
                            }
                        });
                    }
                    // Also refresh Home-Base messages if they are the old repetitive ones
                    if (patched[id].messages['Home-Base']?.length > 5 && patched[id].messages['Home-Base'].every((m: any) => m.sender === 'Bruce W.')) {
                         patched[id].messages['Home-Base'] = defaultWorkspaces[id].messages['Home-Base'];
                    }
                } else {
                    patched[id] = defaultWorkspaces[id];
                }
            });
            setWorkspaces(patched);
        } else setWorkspaces(defaultWorkspaces);

        if (savedUnread) setUnreadCounts(JSON.parse(savedUnread));
        else {
            // Default unread counts for a fresh look
            setUnreadCounts({
                'bar-man': { 'Clandestine-Intel': 2, 'Bruce-W.': 1 },
                'space-balls': { 'Home-Base': 1 }
            });
        }

        setIsLoaded(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('hashi_missions', JSON.stringify(missions));
            localStorage.setItem('hashi_trending', JSON.stringify(trendingProjects));
            localStorage.setItem('hashi_roles', JSON.stringify(openRoles));
            localStorage.setItem('hashi_workspaces', JSON.stringify(workspaces));
            localStorage.setItem('hashi_unread', JSON.stringify(unreadCounts));
        }
    }, [missions, trendingProjects, openRoles, workspaces, unreadCounts, isLoaded]);

    const publishMission = (data: {
        name: string;
        summary: string;
        coverImage: string | null;
        roles: string[];
        deadlines: { label: string; date: string }[];
    }) => {
        const id = data.name.toLowerCase().replace(/\s+/g, '-');
        const projectNumber = `#00${Math.floor(Math.random() * 90) + 10}`;

        const newMission: Mission = {
            id,
            title: data.name,
            role: 'Founder',
            projectNumber,
            status: 'IN_PROGRESS',
            progress: 0,
            summary: data.summary || 'A new collaborative mission on Hashi.',
            coverImage: data.coverImage,
            tagline: 'NEW PRODUCTION',
            members: [{ initials: 'PM', color: '#1e3a5f', name: 'Pietro M.' }],
            milestones: [
                { label: 'Initialization', state: 'done', tooltip: 'Project initialized on Hashi' },
                { label: 'Role Recruitment', state: 'active', tooltip: 'Currently seeking collaborators' },
            ],
            dueDates: data.deadlines.map(d => ({
                label: d.label.toUpperCase(),
                date: d.date,
                urgency: 'ok',
                detail: `Project milestone: ${d.label}`
            })),
        };

        const newTrending: TrendingProject = {
            id,
            name: data.name,
            members: 1,
            href: `/comms?project=${id}`,
            isNew: true,
            coverImage: data.coverImage,
            tagline: 'NEW PRODUCTION',
            timestamp: 'Just now',
            description: data.summary || 'A new collaborative mission on Hashi.',
            creatorName: 'Pietro M.',
            creatorPhoto: null,
            roles: data.roles,
            offer: 'Collaboration'
        };

        const newOpenRolesToAdd: OpenRole[] = data.roles.map(r => ({
            title: r,
            project: data.name,
            type: 'Freelance'
        }));

        const newWorkspace: ProjectWorkspace = {
            name: data.name.toUpperCase(),
            subtitle: data.summary || 'NEW PRODUCTION',
            coverImage: data.coverImage,
            channels: ['Home-Base', 'Production', 'Creative'],
            onlineUsers: ['Pietro M.'],
            photos: data.coverImage ? [{ src: data.coverImage, alt: 'Project Cover' }] : [],
            tracks: [],
            calls: [],
            messages: {
                'Home-Base': [
                    {
                        id: 'system-1',
                        sender: 'HASHI_SYSTEM',
                        initials: 'H',
                        color: '#65a30d',
                        content: `Project Workspace "${data.name}" initialized. High Command is online.`,
                        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                        mine: false
                    }
                ],
                'Production': [],
                'Creative': []
            }
        };

        setMissions(prev => [newMission, ...prev]);
        setTrendingProjects(prev => [newTrending, ...prev.map(p => ({ ...p, isNew: false }))]);
        setOpenRoles(prev => [...newOpenRolesToAdd, ...prev]);
        setWorkspaces(prev => ({ ...prev, [id]: newWorkspace }));
    };

    const deleteProject = (id: string) => {
        const project = missions.find(m => m.id === id);
        const projectName = project?.title;

        setMissions(prev => prev.filter(m => m.id !== id));
        setTrendingProjects(prev => prev.filter(p => !p.href.includes(`project=${id}`)));
        if (projectName) {
            setOpenRoles(prev => prev.filter(r => r.project !== projectName));
        }
        setWorkspaces(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const addPhotoToProject = (projectId: string, photo: Photo) => {
        setWorkspaces(prev => {
            const ws = prev[projectId];
            if (!ws) return prev;
            return {
                ...prev,
                [projectId]: { ...ws, photos: [photo, ...ws.photos] }
            };
        });
    };

    const addMessageToProject = (projectId: string, channel: string, message: Message) => {
        setWorkspaces(prev => {
            const ws = prev[projectId];
            if (!ws) return prev;
            const channelMessages = ws.messages[channel] || [];
            return {
                ...prev,
                [projectId]: {
                    ...ws,
                    messages: {
                        ...ws.messages,
                        [channel]: [...channelMessages, message]
                    }
                }
            };
        });

        // Increment unread count if not system message and not mine
        if (message.sender !== 'HASHI_SYSTEM' && !message.mine) {
            setUnreadCounts(prev => {
                const projectUnread = prev[projectId] || {};
                return {
                    ...prev,
                    [projectId]: {
                        ...projectUnread,
                        [channel]: (projectUnread[channel] || 0) + 1
                    }
                };
            });

            // Trigger alert
            const newNotif: AppNotification = {
                id: `notif-${Date.now()}`,
                title: message.sender,
                message: message.content,
                time: 'Just now',
                projectId,
                channelId: channel,
                senderInitials: message.initials,
                senderColor: message.color
            };
            setNotifications(prev => [newNotif, ...prev]);

            // Auto-remove after 5s
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
            }, 5000);
        }
    };

    const markAsRead = (projectId: string, channelId: string) => {
        setUnreadCounts(prev => {
            const projectUnread = prev[projectId];
            if (!projectUnread || !projectUnread[channelId]) return prev;
            return {
                ...prev,
                [projectId]: {
                    ...projectUnread,
                    [channelId]: 0
                }
            };
        });
    };

    const joinProject = (projectId: string) => {
        const trending = trendingProjects.find(p => p.id === projectId);
        if (!trending) return;

        // Add to missions
        const existingMission = missions.find(m => m.id === projectId);
        if (!existingMission) {
            const newMission: Mission = {
                id: trending.id,
                title: trending.name,
                role: 'Member',
                projectNumber: `#00${Math.floor(Math.random() * 90) + 10}`,
                status: 'IN_PROGRESS',
                progress: 0,
                summary: trending.description,
                coverImage: trending.coverImage,
                tagline: trending.tagline,
                members: [{ initials: 'PM', color: '#1e3a5f', name: 'Pietro M.' }],
                milestones: [
                    { label: 'Joining', state: 'done', tooltip: 'Joined project from Feed' }
                ]
            };
            setMissions(prev => [newMission, ...prev]);
        }

        // Add to workspace members
        setWorkspaces(prev => {
            const ws = prev[projectId];
            if (!ws) return prev;
            if (ws.onlineUsers.includes('Pietro M.')) return prev;
            return {
                ...prev,
                [projectId]: {
                    ...ws,
                    onlineUsers: [...ws.onlineUsers, 'Pietro M.']
                }
            };
        });

        // Add system message to #Home-Base
        addMessageToProject(projectId, 'Home-Base', {
            id: `sys-${Date.now()}`,
            sender: 'HASHI_SYSTEM',
            initials: 'H',
            color: '#65a30d',
            content: 'Pietro M. has joined the project via Hashi Feed.',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            mine: false
        });
    };

    const reachOut = (projectId: string, message: string) => {
        const trending = trendingProjects.find(p => p.id === projectId);
        if (!trending) return;

        const creator = trending.creatorName || 'Creator';
        const channelName = creator.replace(/\s+/g, '-');

        // Create private DM channel in 'bar-man' (home workspace) for simplicity or as a new tab
        // Actually user requested "Direct Messages section del Workspace"
        // For this demo, let's treat 'Direct Messages' as a concept.
        // I'll add the message to the 'bar-man' workspace under a new private channel.

        setWorkspaces(prev => {
            const ws = prev['bar-man']; // Default workspace for DMs
            if (!ws) return prev;

            const newMessages = { ...ws.messages };
            if (!newMessages[channelName]) {
                newMessages[channelName] = [];
            }

            newMessages[channelName].push({
                id: `msg-${Date.now()}`,
                sender: 'Pietro M.',
                initials: 'PM',
                color: '#1e3a5f',
                content: message,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                mine: true
            });

            return {
                ...prev,
                ['bar-man']: {
                    ...ws,
                    channels: ws.channels.includes(channelName) ? ws.channels : [...ws.channels, channelName],
                    messages: newMessages
                }
            };
        });
    };

    // --- Message Simulation Engine ---
    useEffect(() => {
        if (!isLoaded) return;

        const simulationInterval = setInterval(() => {
            if (Math.random() > 0.7) return;

            const possibleMissions = missions.filter(m => m.id === 'bar-man' || m.id === 'space-balls');
            if (possibleMissions.length === 0) return;

            const targetMission = possibleMissions[Math.floor(Math.random() * possibleMissions.length)];
            const ws = defaultWorkspaces[targetMission.id];
            if (!ws) return;

            const channels = ws.channels.filter(c => c !== 'Home-Base' || Math.random() > 0.5);
            const targetChannel = channels[Math.floor(Math.random() * channels.length)];

            const messages = ws.messages[targetChannel] || ws.messages['Home-Base'];
            const potentialMsgs = messages.filter(m => !m.mine && m.sender !== 'HASHI_SYSTEM');
            if (potentialMsgs.length === 0) return;

            const randomMsgTemplate = potentialMsgs[Math.floor(Math.random() * potentialMsgs.length)];

            const incomingMsg: Message = {
                ...randomMsgTemplate,
                id: `sim-${Date.now()}`,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                mine: false
            };

            addMessageToProject(targetMission.id, targetChannel, incomingMsg);
        }, 45000);

        return () => clearInterval(simulationInterval);
    }, [isLoaded, missions, addMessageToProject]);

    return (
        <ProjectContext.Provider value={{
            missions,
            trendingProjects,
            openRoles,
            workspaces,
            publishMission,
            deleteProject,
            addPhotoToProject,
            addMessageToProject,
            notifications,
            removeNotification: (id: string) => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            },
            unreadCounts,
            markAsRead,
            joinProject,
            reachOut
        }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProjects() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProjects must be used within a ProjectProvider');
    }
    return context;
}
