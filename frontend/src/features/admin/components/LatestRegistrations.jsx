import { Link, useNavigate } from "react-router-dom";
import { avatar } from "../../../utils/avatar";
import { Eye, ExternalLink, ShieldCheck, UserMinus, Clock, UserPlus, Search } from "lucide-react";

export default function LatestRegistrations({ users }) {
  const navigate = useNavigate();

  // Format date helper
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  return (
    <div className="rounded-[24px] sm:rounded-[32px] bg-[#1A0C3F]/50 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 sm:px-10 py-6 sm:py-8 border-b border-white/5 gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none uppercase">Identity Stream</h2>
          <div className="flex items-center gap-2 mt-2">
            <UserPlus size={12} className="text-purple-400" />
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">Live Node Initialization</p>
          </div>
        </div>
        <Link to="/admin/users" className="w-full sm:w-auto flex items-center justify-center gap-3 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all bg-white/5 px-6 py-3 rounded-2xl border border-white/5 group/btn shadow-xl">
          <span>IDENTITY MATRIX</span>
          <ExternalLink size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
        </Link>
      </div>

      {/* Table Headers - HIDDEN ON MOBILE */}
      <div className="hidden md:flex px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 border-b border-white/5 bg-white/[0.01]">
        <div className="flex-1">Node Participant</div>
        <div className="flex items-center gap-12 lg:gap-16">
          <div className="w-28 text-center">Security Hash</div>
          <div className="w-24 text-center">Timeline</div>
          <div className="w-12"></div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {users && users.length > 0 ? (
          users.map((u, i) => (
            <div 
              key={u._id || i} 
              onClick={() => navigate(`/profile/${u.username}`)}
              className={`group flex flex-col md:flex-row md:items-center px-6 sm:px-10 py-6 sm:py-8 transition-all cursor-pointer relative 
                ${u.isActive ? 'hover:bg-white/[0.03]' : 'bg-red-900/5 opacity-75 grayscale-[20%]'}`}
            >
              <div className="absolute left-0 w-1 h-0 bg-purple-500 group-hover:h-2/3 top-1/6 transition-all duration-500 rounded-r-full" />
              
              {/* USER */}
              <div className="flex-1 flex items-center gap-4 sm:gap-6 min-w-0 mb-4 md:mb-0">
                <div className="relative shrink-0">
                  <img
                    src={u.profilePic || avatar(u.displayName || u.username)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover bg-[#0F0529] ring-2 transition-all duration-500 group-hover:scale-105 group-hover:rotate-3
                      ${u.isActive ? 'ring-white/5' : 'ring-red-900/40'}`}
                    alt={u.username}
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#13001f] shadow-2xl transition-all duration-500
                    ${!u.isActive ? 'bg-red-500' : (u.onlineStatus?.status === 'online' ? 'bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]' : 'bg-gray-600')}`} 
                  />
                </div>
                <div className="overflow-hidden">
                  <p className={`font-black text-base sm:text-lg text-white group-hover:text-purple-300 transition-colors truncate tracking-tight
                    ${!u.isActive && 'line-through text-white/40'}`}>
                    {u.displayName || u.username}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-white/20 truncate font-black uppercase tracking-widest">@{u.username}</span>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[9px] text-purple-400 font-black uppercase tracking-widest">
                        {u.onlineStatus?.status === 'online' ? 'Active' : `${formatTimeAgo(u.onlineStatus?.lastSeen)} ago`}
                    </span>
                  </div>
                </div>
              </div>

              {/* STATS/META - STACKED ON MOBILE */}
              <div className="flex items-center justify-between md:justify-end gap-6 lg:gap-16 shrink-0">
                <div className="flex items-center gap-2">
                  {!u.isActive ? (
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-500/20">
                      <UserMinus size={12} />
                      <span>OFFLINE</span>
                    </div>
                  ) : u.pendingReports > 0 ? (
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.3)] animate-pulse">
                      <ShieldCheck size={12} />
                      <span>FLAGGED</span>
                    </div>
                  ) : (
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500
                        ${u.isVerified 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20 group-hover:bg-green-500/20' 
                            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover:bg-indigo-500/20'}`}>
                      <ShieldCheck size={12} />
                      <span>{u.isVerified ? 'Verified' : 'Stable'}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-8 lg:gap-12">
                    <div className="hidden md:block text-white/30 text-[11px] font-black uppercase tracking-widest tabular-nums w-24 text-center">
                        {formatTimeAgo(u.createdAt)} AGO
                    </div>

                    <button className="p-3.5 rounded-2xl bg-white/5 text-white/30 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xl hover:scale-110 active:scale-95">
                        <Search size={18} />
                    </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="px-10 py-32 text-center flex flex-col items-center gap-4">
            <UserPlus size={40} className="text-white/10" />
            <span className="text-white/20 font-black uppercase tracking-[0.3em] text-sm italic">Zero Entry Detected</span>
          </div>
        )}
      </div>
    </div>
  );
}
