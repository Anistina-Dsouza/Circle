import Sidebar from "../components/Sidebar";
import CommunityTable from "../components/DetailedCommunityTables";
import CommunityStats from "../components/CommunityStats";
import { Search } from "lucide-react";

export default function ManageCommunities() {
  return (
    <div className="flex bg-[#10002B] text-white min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-6">
            <h1 className="text-4xl font-bold">Community Management</h1>

            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-5 py-2 rounded-full text-sm">
              1,248 Circles
            </span>
          </div>

          <button className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 rounded-full font-medium shadow-lg shadow-purple-900/30 hover:opacity-90 transition">
            + Create New Circle
          </button>
        </div>

        {/* Controls */}
        <div className="flex gap-6 mb-8">

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-300" size={18}/>
            <input
              placeholder="Search by name, host, or keyword..."
              className="w-full bg-[#240046] pl-14 pr-6 py-4 rounded-full outline-none border border-purple-900/40 focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          {/* Select */}
          <select className="bg-[#240046] px-6 py-4 rounded-full border border-purple-900/40 outline-none w-64 focus:ring-2 focus:ring-purple-500">
            <option>Privacy Type: All</option>
            <option>Public</option>
            <option>Private</option>
          </select>
        </div>

        <CommunityTable />

        <CommunityStats />

      </main>
    </div>
  );
}