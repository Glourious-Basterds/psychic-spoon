'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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
    ipId?: string; // Link to an IP from the Vault
}

export type IPCategory = 'Film' | 'Animation' | 'Comic' | 'Video Game' | 'Music' | 'TV Series' | 'Podcast' | 'Other';
export type IPPrivacy = 'Public' | 'Private' | 'Selective';
export type IPContactMode = 'Open to pitch' | 'Formal applications only' | 'Paid work/Licensing only';

export interface IntellectualProperty {
    id: string;
    title: string;
    category: IPCategory;
    tagline: string;
    description: string;
    coverImage: string | null;
    materials: { name: string; url: string; type: string }[];
    privacy: IPPrivacy;
    contactModes: IPContactMode[];
    contactInstructions: string;
    creatorId: string;
    creatorName: string;
    createdAt: string;
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
    category?: string;
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

export interface Review {
    id: string;
    reviewerName: string;
    reviewerPhoto: string | null;
    projectTitle: string;
    text: string;
    rating: number;
    date: string;
    categories?: RatingBreakdown;
}

export interface RatingBreakdown {
    reliability: number;
    communication: number;
    punctuality: number;
    quality: number;
    toneUnderstanding: number;
    creativity: number;
    teamwork: number;
}

export interface Post {
    id: string;
    authorName: string;
    authorInitials: string;
    authorColor: string;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    timestamp: string;
}

export interface UserProfile {
    id: string;
    name: string;
    photo: string | null;
    photoScale: number;
    photoX: number;
    photoY: number;
    coverImage: string | null;
    coverScale: number;
    coverX: number;
    coverY: number;
    backgroundPhoto: string | null;
    bgScale: number;
    bgX: number;
    bgY: number;
    role: string;
    rating: number;
    reviewCount: number;
    bio: string;
    email: string;
    portfolio?: string;
    social?: string;
    skills: string[];
    specialties: string[];
    hobbies: string[];
    ratings: RatingBreakdown;
    reviews: Review[];
    posts: Post[];
    hasCompletedOnboarding?: boolean;
    intent?: string;
}

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
        ipId?: string;
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
    userProfile: UserProfile;
    updateProfile: (data: Partial<UserProfile>) => void;
    getOtherUserById: (id: string) => UserProfile | undefined;
    otherUsers: Record<string, UserProfile>;
    addReview: (targetUserId: string, review: Omit<Review, 'id' | 'date'>) => void;
    ips: IntellectualProperty[];
    addIP: (data: Omit<IntellectualProperty, 'id' | 'createdAt' | 'creatorId' | 'creatorName'>) => void;
    updateIP: (id: string, data: Partial<IntellectualProperty>) => void;
    deleteIP: (id: string) => void;
    isLoaded: boolean;
}

