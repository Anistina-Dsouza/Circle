import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import CommunityTable from "../components/DetailedCommunityTables";
import CommunityStats from "../components/CommunityStats";
import ViewReportsModal from "../components/ViewReportsModal";
import { Search, Filter, Layers, PlusCircle } from "lucide-react";
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
      <div className="max-w-7xl mx-auto px-2">
        {/* Header */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Layers size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/60">Community Matrix</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Circle Clusters</h1>
            <p className="text-white/40 text-xs sm:text-sm font-black uppercase tracking-[0.2em]">Manage platform community nodes and moderation</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative group flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-purple-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search Clusters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-white/10"
              />
            </div>

            <div className="relative flex-1 sm:flex-none">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={14} />
                <select
                  value={privacyFilter}
                  onChange={(e) => setPrivacyFilter(e.target.value)}
                  className="w-full sm:w-auto appearance-none bg-white/5 border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-[10px] font-black uppercase tracking-widest text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer hover:bg-white/10 transition-all"
                >
                  <option value="all">Privacy: All Nodes</option>
                  <option value="public">Privacy: Public</option>
                  <option value="private">Privacy: Private</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 text-[8px]">▼</div>
            </div>
          </div>
        </div>

        {/* Community Table Container */}
        <div className="mb-10">
          <CommunityTable 
            data={processedCircles} 
            loading={loading} 
            onToggleStatus={handleToggleStatus} 
            onViewReports={(id) => setViewReportItemId(id)} 
          />
        </div>

        {/* Section Divider */}
        <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 italic">Performance Telemetry</span>
            <div className="h-px flex-1 bg-white/5" />
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
