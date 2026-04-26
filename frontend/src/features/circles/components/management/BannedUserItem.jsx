import React from 'react';
import { UserPlus, ShieldX } from 'lucide-react';

const BannedUserItem = ({ user, onUnban }) => {
    return (
        <div className="bg-[#1A1140]/60 backdrop-blur-sm rounded-3xl p-5 border border-white/5 hover:border-red-500/50 transition-all duration-500 group relative overflow-hidden flex items-center gap-5">
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 flex items-center gap-4 w-full">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <img 
                        src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`} 
                        alt={user.name} 
                        className="w-14 h-14 rounded-2xl border-2 border-white/5 group-hover:border-red-500/50 transition-all object-cover shadow-lg grayscale group-hover:grayscale-0" 
                    />
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-400 to-red-600 p-1.5 rounded-lg border-2 border-[#1A1140] shadow-glow-red">
                        <ShieldX size={10} className="text-white" />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-black text-white group-hover:text-red-400 transition-colors truncate tracking-tight">
                        {user.name}
                    </h4>
                    <div className="flex flex-col gap-1 mt-1">
                        <span className="text-[10px] text-gray-500 font-bold tracking-widest">
                            Banned on {user.bannedDate}
                        </span>
                        {user.reason && (
                            <span className="text-[10px] text-red-400/60 font-medium italic truncate">
                                "{user.reason}"
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => onUnban(user.id)}
                        className="p-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl hover:bg-green-500 hover:text-white transition-all flex items-center gap-2"
                        title="Unban User"
                    >
                        <UserPlus size={18} />
                        <span className="text-[10px] font-black tracking-widest hidden sm:inline">UNBAN</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BannedUserItem;
