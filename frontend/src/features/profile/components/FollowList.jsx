import React from 'react';
import { X, UserPlus, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const FollowList = ({ title, users, onClose, currentUserId }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1E1B3A] rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
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
                            {users.map((follow) => {
                                // Handle both follower and following structures
                                const user = follow.follower || follow.following || follow;
                                
                                return (
                                    <div key={user._id} className="flex items-center justify-between">
                                        <Link 
                                            to={`/profile/${user.username}`}
                                            className="flex items-center space-x-3 flex-1"
                                            onClick={onClose}
                                        >
                                            <img
                                                src={user.profilePic || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'}
                                                alt={user.username}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-semibold text-white">
                                                    {user.displayName || user.username}
                                                </p>
                                                <p className="text-sm text-gray-400">@{user.username}</p>
                                            </div>
                                        </Link>
                                        
                                        {user._id !== currentUserId && (
                                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                                <UserPlus size={20} className="text-gray-400" />
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