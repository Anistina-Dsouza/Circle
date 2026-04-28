import React, { useState, useMemo } from 'react';
import { Target, Zap, Search, Filter, Maximize2, Minimize2, Activity, Users, MessageSquare } from 'lucide-react';

export default function CommunityEngagementGraph({ data = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isExpanded, setIsExpanded] = useState(false);
    const [hoveredCircle, setHoveredCircle] = useState(null);

    const categories = useMemo(() => {
        const cats = new Set(data.map(c => c.category));
        return ["All", ...Array.from(cats)].slice(0, 6);
    }, [data]);

    const filteredData = useMemo(() => {
        return data.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCat = selectedCategory === "All" || c.category === selectedCategory;
            return matchesSearch && matchesCat;
        });
    }, [data, searchTerm, selectedCategory]);

    const maxMsg = Math.max(...data.map(c => c.stats.messageCount), 1);
    const maxMem = Math.max(...data.map(c => c.stats.memberCount), 1);
    
    // Dynamic Stats
    const totalEngagement = useMemo(() => data.reduce((acc, c) => acc + c.stats.messageCount, 0), [data]);
    const avgEfficiency = useMemo(() => {
        if (data.length === 0) return "0";
        return (data.reduce((acc, c) => acc + (c.stats.messageCount / (c.stats.memberCount || 1)), 0) / data.length).toFixed(1);
    }, [data]);

    return (
        <div className={`bg-[#0F0529]/60 backdrop-blur-3xl border border-white/10 rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 flex flex-col relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] group transition-all duration-700 ${isExpanded ? 'fixed inset-4 z-[100] m-0' : 'relative'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-fuchsia-600/10 pointer-events-none" />
            
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-6 sm:mb-8 relative z-10 gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-xl text-purple-400 border border-purple-500/30">
                            <Target size={18} className="animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">Engagement Matrix</h3>
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-0.5 flex items-center gap-2">
                                <Activity size={10} className="text-purple-500" />
                                Interaction Mapping
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">

                    {/* Category Filter */}
                    <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl w-fit">
                        {categories.map((cat) => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${selectedCategory === cat ? "bg-purple-600 text-white shadow-lg" : "text-white/30 hover:text-white"}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Matrix Viewport */}
            <div className="flex-1 flex flex-col sm:flex-row gap-6 lg:gap-10 mb-10">
                {/* Y-Axis Labels Sidebar */}
                <div className="hidden sm:flex flex-col justify-between py-12 items-end pr-2 min-w-[80px] pointer-events-none border-r border-white/5">
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest whitespace-nowrap">High Activity</span>
                        <span className="text-[8px] text-white/20 uppercase font-bold tracking-tighter">Peak Reach</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest whitespace-nowrap">Low Activity</span>
                        <span className="text-[8px] text-white/10 uppercase font-bold tracking-tighter">Base Level</span>
                    </div>
                </div>

                <div className="flex-1 relative min-h-[260px] lg:min-h-[280px]">
                    {/* Main Graph Area */}
                    <div className="absolute inset-0 border-l border-b border-white/10 rounded-bl-2xl bg-white/[0.01]">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-[0.03] pointer-events-none overflow-hidden rounded-bl-2xl">
                            {Array.from({ length: 64 }).map((_, i) => (<div key={i} className="border border-white" />))}
                        </div>
                        
                    {filteredData.sort((a, b) => b.stats.messageCount - a.stats.messageCount).map((circle, i) => {
                        const normalizedMsg = circle.stats.messageCount / maxMsg;
                        const normalizedMem = circle.stats.memberCount / maxMem;
                        
                        // Hybrid scaling: use both value and rank to ensure spread
                        const rankMsg = (filteredData.length - i) / filteredData.length;
                        // For members, we need to rank them separately
                        const memRankData = [...filteredData].sort((a, b) => a.stats.memberCount - b.stats.memberCount);
                        const rankMem = memRankData.findIndex(c => c.name === circle.name) / filteredData.length;

                        const bottom = Math.min(Math.max((Math.pow(normalizedMsg, 0.45) * 60 + rankMsg * 30) - 5, 8), 92);
                        const left = Math.min(Math.max((Math.pow(normalizedMem, 0.45) * 60 + rankMem * 30) - 5, 8), 92);
                        
                        const size = Math.min(Math.max((Math.sqrt(normalizedMsg) * 40) + 30, 28), 80);
                        const efficiency = (circle.stats.messageCount / (circle.stats.memberCount || 1)).toFixed(1);
                        const isHovered = hoveredCircle === i;

                        // Category-based colors
                        const colors = {
                            "Social": "from-blue-500/50 to-blue-600/20",
                            "Gaming": "from-purple-500/50 to-purple-600/20",
                            "Education": "from-emerald-500/50 to-emerald-600/20",
                            "Technology": "from-fuchsia-500/50 to-fuchsia-600/20"
                        };
                        const bubbleColor = colors[circle.category] || "from-purple-500/50 to-fuchsia-600/20";

                        return (
                            <div
                                key={i}
                                onMouseEnter={() => setHoveredCircle(i)}
                                onMouseLeave={() => setHoveredCircle(null)}
                                className={`absolute rounded-full transition-all duration-700 cursor-pointer shadow-2xl flex items-center justify-center border-2 z-10
                                    ${isHovered ? 'z-50 scale-125 border-purple-400' : 'border-purple-500/30'}
                                `}
                                style={{
                                    bottom: `${bottom}%`,
                                    left: `${left}%`,
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    background: isHovered 
                                        ? `radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.95), rgba(124, 58, 237, 0.6))`
                                        : `radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.4), rgba(124, 58, 237, 0.1))`,
                                    boxShadow: isHovered 
                                        ? `0 0 60px rgba(168, 85, 247, 0.8), inset 0 0 20px rgba(255,255,255,0.3)`
                                        : `0 0 30px rgba(168, 85, 247, 0.1)`,
                                }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${bubbleColor} opacity-50 rounded-full`} />
                                <span className={`relative z-10 text-[11px] font-black text-white transition-all drop-shadow-md ${isHovered ? 'scale-150' : 'opacity-100'}`}>{i + 1}</span>

                                {/* Smart Compact Tooltip / Detail Card */}
                                <div className={`absolute ${bottom > 35 ? 'top-full mt-2' : 'bottom-full mb-2'} ${left > 80 ? 'right-0 translate-x-0' : left < 20 ? 'left-0 translate-x-0' : 'left-1/2 -translate-x-1/2'} w-36 sm:w-40 transition-all duration-500 pointer-events-none z-[100] ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}>
                                    <div className="bg-[#0A051E]/95 backdrop-blur-2xl border border-purple-500/40 p-2 rounded-xl shadow-[0_15px_45px_rgba(0,0,0,1)] relative overflow-hidden">
                                        <div className={`absolute ${bottom > 35 ? 'bottom-0' : 'top-0'} left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent`} />
                                        
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="min-w-0">
                                                <h5 className="text-[10px] font-black text-white uppercase tracking-tight leading-none mb-0.5 truncate">{circle.name}</h5>
                                                <span className="text-[5px] text-purple-400 font-black uppercase tracking-widest">{circle.category}</span>
                                            </div>
                                            <div className="shrink-0 w-5 h-5 bg-purple-500/10 rounded flex items-center justify-center border border-purple-500/20">
                                                <span className="text-[9px] font-black text-purple-400">#{i + 1}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-1.5 mb-2">
                                            <div className="p-1 rounded-lg bg-white/5 border border-white/5">
                                                <div className="flex items-center gap-0.5 mb-0.5 opacity-40">
                                                    <MessageSquare size={5} />
                                                    <span className="text-[5px] font-black uppercase tracking-widest">Pulse</span>
                                                </div>
                                                <span className="text-[9px] font-black text-white tabular-nums">{circle.stats.messageCount.toLocaleString()}</span>
                                            </div>
                                            <div className="p-1 rounded-lg bg-white/5 border border-white/5">
                                                <div className="flex items-center gap-0.5 mb-0.5 opacity-40">
                                                    <Users size={5} />
                                                    <span className="text-[5px] font-black uppercase tracking-widest">Reach</span>
                                                </div>
                                                <span className="text-[9px] font-black text-white tabular-nums">{circle.stats.memberCount.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-600/10 to-fuchsia-600/10 border border-purple-500/20 flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <Zap size={6} className="text-purple-400" />
                                                <span className="text-[6px] font-black text-white uppercase tracking-widest">Efficiency</span>
                                            </div>
                                            <span className="text-[9px] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">{efficiency}x</span>
                                        </div>

                                        <div className={`absolute ${bottom > 35 ? '-top-1 border-t border-l' : '-bottom-1 border-r border-b'} left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0A051E] border-purple-500/20 rotate-45`} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>
            </div>

            {/* Bottom X-Axis Labels */}
            <div className="hidden sm:flex justify-between items-center ml-[80px] lg:ml-[120px] px-10 mb-8 pointer-events-none border-t border-white/5 pt-4">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Niche Scale</span>
                    <span className="text-[8px] text-white/10 uppercase font-bold tracking-tighter">Focused</span>
                </div>
                <div className="flex-1 mx-12 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[10px] font-black text-purple-400/60 uppercase tracking-widest">Mass Scale</span>
                    <span className="text-[8px] text-white/10 uppercase font-bold tracking-tighter">Broad</span>
                </div>
            </div>

            {/* Quick Stats Footer */}
            <div className="flex flex-wrap items-center gap-8 mt-auto relative z-10 pt-6 border-t border-white/5">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-purple-400/60 uppercase tracking-[0.2em] mb-1">Avg Efficiency</span>
                    <span className="text-xl font-black text-white tabular-nums leading-none">{avgEfficiency}x</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-purple-400/60 uppercase tracking-[0.2em] mb-1">Total Pulse</span>
                    <span className="text-xl font-black text-white tabular-nums leading-none">{totalEngagement.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-purple-400/60 uppercase tracking-[0.2em] mb-1">Active Nodes</span>
                    <span className="text-xl font-black text-white tabular-nums leading-none">{filteredData.length}</span>
                </div>
                
                <div className="ml-auto hidden md:flex items-center gap-3 px-6 py-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_#a855f7]" />
                    Live Pulse: Syncing
                </div>
            </div>
        </div>
    );
}
