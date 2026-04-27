import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import CreateStoryModal from './CreateStoryModal';

const StoryCircle = ({ name, avatar, isAdd = false, username, onClick, isSeen = false }) => {
    const content = (
        <div
            onClick={onClick}
            className="flex flex-col items-center space-y-2 cursor-pointer group"
        >
            <div className={`
                w-20 h-20 rounded-full p-[3px] 
                ${isAdd
                    ? 'border-2 border-dashed border-gray-500 hover:border-white'
                    : isSeen
                        ? 'border-2 border-white/10'
                        : 'bg-gradient-to-tr from-yellow-400 to-purple-600 group-hover:from-yellow-300 group-hover:to-pink-500 shadow-lg shadow-purple-500/20'}
                transition-all duration-300 transform group-hover:scale-110 
            `}>
                <div className="w-full h-full bg-[#0F0529] rounded-full p-[2px] overflow-hidden flex items-center justify-center">
                    {isAdd ? (
                        <Plus size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                    ) : (
                        <img
                            src={avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}
                            alt={name}
                            className={`w-full h-full rounded-full object-cover transition-all duration-300 ${isSeen ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}
                        />
                    )}
                </div>
            </div>
            <span className={`text-xs font-medium transition-colors truncate max-w-[70px] ${isSeen ? 'text-gray-600' : 'text-gray-300 group-hover:text-white'}`}>
                {isAdd ? 'Add Story' : name}
            </span>
        </div>
    );

    if (isAdd || onClick) return content;
    return (
        <Link
            to={`/stories/${username}`}
            state={{ userList: username.includes('discover_') ? [] : (window._stories_list || []) }}
        >
            {content}
        </Link>
    );
};

const StoriesBar = ({ onPostSuccess }) => {
    const [followingStories, setFollowingStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const baseUrl = import.meta.env.VITE_API_URL;
    const user = JSON.parse(localStorage.getItem('user'));

    const handleModalClose = () => {
        setIsModalOpen(false);
        if (onPostSuccess) onPostSuccess();
    };

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${baseUrl}/api/moments/feed`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    let follows = response.data.followingMoments || [];

                    // Sort such that the logged-in user's story is always first
                    if (user && user.username) {
                        follows = [...follows].sort((a, b) => {
                            if (a.user?.username === user.username) return -1;
                            if (b.user?.username === user.username) return 1;
                            return 0;
                        });
                    }

                    setFollowingStories(follows);
                    window._stories_list = follows.map(s => s.user?.username).filter(Boolean);
                }
            } catch (error) {
                console.error('Error fetching stories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [baseUrl]);

    if (loading) {
        return (
            <div className="flex items-center space-x-6 overflow-x-auto py-4 scrollbar-hide mb-8 no-scrollbar">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="flex flex-col items-center space-y-3 animate-pulse">
                        <div className="w-20 h-20 rounded-full bg-white/5 p-[1px] border border-white/10">
                            <div className="w-full h-full rounded-full bg-white/5 p-1" />
                        </div>
                        <div className="h-2.5 w-14 bg-white/5 rounded-full" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black text-purple-500 tracking-widest bg-purple-500/10 px-2 py-0.5 rounded">Friends</span>
                <span className="text-xs font-bold text-gray-500">Stories from people you follow</span>
            </div>

            <div className="flex items-center space-x-6 overflow-x-auto py-4 px-4 -mx-4 scrollbar-hide no-scrollbar">
                <StoryCircle
                    isAdd
                    name="Add Story"
                    avatar={user?.profilePic}
                    onClick={() => setIsModalOpen(true)}
                />

                {followingStories.map(story => {
                    const isSeen = story.viewers?.some(v => {
                        const viewerId = v._id || v;
                        return viewerId.toString() === user?._id?.toString() || viewerId.toString() === user?.id?.toString();
                    });
                    return (
                        <StoryCircle
                            key={story._id}
                            name={story.user?.displayName || story.user?.username}
                            avatar={story.user?.profilePic}
                            username={story.user?.username}
                            isSeen={isSeen}
                        />
                    );
                })}

                {followingStories.length === 0 && (
                    <div className="flex items-center space-x-4 ml-2">
                        <p className="text-sm text-gray-600 italic">No friend stories. Why not follow someone?</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <CreateStoryModal isOpen={isModalOpen} onClose={handleModalClose} />
            )}
        </div>
    );
};

export const DiscoverGrid = () => {
    const [discoverStories, setDiscoverStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const baseUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchDiscover = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${baseUrl}/api/moments/feed`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    const discover = response.data.discoverMoments || [];
                    setDiscoverStories(discover);
                    window._discover_list = discover.map(s => s.user?.username).filter(Boolean);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDiscover();
    }, [baseUrl]);

    if (loading) return (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-10">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="relative aspect-[4/5] rounded-[3rem] bg-white/5 border border-white/5 animate-pulse overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-white/10" />
                            <div className="h-4 w-24 bg-white/10 rounded-lg" />
                        </div>
                        <div className="h-3 w-40 bg-white/5 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="mt-4">
            <div className="flex items-center gap-2 mb-6">
                <span className="text-[10px] font-black text-fuchsia-500 tracking-widest bg-fuchsia-500/10 px-2 py-0.5 rounded">Discover</span>
                <span className="text-xs font-bold text-gray-500">Stories from around the world</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                {discoverStories.map(story => (
                    <Link
                        key={story._id}
                        to={`/stories/${story.user?.username}`}
                        state={{ userList: window._discover_list || [] }}
                        className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/5 bg-[#1A1140] hover:border-purple-500/50 transition-all shadow-2xl hover:shadow-purple-500/30 active:scale-95"
                    >
                        {/* Story Preview */}
                        {story.media?.type === 'video' ? (
                            <video
                                src={`${story.media.url}#t=0.1`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                                preload="metadata"
                                muted
                                playsInline
                            />
                        ) : story.media?.type === 'text' ? (
                            <div
                                className="w-full h-full flex items-center justify-center p-6 text-center overflow-hidden relative"
                                style={{
                                    backgroundImage: `url('https://i.pinimg.com/736x/d5/48/96/d54896e952622eee393eb237abb734d1.jpg')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <div className="absolute inset-0 bg-black/40" />
                                <p
                                    className="text-white text-sm md:text-base break-words group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100 drop-shadow-xl relative z-10"
                                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
                                >
                                    {story.media.text || story.caption}
                                </p>
                            </div>
                        ) : (
                            <img
                                src={story.media?.url}
                                alt=""
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                            />
                        )}

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:via-black/40 transition-all" />

                        {/* User Info */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex items-center gap-2 mb-1">
                                <img
                                    src={story.user?.profilePic}
                                    className="w-6 h-6 rounded-full border border-white/20 object-cover"
                                    alt=""
                                />
                                <span className="text-xs font-black text-white truncate">{story.user?.displayName || story.user?.username}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 line-clamp-1 font-medium">{story.caption || 'New Story'}</p>
                        </div>
                    </Link>
                ))}

                {discoverStories.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                        <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">No public stories found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoriesBar;
