'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
    Search,
    Settings,
    Maximize2,
    Move
} from 'lucide-react';
import { useProjects, UserProfile, Review, Post, RatingBreakdown } from '@/app/context/ProjectContext';
import { useUI } from '@/context/UIContext';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { Users, FolderKanban, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { signIn } from 'next-auth/react';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (review: any) => void;
    targetName: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit, targetName }) => {
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');
    const [categories, setCategories] = useState<RatingBreakdown>({
        reliability: 5,
        communication: 5,
        punctuality: 5,
        quality: 5,
        toneUnderstanding: 5,
        creativity: 5,
        teamwork: 5
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-[#030712]">Lascia una recensione</h2>
                        <p className="text-xs font-bold text-black/30 uppercase tracking-widest mt-1">Per {targetName}</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center hover:bg-gray-50 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto hashi-scrollbar space-y-8">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 block mb-4">Valutazione Generale</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button key={s} onClick={() => setRating(s)} className="transition-transform hover:scale-110">
                                    <Star size={32} className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {Object.entries(categories).map(([key, val]) => (
                            <div key={key}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-black/40">
                                        {key === 'toneUnderstanding' ? 'Comprensione Tono' : key.charAt(0).toUpperCase() + key.slice(1)}
                                    </span>
                                    <span className="text-[10px] font-black text-blue-500">{val.toFixed(1)}</span>
                                </div>
                                <input 
                                    type="range" min="1" max="5" step="0.5" 
                                    value={val} 
                                    onChange={(e) => setCategories({...categories, [key]: parseFloat(e.target.value)})}
                                    className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 block mb-4">La tua esperienza</label>
                        <textarea 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Descrivi la tua esperienza lavorando con questa persona."
                            className="w-full bg-gray-50 border border-black/5 rounded-2xl p-6 text-[13px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[120px]"
                        />
                    </div>
                </div>

                <div className="p-8 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/50">
                    <button onClick={onClose} className="px-8 py-3 rounded-full text-black/40 font-black uppercase text-[10px] tracking-widest hover:text-black transition-all">Annulla</button>
                    <button 
                        onClick={() => onSubmit({ rating, text, categories })}
                        className="px-10 py-3 rounded-full bg-[#030712] text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all"
                    >
                        Pubblica Recensione
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- ImageEditor Component ---
const ImageEditor = ({ 
    image, 
    scale, 
    x, 
    y, 
    onUpdate, 
    label 
}: { 
    image: string | undefined; 
    scale: number; 
    x: number; 
    y: number; 
    onUpdate?: (data: { scale?: number, x?: number, y?: number }) => void;
    label: string;
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartPos({ x: e.clientX - x, y: e.clientY - y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        onUpdate?.({ 
            x: e.clientX - startPos.x, 
            y: e.clientY - startPos.y 
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    return (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm overflow-hidden select-none">
            <div 
                className="absolute inset-0 cursor-move active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <img 
                    src={image || undefined} 
                    alt="Editor" 
                    className="w-full h-full object-cover pointer-events-none"
                    style={{ 
                        transform: `translate(${x}px, ${y}px) scale(${scale})`,
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                />
            </div>
            
            {/* Internal positioning info if no external onUpdate (rare) */}
            {!onUpdate && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 bg-black/60 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl min-w-[280px]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60 text-center">Drag to position {label}</p>
                </div>
            )}
        </div>
    );
};

// --- ImageEditModal Component ---
const ImageEditModal = ({ 
    isOpen, 
    onClose, 
    type, 
    image, 
    scale, 
    x, 
    y, 
    onUpdate 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    type: 'photo' | 'cover' | 'background';
    image: string | undefined;
    scale: number;
    x: number;
    y: number;
    onUpdate: (data: { scale?: number, x?: number, y?: number }) => void;
}) => {
    if (!isOpen) return null;

    const label = type === 'photo' ? 'Profile' : type === 'cover' ? 'Cover' : 'Background';

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
            <div className="relative bg-[#030712] w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-white/10">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Edit {label} Photo</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 transition-all">
                        <X size={18} />
                    </button>
                </div>

                <div className="relative aspect-video md:aspect-[21/9] bg-black group">
                    <div className={`absolute inset-0 overflow-hidden ${type === 'photo' ? 'flex items-center justify-center' : ''}`}>
                        <div className={`relative ${type === 'photo' ? 'w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/20' : 'w-full h-full'}`}>
                            <ImageEditor 
                                image={image}
                                scale={scale}
                                x={x}
                                y={y}
                                label={label}
                                onUpdate={onUpdate}
                            />
                        </div>
                    </div>
                    {type === 'photo' && <div className="absolute inset-0 pointer-events-none border-[40px] md:border-[80px] border-[#030712]/60" />}
                </div>

                <div className="p-8 space-y-6 bg-white/5">
                    <div className="flex items-center gap-4">
                        <Maximize2 size={16} className="text-white/40" />
                        <input 
                            type="range" 
                            min="1" 
                            max="10" 
                            step="0.01" 
                            value={scale} 
                            onChange={(e) => onUpdate({ scale: parseFloat(e.target.value) })}
                            className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                        />
                        <span className="text-[11px] font-bold text-white w-12 text-right">{(scale * 10).toFixed(0)}%</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Drag image to perfect position</p>
                        <button 
                            onClick={onClose}
                            className="px-12 py-3.5 rounded-full bg-blue-500 text-white font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all border border-blue-400/50"
                        >
                            Apply Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- LoginView Component ---
const LoginView = () => {
    const { setAuthModalOpen, setAuthModalView } = useUI();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Credenziali non valide. Riprova.');
            }
        } catch (err) {
            setError('Si è verificato un errore. Riprova.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-full h-full bg-white overflow-hidden animate-in fade-in duration-700">
            {/* Left: Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-12 lg:p-24 relative z-10 bg-white shadow-2xl">
                <div className="w-full max-w-sm space-y-10">
                    <div className="space-y-4">
                        <div className="text-3xl font-black tracking-[0.3em] text-[#030712] hashi-font mb-8">hashi.</div>
                        <h2 className="text-xl font-bold text-[#030712] tracking-tight">Accedi al tuo profilo</h2>
                        <p className="text-sm text-black/40">Inserisci le tue credenziali per continuare la tua storia.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#65a30d] transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email" 
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-black/[0.02] border border-black/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#65a30d]/20 focus:border-[#65a30d]/30 transition-all font-medium"
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#65a30d] transition-colors" size={18} />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password" 
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-black/[0.02] border border-black/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#65a30d]/20 focus:border-[#65a30d]/30 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {error && <p className="text-[11px] font-bold text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-[#030712] text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-black/10 hover:bg-black transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {isLoading ? 'Accesso in corso...' : (
                                <>
                                    Accedi
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="pt-6 text-center">
                            <button 
                                type="button"
                                onClick={() => { setAuthModalView('register'); setAuthModalOpen(true); }}
                                className="text-[11px] font-black uppercase tracking-widest text-black/30 hover:text-[#65a30d] transition-colors"
                            >
                                Non hai un account? <span className="text-[#030712] underline decoration-[#65a30d]/30 underline-offset-4">Registrati</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right: Presentation */}
            <div className="hidden lg:flex flex-1 bg-[#f9fafb] items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none select-none overflow-hidden flex items-center justify-center">
                    <div className="text-[30rem] font-black tracking-tighter alternate-font">H</div>
                </div>

                <div className="w-full max-w-md relative z-10 space-y-12">
                    <div className="space-y-4">
                        <div className="w-12 h-1.5 bg-[#65a30d] rounded-full" />
                        <h3 className="text-4xl font-black tracking-tight text-[#030712] leading-[1.1]">Perché scegliere Hashi?</h3>
                    </div>

                    <div className="space-y-10">
                        <div className="flex gap-6 group">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-black/5 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#65a30d]/5 group-hover:border-[#65a30d]/20 transition-all duration-500">
                                <Users size={24} className="text-[#65a30d]" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-black uppercase tracking-widest">Trova il tuo team</h4>
                                <p className="text-[13px] text-black/40 leading-relaxed font-medium">Connettiti con i migliori creativi del settore per dare vita alle tue visioni più audaci.</p>
                            </div>
                        </div>

                        <div className="flex gap-6 group">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-black/5 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#65a30d]/5 group-hover:border-[#65a30d]/20 transition-all duration-500">
                                <FolderKanban size={24} className="text-[#65a30d]" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-black uppercase tracking-widest">Gestisci i tuoi progetti</h4>
                                <p className="text-[13px] text-black/40 leading-relaxed font-medium">Strumenti di workflow avanzati pensati esclusivamente per il processo creativo.</p>
                            </div>
                        </div>

                        <div className="flex gap-6 group">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-black/5 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#65a30d]/5 group-hover:border-[#65a30d]/20 transition-all duration-500">
                                <ShieldCheck size={24} className="text-[#65a30d]" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-black uppercase tracking-widest">Proteggi la tua IP</h4>
                                <p className="text-[13px] text-black/40 leading-relaxed font-medium">Il Vault digitale per custodire e valorizzare le tue proprietà intellettuali.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Profile Content Component ---
function ProfileContent({ userId }: { userId?: string }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { status } = useSession();
    const { userProfile, updateProfile, getOtherUserById, missions, addReview } = useProjects();
    const { setAuthModalOpen } = useUI();
    
    const targetUserId = userId || searchParams.get('user');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'posts' | 'projects'>('posts');
    const [editData, setEditData] = useState<Partial<UserProfile>>({});

    const [editingSections, setEditingSections] = useState({
        hero: false,
        bio: false,
        skills: false,
        links: false,
        photo: false,
        cover: false,
        background: false
    });

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const coverInputRef = React.useRef<HTMLInputElement>(null);
    const bgInputRef = React.useRef<HTMLInputElement>(null);

    const [activeEditor, setActiveEditor] = useState<'photo' | 'cover' | 'background' | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const toggleSection = (section: keyof typeof editingSections) => {
        if (!isOwner) return;
        setEditingSections(prev => ({ ...prev, [section]: !prev[section] }));
        if (!isEditing) {
            setEditData(profile || {});
            setIsEditing(true);
        }
    };

    const openImageEditor = (type: 'photo' | 'cover' | 'background') => {
        setActiveEditor(type);
        setIsEditModalOpen(true);
    };

    useEffect(() => {
        // Normalizing ID for comparison
        const myId = userProfile.id?.toLowerCase();
        const tid = targetUserId?.toLowerCase();

        if (!targetUserId || tid === 'pietro-m' || tid === 'pietro m.' || tid === myId) {
            setProfile(userProfile);
            setIsOwner(true);
        } else {
            const other = getOtherUserById(targetUserId);
            setProfile(other || null);
            setIsOwner(false);
        }
    }, [targetUserId, userProfile, getOtherUserById]);

    if (!profile) return <div className="p-12 text-center opacity-50">User not found</div>;

    const canReview = !isOwner && missions.some(m => 
        m.status === 'COMPLETED' && 
        m.members?.some(mm => mm.name === profile.name) &&
        m.members?.some(mm => mm.name === userProfile.name)
    );

    const handleSave = () => {
        updateProfile(editData);
        setIsEditing(false);
        setEditingSections({ 
            hero: false, bio: false, skills: false, links: false,
            photo: false, cover: false, background: false 
        });
        setActiveEditor(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'coverImage' | 'backgroundPhoto') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                const type = field === 'photo' ? 'photo' : field === 'coverImage' ? 'cover' : 'background';
                
                setEditData(prev => ({ 
                    ...prev, 
                    [field]: base64,
                    ...(field === 'photo' ? { photoScale: 1, photoX: 0, photoY: 0 } : {}),
                    ...(field === 'coverImage' ? { coverScale: 1, coverX: 0, coverY: 0 } : {}),
                    ...(field === 'backgroundPhoto' ? { bgScale: 1, bgX: 0, bgY: 0 } : {})
                }));
                
                setIsEditing(true);
                openImageEditor(type);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMessage = () => {
        if (status === 'unauthenticated') {
            setAuthModalOpen(true);
            return;
        }
        if (profile.id === 'bruce-w' || profile.name === 'Bruce W.') {
            router.push('/comms?project=bar-man&channel=Bruce-W.');
        } else {
            router.push('/comms');
        }
    };

    const handleConnect = () => {
        if (status === 'unauthenticated') {
            setAuthModalOpen(true);
            return;
        }
        alert(`Request sent to ${profile.name}`);
    };

    const handleReviewSubmit = (reviewData: any) => {
        addReview(profile.id, {
            reviewerName: userProfile.name,
            reviewerPhoto: userProfile.photo,
            projectTitle: missions.find(m => m.members?.some(mm => mm.name === profile.name))?.title || 'Collaborazione Hashi',
            text: reviewData.text,
            rating: reviewData.rating,
        });
        setIsReviewModalOpen(false);
    };

    return (
        <div className="flex-1 overflow-y-auto h-full hashi-scrollbar hashi-theme-bg relative">
            {/* Background Layer */}
            {profile.backgroundPhoto && (
                <div className="fixed inset-0 z-[-1] opacity-20 pointer-events-none">
                    <img 
                        src={isEditing ? (editData.backgroundPhoto || profile.backgroundPhoto || undefined) : (profile.backgroundPhoto || undefined)} 
                        className="w-full h-full object-cover" 
                        style={{
                            transform: isEditing ? `translate(${editData.bgX || 0}px, ${editData.bgY || 0}px) scale(${editData.bgScale || 1})` : `translate(${profile.bgX || 0}px, ${profile.bgY || 0}px) scale(${profile.bgScale || 1})`
                        }}
                        alt="Background" 
                    />
                    {isEditing && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none bg-black/20">
                            <button 
                                onClick={() => bgInputRef.current?.click()}
                                className="pointer-events-auto flex items-center gap-2 px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest hover:bg-black/80 transition-all shadow-2xl"
                            >
                                <Camera size={14} /> Change Background
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Hidden Inputs */}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} />
            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'coverImage')} />
            <input type="file" ref={bgInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'backgroundPhoto')} />

            {/* Hero Section */}
            <div className="relative group">
                {/* Cover Image */}
                <div className="relative h-64 md:h-80 w-full overflow-hidden">
                    <img 
                        src={isEditing ? (editData.coverImage || profile.coverImage || undefined) : (profile.coverImage || undefined)} 
                        className="w-full h-full object-cover transition-transform duration-700"
                        style={{
                            transform: isEditing ? `translate(${editData.coverX || 0}px, ${editData.coverY || 0}px) scale(${editData.coverScale || 1})` : `translate(${profile.coverX || 0}px, ${profile.coverY || 0}px) scale(${profile.coverScale || 1})`
                        }}
                        alt="Profile Cover"
                    />
                    
                    {/* Fixed Gradient Overlay for text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent opacity-80" />

                    {isEditing && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                            <button 
                                onClick={() => coverInputRef.current?.click()}
                                className="pointer-events-auto flex items-center gap-2 px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest hover:bg-black/80 transition-all shadow-2xl"
                            >
                                <Camera size={14} /> Change Cover
                            </button>
                        </div>
                    )}

                </div>

                {/* Profile Info Overlay */}
                <div className="max-w-6xl mx-auto px-6 relative">
                    <div className="flex flex-col md:flex-row items-end gap-6 -mt-20 relative z-10">
                        {/* Avatar */}
                        <div className="relative group/avatar">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#ffffff] shadow-2xl overflow-hidden bg-white shrink-0 relative">
                                {isEditing ? (
                                    <img 
                                        src={editData.photo || profile.photo || undefined} 
                                        className="w-full h-full object-cover" 
                                        style={{
                                            transform: `translate(${editData.photoX || 0}px, ${editData.photoY || 0}px) scale(${editData.photoScale || 1})`
                                        }}
                                        alt={profile.name} 
                                    />
                                ) : profile.photo ? (
                                    <img 
                                        src={profile.photo} 
                                        className="w-full h-full object-cover" 
                                        style={{
                                            transform: `translate(${profile.photoX || 0}px, ${profile.photoY || 0}px) scale(${profile.photoScale || 1})`
                                        }}
                                        alt={profile.name} 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-[#1e3a5f] text-4xl font-black text-center">
                                        {profile.name?.charAt(0) || 'U'}
                                    </div>
                                )}

                                {isEditing && activeEditor === 'photo' && (
                                    <ImageEditor 
                                        image={editData.photo || profile.photo || undefined}
                                        scale={editData.photoScale ?? profile.photoScale ?? 1}
                                        x={editData.photoX ?? profile.photoX ?? 0}
                                        y={editData.photoY ?? profile.photoY ?? 0}
                                        label="Avatar"
                                        onUpdate={(d: { scale?: number, x?: number, y?: number }) => setEditData(prev => ({ ...prev, 
                                            photoScale: d.scale ?? prev.photoScale,
                                            photoX: d.x ?? prev.photoX,
                                            photoY: d.y ?? prev.photoY
                                        }))}
                                    />
                                )}
                            </div>
                             {isEditing && (
                                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-full overflow-hidden">
                                    <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all shadow-lg"><Camera size={24} /></button>
                                </div>
                            )}
                        </div>

                        {/* Name & Title */}
                        <div className="flex-1 pb-4 md:pb-6">
                            <div className="flex items-center gap-3 mb-1 group/name">
                                <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] hashi-font uppercase tracking-tight flex items-center gap-4">
                                {isEditing ? (
                                    <input 
                                        value={editData.name || profile.name || ''} 
                                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                                        className="bg-transparent border-b border-white/50 focus:outline-none w-full"
                                    />
                                ) : (
                                    <div className="flex items-center gap-4">
                                        {profile.name || 'Anonymous User'}
                                        <VerificationBadge rating={profile.rating} size={28} className="translate-y-[-2px]" />
                                        {isOwner && <button onClick={() => toggleSection('hero')} className="p-1 hover:bg-white/10 rounded-full transition-colors"><Edit3 size={16} className="text-white/60" /></button>}
                                    </div>
                                )}
                                </h1>
                            </div>
                            
                            <div className="flex items-center gap-4 text-white/90">
                                <div className="flex items-center gap-1.5 focus-within:ring-1 focus-within:ring-blue-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={i < Math.floor(profile.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold tracking-widest text-white">{(profile.rating || 0).toFixed(1)}</span>
                                    <span className="text-xs text-white/80 font-medium">({profile.reviewCount || 0} reviews)</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-white/50" />
                                <span className="text-sm font-bold uppercase tracking-[0.2em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
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
                        <div className="flex gap-3 pb-8 items-center">
                            {isOwner ? (
                                isEditing ? (
                                    <>
                                        <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-full border border-white/20 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                                        <button onClick={handleSave} className="px-8 py-2.5 rounded-full bg-blue-500 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg hover:bg-blue-600 transition-all">Salva Modifiche</button>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => { setEditData(profile); setIsEditing(true); }} 
                                            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center shadow-2xl hover:bg-black/60 transition-all group/gear"
                                            title="Edit Profile"
                                        >
                                            <Settings size={20} className="group-hover/gear:rotate-90 transition-transform duration-500" />
                                        </button>
                                    </div>
                                )
                            ) : (
                                <>
                                    <button onClick={handleConnect} className="px-8 py-2.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:bg-black/60 transition-all flex items-center gap-2">
                                        <UserPlus size={14} />
                                        Connect
                                    </button>
                                    <button onClick={handleMessage} className="px-8 py-2.5 rounded-full bg-blue-500 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center gap-2">
                                        <MessageCircle size={14} />
                                        Message
                                    </button>
                                    {canReview && (
                                        <button onClick={() => setIsReviewModalOpen(true)} className="px-8 py-2.5 rounded-full bg-yellow-400 text-black font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-yellow-500 transition-all flex items-center gap-2 border-2 border-white/20">
                                            <Star size={14} fill="currentColor" />
                                            Lascia una recensione
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <ReviewModal 
                    isOpen={isReviewModalOpen} 
                    onClose={() => setIsReviewModalOpen(false)} 
                    onSubmit={handleReviewSubmit}
                    targetName={profile.name}
                />
            </div>

            {/* Main Content Grid */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left Column: Bio & Info */}
                    <div className="lg:col-span-4 space-y-12">
                        {/* Bio Section */}
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/60 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                Raccontati
                                {isOwner && <button onClick={() => toggleSection('bio')} className="p-1 hover:bg-black/5 rounded-full transition-colors"><Edit3 size={12} className="text-black/40" /></button>}
                            </h3>
                            {isEditing && editingSections.bio ? (
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

                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/60 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                Stiamo cercando
                                {isOwner && <button onClick={() => toggleSection('skills')} className="p-1 hover:bg-black/5 rounded-full transition-colors"><Edit3 size={12} className="text-black/40" /></button>}
                            </h3>
                            
                            <div className="mb-8">
                                <label className="text-[9px] font-black uppercase tracking-widest text-black/40 block mb-3">Specialità</label>
                                <div className="flex flex-wrap gap-2">
                                    {(profile.specialties || []).map(spec => (
                                        <span key={spec} className="px-4 py-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-md">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="text-[9px] font-black uppercase tracking-widest text-black/40 block mb-3">Skills</label>
                                <div className="flex flex-wrap gap-2">
                                    {(profile.skills || []).map(skill => (
                                        <span key={skill} className="px-3 py-1.5 bg-gray-100 text-black/70 text-[10px] font-bold uppercase tracking-wider rounded-md border border-black/5 hover:bg-gray-200 transition-colors">
                                            {skill}
                                        </span>
                                    ))}
                                    {isEditing && <button className="w-8 h-8 rounded-md border border-dashed border-black/20 flex items-center justify-center text-black/30 hover:bg-black/5 transition-all"><Plus size={14} /></button>}
                                </div>
                            </div>

                            <div>
                                <label className="text-[9px] font-black uppercase tracking-widest text-black/40 block mb-3">Hobby & Interessi</label>
                                <div className="flex flex-wrap gap-2">
                                    {(profile.hobbies || []).map(hobby => (
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
                                        {profile.posts && profile.posts.length > 0 ? profile.posts.map(post => (
                                            <div key={post.id} className="group/post">
                                                <div className="flex gap-4 mb-4">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: post.authorColor || '#ccc' }}>
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
                                    <div className="text-6xl font-black hashi-font mb-2 leading-none text-[#030712]">{(profile.rating || 0).toFixed(1)}</div>
                                    <div className="flex justify-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={18} className={i < Math.floor(profile.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"} />
                                        ))}
                                    </div>
                                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-black/50">Valutazione Globale</div>
                                </div>

                                {/* Right: Category Breakdown */}
                                <div className="flex-1 space-y-4 w-full">
                                    {profile.ratings && Object.entries(profile.ratings).map(([key, val]) => (
                                        <div key={key}>
                                            <div className="flex justify-between items-end mb-1.5 px-0.5">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-black/60">
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
                                {profile.reviews && profile.reviews.map(rev => (
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

            {isEditModalOpen && profile && (
                <ImageEditModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    type={activeEditor === 'photo' ? 'photo' : activeEditor === 'cover' ? 'cover' : 'background'}
                    image={
                        activeEditor === 'photo' ? (editData.photo || profile.photo || undefined) :
                        activeEditor === 'cover' ? (editData.coverImage || profile.coverImage || undefined) :
                        (editData.backgroundPhoto || profile.backgroundPhoto || undefined)
                    }
                    scale={
                        activeEditor === 'photo' ? (editData.photoScale ?? profile.photoScale ?? 1) :
                        activeEditor === 'cover' ? (editData.coverScale ?? profile.coverScale ?? 1) :
                        (editData.bgScale ?? profile.bgScale ?? 1)
                    }
                    x={
                        activeEditor === 'photo' ? (editData.photoX ?? profile.photoX ?? 0) :
                        activeEditor === 'cover' ? (editData.coverX ?? profile.coverX ?? 0) :
                        (editData.bgX ?? profile.bgX ?? 0)
                    }
                    y={
                        activeEditor === 'photo' ? (editData.photoY ?? profile.photoY ?? 0) :
                        activeEditor === 'cover' ? (editData.coverY ?? profile.coverY ?? 0) :
                        (editData.bgY ?? profile.bgY ?? 0)
                    }
                    onUpdate={(d) => {
                        if (activeEditor === 'photo') {
                            setEditData(prev => ({ ...prev, 
                                photoScale: d.scale ?? prev.photoScale,
                                photoX: d.x ?? prev.photoX,
                                photoY: d.y ?? prev.photoY
                            }));
                        } else if (activeEditor === 'cover') {
                            setEditData(prev => ({ ...prev, 
                                coverScale: d.scale ?? prev.coverScale,
                                coverX: d.x ?? prev.coverX,
                                coverY: d.y ?? prev.coverY
                            }));
                        } else {
                            setEditData(prev => ({ ...prev, 
                                bgScale: d.scale ?? prev.bgScale,
                                bgX: d.x ?? prev.bgX,
                                bgY: d.y ?? prev.bgY
                            }));
                        }
                    }}
                />
            )}
        </div>
    );
}

export default function ProfilePage({ userId }: { userId?: string }) {
    const { status } = useSession();

    if (status === 'loading') {
        return <div className="h-full bg-white flex items-center justify-center p-12 text-center opacity-50 font-black uppercase tracking-widest text-[10px]">Verifying crypt-identity...</div>;
    }

    return (
        <Suspense fallback={<div className="p-12 text-center opacity-50 font-black uppercase tracking-widest">Loading component...</div>}>
            {status === 'authenticated' ? (
                <ProfileContent userId={userId} />
            ) : (
                <LoginView />
            )}
        </Suspense>
    );
}
