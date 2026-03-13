import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Eye, ChevronUp, AlertCircle, X } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import StoryInfo from '../components/StoryInfo';

const StoryViewerPage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [error, setError] = useState(null);
    
    const progressTimer = useRef(null);
    const baseUrl = import.meta.env.VITE_API_URL;
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const STORY_DURATION = 5000;
    const PROGRESS_INTERVAL = 50;

    useEffect(() => {
        const fetchUserStories = async () => {
            setLoading(true);
            setError(null);
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
                } else {
                    setError('Failed to fetch stories.');
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
        if (loading || stories.length === 0 || isPaused || error) return;

        const step = (PROGRESS_INTERVAL / STORY_DURATION) * 100;
        
        progressTimer.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    handleNext();
                    return 0;
                }
                return prev + step;
            });
        }, PROGRESS_INTERVAL);

        return () => clearInterval(progressTimer.current);
    }, [currentIndex, loading, stories.length, isPaused, error]);

    const handleNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setProgress(0);
        } else {
            navigate('/feed');
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setProgress(0);
        } else {
            setCurrentIndex(0);
            setProgress(0);
        }
    };

    const handleDelete = async () => {
        const momentId = stories[currentIndex]?._id;
        if (!momentId) return;

        if (window.confirm('Are you sure you want to delete this story?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${baseUrl}/api/moments/${momentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Remove deleted story from state
                const newStories = stories.filter(s => s._id !== momentId);
                if (newStories.length === 0) {
                    navigate('/feed');
                } else {
                    setStories(newStories);
                    setCurrentIndex(Math.min(currentIndex, newStories.length - 1));
                    setProgress(0);
                }
            } catch (error) {
                alert('Failed to delete story');
            }
        }
    };

    const handleContainerClick = (e) => {
        if (e.target.closest('button')) return;

        const { clientX } = e;
        const screenWidth = window.innerWidth;
        const cardElement = e.currentTarget;
        const cardRect = cardElement.getBoundingClientRect();
        
        // Navigation relative to card
        const relativeX = clientX - cardRect.left;
        if (relativeX < cardRect.width / 3) {
            handlePrev();
        } else {
            handleNext();
        }
    };

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
    const isOwnStory = currentStory.user?._id === currentUser?.id || currentStory.user === currentUser?.id;

    return (
        <div className="fixed inset-0 bg-[#0F0529] z-[100] flex flex-col items-center justify-center overflow-hidden font-sans">
            {/* Minimalist Background with subtle top close */}
            <button 
                onClick={() => navigate(-1)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white z-50 transition-colors"
            >
                <X size={28} />
            </button>

            {/* Stories Container (Card Style) */}
            <div className="relative w-full max-w-[420px] h-full max-h-[90vh] flex flex-col pt-12 pb-8">
                
                {/* Header Elements (Top of Card) */}
                <div className="mb-8 px-1 shrink-0">
                    <ProgressBar stories={stories} currentIndex={currentIndex} progress={progress} />
                    <div className="mt-8">
                        <StoryInfo 
                            user={currentStory.user} 
                            createdAt={currentStory.createdAt} 
                            isOwnStory={isOwnStory}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>

                {/* Main Card Content */}
                <div 
                    className="flex-1 min-h-0 bg-[#1E1B3A] rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative cursor-pointer group border border-white/5"
                    onMouseDown={() => setIsPaused(true)}
                    onMouseUp={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                    onClick={handleContainerClick}
                >
                    {/* Media */}
                    {currentStory.media.type === 'video' ? (
                        <video src={currentStory.media.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                    ) : (
                        <img src={currentStory.media.url} className="w-full h-full object-cover" alt="story" />
                    )}

                    {/* Gradient Overlay for Text Visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                    {/* STORY CONTENT Placeholder (as per ref) */}
                    {!currentStory.media.url && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <h2 className="text-4xl font-black text-white/30 uppercase tracking-[0.5em] text-center px-12 leading-relaxed">
                                Story Content
                            </h2>
                        </div>
                    )}

                    {/* Viewers Badge (Bottom-Center as per ref) */}
                    <div className="absolute bottom-24 left-0 right-0 flex justify-center pointer-events-none">
                        <div className="bg-[#4C3E7C]/80 backdrop-blur-md px-6 py-2.5 rounded-full flex items-center space-x-2 border border-white/10 shadow-lg pointer-events-auto">
                            <Eye size={16} className="text-purple-300" />
                            <span className="text-xs font-bold text-white tracking-wide">
                                {currentStory.viewCount || 0} Viewers
                            </span>
                            <ChevronUp size={16} className="text-purple-300 ml-1" />
                        </div>
                    </div>

                    {/* Caption (Left-Bottom as per ref) */}
                    {currentStory.caption && (
                        <div className="absolute bottom-10 left-8 right-8 pointer-events-none">
                            <p className="text-white/90 text-[13px] font-medium leading-relaxed drop-shadow-sm line-clamp-3">
                                {currentStory.caption}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-purple-300 text-[10px] font-bold">#CircleVibes</span>
                                <span className="text-purple-300 text-[10px] font-bold">#StoryTime</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Desktop Side Arrows (Subtle) */}
                <button 
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="absolute -left-20 top-1/2 -translate-y-1/2 p-3 text-gray-300 hover:text-purple-500 transition-all hidden xl:block"
                >
                    <ChevronLeft size={48} />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="absolute -right-20 top-1/2 -translate-y-1/2 p-3 text-gray-300 hover:text-purple-500 transition-all hidden xl:block"
                >
                    <ChevronRight size={48} />
                </button>
            </div>
        </div>
    );
};

export default StoryViewerPage;
