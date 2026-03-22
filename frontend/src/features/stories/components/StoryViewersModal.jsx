import React from 'react';
import { X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StoryViewersModal = ({ viewers = [], isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
             onClick={onClose}>
            <div 
                className="w-full sm:w-[400px] max-h-[70vh] bg-[#160D33] sm:rounded-3xl rounded-t-3xl border border-white/10 shadow-2xl flex flex-col transform transition-transform"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                    <div className="flex items-center space-x-2">
                        <Eye size={20} className="text-purple-400" />
                        <h3 className="text-lg font-bold text-white">Story Viewers</h3>
                        <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full font-bold ml-2">
                            {viewers.length}
                        </span>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Viewers List */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                    {viewers.length === 0 ? (
                        <div className="text-center py-10 flex flex-col items-center">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                                <Eye size={32} className="text-purple-400/50" />
                            </div>
                            <p className="text-gray-400 text-sm font-medium">No one has seen this story yet</p>
                        </div>
                    ) : (
                        viewers.map((viewer, idx) => (
                            <div key={viewer._id || viewer.id || idx} className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-colors cursor-pointer"
                                onClick={() => {
                                    onClose();
                                    navigate(`/profile/${viewer.username}`);
                                }}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full border border-purple-500/30 overflow-hidden shrink-0">
                                        <img 
                                            src={viewer.profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"} 
                                            alt={viewer.username} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">{viewer.displayName || viewer.username}</span>
                                        <span className="text-xs text-gray-400">@{viewer.username}</span>
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
