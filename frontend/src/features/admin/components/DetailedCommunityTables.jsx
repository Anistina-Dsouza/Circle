import { Loader2, Users, ExternalLink, ShieldAlert, CheckCircle2, Lock, Globe, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function CommunityTable({ data = [], loading = false, onToggleStatus, onViewReports }) {
  if (loading) {
    return (
      <div className="bg-[#1A0C3F]/50 backdrop-blur-xl rounded-[32px] border border-white/10 p-32 flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Users size={24} className="text-indigo-400 animate-pulse" />
          </div>
        </div>
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Loading Communities...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Mobile Card View (hidden on lg+) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {data.map((c) => (
          <div key={c._id} className={`bg-[#1A0C3F]/50 backdrop-blur-xl p-6 rounded-[28px] border border-white/10 relative overflow-hidden group transition-all hover:border-indigo-500/30 ${!c.isActive && 'opacity-60'}`}>
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={c.coverImage !== 'default_circle.png' && c.coverImage ? c.coverImage : `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`}
                      alt="cover"
                      className={`w-14 h-14 rounded-2xl object-cover ring-2 ${c.isActive ? 'ring-indigo-500/20' : 'ring-red-500/20'}`}
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#1A0C3F] ${c.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-white font-black text-lg truncate group-hover:text-indigo-300 transition-colors">{c.name}</h3>
                    <div className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-widest mt-1">
                      <User size={10} />
                      <span>@{c.creator?.username || 'unknown'}</span>
                    </div>
                  </div>
               </div>
               <div className={`p-2 rounded-xl border ${c.type === 'public' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                  {c.type === 'public' ? <Globe size={14} /> : <Lock size={14} />}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <span className="block text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Nodes</span>
                <div className="flex items-center gap-2 text-white font-black text-lg">
                  <Users size={16} className="text-indigo-400" />
                  <span className="tabular-nums">{c.stats?.memberCount || 0}</span>
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <span className="block text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Status</span>
                {c.pendingReports > 0 ? (
                  <div className="flex items-center gap-2 text-red-400 font-black text-xs animate-pulse">
                    <ShieldAlert size={14} />
                    <span>FLAGGED</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-500/60 font-black text-xs">
                    <CheckCircle2 size={14} />
                    <span>STABLE</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                to={`/circles/${c.slug}`}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-white/40 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 hover:text-white transition-all group/btn"
              >
                <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                <span>Sync Node</span>
              </Link>

              {c.pendingReports > 0 && (
                <button 
                  onClick={() => onViewReports(c._id)}
                  className="p-3.5 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                >
                  <ShieldAlert size={18} />
                </button>
              )}

              <button 
                onClick={() => onToggleStatus(c._id)}
                className={`p-3.5 rounded-2xl transition-all shadow-lg ${
                  c.isActive 
                    ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white"
                    : "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white"
                }`}
              >
                <CheckCircle2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (hidden on lg-) */}
      <div className="hidden lg:block bg-[#1A0C3F]/50 backdrop-blur-xl rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-[1000px] lg:min-w-0">
            {/* Table Header */}
            <div className="grid grid-cols-6 px-10 py-6 text-[10px] uppercase tracking-[0.2em] font-black text-white/30 border-b border-white/5 bg-white/[0.02]">
              <span>Community</span>
              <span>Host</span>
              <span className="text-center">Members</span>
              <span className="text-center">Moderation</span>
              <span className="text-center">Privacy</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/5">
              {data.map((c) => (
                <div
                  key={c._id}
                  className={`grid grid-cols-6 items-center px-10 py-7 transition-all group ${
                    c.isActive ? 'hover:bg-white/[0.03]' : 'bg-red-900/5 opacity-75 grayscale-[20%]'
                  }`}
                >
                  {/* Name */}
                  <div className="flex items-center gap-4 overflow-hidden pr-4">
                    <div className="relative shrink-0">
                        <img
                        src={c.coverImage !== 'default_circle.png' && c.coverImage ? c.coverImage : `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`}
                        alt="cover"
                        className={`w-12 h-12 rounded-2xl object-cover ring-2 transition-transform group-hover:scale-105 ${c.isActive ? 'ring-indigo-700/40' : 'ring-red-900/40'}`}
                        />
                        {c.isActive && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#1A0C3F] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />}
                    </div>
                    <span className={`font-black text-white truncate group-hover:text-indigo-300 transition-colors ${!c.isActive && 'line-through text-white/40'}`}>
                      {c.name}
                    </span>
                  </div>

                  {/* Host */}
                  <div className="overflow-hidden pr-4 space-y-1">
                    <span className="text-sm font-bold text-white/60 truncate block group-hover:text-white transition-colors">
                      @{c.creator?.username || 'unknown'}
                    </span>
                    <span className="text-[9px] text-white/20 uppercase font-black tracking-widest block italic">Creator</span>
                  </div>

                  {/* Members */}
                  <div className="flex items-center justify-center gap-2.5 text-white/80">
                    <Users size={14} className="text-indigo-400"/>
                    <span className="text-sm font-black tabular-nums">{c.stats?.memberCount || 0}</span>
                  </div>

                  {/* Integrity Status */}
                  <div className="flex justify-center">
                    {c.pendingReports > 0 ? (
                      <button 
                        onClick={() => onViewReports(c._id)} 
                        className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg group/flag animate-pulse"
                      >
                        <ShieldAlert size={12} className="group-hover/flag:rotate-12 transition-transform" />
                        <span>{c.pendingReports} PENDING</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-white/10 text-[9px] font-black uppercase tracking-widest">
                        <CheckCircle2 size={12} className="text-green-500/40" />
                        <span>Stable</span>
                      </div>
                    )}
                  </div>

                  {/* Protocol */}
                  <div className="flex justify-center">
                    <span
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        c.type === "public"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                      }`}
                    >
                      {c.type === 'public' ? <Globe size={10} /> : <Lock size={10} />}
                      {c.type || 'public'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3">
                    <Link 
                      to={`/circles/${c.slug}`} 
                      className="p-3 rounded-2xl bg-white/5 text-white/20 hover:bg-indigo-600 hover:text-white transition-all shadow-xl group/btn hover:rotate-12"
                      title="Sync Node"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <button 
                      onClick={() => onToggleStatus(c._id)}
                      className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
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
            </div>
          </div>
        </div>
      </div>

      {data.length === 0 && (
        <div className="bg-[#1A0C3F]/50 backdrop-blur-xl border border-white/10 rounded-[32px] p-32 text-center flex flex-col items-center gap-6 shadow-2xl">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/10">
              <Users size={40} />
          </div>
          <span className="text-white/20 font-black uppercase tracking-[0.4em] text-sm italic">No communities found</span>
        </div>
      )}
    </div>
  );
}
