import { Link, useNavigate } from "react-router-dom";
import { avatar } from "../../../utils/avatar";
import { Eye, ExternalLink, ShieldCheck, UserMinus, Clock, Activity } from "lucide-react";

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
    <div className="rounded-[24px] sm:rounded-[32px] bg-[#1A0C3F]/50 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 group/container hover:border-purple-500/20">
      {/* Header */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center px-6 sm:px-10 py-6 sm:py-9 border-b border-white/5 gap-4 bg-white/[0.02]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
              <Activity size={14} className="text-purple-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-400/60">Live Feed</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tighter">Recent Identities</h2>
        </div>
        <Link to="/admin/users" className="flex items-center gap-3 text-white/40 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all bg-white/5 px-6 py-2.5 rounded-2xl border border-white/5 whitespace-nowrap group">
          <span>Manage Matrix</span>
          <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Table Headers */}
      <div className="flex px-6 sm:px-10 py-5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white/20 border-b border-white/5 bg-white/[0.01]">
        <div className="flex-1">Identity Node</div>
        <div className="hidden lg:flex items-center gap-12">
          <div className="w-24 text-center">Protocol</div>
          <div className="w-24 text-center">Sync Time</div>
          <div className="w-12 text-right pr-2">Access</div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {users && users.length > 0 ? (
          users.map((u, i) => (
            <div 
              key={u._id || i} 
              onClick={() => navigate(`/profile/${u.username}`)}
              className={`group flex items-center px-6 sm:px-10 py-6 sm:py-8 transition-all cursor-pointer relative overflow-hidden
                ${u.isActive ? 'hover:bg-white/[0.04]' : 'bg-red-900/5 opacity-75 grayscale-[20%]'}`}
            >
              {u.isActive && <div className="absolute left-0 w-1 h-0 bg-purple-500 group-hover:h-full top-0 transition-all duration-500 rounded-r-full shadow-[0_0_20px_rgba(168,85,247,0.5)]" />}
              
              {/* USER */}
              <div className="flex-1 flex items-center gap-4 sm:gap-6 min-w-0">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />
                  <img
                    src={u.profilePic || avatar(u.displayName || u.username)}
                    className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-[18px] sm:rounded-[22px] object-cover bg-[#0F0529] group-hover:scale-105 transition-all duration-500
                      ${u.isActive ? 'ring-2 ring-white/10' : 'ring-2 ring-red-900/40'}`}
                    alt={u.username}
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-4 border-[#1A0C3F] shadow-lg transition-all duration-500 z-10
                    ${!u.isActive ? 'bg-red-500' : (u.onlineStatus?.status === 'online' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse' : 'bg-white/10')}`} 
                  />
                </div>
                <div className="overflow-hidden space-y-1">
                  <p className={`font-black text-sm sm:text-lg text-white group-hover:text-purple-300 transition-colors truncate
                    ${!u.isActive && 'line-through text-white/40'}`}>
                    {u.displayName || u.username}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-white/20 truncate font-black uppercase tracking-[0.2em] mt-0.5">
                    {u.onlineStatus?.status === 'online' ? 'Active Sync' : `Last Seen ${formatTimeAgo(u.onlineStatus?.lastSeen)}`}
                  </p>
                </div>
              </div>

              {/* STATS/META - Shown on LG+ screens */}
              <div className="hidden lg:flex items-center gap-12 shrink-0">
                <div className="flex items-center gap-2">
                  {!u.isActive ? (
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 text-[9px] font-black uppercase tracking-widest border border-red-500/20">
                      <UserMinus size={10} />
                      <span>Deactivated</span>
                    </div>
                  ) : u.pendingReports > 0 ? (
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse">
                      <span>{u.pendingReports} Violation</span>
                    </div>
                  ) : u.isVerified ? (
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 text-[9px] font-black uppercase tracking-widest border border-green-500/20">
                      <ShieldCheck size={10} />
                      <span>Trusted</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-white/30 text-[9px] font-black uppercase tracking-widest border border-white/5">
                      <span>Standard</span>
                    </div>
                  )}
                </div>

                <div className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap w-24 text-center tabular-nums">
                  {formatTimeAgo(u.createdAt)}
                </div>

                <button className="p-3 rounded-2xl bg-white/5 text-white/20 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-xl group-hover:rotate-12">
                  <Eye size={16} />
                </button>
              </div>

              {/* Mobile Status - Shown only on small screens */}
              <div className="lg:hidden flex items-center ml-2 shrink-0">
                {u.pendingReports > 0 && u.isActive ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse" />
                ) : !u.isActive ? (
                  <UserMinus size={16} className="text-red-500 opacity-50" />
                ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="px-8 py-32 text-white/10 text-xs text-center italic font-black uppercase tracking-[0.4em]">
            Zero Identities Discovered
          </div>
        )}
      </div>
    </div>
  );
}

  );
}