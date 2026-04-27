import React, { useState } from 'react';
import { X, Eye, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StoryViewersModal = ({ viewers = [], reactions = [], isOpen, onClose }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    const currentUserId = (() => {
        try { return JSON.parse(localStorage.getItem('user') || '{}')._id; }
        catch { return null; }
    })();

    const filteredViewers = viewers.filter(viewer => {
        const vId = (viewer._id || viewer.id || viewer).toString();
        const isSelf = vId === currentUserId?.toString();
        const matchesSearch = (viewer.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (viewer.displayName || '').toLowerCase().includes(searchQuery.toLowerCase());
        return !isSelf && matchesSearch;
    });

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
             onClick={onClose}>
            <div 
                className="w-full sm:w-[400px] max-h-[70vh] bg-[#160D33] sm:rounded-[32px] rounded-t-[32px] border border-white/10 shadow-2xl flex flex-col transform transition-all duration-300 overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/2">
                    <div className="flex items-center space-x-3">
                        <div className="bg-purple-500/10 p-2 rounded-xl">
                            <Eye size={20} className="text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white leading-none mb-1">Story Viewers</h3>
                            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
                                {filteredViewers.length} Total Views
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-white rounded-full hover:bg-white/5 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search Bar - Always show if there are viewers */}
                {viewers.length > 0 && (
                    <div className="p-4 px-6 bg-white/1 border-b border-white/5">
                        <div className="relative group">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search viewers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#0F0529] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Viewers List */}
                <div className="flex-1 overflow-y-auto p-6 pt-4 custom-scrollbar space-y-3 min-h-[300px]">
                    {viewers.length === 0 ? (
                        <div className="text-center py-16 flex flex-col items-center">
                            <div className="w-20 h-20 bg-purple-500/5 rounded-full flex items-center justify-center mb-6">
                                <Eye size={40} className="text-purple-400/20" />
                            </div>
                            <p className="text-gray-500 text-sm font-bold tracking-wide">No views recorded yet</p>
                        </div>
                    ) : filteredViewers.length === 0 ? (
                        <div className="text-center py-16 flex flex-col items-center">
                            <p className="text-gray-500 text-sm font-bold italic tracking-wide">No matches for "{searchQuery}"</p>
                        </div>
                    ) : (
                        filteredViewers.map((viewer, idx) => (
                            <div 
                                key={viewer._id || viewer.id || idx} 
                                className="group flex items-center justify-between hover:bg-white/5 p-3 rounded-[20px] transition-all cursor-pointer border border-transparent hover:border-white/5"
                                onClick={() => {
                                    onClose();
                                    navigate(`/profile/${viewer.username}`);
                                }}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 overflow-hidden shrink-0 group-hover:border-purple-500/50 transition-all p-0.5">
                                            <img 
                                                src={viewer.profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"} 
                                                alt={viewer.username} 
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#160D33] rounded-full shadow-lg" title="Online" />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors">
                                                {viewer.displayName || viewer.username}
                                            </span>
                                            {(() => {
                                                const reaction = reactions.find(r => (r.user?._id || r.user) === viewer._id);
                                                return reaction ? (
                                                    <span className="text-base animate-in zoom-in duration-300">
                                                        {reaction.emoji}
                                                    </span>
                                                ) : null;
                                            })()}
                                        </div>
                                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                                            @{viewer.username}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="text-[10px] font-black text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md uppercase tracking-wider">
                                        View Profile
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoryViewersModal;
