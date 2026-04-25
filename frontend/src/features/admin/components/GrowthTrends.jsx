import React from 'react';
import { TrendingUp, Layout, Activity, ChevronRight } from 'lucide-react';

const GrowthTrends = ({ trends, hideDistribution = false }) => {
    const { registrations = [], categories = [] } = trends;
 
    // Calculate max registration for scaling
    const maxReg = Math.max(...registrations.map(r => r.count), 5);
    const maxCat = Math.max(...categories.map(c => c.count), 1);
 
    // Date formatting helper
    const formatDate = (dateStr) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        } catch (e) {
            return dateStr;
        }
    };
 
    return (
        <div className={`grid ${hideDistribution ? 'grid-cols-1' : 'lg:grid-cols-2'} gap-10`}>
            {/* Registration Trends - GROWTH VELOCITY */}
            <div className="rounded-[32px] bg-[#1A0C3F]/50 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 hover:border-purple-500/20 relative">
                {/* Standardized Header */}
                <div className="flex justify-between items-center px-8 py-7 border-b border-white/5">
                    <div className="flex items-center gap-5">
                        <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                            <TrendingUp size={24} className="animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Growth Velocity</h2>
                            <p className="text-xs text-purple-400/60 mt-1 uppercase tracking-widest font-black">User Acquisition Flux</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest">
                        <Activity size={12} />
                        <span>Live Audit</span>
                    </div>
                </div>
 
                <div className="p-10">
                    <div className="relative h-[280px]">
                        {/* High-Contrast Y-Axis Grid */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-8">
                            {[100, 50, 0].map((percent) => (
                                <div key={percent} className="flex items-center gap-8 w-full group/grid">
                                    <span className="text-[12px] font-black text-white/60 w-10 text-right tabular-nums">
                                        {Math.round((percent / 100) * maxReg)}
                                    </span>
                                    <div className={`flex-1 h-px ${percent === 0 ? 'bg-white/20' : 'bg-white/[0.05]'} group-first/grid:bg-purple-500/20`} />
                                </div>
                            ))}
                        </div>
 
                        {/* Chart Area - Tactical Growth Columns */}
                        <div className="absolute inset-0 left-16 px-6 flex items-end justify-between gap-4">
                            {registrations.length > 0 ? registrations.map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center group/bar h-full">
                                    <div className="relative w-full h-full flex items-end justify-center">
                                        {/* Numerical Value Indicator (Shows on Hover) */}
                                        <div className="absolute opacity-0 group-hover/bar:opacity-100 transition-all duration-300 bottom-full mb-6 z-30">
                                            <div className="bg-purple-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl shadow-purple-900/40 border border-purple-400/30 whitespace-nowrap">
                                                {d.count} SIGNUPS
                                            </div>
                                            <div className="w-2 h-2 bg-purple-600 rotate-45 mx-auto -mt-1 border-r border-b border-purple-400/30" />
                                        </div>
 
                                        {/* Tactical Column Track */}
                                        <div className="absolute inset-x-0 bottom-0 top-0 w-full max-w-[24px] mx-auto bg-purple-500/[0.02] rounded-full border border-white/[0.03] pointer-events-none" />
 
                                        {/* The Pillar - Segmented Design */}
                                        <div 
                                            className="w-full max-w-[24px] rounded-full transition-all duration-1000 ease-out relative z-10 overflow-hidden
                                                bg-purple-500/10 group-hover/bar:bg-purple-500/20 group-hover/bar:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                                            style={{ height: `${(d.count / maxReg) * 100}%`, minHeight: d.count > 0 ? '12px' : '4px' }}
                                        >
                                            {/* Gradient Fill */}
                                            <div className={`absolute inset-0 bg-gradient-to-t from-purple-600 via-purple-500 to-fuchsia-400 transition-opacity duration-500 ${d.count > 0 ? 'opacity-40 group-hover/bar:opacity-100' : 'opacity-0'}`} />
                                            
                                            {/* Pulse Animation */}
                                            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] h-1/2 w-full animate-scan" />
                                        </div>
 
                                        {/* Interactive Node Peak */}
                                        <div 
                                            className="absolute w-2 h-2 rounded-full transition-all duration-500 z-20 mb-[-4px] bg-white/20 border border-purple-400/30 group-hover/bar:bg-fuchsia-400 group-hover/bar:scale-150 group-hover/bar:shadow-[0_0_15px_#e879f9]"
                                            style={{ bottom: `${(d.count / maxReg) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )) : (
                                <div className="w-full h-full flex items-center justify-center text-white/10 uppercase tracking-[0.2em] font-black text-[10px]">
                                    Awaiting Data Stream
                                </div>
                            )}
                        </div>
                    </div>
 
                    {/* Bottom X-Axis */}
                    <div className="flex mt-8 ml-16 px-6 justify-between border-t border-white/5 pt-8">
                        {registrations.map((item, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group/x-label">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/5 border border-white/10 group-hover/x-label:bg-purple-400 group-hover/x-label:scale-125 transition-all duration-300" />
                                <span className="text-[10px] font-black text-white/30 group-hover/x-label:text-white transition-colors uppercase tracking-tight">
                                    {formatDate(item._id)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
 
            {/* Category Popularity - DISTRIBUTION */}
            {!hideDistribution && (
            <div className="rounded-[32px] bg-[#1A0C3F]/50 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 hover:border-indigo-500/20 relative">
                {/* Standardized Header */}
                <div className="flex justify-between items-center px-8 py-7 border-b border-white/5">
                    <div className="flex items-center gap-5">
                        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            <Layout size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Distribution</h2>
                            <p className="text-xs text-white/40 mt-1 uppercase tracking-widest font-black">Niche Saturation</p>
                        </div>
                    </div>
                </div>
 
                <div className="p-10 space-y-9">
                    {categories.length > 0 ? categories.map((cat, idx) => (
                        <div key={idx} className="space-y-4 group/row">
                            <div className="flex justify-between items-end px-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                    <span className="text-sm font-bold text-white/80 group-hover/row:text-white transition-colors">{cat._id}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-bold text-white tabular-nums">{cat.count}</span>
                                    <span className="text-[9px] font-black text-indigo-400/40 uppercase tracking-widest">Units</span>
                                </div>
                            </div>
                            
                            <div className="relative h-[6px] w-full bg-white/[0.02] rounded-full overflow-hidden border border-white/[0.04]">
                                <div 
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400 rounded-full transition-all duration-1000 ease-out group-hover/row:brightness-125"
                                    style={{ width: `${(cat.count / maxCat) * 100}%` }}
                                >
                                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] w-1/2 animate-scan" />
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="w-full h-48 flex flex-col items-center justify-center text-white/10 gap-4">
                            <Activity size={32} className="opacity-20" />
                            <span className="uppercase tracking-[0.3em] font-black text-[10px]">Awaiting Distribution Data</span>
                        </div>
                    )}
                </div>
            </div>
            )}
        </div>
    );
};

export default GrowthTrends;
