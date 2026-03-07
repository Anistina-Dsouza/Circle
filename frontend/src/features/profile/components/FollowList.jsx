import React from 'react';
import { X, UserPlus, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const FollowList = ({ 
    title, 
    users, 
    onClose, 
    currentUserId,
    onFollowToggle  // Add this prop
}) => {
    const handleFollowClick = async (e, targetUserId) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (onFollowToggle) {
            try {
                await onFollowToggle(targetUserId);
            } catch (error) {
                console.error('Follow toggle failed:', error);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-[#1E1B3A] rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Follow List */}
                <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4">
                    {users.length === 0 ? (
                        <p className="text-center text-gray-400 py-8">No users to show</p>
                    ) : (
                        <div className="space-y-4">
                            {users.map((userItem) => {
                                // Extract user data based on structure
                                const user = userItem.follower || userItem.following || userItem;
                                
                                // Check if current user is following this user
                                const isFollowing = user.isFollowing || false;
                                
                                return (
                                    <div key={user._id} className="flex items-center justify-between">
                                        <Link 
                                            to={`/profile/${user.username}`}
                                            className="flex items-center space-x-3 flex-1"
                                            onClick={onClose}
                                        >
                                            <img
                                                src={user.avatar || user.profilePic || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'}
                                                alt={user.username}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-semibold text-white">
                                                    {user.name || user.displayName || user.username}
                                                </p>
                                                <p className="text-sm text-gray-400">@{user.username}</p>
                                            </div>
                                        </Link>
                                        
                                        {user._id !== currentUserId && (
                                            <button 
                                                onClick={(e) => handleFollowClick(e, user._id)}
                                                className={`p-2 rounded-full transition-colors ${
                                                    isFollowing 
                                                        ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' 
                                                        : 'hover:bg-white/10 text-gray-400'
                                                }`}
                                            >
                                                {isFollowing ? <UserCheck size={20} /> : <UserPlus size={20} />}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowList;