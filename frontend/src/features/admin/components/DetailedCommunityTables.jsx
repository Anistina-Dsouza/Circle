import { Loader2, Users, ExternalLink, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function CommunityTable({ data = [], loading = false, onToggleStatus, onViewReports }) {
  return (
    <div className="bg-[#1A0C3F]/50 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500">
      <div className="overflow-x-auto custom-scrollbar-horizontal">
        <table className="w-full min-w-[900px] border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-black text-white/30 border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 sm:px-10 py-6 text-left font-black w-[25%]">Community</th>
              <th className="px-4 py-6 text-left font-black w-[15%] hidden md:table-cell">Host</th>
              <th className="px-4 py-6 text-center font-black w-[12%]">Members</th>
              <th className="px-4 py-6 text-center font-black w-[15%]">Moderation</th>
              <th className="px-4 py-6 text-center font-black w-[13%] hidden lg:table-cell">Privacy</th>
              <th className="px-6 sm:px-10 py-6 text-right font-black w-[20%]">Actions</th>
            </tr>
          </thead>

          {/* Rows */}
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan="6">
                  <div className="flex items-center justify-center p-20 text-purple-400">
                    <Loader2 className="animate-spin w-8 h-8" />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="p-20 text-center text-white/20 font-black uppercase tracking-[0.3em] text-sm italic">
                    No community nodes discovered.
                  </div>
                </td>
              </tr>
            ) : (
              data.map((c) => (
                <tr
                  key={c._id}
                  className={`group transition-all duration-300 ${
                    c.isActive ? 'hover:bg-white/[0.03]' : 'bg-red-900/5 opacity-75 grayscale-[20%]'
                  }`}
                >
                  {/* Name */}
                  <td className="px-6 sm:px-10 py-6">
                    <div className="flex items-center gap-3 sm:gap-4 overflow-hidden pr-4">
                      <img
                        src={c.coverImage !== 'default_circle.png' && c.coverImage ? c.coverImage : `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`}
                        alt="cover"
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover ring-2 transition-transform group-hover:scale-105 ${c.isActive ? 'ring-purple-700/40' : 'ring-red-900/40'}`}
                      />
                      <span className={`font-bold text-sm sm:text-base text-white truncate group-hover:text-purple-300 transition-colors ${!c.isActive && 'line-through text-white/40'}`}>
                        {c.name}
                      </span>
                    </div>
                  </td>

                  {/* Host */}
                  <td className="px-4 py-6 hidden md:table-cell">
                    <div className="overflow-hidden pr-4">
                      <span className="text-xs sm:text-sm font-medium text-white/60 truncate block">
                        @{c.creator?.username || 'unknown'}
                      </span>
                      <span className="text-[9px] text-white/20 uppercase font-black tracking-widest block mt-1">Creator Node</span>
                    </div>
                  </td>

                  {/* Members */}
                  <td className="px-4 py-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-white/80">
                      <Users size={14} className="text-indigo-400"/>
                      <span className="text-sm font-black tabular-nums">{c.stats?.memberCount || 0}</span>
                    </div>
                  </td>

                  {/* Flags */}
                  <td className="px-4 py-6 text-center">
                    <div className="flex justify-center">
                      {c.pendingReports > 0 ? (
                        <button 
                          onClick={() => onViewReports(c._id)} 
                          className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter hover:bg-red-500 hover:text-white transition-all shadow-lg whitespace-nowrap"
                        >
                          <ShieldAlert size={12} />
                          <span>{c.pendingReports} PENDING</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-white/20 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                          <CheckCircle2 size={12} className="text-green-500/40" />
                          <span>Stable Node</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Privacy */}
                  <td className="px-4 py-6 text-center hidden lg:table-cell">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        c.type === "public"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                      }`}
                    >
                      {c.type || 'public'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 sm:px-10 py-6 text-right">
                    <div className="flex justify-end items-center gap-2.5">
                      <Link 
                        to={`/circles/${c.slug}`} 
                        className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:bg-purple-500 hover:text-white transition-all shadow-lg group/btn"
                        title="View Live Circle"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button 
                        onClick={() => onToggleStatus(c._id)}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg whitespace-nowrap ${
                          c.isActive 
                            ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white"
                            : "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white"
                        }`}
                      >
                        {c.isActive ? 'Disable' : 'Restore'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>

  );
}