import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
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
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">Community Management</h1>

            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium">
              {circles.length} Circles
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-400" size={18}/>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, host, or keyword..."
              className="w-full bg-[#240046]/40 pl-12 pr-6 py-3.5 rounded-full outline-none border border-purple-900/40 focus:ring-2 focus:ring-purple-500/50 transition placeholder:text-gray-500 text-sm"
            />
          </div>

          {/* Privacy Filter */}
          <div className="relative w-full lg:w-64">
            <select
              value={privacyFilter}
              onChange={(e) => setPrivacyFilter(e.target.value)}
              className="
                  w-full
                  appearance-none
                  bg-[#240046]/40
                  px-6 pr-12 py-3.5
                  rounded-full
                  border border-purple-500/30
                  text-purple-200
                  text-sm font-medium
                  outline-none
                  transition-all duration-200
                  hover:border-purple-400
                  focus:border-purple-400
                  focus:ring-2 focus:ring-purple-500/30
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

            <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-purple-400">
              <span className="text-[10px]">▼</span>
            </div>
          </div>
        </div>

        <div className="mb-10 overflow-x-auto rounded-[28px] border border-white/5 bg-[#240046]/20">
          <div className="min-w-[800px]">
            <CommunityTable 
              data={processedCircles} 
              loading={loading} 
              onToggleStatus={handleToggleStatus} 
              onViewReports={(id) => setViewReportItemId(id)} 
            />
          </div>
        </div>

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
      </div>
    </AdminLayout>
  );
}