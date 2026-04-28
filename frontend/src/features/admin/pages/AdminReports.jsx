import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Loader2, Activity, Zap, Shield, Users, BarChart3, TrendingUp, AlertTriangle, Cpu, Globe, Trophy, Medal, MessageSquare, Video, UserPlus, Plus, Calendar, Hash, ChevronLeft, ChevronRight, Clock, Info, Sparkles, Filter, List, LayoutGrid, Target, MousePointer2 } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";

import GrowthTrends from "../components/GrowthTrends";
import CommunityEngagementGraph from "../components/CommunityEngagementGraph";

export default function AdminReports() {
    const [activeTab, setActiveTab] = useState("Velocity");
    const [stats, setStats] = useState(null);

    const [distributionData, setDistributionData] = useState(null);
    const [velocityData, setVelocityData] = useState(null);

    // Activity Pagination States
    const [activityData, setActivityData] = useState(null);
    const [userPage, setUserPage] = useState(1);
    const [circlePage, setCirclePage] = useState(1);
    const [meetingPage, setMeetingPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchReportsData = useCallback(async (tab, pages = { u: 1, c: 1, m: 1 }) => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const baseUrl = import.meta.env.VITE_API_URL || "";
            const headers = { Authorization: `Bearer ${token}` };

            if (tab === "Velocity") {
                const res = await axios.get(`${baseUrl}/api/admin/velocity`, { headers });
                setVelocityData(res.data.data);
            } else if (tab === "Distribution") {
                const res = await axios.get(`${baseUrl}/api/admin/distribution`, { headers });
                setDistributionData(res.data.data);
            } else if (tab === "Lifecycle") {
                const res = await axios.get(`${baseUrl}/api/admin/dashboard`, { headers });
                setStats(res.data.data);
            } else if (tab === "Safety") {
                const res = await axios.get(`${baseUrl}/api/admin/dashboard`, { headers });
                setStats(res.data.data);
            } else if (tab === "Activity") {
                const res = await axios.get(`${baseUrl}/api/admin/activity?userPage=${pages.u}&circlePage=${pages.c}&meetingPage=${pages.m}&limit=5`, { headers });
                setActivityData(res.data.data);
            }
        } catch (err) {
            console.error("Reports error:", err);
            setError("Failed to connect to reporting service. Retrying...");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReportsData(activeTab, { u: userPage, c: circlePage, m: meetingPage });

        let interval;
        if (activeTab === "Activity") {
            interval = setInterval(() => fetchReportsData("Activity", { u: userPage, c: circlePage, m: meetingPage }), 10000);
        }

        return () => clearInterval(interval);
    }, [activeTab, userPage, circlePage, meetingPage, fetchReportsData]);

    const tabs = [
        { id: "Velocity", icon: <Zap size={18} />, label: "Engagement", desc: "User Interaction" },
        { id: "Activity", icon: <MessageSquare size={18} />, label: "Audit Logs", desc: "System Logs" },
        { id: "Distribution", icon: <BarChart3 size={18} />, label: "Categories", desc: "Platform Spread" }
    ];

    return (
        <AdminLayout>
            {/* Header Section */}
            <div className="mb-14 relative">
                <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-10">
                    <div className="relative z-10 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                            <div className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-[0.2em]">
                                Platform Analytics
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3 leading-none uppercase">
                            Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Reports</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] max-w-lg mx-auto lg:mx-0">
                            Comprehensive analytics of community interactions and user engagement.
                        </p>
                    </div>

                    <div className="flex p-1 bg-[#1A0C3F]/20 backdrop-blur-xl rounded-2xl sm:rounded-[32px] border border-white/5 shadow-2xl overflow-x-auto no-scrollbar scroll-smooth mx-auto lg:mx-0 w-fit">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-col items-center gap-1 min-w-[70px] xs:min-w-[80px] sm:min-w-[100px] px-3 xs:px-4 sm:px-6 py-2 sm:py-4 rounded-xl sm:rounded-[24px] transition-all duration-700 group shrink-0 ${activeTab === tab.id
                                    ? "bg-gradient-to-br from-purple-600/90 to-fuchsia-800/90 text-white shadow-2xl shadow-purple-900/40 border border-white/10"
                                    : "text-white/20 hover:text-white/60 hover:bg-white/[0.03]"
                                    }`}
                            >
                                <div className={`transition-transform duration-500 ${activeTab === tab.id ? 'scale-110' : 'scale-100 group-hover:scale-110'}`}>
                                    {tab.icon && <tab.icon.type {...tab.icon.props} size={window.innerWidth < 640 ? 16 : 18} />}
                                    {!tab.icon.type && tab.icon}
                                </div>
                                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest mt-1">{tab.label}</span>
                                <span className={`text-[6px] sm:text-[7px] font-black uppercase tracking-tighter opacity-40 group-hover:opacity-100 ${activeTab === tab.id ? 'text-white' : 'text-gray-500'} hidden xs:block`}>
                                    {tab.desc}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-10 p-6 bg-red-900/10 border-l-4 border-red-500 rounded-r-2xl flex items-center gap-5 animate-pulse">
                    <div className="p-2.5 bg-red-500/20 rounded-xl text-red-500">
                        <AlertTriangle size={22} />
                    </div>
                    <div>
                        <h4 className="text-red-500 font-black uppercase tracking-widest text-[11px]">System Error</h4>
                        <p className="text-red-400/60 text-[9px] font-bold uppercase tracking-tight mt-1">{error}</p>
                    </div>
                </div>
            )}

            <div className="relative min-h-[600px]">
                {loading && !distributionData && !stats && !activityData && !velocityData ? (
                    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full border-2 border-purple-500/10 border-t-purple-500 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Cpu className="text-purple-400 animate-pulse" size={24} />
                            </div>
                        </div>
                        <span className="text-[10px] font-black text-purple-400/40 uppercase tracking-[0.4em] animate-pulse">Loading Reports...</span>
                    </div>
                ) : (
                    <div className="transition-all duration-1000 transform">

                        {activeTab === "Velocity" && <VelocityReport data={velocityData} />}
                        {activeTab === "Activity" && (
                            <ActivityReport
                                data={activityData}
                                pages={{ u: userPage, c: circlePage, m: meetingPage }}
                                setPages={{ u: setUserPage, c: setCirclePage, m: setMeetingPage }}
                            />
                        )}
                        {activeTab === "Distribution" && <DistributionReport data={distributionData} />}
                        {activeTab === "Lifecycle" && <LifecycleReport data={stats} />}
                        {activeTab === "Safety" && <SafetyReport data={stats} />}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}



function VelocityReport({ data }) {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const getIntensity = (day, hour) => {
        const found = data?.hourlySignal.find(s => s._id.day === (day === 0 ? 7 : day) && s._id.hour === hour);
        return found ? found.count : 0;
    };
    const maxIntensity = Math.max(...(data?.hourlySignal.map(s => s.count) || [1]), 1);

    return (
        <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-1000 pb-20">
            {/* KPI Row */}
            <div className="grid lg:grid-cols-3 gap-8">
                <PremiumMetric
                    label="Response Latency"
                    value={`${data?.avgLatency || 0}m`}
                    icon={<Clock size={20} />}
                    color="text-fuchsia-400"
                    glow="shadow-fuchsia-500/10"
                    desc="Avg Reply Time"
                />
                <PremiumMetric
                    label="Total Messages"
                    value={data?.platformVolume.toLocaleString()}
                    icon={<MessageSquare size={20} />}
                    color="text-purple-400"
                    glow="shadow-purple-500/10"
                    desc="7D Message Volume"
                />
                <PremiumMetric
                    label="Activity Velocity"
                    value={`${((data?.platformVolume / 10080) * 100).toFixed(1)}%`}
                    icon={<TrendingUp size={20} />}
                    color="text-emerald-400"
                    glow="shadow-emerald-500/10"
                    desc="Messages per Minute"
                />
            </div>

            {/* Peak Signal Heatmap */}
            <div className="bg-[#0F0529]/40 border border-white/5 rounded-[32px] sm:rounded-[48px] p-6 sm:p-12 flex flex-col relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="flex justify-between items-center mb-10 sm:mb-12">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Peak Signal Hours</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <Sparkles size={12} className="text-purple-400" />
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Interaction Heatmap</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar -mx-6 sm:mx-0 px-6 sm:px-0">
                    <div className="min-w-[700px] flex flex-col gap-4">
                        {days.map((day, dIdx) => (
                            <div key={day} className="flex items-center gap-6 group/row">
                                <span className="text-[10px] font-black text-white/30 uppercase w-10 transition-colors group-hover/row:text-purple-400">{day}</span>
                                <div className="flex-1 flex gap-2 sm:gap-2.5">
                                    {hours.map(hour => {
                                        const val = getIntensity(dIdx + 1, hour);
                                        const opacity = val === 0 ? 0.03 : (val / maxIntensity) * 0.8 + 0.2;
                                        return (
                                            <div
                                                key={hour}
                                                className="flex-1 h-10 sm:h-12 rounded-[6px] transition-all duration-700 relative group/cell hover:scale-110 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:z-20 border border-white/5 bg-purple-500/[0.02]"
                                                style={{ backgroundColor: `rgba(168, 85, 247, ${opacity})` }}
                                            >
                                                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/cell:opacity-100 transition-all pointer-events-none z-50">
                                                    <div className="bg-[#1A0C3F] border border-purple-500/40 text-[9px] font-black px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap text-white">
                                                        <span className="text-purple-400">{val}</span> MESSAGES @ {hour}:00
                                                    </div>
                                                    <div className="w-2 h-2 bg-[#1A0C3F] rotate-45 mx-auto -mt-1 border-r border-b border-purple-500/40" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <CommunityEngagementGraph data={data?.circleEngagement} />
        </div>
    );
}

function ActivityReport({ data, pages, setPages }) {
    const users = data?.users || [];
    const circles = data?.circles || [];
    const meetings = data?.meetings || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="grid lg:grid-cols-3 gap-8">

                {/* 1. PROFILE INITIALIZATIONS */}
                <ActivitySegment
                    title="Recent Users"
                    icon={<UserPlus size={20} />}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                    page={pages.u}
                    totalPages={pagination?.users?.totalPages}
                    onPageChange={setPages.u}
                >
                    {users.map((user, i) => (
                        <ActivityCard key={i} color="blue">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest px-1.5 py-0.5 bg-blue-500/10 rounded">User</span>
                                <span className="text-[8px] text-gray-600 font-bold">{new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white truncate">@{user.username}</h4>
                            <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${user.onlineStatus?.status === 'online' ? 'bg-green-500' : 'bg-gray-700'}`} />
                                    <span className="text-[8px] font-black text-gray-600 uppercase">Status: {user.onlineStatus?.status || 'offline'}</span>
                                </div>
                                <span className="text-[8px] font-black text-blue-400/60 uppercase">SUCCESS</span>
                            </div>
                        </ActivityCard>
                    ))}
                </ActivitySegment>

                {/* 2. COMMUNITY EXPANSION */}
                <ActivitySegment
                    title="Recent Communities"
                    icon={<Plus size={20} />}
                    color="text-purple-400"
                    bg="bg-purple-500/10"
                    page={pages.c}
                    totalPages={pagination?.circles?.totalPages}
                    onPageChange={setPages.c}
                >
                    {circles.map((circle, i) => (
                        <ActivityCard key={i} color="purple">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest px-1.5 py-0.5 bg-purple-500/10 rounded">Community</span>
                                <span className="text-[8px] text-gray-600 font-bold">{new Date(circle.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white truncate">{circle.name}</h4>
                            <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Users size={10} className="text-gray-600" />
                                    <span className="text-[8px] font-black text-gray-600 uppercase">{circle.stats?.memberCount || 0} Members</span>
                                </div>
                                <span className="text-[8px] font-black text-purple-400/60 uppercase">CREATED</span>
                            </div>
                        </ActivityCard>
                    ))}
                </ActivitySegment>

                {/* 3. MEETING RESONANCE */}
                <ActivitySegment
                    title="Recent Meetings"
                    icon={<Video size={20} />}
                    color="text-emerald-400"
                    bg="bg-emerald-500/10"
                    page={pages.m}
                    totalPages={pagination?.meetings?.totalPages}
                    onPageChange={setPages.m}
                >
                    {meetings.map((meeting, i) => (
                        <ActivityCard key={i} color="emerald">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest px-1.5 py-0.5 bg-emerald-500/10 rounded">Meeting</span>
                                <span className="text-[8px] text-gray-600 font-bold">{new Date(meeting.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white truncate">{meeting.title}</h4>
                            <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Activity size={10} className="text-gray-600" />
                                    <span className="text-[8px] font-black text-gray-600 uppercase">Room: {meeting.roomId?.substring(0, 8)}...</span>
                                </div>
                                <span className={`text-[8px] font-black uppercase ${meeting.status === 'live' ? 'text-green-400' : 'text-emerald-400/60'}`}>{meeting.status}</span>
                            </div>
                        </ActivityCard>
                    ))}
                </ActivitySegment>
            </div>
        </div>
    );
}

function ActivitySegment({ title, icon, color, bg, children, page, totalPages, onPageChange }) {
    return (
        <div className="bg-[#0F0529]/40 border border-white/5 rounded-[40px] p-8 flex flex-col h-full min-h-[600px] shadow-2xl relative group">
            <div className="absolute top-0 right-10 w-20 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 ${bg} rounded-xl ${color}`}>
                        {icon}
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{title}</h3>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => onPageChange(page - 1)}
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 disabled:opacity-0 hover:text-white transition-all"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <span className="text-[10px] font-black text-white/20 tabular-nums">{page}/{totalPages || 1}</span>
                    <button
                        disabled={page >= (totalPages || 1)}
                        onClick={() => onPageChange(page + 1)}
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 disabled:opacity-0 hover:text-white transition-all"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            <div className="space-y-4 flex-1">
                {children.length > 0 ? children : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-10 py-20">
                        <Activity size={32} className="mb-4" />
                        <span className="text-[8px] font-black uppercase tracking-widest">No activity found</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function ActivityCard({ children, color }) {
    return (
        <div className={`p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all group/card relative overflow-hidden`}>
            <div className={`absolute left-0 top-0 bottom-0 w-0.5 bg-${color}-500 opacity-0 group-hover/card:opacity-100 transition-opacity`} />
            {children}
        </div>
    );
}

function DistributionReport({ data }) {
    return (
        <div className="grid lg:grid-cols-2 gap-8 animate-in slide-in-from-right-10 duration-1000">
            <div className="bg-[#0F0529]/40 border border-white/5 rounded-[40px] p-10">
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
                        <BarChart3 size={20} />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Category Distribution</h3>
                </div>

                <div className="space-y-8">
                    {data?.distribution.map((cat, i) => {
                        const maxMembers = Math.max(...data.distribution.map(d => d.totalMembers), 1);
                        const percent = (cat.totalMembers / maxMembers) * 100;
                        return (
                            <div key={i} className="group/cat">
                                <div className="flex justify-between items-end mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={`w-1 h-1 rounded-full ${cat.circleCount > 0 ? 'bg-purple-500' : 'bg-gray-700'}`} />
                                            <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">{cat._id}</span>
                                        </div>
                                        <h4 className="text-sm font-black text-white/90 lowercase leading-none">{cat.circleCount} communities</h4>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-black text-white tabular-nums leading-none tracking-tighter">{cat.totalMembers.toLocaleString()}</span>
                                        <p className="text-[8px] text-gray-500 uppercase tracking-widest font-black mt-0.5">Total Members</p>
                                    </div>
                                </div>
                                <div className="h-2.5 w-full bg-white/[0.02] rounded-full overflow-hidden border border-white/5 shadow-inner">
                                    <div
                                        className={`h-full bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-400 transition-all duration-1000 relative group-hover/cat:scale-y-110 ${cat.circleCount === 0 ? 'opacity-10' : 'opacity-100 shadow-[0_0_15px_rgba(168,85,247,0.3)]'}`}
                                        style={{ width: `${Math.max(percent, cat.circleCount > 0 ? 5 : 0)}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/10 animate-pulse opacity-0 group-hover/cat:opacity-100" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-[#0F0529]/40 border border-white/5 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 relative overflow-hidden">
                <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-fuchsia-500/5 rounded-full blur-[60px] pointer-events-none" />
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-2.5 bg-fuchsia-500/10 rounded-xl text-fuchsia-400">
                        <TrendingUp size={20} />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Top Performers</h3>
                </div>

                <div className="space-y-5">
                    {data?.topCircles.map((circle, i) => (
                        <div key={i} className="flex items-center gap-3 sm:gap-5 p-3 sm:p-4 rounded-[20px] sm:rounded-[24px] bg-white/[0.01] border border-white/5 hover:border-purple-500/30 transition-all duration-500 group relative">
                            <div className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[10px] sm:text-[11px] font-black border-2 border-[#0F0529] shadow-lg transition-transform group-hover:scale-110 ${i === 0 ? 'bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 text-[#1A0C3F]' :
                                i === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-[#1A0C3F]' :
                                    i === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                                        'bg-[#1A1140] text-purple-400'
                                }`}>
                                {i === 0 ? <Trophy size={12} /> : i + 1}
                            </div>

                            <div className="relative shrink-0">
                                <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-[14px] sm:rounded-[20px] overflow-hidden border border-white/10 group-hover:border-purple-500/50 transition-colors">
                                    <img src={circle.profilePic} alt={circle.name} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                                    <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-green-500 border-2 border-[#0F0529] shadow-[0_0_5px_#22c55e]" />
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-black text-white tracking-tight leading-none truncate max-w-[120px]">{circle.name}</h4>
                                    <div className="px-1.5 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[7px] font-black text-purple-400 uppercase">LVL 0{5 - i}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-black text-purple-400/60 uppercase tracking-widest">{circle.category}</span>
                                    <div className="w-0.5 h-0.5 rounded-full bg-white/10" />
                                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">{circle.stats.messageCount.toLocaleString()} messages</span>
                                </div>
                            </div>

                            <div className="text-right shrink-0">
                                <div className="flex items-center justify-end gap-1 text-white">
                                    <Users size={window.innerWidth < 640 ? 8 : 10} className="text-purple-500" />
                                    <span className="text-sm sm:text-lg font-black tabular-nums leading-none tracking-tighter">{circle.stats.memberCount}</span>
                                </div>
                                <p className="text-[6px] sm:text-[7px] text-gray-600 font-black uppercase tracking-widest mt-1">Growth</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function LifecycleReport({ data }) {
    return (
        <div className="animate-in zoom-in-95 duration-1000">
            <div className="bg-[#0F0529]/40 border border-white/5 rounded-[40px] p-10">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Growth Lifecycle Analytics</h3>
                    <div className="text-[9px] font-black text-purple-400 uppercase tracking-[0.3em]">Platform growth stats</div>
                </div>
                <GrowthTrends trends={data?.trends} hideDistribution={true} />
            </div>
        </div>
    );
}

function SafetyReport({ data }) {
    const stats = data?.stats;
    const latestReports = data?.latestReports;

    return (
        <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in duration-1000">
            <div className="bg-[#0F0529]/40 border border-white/5 rounded-[40px] p-12 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
                <div className="absolute -top-16 -left-16 w-56 h-56 bg-red-600/10 rounded-full blur-[70px]" />
                <div className={`p-8 rounded-[32px] bg-red-500/10 text-red-500 mb-8 border border-red-500/20 shadow-2xl relative z-10 ${stats?.flaggedItems > 10 ? 'animate-pulse' : ''}`}>
                    <Shield size={56} />
                </div>
                <h3 className="text-6xl font-black text-white mb-3 tracking-tighter leading-none">{stats?.flaggedItems}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-[0.3em] font-black">Active Flagged Items</p>
                <div className="mt-12 w-full pt-8 border-t border-white/5">
                    <div className={`text-[11px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full ${stats?.flaggedItems > 10 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${stats?.flaggedItems > 10 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                        Platform Integrity: {stats?.flaggedItems > 10 ? 'Critical' : 'Stable'}
                    </div>
                </div>
            </div>

            <div className="bg-[#0F0529]/40 border border-white/5 rounded-[40px] p-10 flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                        <AlertTriangle size={18} />
                    </div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Latest Incidents</h4>
                </div>

                <div className="space-y-4 flex-1">
                    {latestReports && latestReports.length > 0 ? (
                        latestReports.map((report, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest px-2 py-0.5 bg-purple-500/10 rounded-md">
                                        {report.reportedItemType}
                                    </span>
                                    <span className="text-[8px] text-gray-600 font-bold uppercase">{new Date(report.createdAt).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-xs text-white/80 font-medium line-clamp-1">{report.reason}</p>
                                <div className="mt-3 flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-gray-800 border border-white/10" />
                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Reporter: {report.reporter?.username || 'Anonymous'}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-white/[0.02] border-dashed rounded-3xl p-10">
                            <Shield className="text-gray-800 mb-4 opacity-20" size={32} />
                            <span className="text-[9px] text-gray-700 font-black uppercase tracking-[0.3em]">No pending incidents detected</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function PremiumMetric({ label, value, icon, color, glow, desc }) {
    return (
        <div className={`bg-[#1A0C3F]/40 backdrop-blur-2xl border border-white/5 rounded-[32px] p-8 transition-all duration-500 hover:border-purple-500/40 hover:-translate-y-1.5 group shadow-2xl ${glow}`}>
            <div className={`p-3.5 rounded-xl bg-white/5 mb-6 w-fit ${color} group-hover:scale-110 transition-all duration-500 shadow-xl`}>
                {icon}
            </div>
            <div className="space-y-1.5">
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">{label}</p>
                <h3 className="text-4xl font-black text-white tracking-tighter leading-none lowercase">{value}</h3>
                <div className="flex items-center gap-2 pt-1.5">
                    <div className={`w-0.5 h-0.5 rounded-full ${color} opacity-40`} />
                    <p className="text-[7px] text-gray-600 font-black uppercase tracking-widest">{desc}</p>
                </div>
            </div>
        </div>
    );
}
