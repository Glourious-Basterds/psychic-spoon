'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

export interface TrendingProject {
    name: string;
    members: number;
    href: string;
    isNew?: boolean;
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
    channels: string[];
    onlineUsers: string[];
    photos: Photo[];
    tracks: Track[];
    calls: Call[];
    messages: Record<string, Message[]>;
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
}

// --- Context & Provider ---

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
    // Initial Missions
    const [missions, setMissions] = useState<Mission[]>([
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
                { label: 'ANIMATIC', date: 'Nov 30', urgency: 'ok', detail: 'Completed — Animatic delivered and approved.' },
                { label: 'ANIMATION', date: 'Jan 20', urgency: 'soon', detail: 'Due Jan 20 — 40% complete. Pasta cannon sequence is the critical path.' },
                { label: 'VFX PASS', date: 'Feb 10', urgency: 'ok', detail: 'On track — VFX team briefed. Zero-gravity pasta effects in production.' },
                { label: 'FINAL CUT', date: 'Feb 28', urgency: 'ok', detail: 'Final delivery — Feb 28. Distribution via Hashi IP Vault.' },
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
    ]);

    // Initial Trending
    const [trendingProjects, setTrendingProjects] = useState<TrendingProject[]>([
        { name: 'The Bar-Man', members: 8, href: '/comms?project=bar-man' },
        { name: 'Space-Balls S2', members: 6, href: '/comms?project=space-balls' },
        { name: 'Ghost Protocol Noir', members: 3, href: '/missions' },
    ]);

    // Initial Open Roles
    const [openRoles, setOpenRoles] = useState<OpenRole[]>([
        { title: 'Sound Designer', project: 'The Bar-Man', type: 'Freelance' },
        { title: 'VFX Lead', project: 'Space-Balls S2', type: 'Full-time' },
        { title: 'Script Editor', project: 'Ghost Protocol', type: 'Contract' },
    ]);

    // Initial Workspaces
    const [workspaces, setWorkspaces] = useState<Record<string, ProjectWorkspace>>({
        'bar-man': {
            name: 'THE BAR-MAN',
            subtitle: 'NOIR CINEMA PROJECT',
            channels: ['Home-Base', 'Clandestine-Intel', 'Bruce-W.'],
            onlineUsers: ['Bruce-W.'],
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
                    { id: '1', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "How's the project going on so far?", time: '09:00', mine: true },
                    { id: '2', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "Idk, have a look around dumbass", time: '09:02', mine: false },
                    { id: '3', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Script revision uploaded. Everyone read it before tonight.", time: '09:45', mine: true },
                    { id: '4', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "Already read it. The ghost reveal in act 2 is perfect.", time: '09:47', mine: false },
                    { id: '5', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "The new carbon-fiber shaker is ready for field testing. Don't shake it too hard, it might explode.", time: '10:00', mine: false },
                    { id: '6', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Tony what the hell", time: '10:01', mine: true },
                    { id: '7', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "It was a controlled explosion. Everything is fine.", time: '10:02', mine: false },
                    { id: '8', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "Can someone tell Tony to stop experimenting near the bar set? He almost broke the whiskey shelf.", time: '10:15', mine: false },
                    { id: '9', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "The shelf survived. Mostly.", time: '10:16', mine: false },
                    { id: '10', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Rough cut review tomorrow at 3pm. Everyone be there.", time: '11:30', mine: true },
                    { id: '11', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "I'll be there.", time: '11:31', mine: false },
                    { id: '12', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "I'll be there via remote surveillance drone.", time: '11:32', mine: false },
                    { id: '13', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Come in person Tony.", time: '11:33', mine: true },
                    { id: '14', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "The drone is more reliable than me.", time: '11:34', mine: false },
                    { id: '15', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "...sometimes I wonder if the ghosts were there all along.", time: '23:47', mine: false, isEasterEgg: true },
                ],
                'Clandestine-Intel': [
                    { id: '1', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "Reference for the lighting in act 1 — think Blade Runner 2049, not Batman. Less neon, more shadow.", time: '08:30', mine: false },
                    { id: '2', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Agreed. I'll brief the cinematographer today.", time: '08:45', mine: true },
                    { id: '3', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "I've built a device that replicates the exact lighting conditions of a 1940s bar. It also makes cocktails.", time: '09:00', mine: false },
                    { id: '4', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "Why does it make cocktails.", time: '09:01', mine: false },
                    { id: '5', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "Why not.", time: '09:02', mine: false },
                    { id: '6', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Sound design reference uploaded. The silence between the dialogue is the real protagonist.", time: '14:00', mine: true },
                    { id: '7', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "This is exactly the direction. Forward this to the sound team.", time: '14:05', mine: false },
                    { id: '8', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Color grade test uploaded. Tell me what you think.", time: '18:00', mine: true },
                    { id: '9', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "It's good. But desaturate the skin tones 10% more. Make them look like they're already dead.", time: '18:30', mine: false },
                    { id: '10', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Dark.", time: '18:31', mine: true },
                    { id: '11', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "That's the point.", time: '18:32', mine: false },
                    { id: '12', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "I think I saw one. In the bar set. It looked at me.", time: '03:12', mine: false, isEasterEgg: true },
                ],
                'Bruce-W.': [
                    { id: '1', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "The script is good. But act 3 needs to breathe more. Give the audience 10 more seconds of silence before the reveal.", time: '10:00', mine: false },
                    { id: '2', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Done. Revision uploaded.", time: '10:05', mine: true },
                    { id: '3', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "Good.", time: '10:06', mine: false },
                    { id: '4', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "What do you think of the poster concept?", time: '15:00', mine: true },
                    { id: '5', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "It needs more shadow. Always more shadow.", time: '15:02', mine: false },
                    { id: '6', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "You say that about everything.", time: '15:03', mine: true },
                    { id: '7', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "Because everything needs more shadow.", time: '15:04', mine: false },
                ],
            },
        },
        'space-balls': {
            name: 'SPACE BALLS',
            subtitle: 'SEASON 2 · SCI-FI PRODUCTION',
            channels: ['Home-Base', 'Galactic-Intel', 'Lord-Helmet'],
            onlineUsers: ['Lord-Helmet'],
            photos: [
                { src: '/images/astronaut_pasta.png', alt: 'Astronaut with Pasta in Zero Gravity' },
                { src: '/images/spaceship_cinematic.png', alt: 'Spaceship through the Nebula' },
                { src: '/images/italian_food_space.png', alt: 'Carbonara against the Cosmos' },
            ],
            tracks: [
                { id: '1', title: 'Spaceballs Theme', duration: '3:45', artist: 'Hashi Audio' },
                { id: '2', title: 'Orbital Drift', duration: '2:58', artist: 'Hashi Audio' },
                { id: '3', title: 'Pasta in Zero-G', duration: '4:22', artist: 'Hashi Audio' },
                { id: '4', title: 'Nebula Serenata', duration: '5:01', artist: 'Hashi Audio' },
            ],
            calls: [
                { id: '1', user: 'Lord Helmet', date: 'Dec 21, 14:00', duration: '22 min', status: 'outgoing' },
                { id: '2', user: 'Tony S.', date: 'Dec 20, 09:30', duration: '4 min', status: 'incoming' },
                { id: '3', user: 'Dark Helmet Jr.', date: 'Dec 20, 11:10', duration: '—', status: 'missed' },
            ],
            messages: {
                'Home-Base': [
                    { id: '1', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "How's the pasta looking for the zero-gravity scene?", time: '09:00', mine: true },
                    { id: '2', sender: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', content: "The merchandising strategy is ludicrous! We need more flamethrowers.", time: '09:05', mine: false },
                    { id: '3', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "We are making a food documentary in space. Why do we need flamethrowers.", time: '09:06', mine: true },
                    { id: '4', sender: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', content: "For the meatballs.", time: '09:07', mine: false },
                    { id: '5', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "I've engineered a fork that works in zero gravity. Patent pending.", time: '09:10', mine: false },
                    { id: '6', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Tony how did you even get on this project", time: '09:11', mine: true },
                    { id: '7', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "I followed the meatballs.", time: '09:12', mine: false },
                    { id: '8', sender: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', content: "I asked for authentic Italian cuisine. I received a pasta cannon. 10/10 would eat again.", time: '10:00', mine: false },
                    { id: '9', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Ship model render is done. It looks incredible.", time: '11:00', mine: true },
                    { id: '10', sender: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', content: "It needs a cannon.", time: '11:02', mine: false },
                    { id: '11', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "I've already designed the cannon. It fires meatballs.", time: '11:03', mine: false },
                    { id: '12', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "I'm quitting.", time: '11:04', mine: true },
                    { id: '13', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Just kidding. Rough cut review tomorrow at 3pm everyone.", time: '11:05', mine: true },
                    { id: '14', sender: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', content: "I will attend via hologram.", time: '11:06', mine: false },
                    { id: '15', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "I will attend via the meatball cannon.", time: '11:07', mine: false },
                    { id: '16', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Please just come in person.", time: '11:08', mine: true },
                    { id: '17', sender: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', content: "...in space, no one can hear you slurp spaghetti. But I can. I always can.", time: '02:33', mine: false, isEasterEgg: true },
                ],
                'Galactic-Intel': [
                    { id: '1', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Production update: zero-gravity food scene rescheduled to next week. Equipment arriving Thursday.", time: '08:00', mine: true },
                    { id: '2', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "I've modified the equipment to also function as a pasta extruder.", time: '08:05', mine: false },
                    { id: '3', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "That was not in the brief Tony.", time: '08:06', mine: true },
                    { id: '4', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "It is now.", time: '08:07', mine: false },
                    { id: '5', sender: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', content: "The script for act 2 is magnificent. The scene where the spaghetti floats past the nebula made me cry.", time: '09:00', mine: false },
                    { id: '6', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "That means a lot, thank you.", time: '09:05', mine: true },
                    { id: '7', sender: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', content: "I also cried because I was eating at the time and pasta went up my nose.", time: '09:06', mine: false },
                    { id: '8', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "VFX test for the nebula sequence uploaded. Tell me what you think.", time: '14:00', mine: true },
                    { id: '9', sender: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', content: "Needs more drama. And a cannon.", time: '14:10', mine: false },
                    { id: '10', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "I can add both.", time: '14:11', mine: false },
                    { id: '11', sender: 'Tony S.', initials: 'TS', color: '#3a1e1e', content: "The pasta cannon achieved orbit. This was not intentional.", time: '04:55', mine: false, isEasterEgg: true },
                    { id: '12', sender: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', content: "Magnificent.", time: '04:56', mine: false, isEasterEgg: true },
                ],
                'Lord-Helmet': [
                    { id: '1', sender: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', content: "Pietro. The mustache. It must be bigger.", time: '10:00', mine: false },
                    { id: '2', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Which mustache.", time: '10:02', mine: true },
                    { id: '3', sender: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', content: "All of them.", time: '10:03', mine: false },
                    { id: '4', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "There are no mustaches in the script.", time: '10:04', mine: true },
                    { id: '5', sender: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', content: "There are now.", time: '10:05', mine: false },
                    { id: '6', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "What do you think of the title sequence?", time: '15:00', mine: true },
                    { id: '7', sender: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', content: "It is the greatest thing I have ever seen. Add a cannon.", time: '15:03', mine: false },
                    { id: '8', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Goodnight Lord Helmet.", time: '15:04', mine: true },
                    { id: '9', sender: 'Lord Helmet', initials: 'LH', color: '#3a1a3a', content: "Goodnight Pietro. Tell Tony to stop the pasta cannon.", time: '15:05', mine: false },
                ],
            },
        },
    });

    const publishMission = (data: {
        name: string;
        summary: string;
        coverImage: string | null;
        roles: string[];
        deadlines: { label: string; date: string }[];
    }) => {
        const id = data.name.toLowerCase().replace(/\s+/g, '-');
        const projectNumber = `#00${Math.floor(Math.random() * 90) + 10}`;

        // 1. Add to Missions
        const newMission: Mission = {
            id,
            title: data.name,
            role: 'Founder',
            projectNumber,
            status: 'IN_PROGRESS',
            progress: 0,
            summary: data.summary,
            members: [{ initials: 'PM', color: '#1e3a5f', name: 'Pietro M.' }],
            milestones: [
                { label: 'Initialization', state: 'done', tooltip: 'Project initialized on Hashi' },
                { label: 'Role Recruitment', state: 'active', tooltip: 'Currently seeking collaborators' },
            ],
            photos: data.coverImage ? [
                { emoji: '🖼', bg: `url(${data.coverImage})` }
            ] : [
                { emoji: '✨', bg: 'linear-gradient(135deg, #1e3a5f, #3b82f6)' }
            ],
            dueDates: data.deadlines.map(d => ({
                label: d.label.toUpperCase(),
                date: d.date,
                urgency: 'ok',
                detail: `Project milestone: ${d.label}`
            })),
        };
        setMissions(prev => [newMission, ...prev]);

        // 2. Add to Trending
        setTrendingProjects(prev => [
            { name: data.name, members: 1, href: `/comms?project=${id}`, isNew: true },
            ...prev
        ]);

        // 3. Add to Open Roles
        const newOpenRoles: OpenRole[] = data.roles.map(r => ({
            title: r,
            project: data.name,
            type: 'Freelance'
        }));
        setOpenRoles(prev => [...newOpenRoles, ...prev]);

        // 4. Create Workspace
        const newWorkspace: ProjectWorkspace = {
            name: data.name.toUpperCase(),
            subtitle: 'NEW PRODUCTION',
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
        setWorkspaces(prev => ({
            ...prev,
            [id]: newWorkspace
        }));
    };

    return (
        <ProjectContext.Provider value={{ missions, trendingProjects, openRoles, workspaces, publishMission }}>
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
