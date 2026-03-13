import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import CreateStoryModal from './CreateStoryModal';

const StoryCircle = ({ name, avatar, isAdd = false, username, onClick }) => {
    const content = (
        <div 
            onClick={onClick}
            className="flex flex-col items-center space-y-2 cursor-pointer group"
        >
            <div className={`
                w-16 h-16 rounded-full p-[3px] 
                ${isAdd ? 'border-2 border-dashed border-gray-500 hover:border-white' : 'bg-gradient-to-tr from-yellow-400 to-purple-600 group-hover:from-yellow-300 group-hover:to-pink-500'}
                transition-all duration-300 transform group-hover:scale-110 shadow-lg shadow-purple-500/20
            `}>
                <div className="w-full h-full bg-[#0F0529] rounded-full p-[2px] overflow-hidden flex items-center justify-center">
                    {isAdd ? (
                        <Plus size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                    ) : (
                        <img
                            src={avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}
                            alt={name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    )}
                </div>
            </div>
            <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors truncate max-w-[70px]">
                {isAdd ? 'Add Story' : name}
            </span>
        </div>
    );

    if (isAdd || onClick) return content;
    return (
        <Link to={`/stories/${username}`}>
            {content}
        </Link>
    );
};

const StoriesBar = ({ onPostSuccess }) => {
    const [stories, setStories] = useState([]);
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
                    // Group moments by user unique IDs to show one circle per user
                    const uniqueUsersMap = new Map();

                    response.data.moments.forEach(moment => {
                        if (moment.user && !uniqueUsersMap.has(moment.user._id)) {
                            uniqueUsersMap.set(moment.user._id, {
                                id: moment.user._id,
                                name: moment.user.displayName || moment.user.username,
                                username: moment.user.username,
                                avatar: moment.user.profilePic,
                                active: true
                            });
                        }
                    });

                    setStories(Array.from(uniqueUsersMap.values()));
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
            <div className="flex items-center space-x-6 overflow-x-auto py-4 scrollbar-hide mb-8">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex flex-col items-center space-y-2 animate-pulse">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10"></div>
                        <div className="h-2 w-10 bg-white/5 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-6 overflow-x-auto py-4 scrollbar-hide mb-8 no-scrollbar">
            <StoryCircle 
                isAdd 
                name="Add Story" 
                avatar={user?.profilePic} 
                onClick={() => setIsModalOpen(true)}
            />
            
            {stories.map(story => (
                <StoryCircle
                    key={story.id}
                    name={story.name}
                    avatar={story.avatar}
                    username={story.username}
                />
            ))}

            {stories.length === 0 && (
                <div className="flex items-center space-x-4 ml-2">
                    <p className="text-sm text-gray-500 italic">Follow people to see their stories here</p>
                </div>
            )}

            {isModalOpen && (
                <CreateStoryModal isOpen={isModalOpen} onClose={handleModalClose} />
            )}
        </div>
    );
};

export default StoriesBar;

