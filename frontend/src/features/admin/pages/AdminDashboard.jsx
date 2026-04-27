import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Activity, ShieldCheck, Database, Globe } from "lucide-react";

import AdminLayout from "../layouts/AdminLayout";
import KPICard from "../components/KPICard";
import LatestRegistrations from "../components/LatestRegistrations";
import CirclesTable from "../components/CirclesTable";
import NetworkChart from "../components/NetworkChart";
import GrowthTrends from "../components/GrowthTrends";

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("token");
            const baseUrl = import.meta.env.VITE_API_URL || "";
            
            const response = await axios.get(`${baseUrl}/api/admin/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setData(response.data.data);
                setLastUpdated(new Date());
            }
        } catch (err) {
            console.error("Dashboard error:", err);
            setError(err.response?.data?.message || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        // Implement Auto-Polling for Dynamic System Pulse (Every 30s)
        const refreshInterval = setInterval(fetchDashboardData, 30000);
        
        return () => clearInterval(refreshInterval);
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex flex-col h-[70vh] w-full items-center justify-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Activity size={24} className="text-purple-400 animate-pulse" />
                        </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Loading Dashboard...</span>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="max-w-2xl mx-auto p-10 bg-red-500/5 border border-red-500/20 rounded-[32px] text-center shadow-2xl">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Dashboard Error</h2>
                    <p className="text-white/40 text-sm font-medium mb-8 leading-relaxed">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all border border-white/10"
                    >
                        Retry Authorization
                    </button>
                </div>
            </AdminLayout>
        );
    }

    const stats = data?.stats || { totalUsers: 0, totalCircles: 0, activeUsers: 0, flaggedItems: 0 };
    const trends = data?.trends || { registrations: [], categories: [], hourly: [] };
    const latestUsers = data?.latestUsers || [];
    const latestCircles = data?.latestCircles || [];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto px-2">
                {/* Premium Dashboard Header */}
                <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-400/80">System Live • Stable</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tighter">Dashboard</h1>
                        <p className="text-white/40 text-xs sm:text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                            <Database size={14} className="text-purple-500" />
                            Overview and Statistics
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-white/[0.03] backdrop-blur-md border border-white/5 p-4 sm:p-5 rounded-[24px] sm:rounded-[32px] group hover:border-white/10 transition-all">
                        <div className="flex flex-col">
                             <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Last Updated</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white tabular-nums">
                                    {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                                <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 animate-[progress_30s_linear_infinite]" />
                                </div>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-white/5 hidden sm:block" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Environment</span>
                            <div className="flex items-center gap-2 text-purple-400">
                                <Globe size={14} />
                                <span className="text-xs font-black uppercase">Production</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
                    <KPICard value={stats.totalUsers.toLocaleString()} label="Users" badge="Total" />
                    <KPICard value={stats.totalCircles.toLocaleString()} label="Circles" badge="Communities" />
                    <KPICard value={stats.activeUsers.toLocaleString()} label="Active" badge="Online" />
                    <KPICard value={stats.flaggedItems.toLocaleString()} label="Flagged" badge={stats.flaggedItems > 0 ? "Review" : "Clean"} />
                </div>

                {/* Data Section Divider */}
                <div className="flex items-center gap-6 mb-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap italic">Recent Activity</span>
                    <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
                    <LatestRegistrations users={latestUsers} />
                    <CirclesTable circles={latestCircles} />
                </div>

                {/* Analytics Section Divider */}
                <div className="flex items-center gap-6 mb-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap italic">Analytics</span>
                    <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                {/* Full Width Visuals */}
                <div className="space-y-12">
                    <NetworkChart 
                        registrationTrends={trends.registrations} 
                        hourlyTrends={trends.hourly}
                    />
                    <GrowthTrends trends={trends} />
                </div>
            </div>
        </AdminLayout>
    )
}