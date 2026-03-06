import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function ManageUsers() {

  const [users] = useState([
    { id: 1, name: "Alex Rivera", email: "alex@circle.com", role: "Admin", status: "Active", joined: "Oct 2023" },
    { id: 2, name: "Jordan Smith", email: "jordan@circle.com", role: "User", status: "Suspended", joined: "Sep 2023" },
    { id: 3, name: "Marc King", email: "marc@kingadmin.io", role: "Admin", status: "Active", joined: "Feb 2024" },
    { id: 4, name: "Elena Rossi", email: "elena@styled.com", role: "User", status: "Active", joined: "Jan 2024" },
  ]);

  return (
    <div className="flex min-h-screen bg-[#070010] text-white">

      <Sidebar />

      <div className="flex-1 ml-64 p-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-gray-400 text-sm">Manage platform users</p>
        </div>

        {/* Table */}
        <div className="rounded-[28px] bg-[radial-gradient(circle_at_top,#2a004a,#13001f)] border border-white/5 overflow-hidden">

          {/* Table Head */}
          <div className="flex px-8 py-4 text-xs uppercase tracking-widest text-gray-400 border-b border-white/5">
            <div className="w-[30%]">User</div>
            <div className="w-[25%]">Email</div>
            <div className="w-[15%]">Role</div>
            <div className="w-[15%]">Status</div>
            <div className="w-[15%]">Joined</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">

            {users.map(user => (
              <div key={user.id} className="flex items-center px-8 py-5 hover:bg-purple-900/20 transition">

                {/* User */}
                <div className="w-[30%] flex items-center gap-4">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    className="w-11 h-11 rounded-full ring-2 ring-purple-700/40"
                  />
                  <span className="font-medium">{user.name}</span>
                </div>

                {/* Email */}
                <div className="w-[25%] text-purple-300 text-sm">
                  {user.email}
                </div>

                {/* Role */}
                <div className="w-[15%]">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    user.role === "Admin"
                      ? "bg-purple-800/40 text-purple-300"
                      : "bg-purple-700/20 text-purple-200"
                  }`}>
                    {user.role}
                  </span>
                </div>

                {/* Status */}
                <div className="w-[15%]">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    user.status === "Active"
                      ? "bg-[#123c2a] text-green-400"
                      : "bg-[#3a0a1c] text-red-400"
                  }`}>
                    {user.status}
                  </span>
                </div>

                {/* Joined */}
                <div className="w-[15%] text-gray-400 text-sm">
                  {user.joined}
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}