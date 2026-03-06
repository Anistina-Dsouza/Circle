import React from 'react';
import { X, UserPlus, UserCheck, Search } from 'lucide-react';

const FollowListModal = ({ isOpen, onClose, title, users, onFollowToggle }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#1A1140] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Search */}
                <div className="px-6 py-4">
                    <div className="relative flex items-center bg-[#0F0529] border border-white/5 rounded-2xl px-4 py-3 focus-within:border-purple-500/50 transition-all">
                        <Search className="text-gray-500 mr-3" size={18} />
                        <input
                            type="text"
                            placeholder={`Search ${title.toLowerCase()}...`}
                            className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600 text-sm"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="px-2 pb-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 to-pink-500">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-full h-full rounded-full object-cover border-2 border-[#1A1140]"
                                            />
                                        </div>
                                        {user.isOnline && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1A1140]" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm tracking-tight group-hover:text-purple-400 transition-colors">
                                            {user.name}
                                        </h4>
                                        <p className="text-gray-500 text-xs font-medium">@{user.username}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onFollowToggle && onFollowToggle(user._id || user.id, user.isFollowing)}
                                    className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${user.isFollowing
                                        ? 'bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-400/30'
                                        : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-600/20'
                                        }`}
                                >
                                    {user.isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
                                    <span>{user.isFollowing ? 'Following' : 'Follow'}</span>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-gray-500 font-medium">No {title.toLowerCase()} yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowListModal;
