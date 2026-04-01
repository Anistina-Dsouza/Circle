import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

import AdminLayout from "../layouts/AdminLayout";
import KPICard from "../components/KPICard";
import LatestRegistrations from "../components/LatestRegistrations";
import CirclesTable from "../components/CirclesTable";
import NetworkChart from "../components/NetworkChart";

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("token");
                const baseUrl = import.meta.env.VITE_API_URL || "";
                
                const response = await axios.get(`${baseUrl}/api/admin/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (err) {
                console.error("Dashboard error:", err);
                setError(err.response?.data?.message || "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex h-[80vh] w-full items-center justify-center">
                    <Loader2 size={40} className="animate-spin text-purple-500" />
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="p-6 bg-red-900/20 text-red-400 border border-red-900/50 rounded-[28px]">
                    <h2 className="text-xl font-bold mb-2">Notice</h2>
                    <p>{error}</p>
                </div>
            </AdminLayout>
        );
    }

    // Safely fallback to 0 if data gracefully handles errors
    const stats = data?.stats || { totalUsers: 0, totalCircles: 0, activeUsers: 0, flaggedItems: 0 };
    const latestUsers = data?.latestUsers || [];
    const latestCircles = data?.latestCircles || [];

    return (
        <AdminLayout>

            <div className="grid grid-cols-4 gap-6 mb-10">
                <KPICard value={stats.totalUsers.toLocaleString()} label="Users" />
                <KPICard value={stats.totalCircles.toLocaleString()} label="Circles" />
                <KPICard value={stats.activeUsers.toLocaleString()} label="Active" />
                <KPICard value={stats.flaggedItems.toLocaleString()} label="Flagged" badge={stats.flaggedItems > 0 ? "Review" : "Good"} />
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <LatestRegistrations users={latestUsers} />
                <CirclesTable circles={latestCircles} />
            </div>

            <NetworkChart />

        </AdminLayout>
    )
}