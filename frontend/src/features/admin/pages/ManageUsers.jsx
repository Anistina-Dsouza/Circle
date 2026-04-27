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
        <div className="rounded-[24px] sm:rounded-[32px] bg-[#1A0C3F]/50 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto no-scrollbar">
            <div className="min-w-[1000px]">
              {/* Table Head */}
              <div className="flex px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-white/30 border-b border-white/5 bg-white/[0.02]">
                <div className="w-[30%]">User Profile</div>
                <div className="w-[20%]">Email Access</div>
                <div className="w-[10%] text-center">Node Role</div>
                <div className="w-[10%] text-center">Telemetry Flags</div>
                <div className="w-[15%] text-center">Join Date</div>
                <div className="w-[15%] text-right">Matrix Control</div>
              </div>

              {/* Rows */}
              {loading ? (
                <div className="flex flex-col items-center justify-center p-32 gap-4">
                  <Loader2 className="animate-spin w-10 h-10 text-purple-500" />
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Synchronizing Matrix...</span>
                </div>
              ) : (() => {
                let processed = [...users];

                if (search) {
                  const s = search.toLowerCase();
                  processed = processed.filter(u => 
                    u.displayName.toLowerCase().includes(s) || 
                    u.username.toLowerCase().includes(s) || 
                    u.email.toLowerCase().includes(s)
                  );
                }

                if (filter === 'active') {
                  processed = processed.filter(user => user.isActive);
                } else if (filter === 'suspended') {
                  processed = processed.filter(user => !user.isActive);
                }

                if (sort === 'alphabetical') {
                  processed.sort((a, b) => a.displayName.localeCompare(b.displayName));
                } else if (sort === 'flagged') {
                  processed.sort((a, b) => (b.pendingReports || 0) - (a.pendingReports || 0));
                }

                return (
                  <div className="divide-y divide-white/5">
                    {processed.map(user => (
                      <div key={user._id} className={`flex items-center px-8 py-6 group transition-all duration-300 ${user.isActive ? 'hover:bg-white/[0.03]' : 'bg-red-900/5 opacity-75 grayscale-[20%]'}`}>

                        {/* User */}
                        <div className="w-[30%] flex items-center gap-4 overflow-hidden pr-4">
                          <div className="relative flex-shrink-0">
                            <img
                              src={user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`}
                              className={`w-11 h-11 rounded-2xl object-cover ring-2 transition-transform duration-500 group-hover:scale-105 ${user.isActive ? 'ring-purple-700/40' : 'ring-red-900/40'}`}
                              alt="avatar"
                            />
                            {user.isActive && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#1A0C3F] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />}
                          </div>
                          <div className="flex flex-col truncate">
                            <span className={`font-bold text-white group-hover:text-purple-300 transition-colors ${!user.isActive && 'line-through text-white/40'} truncate`}>
                              {user.displayName}
                            </span>
                            <span className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-0.5">@{user.username}</span>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="w-[20%] text-white/60 text-sm font-medium truncate pr-4 tabular-nums">
                          {user.email}
                        </div>

                        {/* Role */}
                        <div className="w-[10%] flex justify-center">
                          <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${
                            user.role === "admin"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                              : "bg-white/5 text-white/30 border-white/5"
                          }`}>
                            {user.role}
                          </span>
                        </div>

                        {/* Flags (Reports) */}
                        <div className="w-[10%] flex justify-center">
                          {user.pendingReports > 0 ? (
                            <button 
                              onClick={() => setViewReportItemId(user._id)} 
                              className="flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                            >
                              <ShieldAlert size={12} />
                              <span>{user.pendingReports} PENDING</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 text-white/10">
                              <UserCheck size={14} className="opacity-20" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Secure</span>
                            </div>
                          )}
                        </div>

                        {/* Joined */}
                        <div className="w-[15%] text-white/40 text-[10px] font-black uppercase tracking-widest text-center">
                          {formatDate(user.createdAt)}
                        </div>

                        {/* Access Control Action */}
                        <div className="w-[15%] flex justify-end">
                          {user.role === 'admin' ? (
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/20 border border-white/5 opacity-50">
                              <span>PROTECTED NODE</span>
                            </div>
                          ) : (
                            <button 
                              onClick={() => toggleStatus(user._id, user.role)}
                              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                                user.isActive 
                                  ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white"
                                  : "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white"
                              }`}
                            >
                              {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                              <span>{user.isActive ? "SUSPEND" : "RESTORE"}</span>
                            </button>
                          )}
                        </div>

                      </div>
                    ))}
                    
                    {processed.length === 0 && (
                        <div className="p-32 text-center flex flex-col items-center gap-4">
                          <Search size={40} className="text-white/10" />
                          <span className="text-white/20 font-black uppercase tracking-[0.3em] text-sm italic">Zero Identities Discovered</span>
                        </div>
                    )}

                  </div>
                );
              })()}
            </div>
          </div>
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
