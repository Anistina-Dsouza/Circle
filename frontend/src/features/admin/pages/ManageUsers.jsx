import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
      fetchUsers(); // Refresh grid natively mapping truth
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex min-h-screen bg-[#070010] text-white">

      <Sidebar />

      <div className="flex-1 ml-64 p-10">

        {/* Header */}
        <div className="mb-8 items-center flex justify-between">
          <div>
            <h1 className="text-2xl font-semibold">User Management</h1>
            <p className="text-gray-400 text-sm">Manage platform network users and flag suspensions</p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-[28px] bg-[radial-gradient(circle_at_top,#2a004a,#13001f)] border border-white/5 overflow-hidden min-h-[400px]">

          {/* Table Head */}
          <div className="flex px-8 py-4 text-xs uppercase tracking-widest text-gray-400 border-b border-white/5">
            <div className="w-[30%]">User Profile</div>
            <div className="w-[20%]">Email</div>
            <div className="w-[10%]">Role</div>
            <div className="w-[10%] text-center">Flags</div>
            <div className="w-[15%]">Join Date</div>
            <div className="w-[15%] text-right">Access Controls</div>
          </div>

          {/* Rows */}
          {loading ? (
             <div className="flex items-center justify-center p-20 text-purple-400">
               <Loader2 className="animate-spin w-8 h-8" />
             </div>
          ) : (
            <div className="divide-y divide-white/5">
              {users.map(user => (
                <div key={user._id} className={`flex items-center px-8 py-5 transition ${user.isActive ? 'hover:bg-purple-900/20' : 'bg-red-900/5 opacity-75 grayscale-[20%]'}`}>

                  {/* User */}
                  <div className="w-[30%] flex items-center gap-4">
                    <img
                      src={user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`}
                      className={`w-11 h-11 rounded-full ring-2 ${user.isActive ? 'ring-purple-700/40' : 'ring-red-900/40'}`}
                      alt="avatar"
                    />
                    <div className="flex flex-col">
                      <span className={`font-medium ${!user.isActive && 'line-through text-gray-500'}`}>{user.displayName}</span>
                      <span className="text-xs text-purple-400/50">@{user.username}</span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="w-[20%] text-gray-300 text-sm truncate pr-4">
                    {user.email}
                  </div>

                  {/* Role */}
                  <div className="w-[10%]">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      user.role === "admin"
                        ? "bg-purple-800/40 text-purple-300 border border-purple-500/20"
                        : "bg-purple-700/10 text-purple-200/50"
                    }`}>
                      {user.role}
                    </span>
                  </div>

                  {/* Flags (Reports) */}
                  <div className="w-[10%] flex justify-center">
                    {user.pendingReports > 0 ? (
                      <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-red-500/30">
                        {user.pendingReports} Pending
                      </span>
                    ) : (
                      <span className="text-gray-600 text-xs">-</span>
                    )}
                  </div>

                  {/* Joined */}
                  <div className="w-[15%] text-gray-500 text-sm">
                    {formatDate(user.createdAt)}
                  </div>

                  {/* Access Control Action */}
                  <div className="w-[15%] flex justify-end">
                    {user.role === 'admin' ? (
                      <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-white/5 text-gray-500 cursor-not-allowed">
                        PROTECTED
                      </span>
                    ) : (
                      <button 
                        onClick={() => toggleStatus(user._id, user.role)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition tracking-wider ${
                          user.isActive 
                            ? "bg-[#3a0a1c] text-red-400 hover:bg-red-500 hover:text-white"
                            : "bg-[#123c2a] text-green-400 hover:bg-green-500 hover:text-white"
                        }`}
                      >
                        {user.isActive ? "SUSPEND" : "RESTORE"}
                      </button>
                    )}
                  </div>

                </div>
              ))}
              
              {users.length === 0 && (
                  <div className="p-10 text-center text-gray-500">No core users discovered entirely.</div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}