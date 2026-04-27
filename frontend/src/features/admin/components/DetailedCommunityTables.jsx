import { Loader2, Users, ExternalLink, ShieldAlert, CheckCircle2, MoreVertical, ShieldX, Globe, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function CommunityTable({ data = [], loading = false, onToggleStatus, onViewReports }) {
  return (
    <div className="bg-[#1A0C3F]/50 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
      <div className="overflow-x-auto no-scrollbar">
        <div className="min-w-full">
          {/* Table Header - HIDDEN ON MOBILE */}
          <div className="hidden lg:grid lg:grid-cols-6 px-10 py-6 text-[10px] uppercase tracking-[0.2em] font-black text-white/30 border-b border-white/5 bg-white/[0.02]">
            <span>Community</span>
            <span>Host</span>
            <span className="text-center">Nodes</span>
            <span className="text-center">Integrity</span>
            <span className="text-center">Visibility</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-32 gap-4">
              <Loader2 className="animate-spin w-10 h-10 text-purple-500" />
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Decoding Community Flux...</span>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {data.map((c) => (
                <div
                  key={c._id}
                  className={`flex flex-col lg:grid lg:grid-cols-6 lg:items-center px-6 lg:px-10 py-6 lg:py-6 transition-all duration-300 group ${
                    c.isActive ? 'hover:bg-white/[0.03]' : 'bg-red-900/5 opacity-75 grayscale-[20%]'
                  }`}
                >
                  {/* Name & Community ID */}
                  <div className="flex items-center gap-4 min-w-0 pr-4 mb-4 lg:mb-0">
                    <div className="relative shrink-0">
                        <img
                        src={c.coverImage !== 'default_circle.png' && c.coverImage ? c.coverImage : `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`}
                        alt="cover"
                        className={`w-12 h-12 rounded-2xl object-cover ring-2 transition-transform duration-500 group-hover:scale-110 ${c.isActive ? 'ring-purple-700/40' : 'ring-red-900/40'}`}
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#1A0C3F] flex items-center justify-center ${c.type === 'public' ? 'bg-green-500' : 'bg-orange-500'}`}>
                            {c.type === 'public' ? <Globe size={8} className="text-white" /> : <Lock size={8} className="text-white" />}
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <span className={`font-black text-base text-white truncate group-hover:text-purple-300 transition-colors block ${!c.isActive && 'line-through text-white/40'}`}>
                            {c.name}
                        </span>
                        <span className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1 block truncate">UID: {c._id.substring(0, 8)}</span>
                    </div>
                  </div>

                  {/* Host - SECONDARY ON MOBILE */}
                  <div className="flex items-center justify-between lg:block mb-4 lg:mb-0 lg:pr-4">
                    <span className="lg:hidden text-[9px] font-black text-white/20 uppercase tracking-widest">Host Cluster</span>
                    <div className="text-right lg:text-left">
                        <span className="text-xs sm:text-sm font-bold text-white/60 truncate block group-hover:text-white transition-colors">
                            @{c.creator?.username || 'unknown'}
                        </span>
                        <span className="hidden lg:block text-[9px] text-white/20 uppercase font-black tracking-widest mt-1">Creator Node</span>
                    </div>
                  </div>

                  {/* Members - STATS ON MOBILE */}
                  <div className="flex items-center justify-between lg:justify-center gap-2 mb-4 lg:mb-0">
                    <span className="lg:hidden text-[9px] font-black text-white/20 uppercase tracking-widest">Active Footprint</span>
                    <div className="flex items-center gap-2">
                        <Users size={14} className="text-indigo-400 group-hover:scale-110 transition-transform"/>
                        <span className="text-sm font-black tabular-nums text-white/80">{c.stats?.memberCount || 0} Nodes</span>
                    </div>
                  </div>

                  {/* Integrity / Flags */}
                  <div className="flex items-center justify-between lg:justify-center mb-4 lg:mb-0">
                    <span className="lg:hidden text-[9px] font-black text-white/20 uppercase tracking-widest">Security Audit</span>
                    {c.pendingReports > 0 ? (
                      <button 
                        onClick={() => onViewReports(c._id)} 
                        className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter hover:bg-red-500 hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                      >
                        <ShieldAlert size={12} className="animate-pulse" />
                        <span>{c.pendingReports} PENDING</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-white/20 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 size={12} className="text-green-500/40" />
                        <span className="group-hover:text-green-500/40 transition-colors">Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Privacy - BADGE ON MOBILE */}
                  <div className="hidden lg:flex justify-center">
                    <span
                      className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${
                        c.type === "public"
                          ? "bg-green-500/5 text-green-400 border-green-500/10 group-hover:border-green-500/30"
                          : "bg-orange-500/5 text-orange-400 border-orange-500/10 group-hover:border-orange-500/30"
                      }`}
                    >
                      {c.type || 'public'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 mt-2 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-none border-white/5">
                    <Link 
                      to={`/circles/${c.slug}`} 
                      className="p-3 rounded-2xl bg-white/5 text-white/40 hover:bg-purple-600 hover:text-white hover:scale-110 active:scale-95 transition-all shadow-xl group/btn"
                      title="Sync Live Node"
                    >
                      <ExternalLink size={18} />
                    </Link>
                    <button 
                      onClick={() => onToggleStatus(c._id)}
                      className={`flex-1 lg:flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] ${
                        c.isActive 
                          ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white"
                          : "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white"
                      }`}
                    >
                      {c.isActive ? 'DEACTIVATE' : 'RESTORE'}
                    </button>
                  </div>
                </div>
              ))}

              {data.length === 0 && (
                <div className="p-32 text-center flex flex-col items-center gap-4">
                  <ShieldX size={40} className="text-white/10" />
                  <span className="text-white/20 font-black uppercase tracking-[0.3em] text-sm italic">Zero Communities Isolated</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
