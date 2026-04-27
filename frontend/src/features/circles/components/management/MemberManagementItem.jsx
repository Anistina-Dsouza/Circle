import React from 'react';
import { Shield, ShieldAlert, UserMinus, MoreVertical, VolumeX, Ban, Volume2 } from 'lucide-react';

const MemberManagementItem = ({ member, onKick, onChangeRole, onMute, onBan, isCreator }) => {
    const isModerator = member.role === 'moderator';
    const isAdmin = member.role === 'admin';
    const isMuted = member.isMuted || (member.mutedUntil && new Date(member.mutedUntil) > new Date());


    return (
        <div className="bg-[#1A1140]/60 backdrop-blur-sm rounded-3xl p-4 sm:p-5 border border-white/5 hover:border-purple-500/50 transition-all duration-500 group relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                {/* User Details Row */}
                <div className="flex items-center gap-4 flex-1 w-full min-w-0">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <img 
                            src={member.avatar || `https://i.pravatar.cc/150?u=${member.id}`} 
                            alt={member.name} 
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-white/5 group-hover:border-purple-500/50 transition-all object-cover shadow-lg" 
                        />
                        {isModerator && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-400 to-purple-600 p-1 rounded-lg border-2 border-[#1A1140] shadow-glow-purple">
                                <Shield size={10} className="text-white" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h4 className="text-base sm:text-lg font-black text-white group-hover:text-purple-400 transition-colors truncate tracking-tight">
                            {member.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            <span className={`
                                text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-md tracking-widest border
                                ${isModerator 
                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                                    : 'bg-white/5 text-gray-500 border-white/5'}
                            `}>
                                {member.role}
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-gray-600 font-bold tracking-widest">
                                Joined {member.joinedDate}
                            </span>
                            {isMuted && (
                                <span className="text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-md tracking-widest border bg-blue-500/10 text-blue-400 border-blue-500/20">
                                    MUTED {member.mutedUntil ? `UNTIL ${new Date(member.mutedUntil).toLocaleTimeString()}` : 'INDEFINITELY'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 mt-1 sm:mt-0">
                    {!isAdmin && !isCreator && (
                        <>
                            <button 
                                onClick={() => onMute(member.id, !isMuted)}
                                className={`
                                    p-2.5 sm:p-3 rounded-xl transition-all border
                                    ${isMuted 
                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white' 
                                        : 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500 hover:text-white'}
                                `}
                                title={isMuted ? "Unmute Member" : "Mute Member"}
                            >
                                {isMuted ? <Volume2 size={16} /> : <VolumeX size={16} />}
                            </button>
                            <button 
                                onClick={() => onChangeRole(member.id, isModerator ? 'member' : 'moderator')}
                                className={`
                                    p-2.5 sm:p-3 rounded-xl transition-all border
                                    ${isModerator 
                                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500 hover:text-white' 
                                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500 hover:text-white'}
                                `}
                                title={isModerator ? "Remove Moderator" : "Make Moderator"}
                            >
                                {isModerator ? <ShieldAlert size={16} /> : <Shield size={16} />}
                            </button>
                            <button 
                                onClick={() => onKick(member.id)}
                                className="p-2.5 sm:p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                title="Remove Member"
                            >
                                <UserMinus size={16} />
                            </button>
                            <button 
                                onClick={() => onBan(member.id)}
                                className="p-2.5 sm:p-3 bg-black/40 text-red-600 border border-red-900/50 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                                title="Ban Member"
                            >
                                <Ban size={16} />
                            </button>
                        </>
                    )}
                    {isCreator && (
                        <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-[10px] font-black text-purple-400 uppercase tracking-widest whitespace-nowrap">
                            Circle Host
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MemberManagementItem;
