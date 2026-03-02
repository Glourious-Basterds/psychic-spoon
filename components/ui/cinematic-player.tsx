'use client';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Music, Play, Pause, SkipForward, X, Clapperboard, Film } from 'lucide-react';
import { useUI, CINEMATIC_TRACKS } from '@/context/UIContext';

export function CinematicTrigger() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { currentTrack, isPlaying, togglePlayPause, playTrack, playRandom } = useUI();

    // Portal requires DOM to be mounted
    useEffect(() => { setMounted(true); }, []);

    const modal = (
        <div
            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', padding: '20px' }}
            onClick={() => setIsOpen(false)}
        >
            <div
                style={{ width: '100%', maxWidth: '440px', background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: '9px', fontFamily: 'Courier New, monospace', color: '#374151', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>AUDIO.VAULT</div>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#f9fafb', letterSpacing: '-0.01em' }}>Soundtracks</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                            onClick={() => playRandom()}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 13px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#9ca3af', fontSize: '10px', fontFamily: 'Courier New, monospace', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'; e.currentTarget.style.color = '#f9fafb'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#9ca3af'; }}
                        >
                            <SkipForward size={11} /> SHUFFLE
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', color: '#6b7280', cursor: 'pointer', transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#f9fafb'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Track list */}
                <div style={{ maxHeight: '55vh', overflowY: 'auto', padding: '12px' }}>
                    {CINEMATIC_TRACKS.map((track, i) => {
                        const active = currentTrack?.id === track.id;
                        return (
                            <button
                                key={track.id}
                                onClick={() => { playTrack(track); }}
                                style={{
                                    width: '100%', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
                                    background: active ? 'rgba(163,230,53,0.06)' : 'transparent',
                                    border: `1px solid ${active ? 'rgba(163,230,53,0.18)' : 'rgba(255,255,255,0.04)'}`,
                                    borderRadius: '10px', cursor: 'pointer', marginBottom: '6px',
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; } }}
                                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; } }}
                            >
                                {/* Track number / indicator */}
                                <div style={{ width: '28px', height: '28px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? 'rgba(163,230,53,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${active ? 'rgba(163,230,53,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '6px' }}>
                                    {active && isPlaying ? (
                                        <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '12px' }}>
                                            {[6, 10, 8].map((h, j) => (
                                                <div key={j} style={{ width: '2px', background: '#a3e635', borderRadius: '1px', height: `${h}px`, animation: `eq-bar ${0.4 + j * 0.13}s infinite alternate ease-in-out` }} />
                                            ))}
                                        </div>
                                    ) : active ? (
                                        <Pause size={11} style={{ color: '#a3e635' }} />
                                    ) : (
                                        <span style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: '#374151' }}>{String(i + 1).padStart(2, '0')}</span>
                                    )}
                                </div>

                                {/* Track info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                        <Film size={9} style={{ color: active ? '#a3e635' : '#374151', flexShrink: 0 }} />
                                        <span style={{ fontSize: '9px', fontFamily: 'Courier New, monospace', color: active ? '#6b7280' : '#374151', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{track.movie}</span>
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: active ? 600 : 400, color: active ? '#f9fafb' : '#d1d5db', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</div>
                                    <div style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: '#4b5563', marginTop: '2px' }}>by {track.composer}</div>
                                </div>

                                {/* Right icon */}
                                <div style={{ color: '#a3e635', opacity: active ? 1 : 0, transition: 'opacity 0.15s', flexShrink: 0 }}>
                                    {active && isPlaying ? <Pause size={14} /> : <Play size={14} />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Now playing footer */}
                {currentTrack && (
                    <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '9px', fontFamily: 'Courier New, monospace', color: '#374151', letterSpacing: '0.15em', marginBottom: '3px' }}>NOW PLAYING</div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#f9fafb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentTrack.title}</div>
                            <div style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: '#4b5563' }}>{currentTrack.composer}</div>
                        </div>
                        <button
                            onClick={togglePlayPause}
                            style={{ width: '38px', height: '38px', borderRadius: '50%', background: isPlaying ? '#a3e635' : 'rgba(255,255,255,0.06)', border: `1px solid ${isPlaying ? '#a3e635' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isPlaying ? '#000' : '#9ca3af', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}
                        >
                            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                        </button>
                        <button
                            onClick={playRandom}
                            style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#f9fafb'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; }}
                        >
                            <SkipForward size={13} />
                        </button>
                    </div>
                )}

                <style>{`
                    @keyframes eq-bar {
                        from { transform: scaleY(0.4); }
                        to { transform: scaleY(1); }
                    }
                `}</style>
            </div>
        </div>
    );

    return (
        <>
            {/* Trigger button */}
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 12px',
                    background: currentTrack && isPlaying ? 'rgba(163,230,53,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${currentTrack && isPlaying ? 'rgba(163,230,53,0.2)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: '8px',
                    color: currentTrack && isPlaying ? '#a3e635' : 'rgba(255,255,255,0.35)',
                    fontSize: '10px', fontFamily: 'Courier New, monospace', letterSpacing: '0.15em',
                    textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
                    width: '100%',
                }}
                onMouseEnter={e => {
                    if (!(currentTrack && isPlaying)) {
                        e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
                    }
                }}
                onMouseLeave={e => {
                    if (!(currentTrack && isPlaying)) {
                        e.currentTarget.style.color = 'rgba(255,255,255,0.35)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                    }
                }}
            >
                {currentTrack && isPlaying ? (
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '14px', flexShrink: 0 }}>
                        {[8, 12, 10, 14, 9].map((h, j) => (
                            <div key={j} style={{ width: '2px', background: '#a3e635', borderRadius: '1px', height: `${h}px`, animation: `eq-bar ${0.4 + j * 0.11}s infinite alternate ease-in-out` }} />
                        ))}
                    </div>
                ) : (
                    <Clapperboard size={13} strokeWidth={1.5} />
                )}
                <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentTrack ? currentTrack.title : 'SOUNDTRACKS'}
                </span>
            </button>

            {/* Render modal via portal so it escapes the sidebar's transform stacking context */}
            {isOpen && mounted && ReactDOM.createPortal(modal, document.body)}
        </>
    );
}

// ─── Global Mini Player ────────────────────────────────────────────────────────
export function GlobalMiniPlayer() {
    const { currentTrack, isPlaying, togglePlayPause, playRandom } = useUI();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    if (!currentTrack || !mounted) return null;

    const player = (
        <div style={{
            position: 'fixed', bottom: '20px', right: '20px', zIndex: 9000,
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px',
            background: '#0d0d0d',
            border: '1px solid rgba(163,230,53,0.2)',
            borderRadius: '12px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
            animation: 'slide-up 0.3s ease',
        }}>
            {isPlaying && (
                <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '14px', flexShrink: 0 }}>
                    {[8, 12, 9, 14, 10].map((h, j) => (
                        <div key={j} style={{ width: '2px', background: '#a3e635', borderRadius: '1px', height: `${h}px`, animation: `eq-bar ${0.4 + j * 0.11}s infinite alternate ease-in-out` }} />
                    ))}
                </div>
            )}
            {!isPlaying && <Music size={14} style={{ color: '#4b5563', flexShrink: 0 }} />}

            <div style={{ maxWidth: '160px', overflow: 'hidden' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#f9fafb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentTrack.title}</div>
                <div style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: '#4b5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentTrack.composer}</div>
            </div>

            <div style={{ display: 'flex', gap: '4px', borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: '10px' }}>
                <button onClick={togglePlayPause}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', background: isPlaying ? '#a3e635' : 'rgba(255,255,255,0.06)', border: `1px solid ${isPlaying ? '#a3e635' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isPlaying ? '#000' : '#9ca3af', cursor: 'pointer', transition: 'all 0.15s' }}>
                    {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                </button>
                <button onClick={playRandom}
                    style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f9fafb')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                    <SkipForward size={13} />
                </button>
            </div>

            <style>{`
                @keyframes eq-bar { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }
                @keyframes slide-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );

    return ReactDOM.createPortal(player, document.body);
}
