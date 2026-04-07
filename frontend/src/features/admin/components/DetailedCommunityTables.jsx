import { Loader2, Users } from "lucide-react";
import { Link } from "react-router-dom";
export default function CommunityTable({ data = [], loading = false, onToggleStatus, onViewReports }) {
  return (
    <div className="bg-[#240046] rounded-[32px] overflow-hidden border border-purple-900/40 min-h-[400px]">

      {/* Table Header */}
      <div className="grid grid-cols-6 px-10 py-6 text-sm uppercase tracking-widest text-purple-300 border-b border-purple-900/40">
        <span>Community Name</span>
        <span>Host Name</span>
        <span>Members</span>
        <span>Flags</span>
        <span>Privacy Type</span>
        <span className="text-right">Actions</span>
      </div>

      {/* Rows */}
      {loading ? (
        <div className="flex items-center justify-center p-20 text-purple-400">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : (
        <div className="divide-y divide-purple-900/30">
          {data.map((c) => (
            <div
              key={c._id}
              className={`grid grid-cols-6 items-center px-10 py-6 transition ${
                c.isActive ? 'hover:bg-purple-900/20' : 'bg-red-900/5 opacity-75 grayscale-[20%]'
              }`}
            >
              {/* Name */}
              <div className="flex items-center gap-4">
                <img
                  src={c.coverImage !== 'default_circle.png' && c.coverImage ? c.coverImage : `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`}
                  alt="cover"
                  className={`w-12 h-12 rounded-xl object-cover ring-2 ${c.isActive ? 'ring-purple-700/40' : 'ring-red-900/40'}`}
                />
                <span className={`font-semibold ${!c.isActive && 'line-through text-gray-500'}`}>{c.name}</span>
              </div>

              {/* Host */}
              <span className="text-purple-300">
                {c.creator?.displayName || c.creator?.username || 'Unknown'}
              </span>

              {/* Members */}
              <div className="flex items-center gap-2 text-purple-200">
                <Users size={16}/>
                {c.stats?.memberCount || 0}
              </div>

              {/* Flags */}
              <div>
                {c.pendingReports > 0 ? (
                  <button onClick={() => onViewReports(c._id)} className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition cursor-pointer">
                    {c.pendingReports} Pending
                  </button>
                ) : (
                  <span className="text-gray-500 text-sm">None</span>
                )}
              </div>

              {/* Privacy */}
              <span
                className={`px-4 py-1 rounded-full text-xs font-semibold w-fit ${
                  c.type === "public"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                }`}
              >
                {(c.type || 'public').toUpperCase()}
              </span>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Link to={`/circles/${c.slug}`} className="bg-purple-500/20 text-purple-300 px-5 py-2 rounded-full text-sm hover:bg-purple-500 hover:text-white transition">
                  View
                </Link>
                <button 
                  onClick={() => onToggleStatus(c._id)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                    c.isActive 
                      ? "bg-[#3a0a1c] text-red-400 hover:bg-red-500 hover:text-white"
                      : "bg-[#123c2a] text-green-400 hover:bg-green-500 hover:text-white"
                  }`}
                >
                  {c.isActive ? 'Disable' : 'Restore'}
                </button>
              </div>
            </div>
          ))}

          {data.length === 0 && (
            <div className="p-10 text-center text-purple-300">No communities found.</div>
          )}
        </div>
      )}


    </div>
  );
}