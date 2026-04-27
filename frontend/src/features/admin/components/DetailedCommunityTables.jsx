import { Loader2, Users, ExternalLink, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function CommunityTable({ data = [], loading = false, onToggleStatus, onViewReports }) {
  return (
    <div className="group/table relative bg-[#1A0C3F]/50 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
      {/* Scroll indicator for mobile */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-white/5 rounded-full opacity-0 group-hover/table:opacity-100 transition-opacity pointer-events-none lg:hidden" />
      
      <div className="overflow-x-auto no-scrollbar scroll-smooth">
        <div className="min-w-[1000px] lg:min-w-0">
          {/* Table Header */}
          <div className="grid grid-cols-6 px-6 sm:px-10 py-6 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-black text-white/20 border-b border-white/5 bg-white/[0.02] sticky top-0 z-20 backdrop-blur-xl">
            <span className="pl-2">Community Identity</span>
            <span>Host Node</span>
            <span className="text-center">Population</span>
            <span className="text-center">Moderation Pulse</span>
            <span className="text-center">Access Type</span>
            <span className="text-right pr-2">Actions</span>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-32 gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl animate-pulse" />
                <Loader2 className="animate-spin w-12 h-12 text-purple-500 relative" />
              </div>
              <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] animate-pulse">Accessing Community Database...</span>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {data.map((c) => (
                <div
                  key={c._id}
                  className={`grid grid-cols-6 items-center px-6 sm:px-10 py-7 transition-all duration-500 group/row relative ${
                    c.isActive ? 'hover:bg-white/[0.04]' : 'bg-red-500/[0.02] opacity-80 grayscale-[30%]'
                  }`}
                >
                  {/* Status Indicator */}
                  <div className={`absolute left-0 w-1 h-0 transition-all duration-500 rounded-r-full
                    ${c.isActive ? 'bg-indigo-500 group-hover/row:h-1/2 top-1/4' : 'bg-red-500 h-1/2 top-1/4'}`} 
                  />

                  {/* Community Name */}
                  <div className="flex items-center gap-4 sm:gap-5 overflow-hidden pr-4 pl-2">
                    <div className="relative flex-shrink-0 group/cover">
                      <img
                        src={c.coverImage !== 'default_circle.png' && c.coverImage ? c.coverImage : `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`}
                        alt="cover"
                        className={`w-12 h-12 rounded-2xl object-cover ring-2 transition-all duration-500 group-hover/row:scale-110 shadow-2xl ${
                          c.isActive ? 'ring-white/5 group-hover/row:ring-indigo-500/30' : 'ring-red-900/40'
                        }`}
                      />
                      {c.isActive && (
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-indigo-500 border-2 border-[#1A0C3F] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                      )}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className={`font-black text-[15px] text-white tracking-tight group-hover/row:text-indigo-300 transition-colors truncate ${!c.isActive && 'line-through text-white/30'}`}>
                        {c.name}
                      </span>
                      <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-1 group-hover/row:text-white/40">
                        Signal: {c.type || 'Standard'}
                      </span>
                    </div>
                  </div>

                  {/* Host Node */}
                  <div className="overflow-hidden pr-4">
                    <span className="text-xs sm:text-sm font-bold text-white/60 group-hover/row:text-white transition-colors truncate block">
                      @{c.creator?.username || 'anonymous'}
                    </span>
                    <span className="text-[9px] text-white/20 uppercase font-black tracking-widest block mt-1">Primary Node</span>
                  </div>

                  {/* Population */}
                  <div className="flex items-center justify-center gap-3 text-white/80">
                    <Users size={16} className="text-indigo-400 opacity-40 group-hover/row:opacity-100 transition-opacity"/>
                    <span className="text-sm font-black tabular-nums tracking-tight">{c.stats?.memberCount || 0}</span>
                  </div>

                  {/* Moderation Pulse */}
                  <div className="flex justify-center">
                    {c.pendingReports > 0 ? (
                      <button 
                        onClick={() => onViewReports(c._id)} 
                        className="group/flag flex items-center gap-2.5 bg-red-500/10 text-red-400 border border-red-500/20 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-2xl"
                      >
                        <ShieldAlert size={14} className="group-hover/flag:animate-pulse" />
                        <span>{c.pendingReports} LOGS</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2.5 text-white/10 group-hover/row:text-green-500/20 transition-colors">
                        <CheckCircle2 size={16} className="transition-transform group-hover/row:scale-110" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Stable</span>
                      </div>
                    )}
                  </div>

                  {/* Privacy Type */}
                  <div className="flex justify-center">
                    <span
                      className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-500 ${
                        c.type === "public"
                          ? "bg-green-500/10 text-green-400 border-green-500/20 group-hover/row:bg-green-500/20"
                          : "bg-orange-500/10 text-orange-400 border-orange-500/20 group-hover/row:bg-orange-500/20"
                      }`}
                    >
                      {c.type || 'public'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pr-2">
                    <Link 
                      to={`/circles/${c.slug}`} 
                      className="p-2.5 rounded-xl bg-white/5 text-white/20 hover:bg-indigo-500 hover:text-white transition-all shadow-2xl active:scale-95"
                      title="View Live Circle"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <button 
                      onClick={() => onToggleStatus(c._id)}
                      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95 ${
                        c.isActive 
                          ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white"
                          : "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white"
                      }`}
                    >
                      {c.isActive ? 'Suspend' : 'Restore'}
                    </button>
                  </div>
                </div>
              ))}

              {data.length === 0 && (
                <div className="p-32 text-center flex flex-col items-center gap-6">
                  <div className="p-6 rounded-full bg-white/5 border border-white/10">
                    <Users size={48} className="text-white/10" />
                  </div>
                  <span className="text-white/20 font-black uppercase tracking-[0.4em] text-sm italic">Zero Communities Registered</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Scroll Indicator Overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#1A0C3F] to-transparent pointer-events-none lg:hidden opacity-40" />
    </div>
  );
}
