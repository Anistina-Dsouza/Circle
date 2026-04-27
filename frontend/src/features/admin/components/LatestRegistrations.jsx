import { Link, useNavigate } from "react-router-dom";
import { avatar } from "../../../utils/avatar";
import { Eye, ExternalLink, ShieldCheck, UserMinus, Clock, Activity, Zap } from "lucide-react";

export default function LatestRegistrations({ users }) {
  const navigate = useNavigate();

  // Format date helper
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="group/table relative rounded-[24px] sm:rounded-[32px] bg-[#1A0C3F]/50 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center px-6 sm:px-10 py-6 sm:py-8 border-b border-white/5 gap-6 relative">
        <div className="absolute top-0 left-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Traffic Signal</h2>
          <p className="text-[10px] text-white/40 mt-1 uppercase tracking-[0.25em] font-black">Real-time Registration Feed</p>
        </div>
        <Link to="/admin/users" className="flex items-center gap-3 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all bg-white/5 px-6 py-2.5 rounded-xl border border-white/5 whitespace-nowrap group/link">
          <span>Global Matrix</span>
          <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Table Headers */}
      <div className="flex px-6 sm:px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 border-b border-white/5 bg-white/[0.01]">
        <div className="flex-1 pl-2">Subject Participant</div>
        <div className="hidden md:flex items-center gap-12">
          <div className="w-32 text-center">Audit Pulse</div>
          <div className="w-24 text-center">Temporal Index</div>
          <div className="w-16 text-right pr-4">Access</div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="min-w-[600px] md:min-w-0">
          {users && users.length > 0 ? (
            users.map((u, i) => (
              <div 
                key={u._id || i} 
                onClick={() => navigate(`/profile/${u.username}`)}
                className={`group/row flex items-center px-6 sm:px-10 py-6 sm:py-7 transition-all duration-500 cursor-pointer relative 
                  ${u.isActive ? 'hover:bg-white/[0.04]' : 'bg-red-500/[0.02] opacity-75 grayscale-[20%]'}`}
              >
                {u.isActive && <div className="absolute left-0 w-1.5 h-0 bg-purple-500 group-hover/row:h-1/2 top-1/4 transition-all duration-500 rounded-r-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />}
                
                {/* USER */}
                <div className="flex-1 flex items-center gap-4 sm:gap-6 min-w-0">
                  <div className="relative shrink-0 group/avatar">
                    <img
                      src={u.profilePic || avatar(u.displayName || u.username)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover bg-[#0F0529] transition-all duration-500 group-hover/row:scale-110 shadow-2xl
                        ${u.isActive ? 'ring-2 ring-white/5 group-hover/row:ring-purple-500/30' : 'ring-2 ring-red-900/40'}`}
                      alt={u.username}
                    />
                    <div className={`absolute -bottom-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-[3px] border-[#1A0C3F] shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-700
                      ${!u.isActive ? 'bg-red-500' : (u.onlineStatus?.status === 'online' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-white/20')}`} 
                    />
                  </div>
                  <div className="overflow-hidden">
                    <p className={`font-black text-base sm:text-lg text-white group-hover/row:text-purple-300 transition-colors truncate tracking-tight
                      ${!u.isActive && 'line-through text-white/30'}`}>
                      {u.displayName || u.username}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${u.onlineStatus?.status === 'online' ? 'bg-green-500' : 'bg-white/10'}`} />
                      <p className="text-[10px] text-white/20 truncate font-black uppercase tracking-[0.15em] group-hover/row:text-white/40">
                        {u.onlineStatus?.status === 'online' ? 'Signal Active' : `Last Echo ${formatTimeAgo(u.onlineStatus?.lastSeen)}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* STATS/META - Shown on MD+ screens */}
                <div className="hidden md:flex items-center gap-12 shrink-0">
                  <div className="w-32 flex justify-center">
                    {!u.isActive ? (
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-[9px] font-black uppercase tracking-widest border border-red-500/20">
                        <UserMinus size={12} />
                        <span>Offline</span>
                      </div>
                    ) : u.pendingReports > 0 ? (
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-red-600 text-white text-[9px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.3)] animate-pulse">
                        <Zap size={12} fill="currentColor" />
                        <span>{u.pendingReports} LOGS</span>
                      </div>
                    ) : u.isVerified ? (
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-green-500/10 text-green-400 text-[9px] font-black uppercase tracking-widest border border-green-500/20">
                        <ShieldCheck size={12} />
                        <span>Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">
                        <Activity size={12} />
                        <span>Stable</span>
                      </div>
                    )}
                  </div>

                  <div className="text-white/20 text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap w-24 text-center tabular-nums group-hover/row:text-white/40 transition-colors">
                    {formatTimeAgo(u.createdAt)}
                  </div>

                  <div className="w-16 flex justify-end pr-2">
                    <button className="p-3 rounded-xl bg-white/5 text-white/20 group-hover/row:bg-purple-500 group-hover/row:text-white transition-all shadow-2xl active:scale-90">
                      <Eye size={18} />
                    </button>
                  </div>
                </div>

                {/* Mobile Status - Shown only on small screens */}
                <div className="md:hidden flex items-center ml-4 shrink-0">
                  {u.pendingReports > 0 && u.isActive ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />
                  ) : !u.isActive ? (
                    <UserMinus size={16} className="text-red-500/40" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="px-8 py-32 text-center flex flex-col items-center gap-6">
              <div className="p-6 rounded-full bg-white/5 border border-white/10">
                <Clock size={48} className="text-white/10" />
              </div>
              <span className="text-white/20 font-black uppercase tracking-[0.4em] text-sm italic">Null Registration Signal</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Scroll Indicator Overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#1A0C3F] to-transparent pointer-events-none md:hidden opacity-30" />
    </div>
  );
}


  );
}