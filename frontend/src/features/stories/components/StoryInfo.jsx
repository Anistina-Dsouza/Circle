import React from 'react';
import { Trash2 } from 'lucide-react';

const StoryInfo = ({ user, createdAt, isOwnStory, onDelete }) => {
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
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-purple-500/50 p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    <img 
                        src={user?.profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"} 
                        alt={user?.username} 
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
                <span className="text-xs font-semibold text-purple-300/80 tracking-wide">
                    {formatTime(createdAt)}
                </span>
            </div>
            
            <div className="flex items-center">
                {isOwnStory && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="p-2 text-purple-400/50 hover:text-red-400 transition-colors"
                        title="Delete Story"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default StoryInfo;
