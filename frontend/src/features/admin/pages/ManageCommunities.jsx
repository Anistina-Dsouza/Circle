import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CommunityTable from "../components/DetailedCommunityTables";
import CommunityStats from "../components/CommunityStats";
import ViewReportsModal from "../components/ViewReportsModal";
import { Search } from "lucide-react";
import axios from "axios";

export default function ManageCommunities() {
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [privacyFilter, setPrivacyFilter] = useState("all");
  const [dashboardStats, setDashboardStats] = useState(null);
  const [viewReportItemId, setViewReportItemId] = useState(null);

  const fetchCircles = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      
      const [circlesRes, statsRes] = await Promise.all([
        axios.get(`${baseUrl}/api/admin/circles`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`${baseUrl}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (circlesRes.data.success) {
        setCircles(circlesRes.data.data);
      }
      if (statsRes.data.success) {
        setDashboardStats(statsRes.data.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch communities', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCircles();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      await axios.put(`${baseUrl}/api/admin/circles/${id}/status`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchCircles();
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
      fetchCircles();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to dismiss reports');
    }
  };

  // Compute filtered circles
  const processedCircles = circles.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (c.creator?.displayName || c.creator?.username || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrivacy = privacyFilter === "all" || c.type === privacyFilter;
    return matchesSearch && matchesPrivacy;
  });

  const newCirclesCount = circles.filter(c => {
     const oneDay = 24 * 60 * 60 * 1000;
     return (new Date() - new Date(c.createdAt)) < oneDay;
  }).length;
  
  const avgMembers = circles.length > 0
    ? (circles.reduce((acc, c) => acc + (c.stats?.memberCount || 0), 0) / circles.length).toFixed(1)
    : "0";

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
              {circles.length} Circles
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-6 mb-8">

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-300" size={18}/>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, host, or keyword..."
              className="w-full bg-[#240046] pl-14 pr-6 py-4 rounded-full outline-none border border-purple-900/40 focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          {/* Select */}
          {/* <select className="bg-[#240046] px-6 py-4 rounded-full border border-purple-900/40 outline-none w-64 focus:ring-2 focus:ring-purple-500">
            <option>Privacy Type: All</option>
            <option>Public</option>
            <option>Private</option>
          </select> */}

            <div className="relative w-64">

            <select
            value={privacyFilter}
            onChange={(e) => setPrivacyFilter(e.target.value)}
            className="
                w-full
                appearance-none
                bg-[#240046]
                px-6 pr-12 py-4
                rounded-full
                border border-purple-500/30
                text-purple-200
                text-sm font-medium
                outline-none
                transition-all duration-200
                hover:border-purple-400
                focus:border-purple-400
                focus:ring-2 focus:ring-purple-500/30
                shadow-md shadow-purple-900/20
                cursor-pointer
            "
            >
            <option value="all" className="bg-[#1a0033] text-purple-200">
                Privacy Type: All
            </option>
            <option value="public" className="bg-[#1a0033] text-purple-200">
                Public
            </option>
            <option value="private" className="bg-[#1a0033] text-purple-200">
                Private
            </option>
            </select>

            {/* Custom Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-purple-400">
            ▼
            </div>

            </div>

        </div>

        <CommunityTable data={processedCircles} loading={loading} onToggleStatus={handleToggleStatus} onViewReports={(id) => setViewReportItemId(id)} />

        <CommunityStats 
            newCircles={newCirclesCount} 
            engagement={avgMembers} 
            reportedItems={dashboardStats?.flaggedItems || 0} 
        />

        <ViewReportsModal
            isOpen={!!viewReportItemId}
            onClose={() => setViewReportItemId(null)}
            itemId={viewReportItemId}
            itemType="Circle"
            onDismiss={handleDismiss}
        />

      </main>
    </div>
  );
}