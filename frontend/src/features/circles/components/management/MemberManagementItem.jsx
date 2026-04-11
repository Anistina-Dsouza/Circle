import React from 'react';
import { Shield, ShieldAlert, UserMinus, MoreVertical } from 'lucide-react';

const MemberManagementItem = ({ member, onKick, onChangeRole }) => {
    const isModerator = member.role === 'moderator';

    return (
        <div className="bg-[#1A1140]/60 backdrop-blur-sm rounded-3xl p-5 border border-white/5 hover:border-purple-500/50 transition-all duration-500 group relative overflow-hidden flex items-center gap-5">
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 flex items-center gap-4 w-full">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <img 
                        src={member.avatar || `https://i.pravatar.cc/150?u=${member.id}`} 
                        alt={member.name} 
                        className="w-14 h-14 rounded-2xl border-2 border-white/5 group-hover:border-purple-500/50 transition-all object-cover shadow-lg" 
                    />
                    {isModerator && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-400 to-purple-600 p-1.5 rounded-lg border-2 border-[#1A1140] shadow-glow-purple">
                            <Shield size={10} className="text-white" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-black text-white group-hover:text-purple-400 transition-colors truncate tracking-tight">
                        {member.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                        <span className={`
                            text-[9px] font-black px-2 py-0.5 rounded-md tracking-widest border
                            ${isModerator 
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                                : 'bg-white/5 text-gray-500 border-white/5'}
                        `}>
                            {member.role}
                        </span>
                        <span className="text-[10px] text-gray-600 font-bold tracking-widest">
                            Joined {member.joinedDate}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => onChangeRole(member.id, isModerator ? 'member' : 'moderator')}
                        className={`
                            p-3 rounded-xl transition-all border
                            ${isModerator 
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500 hover:text-white' 
                                : 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500 hover:text-white'}
                        `}
                        title={isModerator ? "Remove Moderator" : "Make Moderator"}
                    >
                        {isModerator ? <ShieldAlert size={18} /> : <Shield size={18} />}
                    </button>
                    <button 
                        onClick={() => onKick(member.id)}
                        className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        title="Remove Member"
                    >
                        <UserMinus size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemberManagementItem;
