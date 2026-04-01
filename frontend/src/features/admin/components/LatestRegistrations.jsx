import { Link } from "react-router-dom";
import { avatar } from "../../../utils/avatar";
import { Eye } from "lucide-react";

export default function LatestRegistrations({ users }) {
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
    <div className="rounded-[28px] bg-[radial-gradient(circle_at_top,#2a004a,#13001f)] border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-white/5">
        <h2 className="text-lg font-semibold">Latest Registrations</h2>
        <Link to="/admin/users" className="text-purple-400 text-xs tracking-widest hover:text-purple-300 transition">VIEW ALL</Link>
      </div>

      {/* Column Headings */}
      <div className="flex px-8 py-4 text-xs uppercase tracking-widest text-gray-400 border-b border-white/5">
        <div className="w-[45%]">User</div>
        <div className="w-[20%]">Status</div>
        <div className="w-[20%]">Joined</div>
        <div className="w-[15%] text-right">Action</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {users && users.length > 0 ? (
          users.map((u, i) => (
            <div key={u._id || i} className="flex items-center px-8 py-5 hover:bg-purple-900/20 transition">
              {/* USER */}
              <div className="w-[45%] flex items-center gap-4">
                <img
                  src={u.profilePic || avatar(u.displayName || u.username)}
                  className="w-11 h-11 rounded-full ring-2 ring-purple-700/40 object-cover bg-[#0F0529]"
                  alt={u.username}
                />
                <div className="overflow-hidden">
                  <p className="font-medium truncate">{u.displayName || u.username}</p>
                  <p className="text-sm text-gray-400 truncate">{u.email}</p>
                </div>
              </div>

              {/* STATUS */}
              <div className="w-[20%]">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold
                  ${u.isVerified
                    ? "bg-[#123c2a] text-green-400"
                    : "bg-[#3a2f00] text-yellow-400"
                  }`}
                >
                  {u.isVerified ? "VERIFIED" : "PENDING"}
                </span>
              </div>

              {/* JOINED */}
              <div className="w-[20%] text-gray-400 text-sm">
                {formatTimeAgo(u.createdAt)}
              </div>

              {/* ACTION */}
              <div className="w-[15%] flex justify-end">
                <button className="p-2 rounded-full hover:bg-purple-800/40 transition">
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="px-8 py-5 text-gray-400 text-sm text-center">
            No recent registrations found.
          </div>
        )}
      </div>
    </div>
  );
}