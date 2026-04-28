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
        <div className={`bg-[#0F0529]/60 backdrop-blur-3xl border border-white/10 rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 flex flex-col relative overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)] group transition-all duration-700 ${isExpanded ? 'fixed inset-4 z-[100] m-0' : 'relative'}`}>
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
                    {/* Search Input */}
                    <div className="relative flex-1 sm:min-w-[240px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <input 
                            type="text"
                            placeholder="Find Circle..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-white/10 font-bold"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl overflow-x-auto no-scrollbar max-w-[300px]">
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

                    {/* Expand Toggle */}
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                        {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                </div>
            </div>

            {/* Matrix Viewport */}
            <div className="flex-1 relative min-h-[280px] lg:min-h-[340px] mb-10 sm:mb-12">
                {/* Axes Labels */}
                <div className="absolute -left-6 sm:-left-12 bottom-0 top-0 hidden sm:flex flex-col justify-between py-10 items-end pr-6 pointer-events-none">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-purple-400/80 uppercase tracking-widest">High Activity</span>
                        <span className="text-[8px] text-white/10 uppercase font-bold">Peak</span>
                    </div>
                    <div className="w-[2px] h-full my-4 bg-gradient-to-b from-purple-500/30 via-purple-500/5 to-transparent rounded-full" />
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Low Activity</span>
                        <span className="text-[8px] text-white/10 uppercase font-bold">Base</span>
                    </div>
                </div>

                <div className="absolute left-0 right-0 -bottom-16 hidden sm:flex justify-between px-10 pointer-events-none">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Niche Scale</span>
                        <span className="text-[8px] text-white/10 uppercase font-bold">Focused</span>
                    </div>
                    <div className="h-[2px] w-full mx-10 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent rounded-full mt-4" />
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-purple-400/60 uppercase tracking-widest">Mass Scale</span>
                        <span className="text-[8px] text-white/10 uppercase font-bold">Broad</span>
                    </div>
                </div>

                {/* Main Graph Area */}
                <div className="absolute inset-0 border-l-2 border-b-2 border-white/10 rounded-bl-3xl overflow-hidden">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-[0.03] pointer-events-none">
                        {Array.from({ length: 64 }).map((_, i) => (<div key={i} className="border border-white" />))}
                    </div>

                    {/* Bubbles */}
                    {filteredData.sort((a, b) => b.stats.messageCount - a.stats.messageCount).map((circle, i) => {
                        const normalizedMsg = circle.stats.messageCount / maxMsg;
                        const normalizedMem = circle.stats.memberCount / maxMem;
                        
                        // Hybrid scaling: use both value and rank to ensure spread
                        const rankMsg = (filteredData.length - i) / filteredData.length;
                        // For members, we need to rank them separately
                        const memRankData = [...filteredData].sort((a, b) => a.stats.memberCount - b.stats.memberCount);
                        const rankMem = memRankData.findIndex(c => c.name === circle.name) / filteredData.length;

                        const bottom = Math.min(Math.max((Math.pow(normalizedMsg, 0.3) * 60 + rankMsg * 30) - 5, 10), 90);
                        const left = Math.min(Math.max((Math.pow(normalizedMem, 0.3) * 60 + rankMem * 30) - 5, 10), 90);
                        
                        const size = Math.max((Math.sqrt(normalizedMsg) * 50) + 35, 32);
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

                                {/* Tooltip / Detail Card */}
                                <div className={`absolute bottom-full mb-6 left-1/2 -translate-x-1/2 w-64 sm:w-72 transition-all duration-500 pointer-events-none z-[100] ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                                    <div className="bg-[#0A051E]/95 backdrop-blur-2xl border-2 border-purple-500/40 p-6 rounded-[32px] shadow-[0_40px_120px_rgba(0,0,0,1)] relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
                                        
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h5 className="text-lg font-black text-white uppercase tracking-tighter leading-none mb-1.5 truncate max-w-[140px]">{circle.name}</h5>
                                                <span className="text-[9px] text-purple-400 font-black uppercase tracking-widest">{circle.category}</span>
                                            </div>
                                            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                                                <span className="text-sm font-black text-purple-400">#{i + 1}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                                                <div className="flex items-center gap-1.5 mb-1 opacity-40">
                                                    <MessageSquare size={10} />
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Activity</span>
                                                </div>
                                                <span className="text-xl font-black text-white tabular-nums">{circle.stats.messageCount.toLocaleString()}</span>
                                            </div>
                                            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                                                <div className="flex items-center gap-1.5 mb-1 opacity-40">
                                                    <Users size={10} />
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Members</span>
                                                </div>
                                                <span className="text-xl font-black text-white tabular-nums">{circle.stats.memberCount.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 border border-purple-500/30 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Zap size={14} className="text-purple-400" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Efficiency</span>
                                            </div>
                                            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">{efficiency}x</span>
                                        </div>

                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0A051E] border-r-2 border-b-2 border-purple-500/40 rotate-45" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Stats Footer */}
            <div className="flex flex-wrap items-center gap-6 mt-auto relative z-10 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Efficiency</span>
                    <span className="text-base font-black text-white tabular-nums">{avgEfficiency}x</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Pulse</span>
                    <span className="text-base font-black text-white tabular-nums">{totalEngagement.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Nodes</span>
                    <span className="text-base font-black text-white tabular-nums">{filteredData.length}</span>
                </div>
                <div className="ml-auto hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                    Live Pulse: Syncing
                </div>
            </div>
        </div>
    );
}
