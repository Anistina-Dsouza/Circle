import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import axios from "axios";
import { Loader2, ShieldAlert, UserCheck, UserX, Search, Filter, SortAsc, ChevronLeft, ChevronRight, Mail, Calendar, Info } from "lucide-react";
import ViewReportsModal from "../components/ViewReportsModal";
import PremiumDropdown from "../components/PremiumDropdown";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState("");
  const [viewReportItemId, setViewReportItemId] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

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
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Filter and Sort Logic
  const getProcessedUsers = () => {
    let processed = [...users];

    if (search) {
      const s = search.toLowerCase();
      processed = processed.filter(u => 
        (u.displayName || "").toLowerCase().includes(s) || 
        (u.username || "").toLowerCase().includes(s) || 
        (u.email || "").toLowerCase().includes(s)
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

    return processed;
  };

  const processedUsers = getProcessedUsers();
  const totalPages = Math.ceil(processedUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, sort]);

  // Pagination Component
  const Pagination = ({ className = "" }) => {
    if (totalPages <= 1) return null;
    return (
      <div className={`flex flex-col sm:flex-row justify-between items-center gap-6 px-4 ${className}`}>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            Showing <span className="text-white/60">{indexOfFirstItem + 1}</span> to <span className="text-white/60">{Math.min(indexOfLastItem, processedUsers.length)}</span> of <span className="text-white/60">{processedUsers.length}</span> users
        </div>

        <div className="flex items-center gap-2">
            <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-purple-600 hover:border-purple-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl"
            >
                <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-2xl text-[10px] font-black transition-all border ${
                            page === currentPage 
                                ? "bg-purple-600 text-white border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                : "bg-white/5 text-white/20 border-white/10 hover:text-white hover:bg-white/10"
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-purple-600 hover:border-purple-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl"
            >
                <ChevronRight size={18} />
            </button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-2">
        {/* Header */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">User Management</h1>
            <p className="text-white/40 text-xs sm:text-sm font-black uppercase tracking-[0.2em]">Manage platform users and account status</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative group flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-purple-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-white/10 font-medium"
              />
            </div>

            <div className="flex gap-3">
              <PremiumDropdown
                value={filter}
                onChange={setFilter}
                icon={Filter}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'active', label: 'Active Only' },
                  { value: 'suspended', label: 'Suspended' }
                ]}
              />
              
              <PremiumDropdown
                value={sort}
                onChange={setSort}
                icon={SortAsc}
                options={[
                  { value: 'default', label: 'Default Sort' },
                  { value: 'alphabetical', label: 'Alphabetical' },
                  { value: 'flagged', label: 'Most Reported' }
                ]}
              />
            </div>
          </div>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center p-32 gap-6 bg-[#1A0C3F]/50 backdrop-blur-xl rounded-[32px] border border-white/10">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 size={24} className="text-purple-400 animate-pulse" />
                    </div>
                </div>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Loading Users...</span>
            </div>
        ) : (
            <>
                <Pagination className="mb-8" />
                {/* Mobile Card View (hidden on lg+) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden mb-8">
                    {currentItems.map(user => (
                        <div key={user._id} className={`bg-[#1A0C3F]/50 backdrop-blur-xl p-6 rounded-[28px] border border-white/10 relative overflow-hidden group transition-all hover:border-purple-500/30 ${!user.isActive && 'opacity-60'}`}>
                            {!user.isActive && <div className="absolute top-0 right-0 bg-red-500/20 text-red-400 px-4 py-1 text-[8px] font-black uppercase tracking-widest rounded-bl-xl border-l border-b border-red-500/20">SUSPENDED</div>}
                            
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative shrink-0">
                                    <img
                                        src={user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`}
                                        className={`w-14 h-14 rounded-2xl object-cover ring-2 ${user.isActive ? 'ring-purple-500/20' : 'ring-red-500/20'}`}
                                        alt={user.username}
                                    />
                                    {user.isActive && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#1A0C3F] rounded-full" />}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="text-white font-black text-lg truncate group-hover:text-purple-300 transition-colors">{user.displayName}</h3>
                                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">@{user.username}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-white/40 text-[11px] font-medium">
                                    <Mail size={14} className="text-purple-500/40" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-white/40 text-[11px] font-medium">
                                    <Calendar size={14} className="text-purple-500/40" />
                                    <span>Joined {formatDate(user.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-3 text-white/40 text-[11px] font-medium">
                                    <Info size={14} className="text-purple-500/40" />
                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20' : 'bg-white/5 text-white/30 border border-white/5'}`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4 mt-auto">
                                {user.pendingReports > 0 ? (
                                    <button 
                                        onClick={() => setViewReportItemId(user._id)} 
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 text-red-400 py-3 rounded-2xl text-[9px] font-black uppercase tracking-tighter border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                    >
                                        <ShieldAlert size={12} />
                                        <span>{user.pendingReports} PENDING</span>
                                    </button>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/5 text-white/10">
                                        <UserCheck size={14} className="opacity-20" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Clear</span>
                                    </div>
                                )}

                                {user.role !== 'admin' && (
                                    <button 
                                        onClick={() => toggleStatus(user._id, user.role)}
                                        className={`p-3 rounded-2xl transition-all shadow-lg ${
                                            user.isActive 
                                                ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white"
                                                : "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white"
                                        }`}
                                    >
                                        {user.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table View (hidden on md-) */}
                <div className="hidden lg:block rounded-[32px] bg-[#1A0C3F]/50 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl mb-8">
                    <div className="overflow-x-auto no-scrollbar">
                        <div className="min-w-[1000px]">
                            {/* Table Head */}
                            <div className="flex px-10 py-6 text-[10px] uppercase tracking-[0.2em] font-black text-white/30 border-b border-white/5 bg-white/[0.02]">
                                <div className="w-[30%]">User Profile</div>
                                <div className="w-[20%]">Email</div>
                                <div className="w-[10%] text-center">Role</div>
                                <div className="w-[12%] text-center">Flags</div>
                                <div className="w-[13%] text-center">Join Date</div>
                                <div className="w-[15%] text-right">Access Controls</div>
                            </div>

                            <div className="divide-y divide-white/5">
                                {currentItems.map(user => (
                                    <div key={user._id} className={`flex items-center px-10 py-7 group transition-all duration-300 ${user.isActive ? 'hover:bg-white/[0.03]' : 'bg-red-900/5 opacity-75 grayscale-[20%]'}`}>

                                        {/* User Profile */}
                                        <div className="w-[30%] flex items-center gap-5 overflow-hidden pr-4">
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`}
                                                    className={`w-12 h-12 rounded-2xl object-cover ring-2 transition-transform duration-500 group-hover:scale-105 ${user.isActive ? 'ring-purple-700/40' : 'ring-red-900/40'}`}
                                                    alt="avatar"
                                                />
                                                {user.isActive && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#1A0C3F] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />}
                                            </div>
                                            <div className="flex flex-col truncate space-y-1">
                                                <span className={`font-black text-white group-hover:text-purple-300 transition-colors ${!user.isActive && 'line-through text-white/40'} truncate`}>
                                                    {user.displayName}
                                                </span>
                                                <span className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-0.5">@{user.username}</span>
                                            </div>
                                        </div>

                                        {/* Email Access */}
                                        <div className="w-[20%] text-white/60 text-sm font-medium truncate pr-4 tabular-nums">
                                            {user.email}
                                        </div>

                                        {/* Node Role */}
                                        <div className="w-[10%] flex justify-center">
                                            <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${
                                                user.role === "admin"
                                                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                                                    : "bg-white/5 text-white/30 border-white/5"
                                            }`}>
                                                {user.role}
                                            </span>
                                        </div>

                                        {/* Telemetry Flags */}
                                        <div className="w-[12%] flex justify-center">
                                            {user.pendingReports > 0 ? (
                                                <button 
                                                    onClick={() => setViewReportItemId(user._id)} 
                                                    className="flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                                >
                                                    <ShieldAlert size={12} />
                                                    <span>{user.pendingReports} PENDING</span>
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2 text-white/10">
                                                    <UserCheck size={14} className="opacity-20" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">-</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Join Date */}
                                        <div className="w-[13%] text-white/40 text-[10px] font-black uppercase tracking-widest text-center tabular-nums">
                                            {formatDate(user.createdAt)}
                                        </div>

                                        {/* Access Control Action */}
                                        <div className="w-[15%] flex justify-end">
                                            {user.role === 'admin' ? (
                                                <div className="flex items-center gap-2 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/20 border border-white/5 opacity-50">
                                                    <span>PROTECTED</span>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => toggleStatus(user._id, user.role)}
                                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
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
                            </div>
                        </div>
                    </div>
                </div>

                {/* No Results */}
                {currentItems.length === 0 && (
                    <div className="bg-[#1A0C3F]/50 backdrop-blur-xl border border-white/10 rounded-[32px] p-32 text-center flex flex-col items-center gap-6 shadow-2xl">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/10">
                            <Search size={40} />
                        </div>
                        <span className="text-white/20 font-black uppercase tracking-[0.4em] text-sm italic">No users found</span>
                    </div>
                )}

                <Pagination />
            </>
        )}

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

