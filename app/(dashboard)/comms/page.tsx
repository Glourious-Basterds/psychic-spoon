'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Image as ImageIcon, Music, Phone, MessageSquare, Video, Play, Pause, Phone as PhoneIcon, X, Send, ChevronDown } from 'lucide-react';

type TabId = 'PHOTOS' | 'SOUNDTRACKS' | 'CALLS' | 'MESSAGES' | 'VIDEO';
type ProjectId = 'bar-man' | 'space-balls';

interface Track { id: string; title: string; duration: string; artist: string; }
interface Call { id: string; user: string; date: string; duration: string; status: 'incoming' | 'outgoing' | 'missed'; }
interface Message { id: string; sender: string; initials: string; color: string; content: string; time: string; mine: boolean; isEasterEgg?: boolean; }
interface Photo { src: string; alt: string; }

const PROJECTS = {
    'bar-man': {
        name: 'THE BAR-MAN',
        subtitle: 'NOIR CINEMA PROJECT',
        channels: ['Home-Base', 'Clandestine-Intel', 'Bruce-W.'],
        onlineUsers: ['Bruce-W.'],
        photos: [
            { src: '/images/barman_noir.png', alt: 'Noir Bartender — Bar Set' },
            { src: '/images/batman_barman.png', alt: 'Batman as The Barman' },
            { src: '/images/joker_bar.png', alt: 'Joker at the Speakeasy' },
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
            ] as Message[],
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
            ] as Message[],
            'Bruce-W.': [
                { id: '1', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "The script is good. But act 3 needs to breathe more. Give the audience 10 more seconds of silence before the reveal.", time: '10:00', mine: false },
                { id: '2', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "Done. Revision uploaded.", time: '10:05', mine: true },
                { id: '3', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "Good.", time: '10:06', mine: false },
                { id: '4', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "What do you think of the poster concept?", time: '15:00', mine: true },
                { id: '5', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "It needs more shadow. Always more shadow.", time: '15:02', mine: false },
                { id: '6', sender: 'Pietro M.', initials: 'PM', color: '#1e3a5f', content: "You say that about everything.", time: '15:03', mine: true },
                { id: '7', sender: 'Bruce W.', initials: 'BW', color: '#1a3a2a', content: "Because everything needs more shadow.", time: '15:04', mine: false },
            ] as Message[],
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
        ] as Photo[],
        tracks: [
            { id: '1', title: 'Spaceballs Theme', duration: '3:45', artist: 'Hashi Audio' },
            { id: '2', title: 'Orbital Drift', duration: '2:58', artist: 'Hashi Audio' },
            { id: '3', title: 'Pasta in Zero-G', duration: '4:22', artist: 'Hashi Audio' },
            { id: '4', title: 'Nebula Serenata', duration: '5:01', artist: 'Hashi Audio' },
        ] as Track[],
        calls: [
            { id: '1', user: 'Lord Helmet', date: 'Dec 21, 14:00', duration: '22 min', status: 'outgoing' },
            { id: '2', user: 'Tony S.', date: 'Dec 20, 09:30', duration: '4 min', status: 'incoming' },
            { id: '3', user: 'Dark Helmet Jr.', date: 'Dec 20, 11:10', duration: '—', status: 'missed' },
        ] as Call[],
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
            ] as Message[],
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
            ] as Message[],
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
            ] as Message[],
        },
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
    // Only auto-scroll when a new user message is sent — not on channel switch
    const sentCountRef = useRef(0);

    useEffect(() => {
        if (projectParam !== activeProject) {
            setActiveProject(projectParam);
            setActiveChannel(PROJECTS[projectParam].channels[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectParam]);

    // Intentionally NOT depending on activeChannel/activeTab — only scroll on new sent messages
    useEffect(() => {
        if (sentCountRef.current > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sentCountRef.current]);

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
        <div style={{ display: 'flex', height: '100vh', background: '#0a0a0a', color: '#e5e7eb', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>

            {/* Project strip */}
            <div style={{ width: '64px', background: '#080808', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', gap: '12px', flexShrink: 0 }}>
                {(['bar-man', 'space-balls'] as ProjectId[]).map(pid => {
                    const isActive = activeProject === pid;
                    const initials = pid === 'bar-man' ? 'BAR' : 'SPC';
                    return (
                        <button
                            key={pid}
                            onClick={() => { setActiveProject(pid); setActiveChannel(PROJECTS[pid].channels[0]); setActiveTab('PHOTOS'); setPlayingTrack(null); }}
                            title={PROJECTS[pid].name}
                            style={{ width: '44px', height: '44px', borderRadius: isActive ? '12px' : '22px', border: isActive ? '2px solid rgba(163,230,53,0.4)' : '1px solid rgba(255,255,255,0.08)', background: isActive ? 'rgba(163,230,53,0.08)' : '#111111', color: isActive ? '#a3e635' : '#4b5563', fontSize: '9px', fontWeight: 800, fontFamily: 'Courier New, monospace', letterSpacing: '0.02em', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderRadius = '14px'; e.currentTarget.style.color = '#d1d5db'; } }}
                            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderRadius = '22px'; e.currentTarget.style.color = '#4b5563'; } }}
                        >
                            {initials}
                        </button>
                    );
                })}
            </div>

            {/* Channel sidebar */}
            <div style={{ width: '200px', background: '#0d0d0d', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
                <div style={{ padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, fontFamily: 'Courier New, monospace', color: '#f9fafb', letterSpacing: '0.08em' }}>{proj.name}</div>
                    <div style={{ fontSize: '9px', color: '#4b5563', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px', fontFamily: 'Courier New, monospace' }}>{proj.subtitle}</div>
                </div>

                <div style={{ padding: '12px 14px 4px', fontSize: '9px', color: '#4b5563', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Courier New, monospace', fontWeight: 700 }}>Intelligence Hub</div>
                {proj.channels.map(ch => {
                    const isCh = activeChannel === ch && activeTab === 'MESSAGES';
                    const isOnline = proj.onlineUsers.includes(ch);
                    return (
                        <button key={ch} onClick={() => { setActiveChannel(ch); setActiveTab('MESSAGES'); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: isCh ? 'rgba(255,255,255,0.05)' : 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: isCh ? '#f9fafb' : '#4b5563', transition: 'all 0.15s' }}
                            onMouseEnter={e => { if (!isCh) e.currentTarget.style.color = '#9ca3af'; }}
                            onMouseLeave={e => { if (!isCh) e.currentTarget.style.color = '#4b5563'; }}>
                            <span style={{ fontSize: '11px', color: '#374151', flexShrink: 0 }}>{isOnline ? '◉' : '#'}</span>
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
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: activeTab === t.id && activeTab !== 'MESSAGES' ? 'rgba(255,255,255,0.04)' : 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: isActive ? '#f9fafb' : '#4b5563', transition: 'all 0.15s' }}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#9ca3af'; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#4b5563'; }}>
                            <Icon size={12} />
                            <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400, textTransform: 'uppercase', fontFamily: 'Courier New, monospace', letterSpacing: '0.06em' }}>{t.label}</span>
                        </button>
                    );
                })}

                <div style={{ marginTop: 'auto', padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: '#93c5fd', flexShrink: 0 }}>PM</div>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#d1d5db' }}>Pietro Maggiotto</div>
                        <div style={{ fontSize: '9px', color: '#4b5563', fontFamily: 'Courier New, monospace', letterSpacing: '0.06em' }}>SYNC // HIGH_COMMAND</div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Tabs bar */}
                <div style={{ height: '48px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '4px', background: '#0d0d0d', flexShrink: 0 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6', marginRight: '12px' }} />
                    {mediaTabDef.map(t => {
                        const Icon = t.icon;
                        const isActive = activeTab === t.id;
                        return (
                            <button key={t.id} onClick={() => setActiveTab(t.id)}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', color: isActive ? '#f9fafb' : '#4b5563', fontSize: '11px', fontWeight: isActive ? 700 : 400, fontFamily: 'Courier New, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: isActive ? '2px solid #a3e635' : '2px solid transparent', transition: 'all 0.15s', marginBottom: '-1px' }}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#9ca3af'; }}
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
                            <div style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#4b5563', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '20px' }}>
                                VISUAL.ARCHIVE &nbsp; <span style={{ color: '#374151' }}>{proj.photos.length} OBJECTS_LOCALIZED</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                                {proj.photos.map((p, i) => (
                                    <button key={i} onClick={() => setLightbox(p)}
                                        style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', aspectRatio: '4/3', cursor: 'pointer', overflow: 'hidden', position: 'relative', padding: 0, transition: 'border-color 0.15s, transform 0.15s' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={p.src} alt={p.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 12px', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', fontSize: '10px', fontFamily: 'Courier New, monospace', color: 'rgba(255,255,255,0.5)', textAlign: 'left', letterSpacing: '0.06em' }}>
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
                                    <div style={{ fontSize: '9px', fontFamily: 'Courier New, monospace', color: '#374151', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
                                        {nowPlaying ? 'NOW PLAYING' : 'AUDIO.VAULT'}
                                    </div>
                                    <div style={{ background: '#111111', border: `1px solid ${nowPlaying ? 'rgba(163,230,53,0.25)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '14px', overflow: 'hidden', transition: 'border-color 0.3s' }}>
                                        {/* Album art area */}
                                        <div style={{ height: '180px', background: nowPlaying ? 'linear-gradient(135deg, #0f1a0f, #1a2e0a)' : 'linear-gradient(135deg, #0d0d0d, #111111)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                            {/* Vinyl record visual */}
                                            <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'radial-gradient(circle, #1a1a1a 30%, #111 31%, #222 40%, #111 41%, #222 60%, #111 61%, #222 80%, #111 81%)', border: `2px solid ${nowPlaying ? 'rgba(163,230,53,0.2)' : 'rgba(255,255,255,0.06)'}`, boxShadow: nowPlaying ? '0 0 30px rgba(163,230,53,0.1)' : 'none', animation: nowPlaying ? 'spin 4s linear infinite' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: nowPlaying ? '#a3e635' : '#333', transition: 'background 0.3s' }} />
                                            </div>
                                            {/* EQ bars (visible when playing) */}
                                            {nowPlaying && (
                                                <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '3px', alignItems: 'flex-end', height: '20px' }}>
                                                    {[10, 16, 12, 18, 14, 20, 10].map((h, j) => (
                                                        <div key={j} style={{ width: '3px', background: '#a3e635', borderRadius: '2px', height: `${h}px`, animation: `eq-bar ${0.4 + j * 0.11}s infinite alternate ease-in-out` }} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Track info */}
                                        <div style={{ padding: '16px' }}>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: nowPlaying ? '#f9fafb' : '#4b5563', marginBottom: '4px', transition: 'color 0.3s', minHeight: '20px' }}>
                                                {nowPlaying ? nowPlaying.title : 'No track selected'}
                                            </div>
                                            <div style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#4b5563', marginBottom: '16px' }}>
                                                {nowPlaying ? nowPlaying.artist : '—'}
                                            </div>

                                            {/* Progress bar (decorative for now) */}
                                            <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginBottom: '12px', overflow: 'hidden' }}>
                                                {nowPlaying && <div style={{ height: '100%', background: '#a3e635', borderRadius: '2px', width: '40%', animation: 'progress-slide 8s linear infinite' }} />}
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
                                                    onMouseEnter={e => (e.currentTarget.style.color = '#9ca3af')}
                                                    onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}
                                                >⏮</button>
                                                <button
                                                    onClick={() => setPlayingTrack(nowPlaying ? null : proj.tracks[0].id)}
                                                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: nowPlaying ? '#a3e635' : 'rgba(255,255,255,0.06)', border: `1px solid ${nowPlaying ? '#a3e635' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: nowPlaying ? '#000' : '#9ca3af', transition: 'all 0.15s' }}
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
                                                    onMouseEnter={e => (e.currentTarget.style.color = '#9ca3af')}
                                                    onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}
                                                >⏭</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Track list */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0' }}>
                                    <div style={{ fontSize: '9px', fontFamily: 'Courier New, monospace', color: '#374151', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
                                        TRACKLIST &nbsp; <span style={{ color: '#1f2937' }}>{proj.tracks.length} TRACKS</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {proj.tracks.map((t, i) => {
                                            const isPlaying = playingTrack === t.id;
                                            return (
                                                <div
                                                    key={t.id}
                                                    onClick={() => setPlayingTrack(isPlaying ? null : t.id)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: isPlaying ? 'rgba(163,230,53,0.06)' : '#111111', border: `1px solid ${isPlaying ? 'rgba(163,230,53,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s' }}
                                                    onMouseEnter={e => { if (!isPlaying) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                                                    onMouseLeave={e => { if (!isPlaying) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                                                >
                                                    <span style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: isPlaying ? '#a3e635' : '#374151', minWidth: '20px' }}>
                                                        {isPlaying ? '▶' : String(i + 1).padStart(2, '0')}
                                                    </span>
                                                    {/* Tiny album rect */}
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: isPlaying ? 'linear-gradient(135deg, #1a2e0a, #0f1a0f)' : 'linear-gradient(135deg, #161616, #0d0d0d)', border: `1px solid ${isPlaying ? 'rgba(163,230,53,0.2)' : 'rgba(255,255,255,0.05)'}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Music size={14} style={{ color: isPlaying ? '#a3e635' : '#374151' }} />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: '13px', fontWeight: isPlaying ? 600 : 400, color: isPlaying ? '#f9fafb' : '#d1d5db', marginBottom: '2px' }}>{t.title}</div>
                                                        <div style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: '#374151' }}>{t.artist}</div>
                                                    </div>
                                                    <span style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#374151', flexShrink: 0 }}>{t.duration}</span>
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
                                CALL.LOG &nbsp; <span style={{ color: '#374151' }}>{proj.calls.length} RECORDS</span>
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
                                        <button style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#9ca3af', fontSize: '11px', cursor: 'pointer', fontFamily: 'Courier New, monospace', letterSpacing: '0.06em', transition: 'all 0.15s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(163,230,53,0.08)'; e.currentTarget.style.color = '#a3e635'; e.currentTarget.style.borderColor = 'rgba(163,230,53,0.2)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
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
                            <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px', background: '#0d0d0d', flexShrink: 0 }}>
                                <span style={{ fontSize: '12px', color: '#4b5563', fontFamily: 'Courier New, monospace' }}>#</span>
                                <select value={activeChannel} onChange={e => setActiveChannel(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', color: '#f9fafb', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                                    {proj.channels.map(ch => <option key={ch} value={ch} style={{ background: '#111111' }}>{ch}</option>)}
                                </select>
                                <ChevronDown size={12} style={{ color: '#4b5563' }} />
                            </div>

                            {/* Message list */}
                            <div style={{ flex: 1, overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {currentMessages.map(msg => (
                                    <div key={msg.id} style={{ display: 'flex', gap: '10px', flexDirection: msg.mine ? 'row-reverse' : 'row', opacity: msg.isEasterEgg ? 0.7 : 1 }}>
                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: msg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', flexShrink: 0, border: msg.isEasterEgg ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
                                            {msg.initials}
                                        </div>
                                        <div style={{ maxWidth: '70%' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexDirection: msg.mine ? 'row-reverse' : 'row' }}>
                                                <span style={{ fontSize: '11px', fontWeight: 600, color: msg.isEasterEgg ? '#4b5563' : '#d1d5db' }}>{msg.sender}</span>
                                                <span style={{ fontSize: '9px', color: '#374151', fontFamily: 'Courier New, monospace' }}>{msg.time}</span>
                                                {msg.isEasterEgg && <span style={{ fontSize: '9px', color: '#374151', fontFamily: 'Courier New, monospace', fontStyle: 'italic' }}>· late night</span>}
                                            </div>
                                            <div style={{ padding: '9px 13px', borderRadius: msg.mine ? '12px 3px 12px 12px' : '3px 12px 12px 12px', background: msg.isEasterEgg ? 'rgba(255,255,255,0.02)' : msg.mine ? 'rgba(163,230,53,0.07)' : '#111111', border: `1px solid ${msg.isEasterEgg ? 'rgba(255,255,255,0.05)' : msg.mine ? 'rgba(163,230,53,0.13)' : 'rgba(255,255,255,0.06)'}`, fontSize: '13px', color: msg.isEasterEgg ? '#4b5563' : '#d1d5db', lineHeight: 1.55, fontStyle: msg.isEasterEgg ? 'italic' : 'normal' }}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '10px', background: '#0a0a0a', flexShrink: 0 }}>
                                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                    placeholder={`Message #${activeChannel}...`}
                                    style={{ flex: 1, background: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 16px', color: '#f9fafb', fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.15s' }}
                                    onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.18)')}
                                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
                                <button onClick={sendMessage}
                                    style={{ padding: '10px 16px', background: newMessage.trim() ? 'rgba(163,230,53,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${newMessage.trim() ? 'rgba(163,230,53,0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '10px', color: newMessage.trim() ? '#a3e635' : '#374151', cursor: newMessage.trim() ? 'pointer' : 'default', transition: 'all 0.15s' }}>
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* VIDEO */}
                    {activeTab === 'VIDEO' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px', color: '#374151' }}>
                            <Video size={48} style={{ opacity: 0.2 }} />
                            <div style={{ fontSize: '12px', fontFamily: 'Courier New, monospace', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Video archive — coming soon</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLightbox(null)}>
                    <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px', color: '#9ca3af', cursor: 'pointer' }}>
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
        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#0a0a0a', color: '#4b5563', fontFamily: 'Courier New, monospace', fontSize: '11px', letterSpacing: '0.1em' }}>LOADING WORKSPACE...</div>}>
            <CommsInner />
        </Suspense>
    );
}
