import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import axios from "axios";
import { Loader2, ShieldAlert, UserCheck, UserX, Search, Filter, SortAsc } from "lucide-react";
import ViewReportsModal from "../components/ViewReportsModal";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState("");
  const [viewReportItemId, setViewReportItemId] = useState(null);

  const fetchUsers = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await axios.get(`${baseUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id, currentRole) => {
    if(currentRole === 'admin') {
      alert("Cannot suspend an administrator account natively.");
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      await axios.put(`${baseUrl}/api/admin/users/${id}/suspend`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUsers(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDismiss = async (id) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      await axios.put(`${baseUrl}/api/admin/reports/${id}/dismiss`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to dismiss reports');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-2">
        {/* Header */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Identity Matrix</h1>
            <p className="text-white/40 text-xs sm:text-sm font-black uppercase tracking-[0.2em]">Platform Network Access Control</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative group flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-purple-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search Identity..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-white/10"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-none">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={14} />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full sm:w-auto appearance-none bg-white/5 border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-[10px] font-black uppercase tracking-widest text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer hover:bg-white/10 transition-all"
                >
                  <option value="all">Status: All</option>
                  <option value="active">Status: Stable</option>
                  <option value="suspended">Status: Offline</option>
                </select>
              </div>
              
              <div className="relative flex-1 sm:flex-none">
                <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={14} />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full sm:w-auto appearance-none bg-white/5 border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-[10px] font-black uppercase tracking-widest text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer hover:bg-white/10 transition-all"
                >
                  <option value="default">Sequence: Default</option>
                  <option value="alphabetical">Sequence: A-Z</option>
                  <option value="flagged">Sequence: Flags</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="group/table relative rounded-[24px] sm:rounded-[32px] bg-[#1A0C3F]/50 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
          {/* Subtle scroll indicator for mobile */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-white/5 rounded-full opacity-0 group-hover/table:opacity-100 transition-opacity pointer-events-none lg:hidden" />
          
          <div className="overflow-x-auto no-scrollbar scroll-smooth">
            <div className="min-w-[1100px] w-full">
              {/* Table Head */}
              <div className="flex px-8 py-6 text-[10px] uppercase tracking-[0.25em] font-black text-white/20 border-b border-white/5 bg-white/[0.02] sticky top-0 z-20 backdrop-blur-xl">
                <div className="w-[28%] pl-2">Subject Node</div>
                <div className="w-[22%]">Access Protocol (Email)</div>
                <div className="w-[12%] text-center">Authorization</div>
                <div className="w-[13%] text-center">Intervention Logs</div>
                <div className="w-[12%] text-center">Temporal Index</div>
                <div className="w-[13%] text-right pr-2">Matrix Override</div>
              </div>

              {/* Rows */}
              {loading ? (
                <div className="flex flex-col items-center justify-center p-32 gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl animate-pulse" />
                    <Loader2 className="animate-spin w-12 h-12 text-purple-500 relative" />
                  </div>
                  <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] animate-pulse">Syncing Identity Matrix...</span>
                </div>
              ) : (() => {
                let processed = [...users];

                if (search) {
                  const s = search.toLowerCase();
                  processed = processed.filter(u => 
                    u.displayName?.toLowerCase().includes(s) || 
                    u.username?.toLowerCase().includes(s) || 
                    u.email?.toLowerCase().includes(s)
                  );
                }

                if (filter === 'active') {
                  processed = processed.filter(user => user.isActive);
                } else if (filter === 'suspended') {
                  processed = processed.filter(user => !user.isActive);
                }

                if (sort === 'alphabetical') {
                  processed.sort((a, b) => (a.displayName || "").localeCompare(b.displayName || ""));
                } else if (sort === 'flagged') {
                  processed.sort((a, b) => (b.pendingReports || 0) - (a.pendingReports || 0));
                }

                return (
                  <div className="divide-y divide-white/5">
                    {processed.map(user => (
                      <div 
                        key={user._id} 
                        className={`flex items-center px-8 py-7 group/row transition-all duration-500 relative
                          ${user.isActive ? 'hover:bg-white/[0.04]' : 'bg-red-500/[0.02] opacity-80 grayscale-[30%]'}`}
                      >
                        {/* Status Line */}
                        <div className={`absolute left-0 w-1 h-0 transition-all duration-500 rounded-r-full
                          ${user.isActive ? 'bg-purple-500 group-hover/row:h-1/2 top-1/4' : 'bg-red-500 h-1/2 top-1/4'}`} 
                        />

                        {/* User Profile */}
                        <div className="w-[28%] flex items-center gap-5 overflow-hidden pr-4">
                          <div className="relative flex-shrink-0 group/avatar">
                            <img
                              src={user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`}
                              className={`w-12 h-12 rounded-2xl object-cover ring-2 transition-all duration-500 group-hover/row:scale-110 shadow-2xl
                                ${user.isActive ? 'ring-white/5 group-hover/row:ring-purple-500/30' : 'ring-red-900/40'}`}
                              alt="avatar"
                            />
                            {user.isActive && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-[3px] border-[#1A0C3F] rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                            )}
                          </div>
                          <div className="flex flex-col truncate">
                            <span className={`font-black text-[15px] text-white tracking-tight group-hover/row:text-purple-300 transition-colors
                              ${!user.isActive && 'line-through text-white/30'}`}>
                              {user.displayName}
                            </span>
                            <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-1 group-hover/row:text-white/40">
                              @{user.username}
                            </span>
                          </div>
                        </div>

                        {/* Email Access */}
                        <div className="w-[22%] text-white/50 text-sm font-medium truncate pr-6 tabular-nums group-hover/row:text-white/80 transition-colors">
                          {user.email}
                        </div>

                        {/* Node Role */}
                        <div className="w-[12%] flex justify-center">
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border transition-all duration-500
                            ${user.role === "admin"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)] group-hover/row:bg-purple-500/20"
                              : "bg-white/5 text-white/20 border-white/5 group-hover/row:border-white/10"
                          }`}>
                            {user.role}
                          </span>
                        </div>

                        {/* Telemetry Flags */}
                        <div className="w-[13%] flex justify-center">
                          {user.pendingReports > 0 ? (
                            <button 
                              onClick={() => setViewReportItemId(user._id)} 
                              className="group/report flex items-center gap-2.5 bg-red-500/10 text-red-400 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-2xl active:scale-95"
                            >
                              <ShieldAlert size={14} className="group-hover/report:animate-bounce" />
                              <span>{user.pendingReports} LOGS</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-2.5 text-white/10 group-hover/row:text-green-500/20 transition-colors">
                              <UserCheck size={16} className="transition-transform group-hover/row:scale-110" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Clearance</span>
                            </div>
                          )}
                        </div>

                        {/* Join Date */}
                        <div className="w-[12%] text-white/30 text-[11px] font-black uppercase tracking-widest text-center group-hover/row:text-white/50 transition-colors">
                          {formatDate(user.createdAt)}
                        </div>

                        {/* Access Control Action */}
                        <div className="w-[13%] flex justify-end pr-2">
                          {user.role === 'admin' ? (
                            <div className="flex items-center gap-2 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/10 border border-white/5 opacity-40 cursor-not-allowed">
                              <span className="truncate">Root Protected</span>
                            </div>
                          ) : (
                            <button 
                              onClick={() => toggleStatus(user._id, user.role)}
                              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95
                                ${user.isActive 
                                  ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white"
                                  : "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white"
                              }`}
                            >
                              {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                              <span>{user.isActive ? "Deactivate" : "Activate"}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {processed.length === 0 && (
                        <div className="p-32 text-center flex flex-col items-center gap-6">
                          <div className="p-6 rounded-full bg-white/5 border border-white/10">
                            <Search size={48} className="text-white/10" />
                          </div>
                          <span className="text-white/20 font-black uppercase tracking-[0.4em] text-sm italic">Null Matrix Intersection</span>
                        </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
          
          {/* Mobile Scroll Indicator Overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#1A0C3F] to-transparent pointer-events-none lg:hidden opacity-40" />
        </div>


        <ViewReportsModal
            isOpen={!!viewReportItemId}
            onClose={() => setViewReportItemId(null)}
            itemId={viewReportItemId}
            itemType="User"
            onDismiss={handleDismiss}
        />
      </div>
    </AdminLayout>
  );
}
