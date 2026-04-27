import React from 'react';
import { Check, X, User } from 'lucide-react';

const JoinRequestItem = ({ request, onApprove, onReject }) => {
    return (
        <div className="bg-[#1A1140]/60 backdrop-blur-sm rounded-3xl p-6 border border-white/5 hover:border-purple-500/50 transition-all duration-500 group relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5 w-full">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <img 
                        src={request.avatar || `https://i.pravatar.cc/150?u=${request.id}`} 
                        alt={request.name} 
                        className="w-20 h-20 rounded-3xl border-2 border-white/10 group-hover:border-purple-500/50 transition-all object-cover shadow-2xl" 
                    />
                    <div className="absolute -bottom-1 -right-1 bg-purple-600 p-1.5 rounded-xl border-2 border-[#1A1140]">
                        <User size={12} className="text-white" />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h4 className="text-xl font-black text-white group-hover:text-purple-400 transition-colors truncate tracking-tight">
                        {request.name || request.username || 'User'}
                    </h4>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 italic leading-relaxed">
                        "{request.message || "Hi! I'd love to join this community and connect with like-minded creators."}"
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                        <span className="text-[10px] text-gray-600 font-bold tracking-widest bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 uppercase">
                            Requested {request.time}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                        onClick={() => onApprove(request.id)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl text-white font-bold text-xs tracking-wide hover:shadow-lg hover:shadow-purple-500/20 transition-all hover:scale-[1.05] active:scale-95 shadow-xl shadow-purple-900/40"
                    >
                        <Check size={16} strokeWidth={3} />
                        Approve
                    </button>
                    <button 
                        onClick={() => onReject(request.id)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 font-bold text-xs tracking-wide hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all active:scale-95"
                    >
                        <X size={16} strokeWidth={3} />
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinRequestItem;
