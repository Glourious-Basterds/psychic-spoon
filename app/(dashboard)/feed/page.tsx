'use client';

import { useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share2, X, Users, Briefcase, Star, UserPlus, Check, Search, ChevronDown, ChevronUp, Layers, MousePointer2, BarChart3, Mail, Plus } from 'lucide-react';

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
    comments?: Comment[];
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

interface Comment {
    id: number;
    author: Author;
    content: string;
    time: string;
    likes: number;
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
    {
        id: 1, author: AUTHORS['Bruce W.'], content: 'Finished the storyboard for act 2. The silence before the reveal is going to destroy people.', time: '2h ago', image: '/images/storyboard_noir.png', likes: 14, replies: 3,
        comments: [
            { id: 1, author: AUTHORS['Mia K.'], content: 'That overhead bar shot in panel 3 is going to be iconic. The negative space is doing all the work.', time: '1h ago', likes: 4 },
            { id: 2, author: AUTHORS['Rafael G.'], content: 'Already thinking about what silence sounds like for act 2. Might be just room tone and heartbeat.', time: '1h ago', likes: 7 },
            { id: 3, author: AUTHORS['Pietro M.'], content: 'The ghost reveal is exactly what we discussed in the table read. Perfect.', time: '2h ago', likes: 3 },
        ]
    },
    {
        id: 2, author: AUTHORS['Pietro M.'], content: 'Looking for a sound designer for a noir short film. Must understand silence as well as sound. Apply via Hashi.', time: '4h ago', badge: { label: 'OPEN ROLE', color: '#a3e635', bg: 'rgba(163,230,53,0.12)' }, likes: 28, replies: 7,
        comments: [
            { id: 1, author: AUTHORS['Dani M.'], content: 'Posted my showreel link on my profile. Noir is my comfort zone.', time: '3h ago', likes: 6 },
            { id: 2, author: AUTHORS['Rafael G.'], content: 'I work with sound designers regularly. Sara R. on Hashi is exceptional — check her out.', time: '3h ago', likes: 9 },
            { id: 3, author: AUTHORS['Ash V.'], content: 'Shared this with two people in my network. Good luck with the search.', time: '4h ago', likes: 2 },
            { id: 4, author: AUTHORS['Bruce W.'], content: 'We need someone who understands that silence is a sound design choice, not an absence.', time: '4h ago', likes: 11 },
        ]
    },
    {
        id: 11, author: AUTHORS['Mia K.'], content: 'Just dropped the complete set design for The Nighthawk Blues. Jazz bar, two floors, hidden backstage. Every surface tells a story. Blueprint attached.', time: '3h ago', image: '/images/set_design_blueprint.png', likes: 52, replies: 8,
        comments: [
            { id: 1, author: AUTHORS['Dani M.'], content: 'That service area placement is genius. Completely out of sight line from the stage. Smart.', time: '2h ago', likes: 5 },
            { id: 2, author: AUTHORS['Bruce W.'], content: 'Can we talk about the booth layout? I want the camera to be able to move from bar to stage in one push.', time: '2h ago', likes: 8 },
            { id: 3, author: AUTHORS['Yuki T.'], content: 'I love how much detail is in the legend. This is the level every production needs.', time: '3h ago', likes: 6 },
            { id: 4, author: AUTHORS['Ash V.'], content: 'Pinewood Stage 3 is a great choice. Good acoustics even without treatment.', time: '3h ago', likes: 3 },
        ]
    },
    {
        id: 3, author: AUTHORS['Lord Helmet'], content: 'The pasta cannon achieved orbit. Production on Space-Balls continues as planned.', time: '5h ago', likes: 67, replies: 12,
        comments: [
            { id: 1, author: AUTHORS['Tony S.'], content: 'For the record, the orbit was unplanned. The cannon had a minor calibration issue.', time: '4h ago', likes: 22 },
            { id: 2, author: AUTHORS['Pietro M.'], content: 'Minor.', time: '4h ago', likes: 34 },
            { id: 3, author: AUTHORS['Yuki T.'], content: 'I would pay to watch a documentary about this production. The behind the scenes must be incredible.', time: '5h ago', likes: 18 },
            { id: 4, author: AUTHORS['Rafael G.'], content: 'Pasta cannon orbit sounds like the best sentence ever written in a production update.', time: '5h ago', likes: 27 },
        ]
    },
    {
        id: 12, author: AUTHORS['Rafael G.'], content: 'Recording the score for The Nightingale\'s Tale today. Steinway D, two mics, zero samples. If it doesn\'t sound human it doesn\'t go in.', time: '6h ago', image: '/images/studio_score_session.png', likes: 71, replies: 11,
        comments: [
            { id: 1, author: AUTHORS['Mia K.'], content: 'Zero samples is the right call. You can feel the difference immediately.', time: '5h ago', likes: 9 },
            { id: 2, author: AUTHORS['Ash V.'], content: 'What mic setup are you running? That room sounds incredible from the photo.', time: '5h ago', likes: 4 },
            { id: 3, author: AUTHORS['Dani M.'], content: 'The sheet music on that Steinway is giving me chills and I haven\'t even heard a note yet.', time: '6h ago', likes: 13 },
            { id: 4, author: AUTHORS['Yuki T.'], content: 'This is exactly the kind of work I want to score my animated short with. DM incoming.', time: '6h ago', likes: 7 },
        ]
    },
    {
        id: 4, author: AUTHORS['Tony S.'], content: 'New tool prototype: a zero-gravity fork. Patent pending. DM for licensing.', time: '8h ago', image: '/images/zerogravity_fork.png', likes: 45, replies: 9,
        comments: [
            { id: 1, author: AUTHORS['Lord Helmet'], content: 'I tested the Mark I prototype. It bent in zero-G. Not ideal for spaghetti.', time: '7h ago', likes: 45 },
            { id: 2, author: AUTHORS['Pietro M.'], content: 'Did you file BEFORE or AFTER it exploded?', time: '7h ago', likes: 38 },
            { id: 3, author: AUTHORS['Tony S.'], content: 'Before. Obviously before. I am a professional.', time: '7h ago', likes: 41 },
            { id: 4, author: AUTHORS['Mia K.'], content: 'Needs to be in a display case as part of the set design. I am serious.', time: '8h ago', likes: 16 },
        ]
    },
    {
        id: 13, author: AUTHORS['Ash V.'], content: 'Three pitches in one week. Two passed, one destroyed us. The one that destroyed us was the best idea. We are rebuilding it and coming back stronger.', time: '9h ago', likes: 93, replies: 17,
        comments: [
            { id: 1, author: AUTHORS['Mia K.'], content: 'The pitch that breaks you is always the one worth rebuilding. I have been there twice.', time: '8h ago', likes: 12 },
            { id: 2, author: AUTHORS['Dani M.'], content: 'What was the concept? You don\'t have to share but now I\'m curious.', time: '9h ago', likes: 5 },
            { id: 3, author: AUTHORS['Yuki T.'], content: 'The best ideas always need two attempts. The first one clears the path.', time: '9h ago', likes: 8 },
        ]
    },
    {
        id: 5, author: AUTHORS['Bruce W.'], content: 'The Bar-Man wrapped principal photography. Crew was exceptional. Full credits on Hashi.', time: '1d ago', badge: { label: 'PROJECT COMPLETE', color: '#f9fafb', bg: 'rgba(255,255,255,0.08)' }, likes: 103, replies: 21,
        comments: [
            { id: 1, author: AUTHORS['Ash V.'], content: 'Congratulations. Wrapping principal is no small thing. Enjoy it for exactly one day then go to post.', time: '22h ago', likes: 14 },
            { id: 2, author: AUTHORS['Mia K.'], content: 'The bar set looked incredible in the BTS shots Pietro posted. Worth every hour of design work.', time: '22h ago', likes: 19 },
            { id: 3, author: AUTHORS['Dani M.'], content: 'Shot on what glass? Need to know for the grade reference.', time: '23h ago', likes: 5 },
            { id: 4, author: AUTHORS['Bruce W.'], content: 'ARRI Signature Primes. Beautiful rendering, no aberrations. The shadow detail is exceptional.', time: '23h ago', likes: 24 },
            { id: 5, author: AUTHORS['Rafael G.'], content: 'Let me know when you are ready for temp score references. I already have ideas.', time: '1d ago', likes: 11 },
        ]
    },
    {
        id: 14, author: AUTHORS['Yuki T.'], content: 'Concept art for the garden sequence in my new animated short. An astronaut finds a living ecosystem on a dead moon. Took 3 weeks to get the lighting right.', time: '1d ago', image: '/images/concept_art_moon.png', likes: 118, replies: 23,
        comments: [
            { id: 1, author: AUTHORS['Pietro M.'], content: 'I have been staring at this for ten minutes. The light in that cavern is unreal.', time: '22h ago', likes: 21 },
            { id: 2, author: AUTHORS['Bruce W.'], content: 'The compositional depth here is something that most concept artists miss completely. Great work.', time: '23h ago', likes: 17 },
            { id: 3, author: AUTHORS['Rafael G.'], content: 'Already thinking about a theme for this. Something between wonder and isolation.', time: '23h ago', likes: 14 },
            { id: 4, author: AUTHORS['Ash V.'], content: 'If you are still looking for a producer for this short, my calendar is open in Q2.', time: '1d ago', likes: 8 },
            { id: 5, author: AUTHORS['Mia K.'], content: 'The color palette alone could be an entire design language. Do you have the hex codes?', time: '1d ago', likes: 10 },
        ]
    },
    {
        id: 6, author: AUTHORS['Pietro M.'], content: 'IP page for The Bar-Man is now live. If you want to pitch a sequel or spinoff, the door is open.', time: '1d ago', badge: { label: 'IP PAGE LIVE', color: '#93c5fd', bg: 'rgba(147,197,253,0.1)' }, likes: 56, replies: 4,
        comments: [
            { id: 1, author: AUTHORS['Mia K.'], content: 'I submitted a pitch for a spinoff set in the same universe. Check your inbox.', time: '20h ago', likes: 7 },
            { id: 2, author: AUTHORS['Ash V.'], content: 'Locking IP early is smart. Most people do it too late after the concept has already leaked.', time: '22h ago', likes: 12 },
            { id: 3, author: AUTHORS['Dani M.'], content: 'Is the vault open to international partners?', time: '23h ago', likes: 3 },
        ]
    },
    {
        id: 15, author: AUTHORS['Dani M.'], content: 'Golden hour on set — the kind of light that makes you forget you have a call sheet. Shot on anamorphic glass. No grade yet. This is straight off the log.', time: '2d ago', image: '/images/bts_cinematographer.png', likes: 134, replies: 19,
        comments: [
            { id: 1, author: AUTHORS['Yuki T.'], content: 'The way that backlight catches the lens flare on the dolly — that is not luck. That is a decision.', time: '1d ago', likes: 18 },
            { id: 2, author: AUTHORS['Mia K.'], content: 'Straight off the log and it already looks graded. Your eye is next level.', time: '1d ago', likes: 14 },
            { id: 3, author: AUTHORS['Bruce W.'], content: 'What was your T-stop? The depth separation is incredible given what looks like a congested set.', time: '2d ago', likes: 9 },
            { id: 4, author: AUTHORS['Dani M.'], content: 'T2.8, Cooke S7/i. The set was tight but we had the track positioned along the longest axis.', time: '2d ago', likes: 16 },
            { id: 5, author: AUTHORS['Pietro M.'], content: 'Adding this to the Hashi mood board for a future project.', time: '2d ago', likes: 7 },
        ]
    },
    {
        id: 7, author: AUTHORS['Tony S.'], content: 'The shaker exploded again. Fortunately I had already filed the patent. The Bar-Man production continues.', time: '2d ago', likes: 38, replies: 6,
        comments: [
            { id: 1, author: AUTHORS['Lord Helmet'], content: 'I was there. The explosion was, at most, medium sized.', time: '1d ago', likes: 29 },
            { id: 2, author: AUTHORS['Bruce W.'], content: 'I have a close-up of the exact moment it happened. I will keep it as leverage.', time: '2d ago', likes: 31 },
            { id: 3, author: AUTHORS['Yuki T.'], content: 'The fact that the patent was filed first is genuinely the most Tony S. sentence I have ever read.', time: '2d ago', likes: 22 },
        ]
    },
    {
        id: 16, author: AUTHORS['Mia K.'], content: 'Reminder: production design is not decoration. It is the architecture of emotion. Every prop, every color temperature, every sight line is a decision that affects performance.', time: '2d ago', likes: 87, replies: 14,
        comments: [
            { id: 1, author: AUTHORS['Dani M.'], content: 'This needs to be printed and put in every production office. Framed.', time: '1d ago', likes: 19 },
            { id: 2, author: AUTHORS['Bruce W.'], content: 'Every director should have to read this before they get a crew. Non-negotiable.', time: '1d ago', likes: 25 },
            { id: 3, author: AUTHORS['Rafael G.'], content: 'Same is true for score. Every chord is a decision. Every rest is a decision.', time: '2d ago', likes: 17 },
            { id: 4, author: AUTHORS['Pietro M.'], content: 'Sharing this with the whole Bar-Man team. Applies to every department.', time: '2d ago', likes: 13 },
        ]
    },
    {
        id: 8, author: AUTHORS['Lord Helmet'], content: 'In space, no one can hear you slurp spaghetti. But I can. I always can.', time: '02:33', likes: 89, replies: 14,
        comments: [
            { id: 1, author: AUTHORS['Pietro M.'], content: 'This was said at 2:33am. We are choosing not to investigate further.', time: 'late night', likes: 67 },
            { id: 2, author: AUTHORS['Tony S.'], content: 'I heard it from the lab. Proceeded to eat spaghetti out of respect.', time: 'late night', likes: 44 },
            { id: 3, author: AUTHORS['Yuki T.'], content: 'This is going in my portfolio as \'creative brief\'.', time: 'late night', likes: 38 },
        ]
    },
    {
        id: 17, author: AUTHORS['Rafael G.'], content: 'Unpopular opinion: the best film scores are the ones you only notice when they are gone.', time: '3d ago', likes: 203, replies: 41,
        comments: [
            { id: 1, author: AUTHORS['Mia K.'], content: 'The best production design too. You only feel the space when it is gone and you\'re suddenly in a hotel ballroom.', time: '2d ago', likes: 22 },
            { id: 2, author: AUTHORS['Dani M.'], content: 'The same is true for cinematography. The shots that get remembered are the ones with invisible craft.', time: '3d ago', likes: 18 },
            { id: 3, author: AUTHORS['Pietro M.'], content: 'This sent me down a rabbit hole replaying films with the score muted. Changed how I watch everything.', time: '3d ago', likes: 31 },
            { id: 4, author: AUTHORS['Bruce W.'], content: 'Nino Rota. Ennio Morricone. Bernard Herrmann. Invisible giants.', time: '3d ago', likes: 26 },
        ]
    },
    {
        id: 18, author: AUTHORS['Ash V.'], content: 'Looking for an editor who can cut drama without losing the silence between the lines. Hashi profile required. Serious inquiries only.', time: '3d ago', badge: { label: 'OPEN ROLE', color: '#a3e635', bg: 'rgba(163,230,53,0.12)' }, likes: 47, replies: 6,
        comments: [
            { id: 1, author: AUTHORS['Mia K.'], content: 'Dropped you a DM. I know someone who edits like this.', time: '2d ago', likes: 4 },
            { id: 2, author: AUTHORS['Bruce W.'], content: 'The silence between lines is where the real performance lives. Any editor worth their salt knows this.', time: '3d ago', likes: 8 },
            { id: 3, author: AUTHORS['Dani M.'], content: 'Shared on my network. Good luck.', time: '3d ago', likes: 2 },
        ]
    },
    {
        id: 9, author: AUTHORS['Pietro M.'], content: 'Three projects. Two worlds. One platform. Hashi.', time: '3d ago', likes: 201, replies: 34,
        comments: [
            { id: 1, author: AUTHORS['Mia K.'], content: 'Joined specifically for The Bar-Man. Zero regrets.', time: '2d ago', likes: 14 },
            { id: 2, author: AUTHORS['Ash V.'], content: 'Two worlds is an understatement. The projects here feel like they\'re from different planets.', time: '2d ago', likes: 18 },
            { id: 3, author: AUTHORS['Rafael G.'], content: 'Short, accurate, zero waste. Very Pietro.', time: '3d ago', likes: 23 },
            { id: 4, author: AUTHORS['Dani M.'], content: 'Saving this as my wallpaper motivation.', time: '3d ago', likes: 11 },
        ]
    },
    {
        id: 10, author: AUTHORS['Bruce W.'], content: 'If you are serious about your craft, you commit. No excuses. No disappearing. Hashi holds you to that.', time: '4d ago', likes: 144, replies: 19,
        comments: [
            { id: 1, author: AUTHORS['Ash V.'], content: 'Bookmarked. Sending to every collaborator who has ever ghosted me mid-project.', time: '3d ago', likes: 28 },
            { id: 2, author: AUTHORS['Mia K.'], content: 'This is the reason I only work with people who are already on Hashi.', time: '3d ago', likes: 22 },
            { id: 3, author: AUTHORS['Yuki T.'], content: 'Commitment is a craft skill. Completely agree.', time: '4d ago', likes: 16 },
            { id: 4, author: AUTHORS['Rafael G.'], content: 'The accountability layer in Hashi is what makes this real and not just a nice idea.', time: '4d ago', likes: 19 },
        ]
    },
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

// ─── Comments data ─────────────────────────────────────────────────────────────
// Toast system

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
function Avatar({ author, size = 36, onClick }: { author: Author; size?: number; onClick?: (e: React.MouseEvent) => void }) {
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

// ─── Post Modal (Thread View) ──────────────────────────────────────────────────────
function PostModal({ post, onClose, onProfile }: { post: Post; onClose: () => void; onProfile: (name: string) => void }) {
    const comments = post.comments ?? [];
    const [replyText, setReplyText] = useState('');
    const [localComments, setLocalComments] = useState<Comment[]>(comments);
    const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const sendReply = () => {
        if (!replyText.trim()) return;
        const newComment: Comment = {
            id: Date.now(), author: AUTHORS['Pietro M.'], content: replyText.trim(), time: 'now', likes: 0,
        };
        setLocalComments(prev => [...prev, newComment]);
        setReplyText('');
    };

    const toggleCommentLike = (id: number) => {
        setLikedComments(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 4000, display: 'flex' }} onClick={onClose}>
            {/* Dark backdrop */}
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
            {/* Drawer */}
            <div style={{ width: '480px', maxWidth: '100vw', height: '100%', background: '#0a0a0a', borderLeft: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', animation: 'drawer-in 0.25s ease' }}
                onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <div style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#4b5563', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        Thread · {localComments.length} {localComments.length === 1 ? 'reply' : 'replies'}
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '6px', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#f9fafb')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                        <X size={16} />
                    </button>
                </div>

                {/* Scrollable content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

                    {/* Original post */}
                    <div style={{ padding: '16px', background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <div onClick={() => { onClose(); setTimeout(() => onProfile(post.author.name), 100); }}
                                style={{ width: '36px', height: '36px', borderRadius: '50%', background: post.author.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', flexShrink: 0, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)' }}>
                                {post.author.initials}
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f9fafb', cursor: 'pointer' }} onClick={() => { onClose(); setTimeout(() => onProfile(post.author.name), 100); }}>{post.author.name}</div>
                                <div style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: '#4b5563' }}>{post.author.role} · {post.time}</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '14px', color: '#d1d5db', lineHeight: 1.65, marginBottom: post.image ? '12px' : 0 }}>{post.content}</p>
                        {post.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={post.image} alt="" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                        )}
                        {post.badge && (
                            <span style={{ marginTop: '10px', display: 'inline-block', padding: '3px 10px', background: post.badge.bg, border: `1px solid ${post.badge.color}33`, borderRadius: '20px', fontSize: '10px', fontFamily: 'Courier New, monospace', color: post.badge.color, letterSpacing: '0.1em' }}>{post.badge.label}</span>
                        )}
                    </div>

                    {/* Comments */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {localComments.map(comment => (
                            <div key={comment.id} style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: comment.author.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
                                    onClick={() => { onClose(); setTimeout(() => onProfile(comment.author.name), 100); }}>
                                    {comment.author.initials}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#d1d5db', cursor: 'pointer' }}
                                            onClick={() => { onClose(); setTimeout(() => onProfile(comment.author.name), 100); }}>
                                            {comment.author.name}
                                        </span>
                                        <span style={{ fontSize: '9px', fontFamily: 'Courier New, monospace', color: '#374151' }}>{comment.author.role}</span>
                                        <span style={{ marginLeft: 'auto', fontSize: '9px', fontFamily: 'Courier New, monospace', color: '#374151' }}>{comment.time}</span>
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.6, marginBottom: '6px' }}>{comment.content}</p>
                                    <button onClick={() => toggleCommentLike(comment.id)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: likedComments.has(comment.id) ? '#fb923c' : '#374151', fontSize: '11px', fontFamily: 'Courier New, monospace', padding: 0, transition: 'color 0.15s' }}>
                                        <Heart size={11} fill={likedComments.has(comment.id) ? '#fb923c' : 'none'} />
                                        {comment.likes + (likedComments.has(comment.id) ? 1 : 0)}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reply input */}
                <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '10px', background: '#0a0a0a', flexShrink: 0 }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', flexShrink: 0 }}>PM</div>
                    <input type="text" value={replyText} onChange={e => setReplyText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') sendReply(); if (e.key === 'Escape') onClose(); }}
                        placeholder={`Reply to ${post.author.name}...`}
                        style={{ flex: 1, padding: '8px 14px', background: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', color: '#f9fafb', fontSize: '13px', outline: 'none', transition: 'border-color 0.15s' }}
                        onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.2)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
                    <button onClick={sendReply}
                        style={{ padding: '8px 16px', background: replyText.trim() ? 'rgba(163,230,53,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${replyText.trim() ? 'rgba(163,230,53,0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '20px', color: replyText.trim() ? '#a3e635' : '#374151', cursor: replyText.trim() ? 'pointer' : 'default', fontSize: '11px', fontFamily: 'Courier New, monospace', transition: 'all 0.15s' }}>SEND</button>
                </div>

                <style>{`
                    @keyframes drawer-in { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                `}</style>
            </div>
        </div>
    );
}

// ─── Project Focus ────────────────────────────────────────────────────────────
function ProjectFocus({ isEditorSetting = false }: { isEditorSetting?: boolean }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isArticleHiddenByEditor] = useState(isEditorSetting); // simulating editor preference

    return (
        <div style={{ padding: '24px', background: 'linear-gradient(to bottom right, #0d0d0d, #080808)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', margin: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at top right, rgba(163,230,53,0.03), transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ borderLeft: '3px solid #a3e635', paddingLeft: '16px' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', color: '#4b5563', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>Project Focus</div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f9fafb', letterSpacing: '-0.02em', margin: 0 }}>THE SPAGHETTI MONSTER</h2>
                </div>
                <button style={{ padding: '10px 24px', background: '#a3e635', border: 'none', borderRadius: '10px', color: '#000', fontSize: '12px', fontWeight: 800, fontFamily: 'Courier New, monospace', letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(163,230,53,0.2)' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                    COLLABORATE
                </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                <div style={{ flex: '1 1 300px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#9ca3af', marginBottom: '12px' }}>Project Summary</h3>
                    <p style={{ fontSize: '14px', color: '#d1d5db', lineHeight: 1.7, marginBottom: '20px' }}>
                        An interactive installation using dynamic wire sculptures and generative audio.
                        Aiming to debut at the next digital art biennial. This project explores the
                        intersection of mechanical tension and organic chaos.
                    </p>
                </div>

                <div style={{ flex: '0 0 auto', display: 'flex', gap: '10px' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <img src="/images/sculpture_1.png" alt="Detail 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <img src="/images/sculpture_2.png" alt="Detail 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#9ca3af', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Article
                </h3>

                <div style={{ position: 'relative' }}>
                    <div style={{
                        fontSize: '14px', color: '#9ca3af', lineHeight: 1.7,
                        maxHeight: isExpanded ? '2000px' : '80px',
                        overflow: 'hidden',
                        transition: 'max-height 0.4s ease-in-out',
                        maskImage: (!isExpanded && !isArticleHiddenByEditor) ? 'none' : !isExpanded ? 'linear-gradient(to bottom, black 20%, transparent 100%)' : 'none'
                    }}>
                        <p>The concept behind "The Spaghetti Monster" originated from exploring complexity theory and the chaotic beauty in interconnected systems. We wanted to create an experience where viewers could manipulate physical strands of carbon fiber that would, in turn, influence a real-time stochastic soundscape.</p>
                        <p style={{ marginTop: '16px' }}>The technical challenge was mapping high-tension physical movements to low-frequency audio oscillations without introducing digital lag. By using custom-made piezoelectric sensors at the anchor points of the sculpture, we converted physical stress into a 24-bit control signal...</p>
                        <p style={{ marginTop: '16px' }}>Ultimately, the piece serves as a commentary on our own digital entanglement—a mess of wires that we call "connectedness." It's a monster of our own making, beautifully tangled and impossibly deep.</p>
                    </div>

                    {(isArticleHiddenByEditor || !isExpanded) && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            style={{
                                marginTop: '16px', padding: '10px 0', width: '100%',
                                background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)',
                                borderRadius: '10px', color: '#a3e635', fontSize: '11px', fontWeight: 700,
                                fontFamily: 'Courier New, monospace', letterSpacing: '0.1em', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(163,230,53,0.15)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(163,230,53,0.08)')}
                        >
                            {isExpanded ? 'HIDE DEEP CONTEXT' : 'SHOW DEEP CONTEXT'} {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                    )}
                </div>
            </div>
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
    const [openPost, setOpenPost] = useState<Post | null>(null);

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

            {/* ── 3-col layout (nav + feed + sidebar) ─── */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '240px 1fr 300px', maxWidth: '1400px', margin: '0 auto', width: '100%', gap: '1px', background: 'rgba(255,255,255,0.03)' }}>

                {/* ── Left Navigation ──────────────── */}
                <div style={{ padding: '24px 16px', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '20px', background: '#080808' }}>
                    {/* User Profile Summary */}
                    <div style={{ padding: '16px', background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ margin: '0 auto 12px', width: '64px', height: '64px', borderRadius: '50%', background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, color: 'white' }}>PM</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#f9fafb' }}>Pietro Maggiotto</div>
                        <div style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'Courier New, monospace', marginTop: '4px' }}>Creative Technologist</div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#f3f4f6' }}>3.5k</div>
                                <div style={{ fontSize: '9px', color: '#4b5563', textTransform: 'uppercase' }}>Followers</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#f3f4f6' }}>120</div>
                                <div style={{ fontSize: '9px', color: '#4b5563', textTransform: 'uppercase' }}>Connect</div>
                            </div>
                        </div>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {[
                            { icon: MousePointer2, label: 'Feed', active: true },
                            { icon: Layers, label: 'Missions' },
                            { icon: Briefcase, label: 'My Projects' },
                            { icon: Users, label: 'Collaborations' },
                            { icon: BarChart3, label: 'Insights' },
                            { icon: Mail, label: 'Messages' },
                        ].map((item, idx) => (
                            <div key={idx} style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px',
                                cursor: 'pointer', transition: 'all 0.15s',
                                background: item.active ? 'rgba(163,230,53,0.05)' : 'transparent',
                                borderLeft: `2px solid ${item.active ? '#a3e635' : 'transparent'}`
                            }}>
                                <item.icon size={16} color={item.active ? '#a3e635' : '#4b5563'} />
                                <span style={{ fontSize: '13px', fontWeight: item.active ? 600 : 400, color: item.active ? '#f9fafb' : '#6b7280' }}>{item.label}</span>
                            </div>
                        ))}
                    </nav>

                    <button style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.3)', borderRadius: '10px', color: '#a3e635', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        <Plus size={16} /> New Project
                    </button>
                </div>

                {/* ── Center feed ──────────────────── */}
                <div style={{ display: 'flex', flexDirection: 'column', background: '#080808' }}>
                    {/* Sticky search */}
                    <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(12px)', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={13} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search creative focus..."
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
                        <div key={post.id} onClick={() => setOpenPost(post)}
                            className="hoverable-post"
                            style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s', cursor: 'pointer', position: 'relative' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.01)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Avatar author={post.author} onClick={(e: React.MouseEvent) => { e.stopPropagation(); setOpenProfile(post.author.name); }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
                                        <span onClick={(e: React.MouseEvent) => { e.stopPropagation(); setOpenProfile(post.author.name); }}
                                            style={{ fontSize: '14px', fontWeight: 600, color: '#f9fafb', cursor: 'pointer', transition: 'color 0.15s' }}
                                            onMouseEnter={e => (e.currentTarget.style.color = '#a3e635')}
                                            onMouseLeave={e => (e.currentTarget.style.color = '#f9fafb')}>
                                            {post.author.name}
                                        </span>
                                        <span style={{ fontSize: '10px', color: '#4b5563', fontFamily: 'Courier New, monospace' }}>{post.author.role}</span>
                                        {['Mia K.', 'Rafael G.', 'Yuki T.', 'Dani M.', 'Ash V.'].includes(post.author.name) && (
                                            <span style={{ fontSize: '8px', padding: '1px 5px', background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.3)', borderRadius: '4px', color: '#a3e635', fontFamily: 'Courier New, monospace', fontWeight: 600 }}>NEW</span>
                                        )}
                                        <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#374151', fontFamily: 'Courier New, monospace' }}>{post.time}</span>
                                    </div>

                                    <p style={{ fontSize: '14px', color: '#d1d5db', lineHeight: 1.65, marginBottom: '10px' }}>{post.content}</p>

                                    {post.badge && (
                                        <div style={{ marginBottom: '12px' }}>
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
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
                                        <div onClick={(e) => { e.stopPropagation(); setLightbox(post.image!); }} style={{ marginBottom: '12px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', cursor: 'zoom-in', position: 'relative' }}
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
                                        <button onClick={e => { e.stopPropagation(); setOpenPost(post); }}
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

                                    <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button onClick={e => { e.stopPropagation(); setOpenPost(post); }}
                                            style={{ flex: 1, padding: '10px', background: 'rgba(163,230,53,0.06)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: '10px', color: '#a3e635', fontSize: '11px', fontWeight: 700, fontFamily: 'Courier New, monospace', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(163,230,53,0.12)'; e.currentTarget.style.borderColor = 'rgba(163,230,53,0.4)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(163,230,53,0.06)'; e.currentTarget.style.borderColor = 'rgba(163,230,53,0.2)'; }}>
                                            OPEN THREAD <MessageCircle size={14} />
                                        </button>
                                        <div className="view-thread-hint" style={{ fontSize: '10px', fontWeight: 600, fontFamily: 'Courier New, monospace', color: '#4b5563', letterSpacing: '0.1em', opacity: 0.4, transition: 'all 0.2s ease' }}>
                                            CLICK CARD TO VIEW
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <ProjectFocus isEditorSetting={true} />
                </div>

                <style>{`
                     @keyframes toast-in {
                         from { opacity: 0; transform: translateY(12px); }
                         to { opacity: 1; transform: translateY(0); }
                     }
                     .view-thread-hint { opacity: 0; transform: translateY(4px); transition: all 0.2s ease; }
                     .hoverable-post:hover .view-thread-hint { opacity: 0.8 !important; transform: translateY(0); }
                 `}</style>

                {/* ── Right sidebar ─────────────────── */}
                <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: 0, height: '100vh', overflow: 'auto', background: '#080808' }}>

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
            {openPost && (
                <PostModal key={openPost.id} post={openPost} onClose={() => setOpenPost(null)} onProfile={setOpenProfile} />
            )}

            {/* Toast notifications */}
            <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </div>
    );
}
