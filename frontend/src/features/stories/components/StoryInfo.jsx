import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, X } from 'lucide-react';

const StoryInfo = ({ user, createdAt, isOwnStory, onDelete, onClose }) => {
    const formatTime = (dateString) => {
        if (!dateString) return 'Just now';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return (
        <div className="w-full flex items-center justify-between px-1">
            <Link 
                to={`/profile/${user?.username}`} 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center space-x-3 group/info hover:opacity-80 transition-opacity"
            >
                <div className="w-10 h-10 rounded-full border-2 border-purple-500/50 p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0 group-hover/info:border-purple-400 group-hover/info:shadow-purple-500/50 transition-all">
                    <img 
                        src={user?.profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"} 
                        alt={user?.username} 
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-white tracking-wide group-hover/info:text-purple-300 transition-colors">
                        {user?.username || 'User'}
                    </span>
                    <span className="text-xs font-semibold text-purple-300/80 tracking-wide mt-0.5">
                        {formatTime(createdAt)}
                    </span>
                </div>
            </Link>
            
            <div className="flex items-center space-x-3">
                {isOwnStory && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="p-1.5 text-purple-400/50 hover:text-red-400 transition-colors"
                        title="Delete Story"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
                <button 
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors"
                    title="Close"
                >
                    <X size={24} />
                </button>
            </div>
        </div>
    );
};

export default StoryInfo;
