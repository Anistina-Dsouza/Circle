import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Eye, ChevronUp, AlertCircle, X, Trash2 } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import StoryInfo from '../components/StoryInfo';
import StoryViewersModal from '../components/StoryViewersModal';

const REACTION_EMOJIS = ['❤️', '😂', '😮', '😢', '🔥', '👏', '🙌', '💯'];
const STORY_DURATION = 5000;
const PROGRESS_INTERVAL = 50;

const StoryViewerPage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [stories, setStories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [showViewers, setShowViewers] = useState(false);
    const [error, setError] = useState(null);
    const [burstEmoji, setBurstEmoji] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [userList, setUserList] = useState([]);

    const progressTimer = useRef(null);
    const baseUrl = import.meta.env.VITE_API_URL;
    
    const currentUser = (() => {
        try { return JSON.parse(localStorage.getItem('user') || '{}'); }
        catch { return {}; }
    })();

    const step = (PROGRESS_INTERVAL / STORY_DURATION) * 100;

    /* ── Callbacks ───────────────────────────────────────── */
    
    const handleNext = useCallback(() => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setProgress(0);
        } else {
            // Check if there's a next user
            const currentUIndex = userList.indexOf(username);
            if (currentUIndex !== -1 && currentUIndex < userList.length - 1) {
                const nextUser = userList[currentUIndex + 1];
                navigate(`/stories/${nextUser}`, { state: { userList }, replace: true });
            } else {
                navigate('/feed');
            }
        }
    }, [currentIndex, stories.length, navigate, username, userList]);

    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setProgress(0);
        } else {
            // Check if there's a previous user
            const currentUIndex = userList.indexOf(username);
            if (currentUIndex !== -1 && currentUIndex > 0) {
                const prevUser = userList[currentUIndex - 1];
                navigate(`/stories/${prevUser}`, { state: { userList }, replace: true });
            } else {
                setCurrentIndex(0);
                setProgress(0);
            }
        }
    }, [currentIndex, username, userList, navigate]);

    const handleReact = useCallback(async (emoji) => {
        const momentId = stories[currentIndex]?._id;
        if (!momentId) return;

        // Show burst animation
        setBurstEmoji(emoji);
        setTimeout(() => setBurstEmoji(null), 1000);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${baseUrl}/api/moments/${momentId}/react`, 
                { emoji },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setStories(prev => prev.map((s, i) => 
                    i === currentIndex ? { ...s, reactions: res.data.reactions } : s
                ));
            }
        } catch (err) {
            console.error('Reaction error:', err);
        }
    }, [currentIndex, stories, baseUrl]);

    const handleDelete = useCallback(async () => {
        const momentId = stories[currentIndex]?._id;
        if (!momentId) return;

        if (window.confirm('Are you sure you want to delete this story?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${baseUrl}/api/moments/${momentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setSuccessMsg('Story deleted permanently!');
                setTimeout(() => {
                    setSuccessMsg('');
                    const newStories = stories.filter(s => s._id !== momentId);
                    if (newStories.length === 0) {
                        navigate('/feed');
                    } else {
                        setStories(newStories);
                        setCurrentIndex(prev => Math.min(prev, newStories.length - 1));
                        setProgress(0);
                    }
                }, 1500);
            } catch (err) {
                console.error('Delete error:', err);
                alert('Failed to delete story');
            }
        }
    }, [currentIndex, stories, baseUrl, navigate]);

    const handleContainerClick = (e) => {
        if (e.target.closest('button')) return;
        const { clientX } = e;
        const cardRect = e.currentTarget.getBoundingClientRect();
        const relativeX = clientX - cardRect.left;
        
        if (relativeX < cardRect.width / 3) {
            handlePrev();
        } else {
            handleNext();
        }
    };

    /* ── Effects ─────────────────────────────────────────── */

    useEffect(() => {
        const fetchUserList = async () => {
            if (location.state?.userList && location.state.userList.length > 0) {
                setUserList(location.state.userList);
                return;
            }
            if (window._stories_list && window._stories_list.length > 0) {
                setUserList(window._stories_list);
                return;
            }
            
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${baseUrl}/api/moments/feed`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    const follows = response.data.followingMoments || [];
                    const list = follows.map(s => s.user?.username).filter(Boolean);
                    setUserList(list);
                    window._stories_list = list;
                }
            } catch (err) {
                console.error('Error fetching user list:', err);
            }
        };

        fetchUserList();
    }, [location.state, username, baseUrl]);

    useEffect(() => {
        const fetchUserStories = async () => {
            setLoading(true);
            setError(null);
            setProgress(0);
            setCurrentIndex(0);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${baseUrl}/api/moments/user/${username}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    if (response.data.moments && response.data.moments.length > 0) {
                        setStories(response.data.moments);
                    } else {
                        setError('No active stories found.');
                    }
                }
            } catch (error) {
                console.error('Error fetching stories:', error);
                setError(error.response?.data?.error || 'Could not load stories.');
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchUserStories();
    }, [username, baseUrl]);

    useEffect(() => {
        if (loading || stories.length === 0 || isPaused || error || showViewers) return;

        progressTimer.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 100;
                return prev + step;
            });
        }, PROGRESS_INTERVAL);

        return () => clearInterval(progressTimer.current);
    }, [loading, stories.length, isPaused, error, showViewers, step]);

    useEffect(() => {
        if (progress >= 100) {
            handleNext();
        }
    }, [progress]);

    useEffect(() => {
        if (!loading && stories.length > 0 && stories[currentIndex]) {
            const momentId = stories[currentIndex]._id;
            if (momentId) {
                const token = localStorage.getItem('token');
                axios.get(`${baseUrl}/api/moments/${momentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => {});
            }
        }
    }, [currentIndex, loading, stories, baseUrl]);

    /* ── Render ──────────────────────────────────────────── */

    if (loading) {
        return (
            <div className="fixed inset-0 bg-[#0F0529] z-[100] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || stories.length === 0) {
        return (
            <div className="fixed inset-0 bg-[#0F0529] z-[100] flex items-center justify-center p-6 text-center">
                <div className="max-w-xs flex flex-col items-center">
                    <AlertCircle size={48} className="text-red-500 mb-4" />
                    <p className="text-gray-400 mb-6">{error || 'No stories available'}</p>
                    <button
                        onClick={() => navigate('/feed')}
                        className="bg-purple-600 text-white px-8 py-2 rounded-xl text-sm font-bold shadow-lg shadow-purple-900/40"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const currentStory = stories[currentIndex];
    if (!currentStory) return null;

    const isOwnStory = currentStory.user?._id === currentUser?._id || currentStory.user === currentUser?._id;

    return (
        <div className="fixed inset-0 bg-[#0F0529] z-[100] flex flex-col items-center justify-center overflow-hidden font-sans">
            {successMsg && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-red-900/40 flex items-center gap-3 border border-red-400/20">
                        <AlertCircle size={20} />
                        <span className="font-bold text-sm tracking-wide">{successMsg}</span>
                    </div>
                </div>
            )}

            <div className="relative w-full max-w-[420px] h-[95vh] flex flex-col py-8">
                
                {/* Header */}
                <div className="mb-6 px-1 shrink-0 z-10 w-full relative">
                    <ProgressBar stories={stories} currentIndex={currentIndex} progress={progress} />
                    <div className="mt-4">
                        <StoryInfo
                            user={currentStory.user}
                            createdAt={currentStory.createdAt}
                            isOwnStory={isOwnStory}
                            onDelete={handleDelete}
                            onClose={() => navigate(-1)}
                        />
                    </div>
                </div>

                {/* Content Card */}
                <div 
                    className="flex-1 min-h-0 bg-[#1E1B3A] rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative cursor-pointer group border border-white/5"
                    onMouseDown={() => !showViewers && setIsPaused(true)}
                    onMouseUp={() => !showViewers && setIsPaused(false)}
                    onTouchStart={() => !showViewers && setIsPaused(true)}
                    onTouchEnd={() => !showViewers && setIsPaused(false)}
                    onClick={handleContainerClick}
                >
                    {currentStory.media?.type === 'video' ? (
                        <video src={currentStory.media.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                    ) : (
                        <img src={currentStory.media?.url} className="w-full h-full object-cover" alt="story" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                    {/* Burst Animation Overlay */}
                    {burstEmoji && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[100]">
                            <span className="text-8xl animate-out fade-out zoom-out-150 duration-1000 fill-mode-forwards">
                                {burstEmoji}
                            </span>
                        </div>
                    )}

                    {isOwnStory && (
                        <div className="absolute bottom-24 left-0 right-0 flex justify-center pointer-events-none">
                            <div
                                onClick={(e) => { e.stopPropagation(); setShowViewers(true); setIsPaused(true); }}
                                className="bg-[#4C3E7C]/80 backdrop-blur-md px-6 py-2.5 rounded-full flex items-center space-x-2 border border-white/10 shadow-lg pointer-events-auto hover:bg-[#5f4e99] transition-colors"
                            >
                                <Eye size={16} className="text-purple-300" />
                                <span className="text-xs font-bold text-white tracking-wide">
                                    {currentStory.viewers?.length || currentStory.viewCount || 0} Viewers
                                </span>
                                <ChevronUp size={16} className="text-purple-300 ml-1" />
                            </div>
                        </div>
                    )}

                    {currentStory.caption && (
                        <div className="absolute bottom-10 left-8 right-1/4 pointer-events-none z-10">
                            <p className="text-white text-base font-bold leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-3">
                                {currentStory.caption}
                            </p>
                        </div>
                    )}

                    {/* Reactions Display - Fixed Position & Larger */}
                    {currentStory.reactions && currentStory.reactions.length > 0 && (
                        <div className="absolute bottom-10 right-6 flex items-center -space-x-3 pointer-events-none">
                            {Array.from(new Set(currentStory.reactions.map(r => r.emoji))).slice(0, 4).map((emoji, i) => (
                                <div 
                                    key={i} 
                                    className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-xl border border-white/20 shadow-2xl animate-in slide-in-from-right-4 duration-500"
                                    style={{ transitionDelay: `${i * 100}ms` }}
                                >
                                    {emoji}
                                </div>
                            ))}
                            {new Set(currentStory.reactions.map(r => r.emoji)).size > 4 && (
                                <div className="w-10 h-10 bg-purple-600/80 backdrop-blur-xl rounded-full flex items-center justify-center text-[10px] font-black text-white border border-white/20 shadow-2xl">
                                    +{new Set(currentStory.reactions.map(r => r.emoji)).size - 4}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick Reactions Bar */}
                {!isOwnStory && (
                    <div className="mt-8 px-4 flex items-center justify-between gap-2 z-10 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-2.5 flex justify-between items-center shadow-2xl backdrop-blur-2xl">
                            {REACTION_EMOJIS.map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={() => handleReact(emoji)}
                                    className="text-xl sm:text-2xl hover:scale-150 active:scale-90 transition-transform duration-200 shrink-0 drop-shadow-lg"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Side Arrows */}
                {stories.length > 1 && (
                    <>
                        {!(currentIndex === 0 && userList.indexOf(username) <= 0) && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                className="absolute -left-20 top-1/2 -translate-y-1/2 p-3 text-gray-300 hover:text-purple-500 transition-all hidden xl:block"
                            >
                                <ChevronLeft size={48} />
                            </button>
                        )}
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="absolute -right-20 top-1/2 -translate-y-1/2 p-3 text-gray-300 hover:text-purple-500 transition-all hidden xl:block"
                        >
                            <ChevronRight size={48} />
                        </button>
                    </>
                )}
            </div>

            <StoryViewersModal 
                isOpen={showViewers} 
                onClose={() => { setShowViewers(false); setIsPaused(false); }} 
                viewers={currentStory.viewers || []} 
                reactions={currentStory.reactions || []}
            />
        </div>
    );
};

export default StoryViewerPage;
