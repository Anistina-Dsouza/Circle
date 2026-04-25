import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Loader2, Activity, Zap, Shield, Users, BarChart3, TrendingUp, AlertTriangle, Cpu, Globe, Trophy, Medal, MessageSquare, Video, UserPlus, Plus, Calendar, Hash, ChevronLeft, ChevronRight, Clock, Info, Sparkles, Filter, List, LayoutGrid, Target, MousePointer2, Flare } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";
import NetworkChart from "../components/NetworkChart";
import GrowthTrends from "../components/GrowthTrends";

export default function AdminReports() {
    const [activeTab, setActiveTab] = useState("Resonance");
    const [stats, setStats] = useState(null);
    const [resonanceData, setResonanceData] = useState([]);
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

            if (tab === "Resonance") {
                const [statsRes, resRes] = await Promise.all([
                    axios.get(`${baseUrl}/api/admin/dashboard`, { headers }),
                    axios.get(`${baseUrl}/api/admin/resonance/detailed`, { headers })
                ]);
                setStats(statsRes.data.data.stats);
                setResonanceData(resRes.data.data);
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
            } else if (tab === "Velocity") {
                const res = await axios.get(`${baseUrl}/api/admin/velocity`, { headers });
                setVelocityData(res.data.data);
            }
        } catch (err) {
            console.error("Reports error:", err);
            setError("Tactical intelligence link failed. Attempting to reconnect...");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReportsData(activeTab, { u: userPage, c: circlePage, m: meetingPage });

        let interval;
        if (activeTab === "Resonance") {
            interval = setInterval(() => fetchReportsData("Resonance"), 15000);
        } else if (activeTab === "Activity") {
            interval = setInterval(() => fetchReportsData("Activity", { u: userPage, c: circlePage, m: meetingPage }), 10000);
        }

        return () => clearInterval(interval);
    }, [activeTab, userPage, circlePage, meetingPage, fetchReportsData]);

    const tabs = [
        { id: "Resonance", icon: <Activity size={18} />, label: "Resonance", desc: "Live Flux" },
        { id: "Velocity", icon: <Zap size={18} />, label: "Velocity", desc: "Engagement" },
        { id: "Activity", icon: <MessageSquare size={18} />, label: "Activity", desc: "Audit Logs" },
        { id: "Distribution", icon: <BarChart3 size={18} />, label: "Distribution", desc: "Niche Audit" }
    ];

    return (
        <AdminLayout>
            {/* Header Section */}
            <div className="mb-14 relative">
                <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-[0.2em]">
                                Intelligence Suite v6.0
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-3 leading-none uppercase">
                            Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Intelligence</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] max-w-lg">
                            Neural auditing of community nodes and conversational engagement vectors.
                        </p>
                    </div>

                    <div className="flex p-1.5 bg-[#1A0C3F]/20 backdrop-blur-xl rounded-[32px] border border-white/5 shadow-2xl overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-col items-center gap-1 min-w-[100px] px-6 py-4 rounded-[24px] transition-all duration-700 group ${activeTab === tab.id
                                        ? "bg-gradient-to-br from-purple-600/90 to-fuchsia-800/90 text-white shadow-2xl shadow-purple-900/40 border border-white/10"
                                        : "text-white/20 hover:text-white/60 hover:bg-white/[0.03]"
                                    }`}
                            >
                                <div className={`transition-transform duration-500 ${activeTab === tab.id ? 'scale-110' : 'scale-100 group-hover:scale-110'}`}>
                                    {tab.icon}
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest mt-1">{tab.label}</span>
                                <span className={`text-[7px] font-black uppercase tracking-tighter opacity-40 group-hover:opacity-100 ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`}>
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
                        <h4 className="text-red-500 font-black uppercase tracking-widest text-[11px]">Anomaly Detected</h4>
                        <p className="text-red-400/60 text-[9px] font-bold uppercase tracking-tight mt-1">{error}</p>
                    </div>
                </div>
            )}

            <div className="relative min-h-[600px]">
                {loading && !resonanceData.length && !distributionData && !stats && !activityData && !velocityData ? (
                    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full border-2 border-purple-500/10 border-t-purple-500 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Cpu className="text-purple-400 animate-pulse" size={24} />
                            </div>
                        </div>
                        <span className="text-[10px] font-black text-purple-400/40 uppercase tracking-[0.4em] animate-pulse">Syncing Intelligence...</span>
                    </div>
                ) : (
                    <div className="transition-all duration-1000 transform">
                        {activeTab === "Resonance" && <ResonanceReport stats={stats} resonanceData={resonanceData} />}
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

function ResonanceReport({ stats, resonanceData }) {
    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PremiumMetric
                    label="Active Load"
                    value={`${((stats?.activeUsers / (stats?.totalUsers || 1)) * 100).toFixed(1)}%`}
                    icon={<Zap size={20} />}
                    color="text-amber-400"
                    glow="shadow-amber-500/10"
                    desc="Participation Density"
                />
                <PremiumMetric
                    label="Platform Nodes"
                    value={stats?.totalUsers.toLocaleString()}
                    icon={<Users size={20} />}
                    color="text-purple-400"
                    glow="shadow-purple-500/10"
                    desc="Global Context Scale"
                />
                <PremiumMetric
                    label="Pulse Freq"
                    value={resonanceData[resonanceData.length - 1]?.count || 0}
                    icon={<Activity size={20} />}
                    color="text-emerald-400"
                    glow="shadow-emerald-500/10"
                    desc="15m Interaction Delta"
                />
            </div>

            <div className="bg-[#0F0529]/40 border border-white/5 rounded-[40px] p-10 relative overflow-hidden group shadow-inner">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Interaction Resonance</h3>
                        <div className="flex items-center gap-2">
                            <Globe size={12} className="text-purple-400/60" />
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">Real-time audit across all node clusters</p>
                        </div>
                    </div>
                    <div className="px-4 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Active Stream</span>
                    </div>
                </div>
                <div className="h-[400px]">
                    <NetworkChart hourlyTrends={resonanceData} isDetailed={true} />
                </div>
            </div>
        </div>
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
                    desc="Avg Reply Interval"
                />
                <PremiumMetric
                    label="Conversational Load"
                    value={data?.platformVolume.toLocaleString()}
                    icon={<MessageSquare size={20} />}
                    color="text-purple-400"
                    glow="shadow-purple-500/10"
                    desc="7D Signal Volume"
                />
                <PremiumMetric
                    label="Activity Velocity"
                    value={`${((data?.platformVolume / 10080) * 100).toFixed(1)}%`}
                    icon={<TrendingUp size={20} />}
                    color="text-emerald-400"
                    glow="shadow-emerald-500/10"
                    desc="Signals per Minute"
                />
            </div>

            {/* Peak Signal Heatmap */}
            <div className="bg-[#0F0529]/40 border border-white/5 rounded-[48px] p-12 flex flex-col relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Peak Signal Hours</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <Sparkles size={12} className="text-purple-400" />
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Neural Traffic Intensity Map</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-3">
                    {days.map((day, dIdx) => (
                        <div key={day} className="flex items-center gap-6 group/row">
                            <span className="text-[10px] font-black text-white/30 uppercase w-10 transition-colors group-hover/row:text-purple-400">{day}</span>
                            <div className="flex-1 flex gap-2">
                                {hours.map(hour => {
                                    const val = getIntensity(dIdx + 1, hour);
                                    const opacity = (val / maxIntensity) * 0.9 + 0.1;
                                    return (
                                        <div
                                            key={hour}
                                            className="flex-1 h-8 rounded-[4px] transition-all duration-700 relative group/cell hover:scale-110 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:z-20"
                                            style={{ backgroundColor: `rgba(168, 85, 247, ${opacity})` }}
                                        >
                                            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/cell:opacity-100 transition-all pointer-events-none z-50">
                                                <div className="bg-[#1A0C3F] border border-purple-500/40 text-[9px] font-black px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap text-white">
                                                    <span className="text-purple-400">{val}</span> SIGNALS @ {hour}:00
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

            {/* Immersive Engagement Depth - High Precision Spatial Mapping */}
            <div className="bg-[#0F0529]/40 border border-white/5 rounded-[56px] p-20 flex flex-col relative overflow-hidden shadow-2xl group min-h-[700px]">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-fuchsia-600/5 pointer-events-none" />

                {/* Neural Pulse Scanline Effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent absolute top-0 animate-scanline" />
                </div>

                <div className="flex justify-between items-end mb-20 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-purple-500/10 rounded-2xl text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                <Target size={24} className="animate-pulse" />
                            </div>
                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Engagement Depth</h3>
                        </div>
                        <p className="text-[12px] text-gray-500 font-black uppercase tracking-[0.3em] ml-1">Spatial Node Interaction Matrix v2.2</p>
                    </div>
                    <div className="flex items-center gap-14 px-10 py-5 bg-[#1A0C3F]/40 backdrop-blur-2xl border border-white/5 rounded-[32px] shadow-2xl">
                        <div className="text-center">
                            <span className="text-3xl font-black text-white tabular-nums drop-shadow-lg">20</span>
                            <p className="text-[8px] text-purple-400 font-black uppercase tracking-[0.3em] mt-1.5">Audit Population</p>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div className="text-center">
                            <span className="text-3xl font-black text-white tabular-nums drop-shadow-lg">{data?.platformVolume.toLocaleString()}</span>
                            <p className="text-[8px] text-purple-400 font-black uppercase tracking-[0.3em] mt-1.5">Gross Signal Flux</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative ml-10 mb-10">
                    {/* Dynamic Axis Labels */}
                    <div className="absolute -left-16 bottom-0 top-0 flex flex-col justify-between py-10 items-end pr-8">
                        <div className="flex flex-col items-end gap-1.5 group/axis">
                            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest group-hover/axis:scale-110 transition-transform">High Velocity</span>
                            <span className="text-[7px] text-white/20 uppercase font-black">Signal Peak</span>
                        </div>
                        <div className="w-1.5 h-32 bg-gradient-to-b from-purple-500/40 via-purple-500/10 to-transparent rounded-full shadow-[0_0_10px_rgba(168,85,247,0.1)]" />
                        <div className="flex flex-col items-end gap-1.5">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Low Velocity</span>
                            <span className="text-[7px] text-white/10 uppercase font-black">Latency Base</span>
                        </div>
                    </div>

                    <div className="absolute left-0 right-0 -bottom-16 flex justify-between px-10">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Micro Footprint</span>
                            <span className="text-[7px] text-white/10 uppercase font-black">Sparse Nodes</span>
                        </div>
                        <div className="h-1.5 w-64 bg-gradient-to-r from-transparent via-purple-500/10 to-purple-500/40 rounded-full mt-5 shadow-[0_0_10px_rgba(168,85,247,0.1)]" />
                        <div className="flex flex-col items-end gap-1.5 group/axis">
                            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest group-hover/axis:scale-110 transition-transform">Global Scale</span>
                            <span className="text-[7px] text-white/20 uppercase font-black">Mass Population</span>
                        </div>
                    </div>

                    {/* Matrix Viewport */}
                    <div className="absolute inset-0 border-l-2 border-b-2 border-white/10 rounded-bl-[40px]">
                        {/* Spatial Bubbles with Precision Arrow Tooltips */}
                        {data?.circleEngagement.map((circle, i) => {
                            const maxMsg = Math.max(...data.circleEngagement.map(c => c.stats.messageCount), 1);
                            const maxMem = Math.max(...data.circleEngagement.map(c => c.stats.memberCount), 1);
                            const bottom = (circle.stats.messageCount / maxMsg) * 80 + 10;
                            const left = (circle.stats.memberCount / maxMem) * 80 + 10;
                            const size = Math.max((circle.stats.messageCount / maxMsg) * 70 + 25, 30);
                            const efficiency = (circle.stats.messageCount / (circle.stats.memberCount || 1)).toFixed(1);

                            const showBelow = bottom > 70;
                            const showLeft = left > 75;

                            return (
                                <div
                                    key={i}
                                    className="absolute rounded-full transition-all duration-1000 hover:z-[100] cursor-crosshair group/bubble shadow-2xl flex items-center justify-center"
                                    style={{
                                        bottom: `${bottom}%`,
                                        left: `${left}%`,
                                        width: `${size}px`,
                                        height: `${size}px`,
                                        background: `radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.8), rgba(124, 58, 237, 0.2))`,
                                        border: `2.5px solid rgba(192, 132, 252, 0.5)`,
                                        boxShadow: `0 0 50px rgba(168, 85, 247, 0.2), inset 0 0 25px rgba(255,255,255,0.1)`,
                                        animation: `pulse-slow ${5 + i % 4}s infinite alternate ease-in-out`
                                    }}
                                >
                                    <span className="text-[9px] font-black text-white/60 group-hover/bubble:text-white transition-colors">{i + 1}</span>

                                    {/* High-Precision Beacon Tooltip */}
                                    <div className={`absolute ${showBelow ? 'top-full mt-8' : 'bottom-full mb-8'} ${showLeft ? 'right-0' : 'left-1/2 -translate-x-1/2'} opacity-0 group-hover/bubble:opacity-100 transition-all duration-500 pointer-events-none w-80 z-[150]`}>
                                        <div className={`relative bg-[#0A051E]/98 backdrop-blur-3xl border-2 border-purple-500/40 p-8 rounded-[40px] shadow-[0_40px_120px_rgba(0,0,0,1)] transform ${showBelow ? 'translate-y-4 group-hover/bubble:translate-y-0' : '-translate-y-4 group-hover/bubble:translate-y-0'}`}>

                                            {/* Refined Arrow - Precision Beacon */}
                                            <div className={`absolute ${showBelow ? '-top-3' : '-bottom-3'} left-1/2 -translate-x-1/2 w-6 h-6 rotate-45 bg-[#0A051E] border-2 border-purple-500/40 ${showBelow ? 'border-r-0 border-b-0' : 'border-l-0 border-t-0'} shadow-[0_0_30px_rgba(168,85,247,0.3)]`} />

                                            <div className="flex items-center justify-between mb-8 relative z-10">
                                                <div>
                                                    <h5 className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-2">{circle.name}</h5>
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                                                        <span className="text-[11px] text-purple-400 font-black uppercase tracking-[0.2em]">{circle.category}</span>
                                                    </div>
                                                </div>
                                                <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500/20 to-fuchsia-600/20 rounded-[24px] flex items-center justify-center border-2 border-purple-500/30 shadow-lg">
                                                    <span className="text-lg font-black text-purple-400">#{i + 1}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-5 mb-8 relative z-10">
                                                <div className="p-5 rounded-[28px] bg-white/[0.03] border border-white/5 group-hover/bubble:border-purple-500/20 transition-all duration-500">
                                                    <span className="text-[10px] text-gray-500 font-black uppercase block mb-2 tracking-widest">Signals DB</span>
                                                    <span className="text-2xl font-black text-white tabular-nums leading-none tracking-tighter">{circle.stats.messageCount.toLocaleString()}</span>
                                                </div>
                                                <div className="p-5 rounded-[28px] bg-white/[0.03] border border-white/5 group-hover/bubble:border-purple-500/20 transition-all duration-500">
                                                    <span className="text-[10px] text-gray-500 font-black uppercase block mb-2 tracking-widest">Nodes DB</span>
                                                    <span className="text-2xl font-black text-white tabular-nums leading-none tracking-tighter">{circle.stats.memberCount.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="p-6 rounded-[32px] bg-gradient-to-r from-purple-600/30 to-fuchsia-600/30 border-2 border-purple-500/40 flex items-center justify-between shadow-[0_10px_30px_rgba(168,85,247,0.1)] relative z-10 overflow-hidden">
                                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/5 to-transparent animate-pulse" />
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <Zap size={22} className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                                                    <span className="text-[12px] font-black text-white uppercase tracking-widest">Efficiency Index</span>
                                                </div>
                                                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 relative z-10 drop-shadow-xl">{efficiency}x</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* High-Fidelity Tactical Matrix */}
                        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-[0.04] pointer-events-none">
                            {Array.from({ length: 100 }).map((_, i) => (<div key={i} className="border border-white/80" />))}
                        </div>
                    </div>
                </div>
            </div>
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
                    title="Profile Sync"
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
                                <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest px-1.5 py-0.5 bg-blue-500/10 rounded">User Node</span>
                                <span className="text-[8px] text-gray-600 font-bold">{new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white truncate">@{user.username}</h4>
                            <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${user.onlineStatus?.status === 'online' ? 'bg-green-500' : 'bg-gray-700'}`} />
                                    <span className="text-[8px] font-black text-gray-600 uppercase">Status: {user.onlineStatus?.status || 'offline'}</span>
                                </div>
                                <span className="text-[8px] font-black text-blue-400/60 uppercase">INIT SUCCESS</span>
                            </div>
                        </ActivityCard>
                    ))}
                </ActivitySegment>

                {/* 2. COMMUNITY EXPANSION */}
                <ActivitySegment
                    title="Community Expansion"
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
                                <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest px-1.5 py-0.5 bg-purple-500/10 rounded">Circle Cluster</span>
                                <span className="text-[8px] text-gray-600 font-bold">{new Date(circle.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white truncate">{circle.name}</h4>
                            <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Users size={10} className="text-gray-600" />
                                    <span className="text-[8px] font-black text-gray-600 uppercase">{circle.stats?.memberCount || 0} Nodes</span>
                                </div>
                                <span className="text-[8px] font-black text-purple-400/60 uppercase">SEED COMPLETE</span>
                            </div>
                        </ActivityCard>
                    ))}
                </ActivitySegment>

                {/* 3. MEETING RESONANCE */}
                <ActivitySegment
                    title="Meeting Resonance"
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
                                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest px-1.5 py-0.5 bg-emerald-500/10 rounded">Sync Event</span>
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
                        <span className="text-[8px] font-black uppercase tracking-widest">No telemetry found</span>
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
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Niche Saturation</h3>
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

            <div className="bg-[#0F0529]/40 border border-white/5 rounded-[40px] p-10 relative overflow-hidden">
                <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-fuchsia-500/5 rounded-full blur-[60px] pointer-events-none" />
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-2.5 bg-fuchsia-500/10 rounded-xl text-fuchsia-400">
                        <TrendingUp size={20} />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Top Performers</h3>
                </div>

                <div className="space-y-5">
                    {data?.topCircles.map((circle, i) => (
                        <div key={i} className="flex items-center gap-5 p-4 rounded-[24px] bg-white/[0.01] border border-white/5 hover:border-purple-500/30 transition-all duration-500 group relative">
                            <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black border-2 border-[#0F0529] shadow-lg transition-transform group-hover:scale-110 ${i === 0 ? 'bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 text-[#1A0C3F]' :
                                    i === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-[#1A0C3F]' :
                                        i === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                                            'bg-[#1A1140] text-purple-400'
                                }`}>
                                {i === 0 ? <Trophy size={14} /> : i + 1}
                            </div>

                            <div className="relative shrink-0">
                                <div className="relative w-14 h-14 rounded-[20px] overflow-hidden border border-white/10 group-hover:border-purple-500/50 transition-colors">
                                    <img src={circle.profilePic} alt={circle.name} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                                    <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-green-500 border-2 border-[#0F0529] shadow-[0_0_5px_#22c55e]" />
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
                                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">{circle.stats.messageCount.toLocaleString()} signals</span>
                                </div>
                            </div>

                            <div className="text-right shrink-0">
                                <div className="flex items-center justify-end gap-1 text-white">
                                    <Users size={10} className="text-purple-500" />
                                    <span className="text-lg font-black tabular-nums leading-none tracking-tighter">{circle.stats.memberCount}</span>
                                </div>
                                <p className="text-[7px] text-gray-600 font-black uppercase tracking-widest mt-1">Footprint</p>
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
                    <div className="text-[9px] font-black text-purple-400 uppercase tracking-[0.3em]">Historical Vector Mapping</div>
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
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Latest Incident Feed</h4>
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
