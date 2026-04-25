import { Link, useNavigate } from "react-router-dom";
import { avatar } from "../../../utils/avatar";
import { Eye, ExternalLink, ShieldCheck, UserMinus, Clock } from "lucide-react";

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
    <div className="rounded-[32px] bg-[#1A0C3F]/50 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-7 border-b border-white/5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Recent Signups</h2>
          <p className="text-xs text-white/40 mt-1 uppercase tracking-widest font-black">Incoming Traffic</p>
        </div>
        <Link to="/admin/users" className="flex items-center gap-2 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <span>Manage All</span>
          <ExternalLink size={12} />
        </Link>
      </div>

      {/* Table Headers for Clarity */}
      <div className="flex px-8 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-white/20 border-b border-white/5 bg-white/[0.01]">
        <div className="flex-1">Participant</div>
        <div className="hidden sm:flex items-center gap-10">
          <div className="w-24 text-center">Audit Status</div>
          <div className="w-24 text-center">Timeline</div>
          <div className="w-12 text-right pr-2">Activity</div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {users && users.length > 0 ? (
          users.map((u, i) => (
            <div 
              key={u._id || i} 
              onClick={() => navigate(`/profile/${u.username}`)}
              className={`group flex items-center px-8 py-6 transition-all cursor-pointer relative 
                ${u.isActive ? 'hover:bg-white/[0.03]' : 'bg-red-900/5 opacity-75 grayscale-[20%]'}`}
            >
              {u.isActive && <div className="absolute left-0 w-1 h-0 bg-purple-500 group-hover:h-1/2 top-1/4 transition-all duration-300 rounded-r-full" />}
              
              {/* USER */}
              <div className="flex-1 flex items-center gap-5">
                <div className="relative">
                  <img
                    src={u.profilePic || avatar(u.displayName || u.username)}
                    className={`w-12 h-12 rounded-2xl object-cover bg-[#0F0529] group-hover:scale-105 transition-transform duration-300
                      ${u.isActive ? 'ring-2 ring-white/5' : 'ring-2 ring-red-900/40'}`}
                    alt={u.username}
                  />
                  {/* Dynamic Status Dot */}
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#13001f] shadow-lg transition-all duration-500
                    ${!u.isActive ? 'bg-red-500' : (u.onlineStatus?.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-600')}`} 
                  />
                </div>
                <div className="overflow-hidden">
                  <p className={`font-bold text-white group-hover:text-purple-300 transition-colors 
                    ${!u.isActive && 'line-through text-white/40'}`}>
                    {u.displayName || u.username}
                  </p>
                  <p className="text-[10px] text-white/40 truncate font-black uppercase tracking-widest">
                    {u.onlineStatus?.status === 'online' ? 'Currently Online' : `Last seen ${formatTimeAgo(u.onlineStatus?.lastSeen)}`}
                  </p>
                </div>
              </div>

              {/* STATS/META */}
              <div className="hidden sm:flex items-center gap-10">
                {/* STATUS */}
                <div className="flex items-center gap-2">
                  {!u.isActive ? (
                    <div 
                      title="This account has been suspended and has restricted access."
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-tighter border border-red-500/20"
                    >
                      <UserMinus size={10} />
                      <span>Suspended</span>
                    </div>
                  ) : u.pendingReports > 0 ? (
                    <div 
                      title={`${u.pendingReports} unresolved moderation reports require your attention.`}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-tighter shadow-[0_0_15px_rgba(220,38,38,0.4)] animate-pulse"
                    >
                      <span>{u.pendingReports} PENDING</span>
                    </div>
                  ) : u.isVerified ? (
                    <div 
                      title="This account has been verified by the system."
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-tighter border border-green-500/20"
                    >
                      <ShieldCheck size={10} />
                      <span>Verified</span>
                    </div>
                  ) : (
                    <div 
                      title="This is a regular active account with no reports."
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-tighter border border-indigo-500/20"
                    >
                      <span>Active Member</span>
                    </div>
                  )}
                </div>

                {/* JOINED */}
                <div className="text-white/30 text-[11px] font-black uppercase tracking-widest whitespace-nowrap">
                  {formatTimeAgo(u.createdAt)}
                </div>

                {/* ACTION */}
                <button className="p-3 rounded-xl bg-white/5 text-white/30 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-xl">
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="px-8 py-20 text-white/20 text-sm text-center italic">
            No recent registrations detected.
          </div>
        )}
      </div>
    </div>
  );
}