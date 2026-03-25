'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
    Star, 
    CheckCircle2, 
    Edit3, 
    Mail, 
    Globe as GlobeIcon, 
    Github, 
    Twitter, 
    Heart, 
    MessageCircle, 
    ThumbsUp,
    Camera,
    Plus,
    Send,
    UserPlus,
    X,
    ChevronRight,
    Search
} from 'lucide-react';
import { useProjects, UserProfile, Review, Post } from '@/app/context/ProjectContext';
import { useUI } from '@/context/UIContext';

export default function ProfilePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();
    const { userProfile, updateProfile, getOtherUserById, missions, reachOut } = useProjects();
    const { hashiMode } = useUI();
    
    const targetUserId = searchParams.get('user');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'posts' | 'projects'>('posts');
    const [editData, setEditData] = useState<Partial<UserProfile>>({});

    useEffect(() => {
        if (!targetUserId || targetUserId === 'pietro-m') {
            setProfile(userProfile);
            setIsOwner(true);
        } else {
            const other = getOtherUserById(targetUserId);
            setProfile(other || null);
            setIsOwner(false);
        }
    }, [targetUserId, userProfile, getOtherUserById]);

    if (!profile) return <div className="p-12 text-center opacity-50">User not found</div>;

    const handleSave = () => {
        updateProfile(editData);
        setIsEditing(false);
    };

    const handleMessage = () => {
        if (profile.id === 'bruce-w') {
            router.push('/comms?project=bar-man&channel=Bruce-W.');
        } else {
            router.push('/comms');
        }
    };

    const handleConnect = () => {
        // Mock connection
        alert(`Request sent to ${profile.name}`);
    };

    return (
        <div className="flex-1 overflow-y-auto hashi-scrollbar hashi-theme-bg">
            {/* Hero Section */}
            <div className="relative group">
                {/* Cover Image */}
                <div className="relative h-64 md:h-80 w-full overflow-hidden">
                    <img 
                        src={isEditing ? (editData.coverImage || profile.coverImage || '') : (profile.coverImage || '')} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt="Profile Cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {isEditing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm cursor-pointer border-2 border-dashed border-white/30 m-4 rounded-xl hover:bg-black/40 transition-all">
                            <div className="flex flex-col items-center gap-2 text-white">
                                <Camera size={32} />
                                <span className="text-xs font-bold uppercase tracking-widest">Change Cover</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Info Overlay */}
                <div className="max-w-6xl mx-auto px-6 relative">
                    <div className="flex flex-col md:flex-row items-end gap-6 -mt-20 relative z-10">
                        {/* Avatar */}
                        <div className="relative group/avatar">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#ffffff] shadow-2xl overflow-hidden bg-white shrink-0">
                                {profile.photo ? (
                                    <img src={profile.photo} className="w-full h-full object-cover" alt={profile.name} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-[#1e3a5f] text-4xl font-black">
                                        {profile.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            {isEditing && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                    <Camera size={24} className="text-white" />
                                </div>
                            )}
                        </div>

                        {/* Name & Title */}
                        <div className="flex-1 pb-4 md:pb-6">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg hashi-font uppercase tracking-tight">
                                    {isEditing ? (
                                        <input 
                                            value={editData.name || profile.name || ''} 
                                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                                            className="bg-transparent border-b border-white/50 focus:outline-none w-full"
                                        />
                                    ) : (
                                        profile.name || 'Anonymous User'
                                    )}
                                </h1>
                                {profile.rating >= 4.0 && <CheckCircle2 size={24} className="text-blue-400 fill-white" />}
                            </div>
                            
                            <div className="flex items-center gap-4 text-white/90">
                                <div className="flex items-center gap-1.5">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={i < Math.floor(profile.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold tracking-widest">{(profile.rating || 0).toFixed(1)}</span>
                                    <span className="text-xs opacity-60 font-medium">({profile.reviewCount || 0} reviews)</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-white/30" />
                                <span className="text-sm font-bold uppercase tracking-[0.2em] opacity-80">
                                    {isEditing ? (
                                        <input 
                                            value={editData.role || profile.role || ''} 
                                            onChange={(e) => setEditData({...editData, role: e.target.value})}
                                            className="bg-transparent border-b border-white/50 focus:outline-none"
                                        />
                                    ) : (
                                        profile.role || 'Contributor'
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pb-8">
                            {isOwner ? (
                                isEditing ? (
                                    <>
                                        <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-full border border-white/20 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                                        <button onClick={handleSave} className="px-8 py-2.5 rounded-full bg-blue-500 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg hover:bg-blue-600 transition-all">Save Profile</button>
                                    </>
                                ) : (
                                    <button onClick={() => { setEditData(profile); setIsEditing(true); }} className="px-8 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-white/20 transition-all flex items-center gap-2">
                                        <Edit3 size={14} />
                                        Edit Profile
                                    </button>
                                )
                            ) : (
                                <>
                                    <button onClick={handleConnect} className="px-8 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-white/20 transition-all flex items-center gap-2">
                                        <UserPlus size={14} />
                                        Connect
                                    </button>
                                    <button onClick={handleMessage} className="px-8 py-2.5 rounded-full bg-blue-500 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center gap-2">
                                        <MessageCircle size={14} />
                                        Message
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left Column: Bio & Info */}
                    <div className="lg:col-span-4 space-y-12">
                        {/* Bio Section */}
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/30 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                Raccontati
                            </h3>
                            {isEditing ? (
                                <textarea 
                                    value={editData.bio || profile.bio}
                                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                                    className="w-full bg-black/5 border border-black/10 rounded-xl p-4 text-[13px] leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-400 min-h-[150px]"
                                    placeholder="Raccontati — chi sei, cosa fai, cosa cerchi su Hashi"
                                />
                            ) : (
                                <p className="text-[13px] leading-relaxed text-black/70 italic bg-white p-6 rounded-2xl shadow-sm border border-black/[0.03]">
                                    "{profile.bio}"
                                </p>
                            )}

                            {/* Social / Contact Links */}
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3 text-[11px] font-bold text-black/50 hover:text-black transition-colors cursor-pointer">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-black/5 shadow-sm"><Mail size={14} /></div>
                                    <span>{profile.email}</span>
                                </div>
                                {profile.portfolio && (
                                    <div className="flex items-center gap-3 text-[11px] font-bold text-black/50 hover:text-black transition-colors cursor-pointer">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-black/5 shadow-sm"><GlobeIcon size={14} /></div>
                                        <span>{profile.portfolio}</span>
                                    </div>
                                )}
                                {profile.social && (
                                    <div className="flex items-center gap-3 text-[11px] font-bold text-black/50 hover:text-black transition-colors cursor-pointer">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-black/5 shadow-sm"><Twitter size={14} /></div>
                                        <span>{profile.social}</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Skills & Stats */}
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/30 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                Stiamo cercando
                            </h3>
                            
                            <div className="mb-8">
                                <label className="text-[9px] font-black uppercase tracking-widest text-black/20 block mb-3">Specialtà</label>
                                <div className="flex flex-wrap gap-2">
                                    {profile.specialties.map(spec => (
                                        <span key={spec} className="px-4 py-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-md">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="text-[9px] font-black uppercase tracking-widest text-black/20 block mb-3">Skills</label>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map(skill => (
                                        <span key={skill} className="px-3 py-1.5 bg-gray-100 text-black/70 text-[10px] font-bold uppercase tracking-wider rounded-md border border-black/5 hover:bg-gray-200 transition-colors">
                                            {skill}
                                        </span>
                                    ))}
                                    {isEditing && <button className="w-8 h-8 rounded-md border border-dashed border-black/20 flex items-center justify-center text-black/30 hover:bg-black/5 transition-all"><Plus size={14} /></button>}
                                </div>
                            </div>

                            <div>
                                <label className="text-[9px] font-black uppercase tracking-widest text-black/20 block mb-3">Hobby & Interessi</label>
                                <div className="flex flex-wrap gap-2">
                                    {profile.hobbies.map(hobby => (
                                        <span key={hobby} className="px-3 py-1.5 bg-pink-50 text-pink-700/70 text-[10px] font-bold uppercase tracking-wider rounded-full border border-pink-100 italic">
                                            #{hobby.replace(/\s+/g, '')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Activity & Ratings */}
                    <div className="lg:col-span-8 space-y-12">
                        
                        {/* Activity Section */}
                        <section className="bg-white rounded-3xl shadow-sm border border-black/[0.03] overflow-hidden">
                            <div className="flex border-b border-black/[0.03]">
                                <button 
                                    onClick={() => setActiveTab('posts')} 
                                    className={`flex-1 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'posts' ? 'text-black bg-white' : 'text-black/30 bg-gray-50/50 hover:bg-gray-50'}`}
                                >
                                    Post
                                </button>
                                <button 
                                    onClick={() => setActiveTab('projects')} 
                                    className={`flex-1 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'projects' ? 'text-black bg-white' : 'text-black/30 bg-gray-50/50 hover:bg-gray-50'}`}
                                >
                                    Progetti
                                </button>
                            </div>

                            <div className="p-8">
                                {activeTab === 'posts' ? (
                                    <div className="space-y-8">
                                        {profile.posts.length > 0 ? profile.posts.map(post => (
                                            <div key={post.id} className="group/post">
                                                <div className="flex gap-4 mb-4">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: post.authorColor }}>
                                                        {post.authorInitials}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-black text-[#030712]">{post.authorName}</h4>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/30">{post.timestamp}</p>
                                                    </div>
                                                </div>
                                                <p className="text-[13px] leading-snug text-black/80 mb-4">{post.content}</p>
                                                {post.image && (
                                                    <div className="rounded-2xl overflow-hidden border border-black/5 mb-4 shadow-sm">
                                                        <img src={post.image} className="w-full h-auto" alt="Post content" />
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-6">
                                                    <button className="flex items-center gap-1.5 text-black/30 hover:text-pink-500 transition-colors">
                                                        <ThumbsUp size={14} className={post.likes > 30 ? "fill-pink-500 text-pink-500" : ""} />
                                                        <span className="text-[11px] font-bold">{post.likes}</span>
                                                    </button>
                                                    <button className="flex items-center gap-1.5 text-black/30 hover:text-blue-500 transition-colors">
                                                        <MessageCircle size={14} />
                                                        <span className="text-[11px] font-bold">{post.comments}</span>
                                                    </button>
                                                </div>
                                                <div className="h-px bg-black/[0.03] w-full mt-8" />
                                            </div>
                                        )) : (
                                            <div className="py-12 text-center opacity-30 italic text-sm">Nessun post pubblicato</div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {missions.filter(m => m.id === 'bar-man' || m.id === 'space-balls').map(proj => (
                                            <div key={proj.id} className="group/proj relative bg-gray-50 border border-black/5 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer">
                                                <div className="h-28 overflow-hidden relative">
                                                    <img src={proj.coverImage || '/images/abstract_hashi_overview.png'} className="w-full h-full object-cover group-hover/proj:scale-110 transition-transform duration-700" alt={proj.title} />
                                                    <div className="absolute top-3 right-3">
                                                        <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-md ${proj.status === 'IN_PROGRESS' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 text-black/40'}`}>
                                                            {proj.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="text-[13px] font-black uppercase tracking-tight mb-1 text-[#030712] truncate">{proj.title}</h4>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/30">{proj.role}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Rating & Reviews Section */}
                        <section>
                            <div className="flex flex-col md:flex-row gap-12 items-start">
                                {/* Left: Big Median Rating */}
                                <div className="text-center shrink-0 w-full md:w-auto bg-white p-10 rounded-3xl shadow-sm border border-black/[0.03]">
                                    <div className="text-6xl font-black hashi-font mb-2 leading-none text-[#030712]">{profile.rating.toFixed(1)}</div>
                                    <div className="flex justify-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={18} className={i < Math.floor(profile.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"} />
                                        ))}
                                    </div>
                                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-black/30">Valutazione Globale</div>
                                </div>

                                {/* Right: Category Breakdown */}
                                <div className="flex-1 space-y-4 w-full">
                                    {Object.entries(profile.ratings).map(([key, val]) => (
                                        <div key={key}>
                                            <div className="flex justify-between items-end mb-1.5 px-0.5">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-black/40">
                                                    {key === 'toneUnderstanding' ? 'Comprensione Tono' : key.charAt(0).toUpperCase() + key.slice(1)}
                                                </span>
                                                <span className="text-[10px] font-black text-black/20 italic">{val.toFixed(1)} / 5.0</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-black/80 rounded-full transition-all duration-1000" style={{ width: `${(val / 5) * 100}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Written Reviews List */}
                            <div className="mt-12 space-y-6">
                                {profile.reviews.map(rev => (
                                    <div key={rev.id} className="bg-white/50 p-8 rounded-3xl border border-black/[0.03] hover:bg-white transition-all shadow-sm">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black/30 font-bold text-sm">
                                                    {(rev.reviewerName || 'A').charAt(0)}
                                                </div>
                                                <div>
                                                    <h5 className="text-[12px] font-black text-[#030712]">{rev.reviewerName || 'Anonymous'}</h5>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/20">Su <span className="text-black/40 underline decoration-blue-500/30 underline-offset-4">{rev.projectTitle}</span></p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 group-hover:scale-110 transition-transform">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={10} className={i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-[13px] leading-relaxed text-black/60 italic font-medium">"{rev.text}"</p>
                                        <p className="text-[9px] font-bold text-black/20 mt-4 uppercase tracking-widest">{rev.date}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