// --- Context & Provider ---

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
    // Combined state (moved to lower block for session access)

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
            offer: 'Shared IP Revenue + Daily Rate',
            category: 'Film'
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
            offer: 'Production Credit + Backend Points',
            category: 'Animazione'
        },
        { 
            id: 'project-woody', 
            name: 'Project Woody', 
            members: 12, 
            href: '/comms?project=project-woody', 
            coverImage: '/images/concept_art_moon_garden_1772413918467.png', 
            tagline: 'WOODWORKING & DESIGN', 
            timestamp: '1h ago',
            description: 'A masterclass in traditional woodworking techniques blended with modern digital design.',
            creatorName: 'Pietro M.',
            creatorPhoto: null,
            roles: ['Designer', 'Carpenter', 'Photographer'],
            offer: 'Shared Workspace + IP',
            category: 'Film'
        },
        { 
            id: 'neo-kyoto', 
            name: 'Neo-Kyoto Drifters', 
            members: 15, 
            href: '/discover', 
            coverImage: '/images/sculpture_1.png', 
            tagline: 'CYBERPUNK RACING GAME', 
            timestamp: '3h ago',
            description: 'An open-world racing game set in a futuristic Kyoto. High-speed action, deep customization, and a synth-heavy soundtrack.',
            creatorName: 'Yuki T.',
            creatorPhoto: null,
            roles: ['Level Designer', '3D Artist', 'Sound Designer'],
            offer: 'Pagato',
            category: 'Videogioco'
        },
        { 
            id: 'sound-silence', 
            name: 'The Sound of Silence', 
            members: 4, 
            href: '/discover', 
            coverImage: '/images/studio_score_session.png', 
            tagline: 'EXPERIMENTAL AUDIO PROJECT', 
            timestamp: '6h ago',
            description: 'Exploring the boundaries of sound and silence through interactive audio installations.',
            creatorName: 'Rafael G.',
            creatorPhoto: null,
            roles: ['Sound Designer', 'Composer'],
            offer: 'Collaborazione',
            category: 'Musica'
        },
        { 
            id: 'mech-heart', 
            name: 'Mechanical Heart', 
            members: 22, 
            href: '/discover', 
            coverImage: '/images/sculpture_2.png', 
            tagline: 'STEAMPUNK ANIMATION', 
            timestamp: '12h ago',
            description: 'A short film about a clockwork world where emotions are powered by steam and gears.',
            creatorName: 'Mia K.',
            creatorPhoto: null,
            roles: ['Animator', 'VFX Artist', 'Writer'],
            offer: 'Collaborazione',
            category: 'Animazione'
        },
        { 
            id: 'beyond-horizon', 
            name: 'Beyond the Horizon', 
            members: 3, 
            href: '/discover', 
            coverImage: '/images/abstract_hashi_overview.png', 
            tagline: 'CREATIVE MINDS PODCAST', 
            timestamp: '1d ago',
            description: 'A weekly podcast interviewing the top creative minds on Hashi. Success stories, failures, and technical deep dives.',
            creatorName: 'Ash V.',
            creatorPhoto: null,
            roles: ['Editor', 'Guest Coordinator'],
            offer: 'Volontario',
            category: 'Podcast'
        },
        { 
            id: 'neon-nights', 
            name: 'Neon Nights', 
            members: 45, 
            href: '/discover', 
            coverImage: '/images/barman_noir_bartender.png', 
            tagline: 'CYBERPUNK DRAMA SERIES', 
            timestamp: '2d ago',
            description: 'A live-action series following the lives of mercenaries in a neon-drenched megacity.',
            creatorName: 'Dani M.',
            creatorPhoto: null,
            roles: ['Director', 'DP', 'Actor'],
            offer: 'Pagato',
            category: 'Serie TV'
        },
        { 
            id: 'great-heist', 
            name: 'The Great Heist', 
            members: 7, 
            href: '/discover', 
            coverImage: '/images/storyboard_noir.png', 
            tagline: 'GRAPHIC NOVEL', 
            timestamp: '3d ago',
            description: 'A noir graphic novel about the biggest art heist in history. Black and white, heavily stylized.',
            creatorName: 'Marco V.',
            creatorPhoto: null,
            roles: ['Illustrator', 'Writer'],
            offer: 'Collaborazione',
            category: 'Fumetto'
        },
    ];

    const defaultRoles: OpenRole[] = [
        { title: 'Sound Designer', project: 'The Bar-Man', type: 'Pagato' },
        { title: 'VFX Lead', project: 'Space-Balls S2', type: 'Pagato' },
        { title: 'Level Designer', project: 'Neo-Kyoto Drifters', type: 'Pagato' },
        { title: '3D Artist', project: 'Neo-Kyoto Drifters', type: 'Collaborazione' },
        { title: 'Animator', project: 'Mechanical Heart', type: 'Collaborazione' },
        { title: 'VFX Artist', project: 'Mechanical Heart', type: 'Collaborazione' },
        { title: 'Editor', project: 'Beyond the Horizon', type: 'Volontario' },
        { title: 'Illustrator', project: 'The Great Heist', type: 'Collaborazione' },
        { title: 'Actor', project: 'Neon Nights', type: 'Pagato' },
        { title: 'Director', project: 'Neon Nights', type: 'Pagato' },
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
            }
        },
        'project-woody': {
            name: 'PROJECT WOODY',
            subtitle: 'WOODWORKING & DESIGN',
            coverImage: '/images/concept_art_moon_garden_1772413918467.png',
            channels: ['Home-Base', 'Design-Lab', 'Workshop-Camera', 'Pietro-M.'],
            onlineUsers: ['Pietro-M.'],
            photos: [
                { src: '/images/concept_art_moon_garden_1772413918467.png', alt: 'Project Cover' },
                { src: '/images/bts_cinematographer_1772413934142.png', alt: 'IMG_4845.jpg' },
            ],
            tracks: [],
            calls: [],
            messages: {
                'Home-Base': [
                    { id: 'pw1', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Welcome to Project Woody. Let's build something authentic.", time: '11:00', mine: true },
                ]
            }
        }
    };

    const pietroProfile: UserProfile = {
        id: 'pietro-m',
        name: 'Pietro M.',
        photo: null,
        photoScale: 1,
        photoX: 0,
        photoY: 0,
        coverImage: '/images/abstract_hashi_overview.png',
        coverScale: 1,
        coverX: 0,
        coverY: 0,
        backgroundPhoto: null,
        bgScale: 1,
        bgX: 0,
        bgY: 0,
        role: 'Sound Designer & Director',
        rating: 4.8,
        reviewCount: 32,
        bio: "I'm a visual storyteller and sound architect. I love creating atmospheric experiences where audio and video dance together perfectly. Looking for projects that challenge the boundaries of noir and sci-fi.",
        email: 'pietro@hashi.cx',
        social: '@pietro_m',
        portfolio: 'pietromaggiotto.com',
        skills: ['Sound Design', 'Directing', 'Cinematography', 'Music Production'],
        specialties: ['Noir Aesthetics', 'Spatial Audio', 'Atmospheric Lighting'],
        hobbies: ['Synth building', 'Street photography', 'Cooking'],
        ratings: { reliability: 5, communication: 5, punctuality: 4.5, quality: 5, toneUnderstanding: 5, creativity: 5, teamwork: 4.5 },
        reviews: [
            { id: 'rev1', reviewerName: 'Bruce W.', reviewerPhoto: null, projectTitle: 'The Bar-Man', text: "Pietro's sound design is the soul of this film. He doesn't just record sound; he builds worlds.", rating: 5, date: '1 week ago' },
            { id: 'rev2', reviewerName: 'Mia K.', reviewerPhoto: null, projectTitle: 'Shadow & Light', text: "Exceptional collaborator. His understanding of mood and pacing is intuitive.", rating: 4.5, date: '1 month ago' }
        ],
        posts: [
            { id: 'post1', authorName: 'Pietro M.', authorInitials: 'PM', authorColor: '#1e3a5f', content: "Just finished the late-night sound pass for #TheBarMan. There's something magical about silence in noir.", image: '/images/bts_cinematographer.png', likes: 42, comments: 8, timestamp: '2h ago' },
            { id: 'post2', authorName: 'Pietro M.', authorInitials: 'PM', authorColor: '#1e3a5f', content: "Experimenting with binaural recording for the next mission. The space feels huge.", likes: 28, comments: 3, timestamp: 'Yesterday' }
        ],
        hasCompletedOnboarding: true,
        intent: 'Both'
    };

    const guestProfile: UserProfile = {
        id: 'guest',
        name: '',
        photo: null,
        photoScale: 1,
        photoX: 0,
        photoY: 0,
        coverImage: null,
        coverScale: 1,
        coverX: 0,
        coverY: 0,
        backgroundPhoto: null,
        bgScale: 1,
        bgX: 0,
        bgY: 0,
        role: '',
        rating: 0,
        reviewCount: 0,
        bio: '',
        email: '',
        skills: [],
        specialties: [],
        hobbies: [],
        ratings: { reliability: 0, communication: 0, punctuality: 0, quality: 0, toneUnderstanding: 0, creativity: 0, teamwork: 0 },
        reviews: [],
        posts: [],
        hasCompletedOnboarding: false,
        intent: ''
    };

    const initialOtherUsers: Record<string, UserProfile> = {
        'bruce-w': {
            id: 'bruce-w',
            name: 'Bruce W.',
            photo: null,
            photoScale: 1,
            photoX: 0,
            photoY: 0,
            coverImage: '/images/barman_noir.png',
            coverScale: 1,
            coverX: 0,
            coverY: 0,
            backgroundPhoto: null,
            bgScale: 1,
            bgX: 0,
            bgY: 0,
            role: 'Lead Director',
            rating: 4.9,
            reviewCount: 124,
            bio: "Director at Nightside Productions. I chase light and shadows. Looking for obsessive perfectionists.",
            email: 'bruce@nightside.io',
            social: '@the_bat_dir',
            portfolio: 'nightside.io',
            skills: ['Directing', 'Writing', 'Fight Choreography'],
            specialties: ['Dark Noir', 'Action Sequences'],
            hobbies: ['Martial arts', 'Night vision tech'],
            ratings: { reliability: 5, communication: 4, punctuality: 5, quality: 5, toneUnderstanding: 5, creativity: 5, teamwork: 3 },
            reviews: [
                {
                    id: 'rev-bw1',
                    reviewerName: 'Pietro M.',
                    reviewerPhoto: null,
                    projectTitle: 'The Bar-Man',
                    text: "Bruce is a visionary. His direction is clear, and his dedication to the noir aesthetic is unmatched.",
                    rating: 5,
                    date: '2 months ago'
                }
            ],
            posts: []
        }
    };

    const { data: session } = useSession();
    const userEmail = session?.user?.email || null;

    const [missions, setMissions] = useState<Mission[]>([]);
    const [trendingProjects, setTrendingProjects] = useState<TrendingProject[]>([]);
    const [openRoles, setOpenRoles] = useState<OpenRole[]>([]);
    const [workspaces, setWorkspaces] = useState<Record<string, ProjectWorkspace>>({});
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [unreadCounts, setUnreadCounts] = useState<Record<string, Record<string, number>>>({});
    const [userProfile, setUserProfile] = useState<UserProfile>(guestProfile);
    const [ips, setIps] = useState<IntellectualProperty[]>([]);
    const [otherUsers, setOtherUsers] = useState<Record<string, UserProfile>>({});
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Load (One-time)
    useEffect(() => {
        // Shared data always loads
        const savedTrending = localStorage.getItem('hashi_trending');
        const savedRoles = localStorage.getItem('hashi_roles');
        
        if (savedTrending) {
             const parsed = JSON.parse(savedTrending);
             const merged = parsed.map((p: TrendingProject) => {
                 const def = defaultTrending.find(d => d.id === p.id);
                 return def ? { ...def, ...p } : p;
             });
             setTrendingProjects(merged);
        } else setTrendingProjects(defaultTrending);

        if (savedRoles) setOpenRoles(JSON.parse(savedRoles));
        else setOpenRoles(defaultRoles);

        setOtherUsers(initialOtherUsers);

        setOtherUsers(initialOtherUsers);
    }, []);

    // Session-based Data loading
    useEffect(() => {
        setIsLoaded(false);
        if (!userEmail) {
            // CRITICAL: Hardware-reset to guest state whenever session is lost or absent.
            // This is the primary defense against "Pietro" or other profile leakage.
            setUserProfile(guestProfile);
            setMissions([]);
            setWorkspaces({});
            setIps([]);
            setNotifications([]);
            setUnreadCounts({});
            setOtherUsers(initialOtherUsers);
            setIsLoaded(true);
            return;
        }

        const prefix = `hashi_${userEmail}`;
        const savedMissions = localStorage.getItem(`${prefix}_missions`);
        const savedWorkspaces = localStorage.getItem(`${prefix}_workspaces`);
        const savedProfile = localStorage.getItem(`${prefix}_profile`);
        const savedIPs = localStorage.getItem(`${prefix}_ips`);

        if (savedProfile) {
            setUserProfile(JSON.parse(savedProfile));
        } else {
            // New user or Pietro
            if (userEmail === 'pietro@hashi.cx') {
                setUserProfile(pietroProfile);
            } else {
                setUserProfile({ ...guestProfile, name: session?.user?.name || '', email: userEmail });
            }
        }

        if (savedMissions) setMissions(JSON.parse(savedMissions));
        else if (userEmail === 'pietro@hashi.cx') setMissions(defaultMissions);
        else setMissions([]);

        if (savedWorkspaces) setWorkspaces(JSON.parse(savedWorkspaces));
        else if (userEmail === 'pietro@hashi.cx') setWorkspaces(defaultWorkspaces);
        else setWorkspaces({});

        if (savedIPs) setIps(JSON.parse(savedIPs));
        else {
            setIps([]);
        }

        setIsLoaded(true);
    }, [userEmail]);

    // Save to localStorage
    useEffect(() => {
        if (isLoaded && userEmail) {
            const prefix = `hashi_${userEmail}`;
            localStorage.setItem(`${prefix}_missions`, JSON.stringify(missions));
            localStorage.setItem(`${prefix}_workspaces`, JSON.stringify(workspaces));
            localStorage.setItem(`${prefix}_profile`, JSON.stringify(userProfile));
            localStorage.setItem(`${prefix}_ips`, JSON.stringify(ips));
        }
        // Always save global shared data
        if (isLoaded) {
            localStorage.setItem('hashi_trending', JSON.stringify(trendingProjects));
            localStorage.setItem('hashi_roles', JSON.stringify(openRoles));
        }
    }, [missions, trendingProjects, openRoles, workspaces, userProfile, ips, isLoaded, userEmail]);

    const publishMission = (data: {
        name: string;
        summary: string;
        coverImage: string | null;
        roles: string[];
        deadlines: { label: string; date: string }[];
        ipId?: string;
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
            ipId: data.ipId,
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

    const updateProfile = (data: Partial<UserProfile>) => {
        setUserProfile(prev => ({ ...prev, ...data }));
    };

    const getOtherUserById = (id: string) => {
        return otherUsers[id];
    };

    const addReview = (targetUserId: string, review: Omit<Review, 'id' | 'date'>) => {
        const newReview: Review = {
            ...review,
            id: `rev-${Date.now()}`,
            date: new Date().toLocaleDateString('it-IT')
        };

        const updateRatings = (currentRatings: RatingBreakdown, reviewRating: number, reviewCount: number, reviewCategories?: RatingBreakdown) => {
            const updated = { ...currentRatings };
            Object.keys(updated).forEach(key => {
                const k = key as keyof RatingBreakdown;
                const currentVal = updated[k] || 0;
                const newVal = reviewCategories ? reviewCategories[k] : reviewRating;
                updated[k] = (currentVal * reviewCount + newVal) / (reviewCount + 1);
            });
            return updated;
        };

        if (targetUserId === userProfile.id) {
            setUserProfile(prev => {
                const newReviews = [newReview, ...prev.reviews];
                const newRating = newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length;
                const updatedRatings = updateRatings(prev.ratings, review.rating, prev.reviewCount, review.categories);
                return {
                    ...prev,
                    reviews: newReviews,
                    reviewCount: newReviews.length,
                    rating: newRating,
                    ratings: updatedRatings
                };
            });
        } else if (otherUsers[targetUserId]) {
            setOtherUsers(prev => {
                const target = prev[targetUserId];
                if (!target) return prev;
                const newReviews = [newReview, ...target.reviews];
                const newRating = newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length;
                const updatedRatings = updateRatings(target.ratings, review.rating, target.reviewCount, review.categories);
                return {
                    ...prev,
                    [targetUserId]: {
                        ...target,
                        reviews: newReviews,
                        reviewCount: newReviews.length,
                        rating: newRating,
                        ratings: updatedRatings
                    }
                };
            });
        }
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

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const addIP = (data: Omit<IntellectualProperty, 'id' | 'createdAt' | 'creatorId' | 'creatorName'>) => {
        const newIP: IntellectualProperty = {
            ...data,
            id: `ip-${Date.now()}`,
            creatorId: userProfile.id || 'pietro-m',
            creatorName: userProfile.name || 'Pietro M.',
            createdAt: new Date().toISOString().split('T')[0]
        };
        setIps(prev => [newIP, ...prev]);
    };

    const updateIP = (id: string, data: Partial<IntellectualProperty>) => {
        setIps(prev => prev.map(ip => ip.id === id ? { ...ip, ...data } : ip));
    };

    const deleteIP = (id: string) => {
        setIps(prev => prev.filter(ip => ip.id !== id));
    };

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
            joinProject,
            reachOut,
            notifications,
            removeNotification,
            unreadCounts,
            markAsRead,
            userProfile,
            updateProfile,
            getOtherUserById,
            otherUsers,
            addReview,
            ips,
            addIP,
            updateIP,
            deleteIP,
            isLoaded
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
