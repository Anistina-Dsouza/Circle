import { Palette, Terminal, Dumbbell, Film, Settings, Hexagon } from "lucide-react";
import { Link } from "react-router-dom";

export default function CirclesTable({ circles }) {

    const getDefaultIcon = (category) => {
        switch (category?.toLowerCase()) {
            case 'creative':
            case 'art':
                return <Palette size={16} />;
            case 'tech':
            case 'technology':
                return <Terminal size={16} />;
            case 'health':
            case 'fitness':
                return <Dumbbell size={16} />;
            case 'entertainment':
            case 'hobbies':
                return <Film size={16} />;
            default:
                return <Hexagon size={16} />;
        }
    };

    return (
    <div className="group/table relative rounded-[24px] sm:rounded-[32px] bg-[#1A0C3F]/50 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center px-6 sm:px-10 py-6 sm:py-8 border-b border-white/5 gap-6 relative">
            <div className="absolute top-0 left-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
            <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Expansion Feed</h2>
                <p className="text-[10px] text-white/40 mt-1 uppercase tracking-[0.25em] font-black">Community Growth Metrics</p>
            </div>
            <Link to="/admin/communities" className="flex items-center gap-3 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all bg-white/5 px-6 py-2.5 rounded-xl border border-white/5 whitespace-nowrap group/link">
                <span>Manage Clusters</span>
                <Settings size={14} className="group-hover/link:rotate-90 transition-transform duration-500" />
            </Link>
        </div>

        {/* Column Headings */}
        <div className="flex px-6 sm:px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 border-b border-white/5 bg-white/[0.01]">
            <div className="flex-1 pl-2">Community Identity</div>
            <div className="hidden sm:block w-[20%] text-center">Class</div>
            <div className="w-[20%] text-center">Active Nodes</div>
            <div className="w-16 text-right pr-4">Matrix</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/5 overflow-x-auto no-scrollbar scroll-smooth">
            <div className="min-w-[500px] sm:min-w-0">
                {circles && circles.length > 0 ? (
                    circles.map((c, i) => (
                        <div
                            key={c._id || i}
                            className="group/row flex items-center px-6 sm:px-10 py-6 sm:py-7 hover:bg-white/[0.04] transition-all duration-500 relative"
                        >
                            <div className="absolute left-0 w-1.5 h-0 bg-indigo-500 group-hover/row:h-1/2 top-1/4 transition-all duration-500 rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />

                            {/* Circle */}
                            <div className="flex-1 flex gap-4 sm:gap-6 items-center overflow-hidden pr-4 pl-2">
                                <div className="relative flex-shrink-0 group/avatar">
                                    {c.coverImage && c.coverImage !== 'default_circle.png' ? (
                                        <img src={c.coverImage} className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-white/5 transition-all duration-500 group-hover/row:scale-110 shadow-2xl group-hover/row:ring-indigo-500/30" alt={c.name} />
                                    ) : (
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400 shadow-2xl group-hover/row:bg-indigo-500 group-hover/row:text-white transition-all duration-500 group-hover/row:scale-110">
                                            {getDefaultIcon(c.category)}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-[#1A0C3F] opacity-0 group-hover/row:opacity-100 transition-opacity duration-500" />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-base sm:text-lg font-black text-white group-hover/row:text-indigo-300 transition-colors truncate tracking-tight">{c.name}</span>
                                    <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.15em] sm:hidden mt-0.5 group-hover/row:text-white/40">
                                        Signal: {c.category}
                                    </span>
                                </div>
                            </div>

                            {/* Category - Desktop only */}
                            <div className="hidden sm:block w-[20%] text-center">
                                <span className="text-[9px] font-black px-4 py-1.5 rounded-xl bg-white/5 text-white/30 border border-white/5 uppercase tracking-[0.1em] group-hover/row:border-indigo-500/30 group-hover/row:text-indigo-300 transition-all">
                                    {c.category}
                                </span>
                            </div>

                            {/* Members */}
                            <div className="w-[20%] flex justify-center">
                                <div className="flex items-center gap-3 tabular-nums">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)] group-hover/row:scale-125 transition-transform" />
                                    <span className="text-sm font-black text-white/80 group-hover/row:text-white">
                                        {c.stats?.memberCount || c.members?.length || 0}
                                    </span>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="w-16 flex justify-end pr-2">
                                <Link to="/admin/communities">
                                    <button className="p-3 rounded-xl bg-white/5 text-white/20 hover:bg-indigo-500 hover:text-white transition-all shadow-2xl active:scale-90">
                                        <Settings size={16} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-32 text-center flex flex-col items-center gap-6">
                        <div className="p-6 rounded-full bg-white/5 border border-white/10">
                            <Hexagon size={48} className="text-white/10" />
                        </div>
                        <span className="text-white/20 font-black uppercase tracking-[0.4em] text-sm italic">Null Cluster Index</span>
                    </div>
                )}
            </div>
        </div>
        
        {/* Mobile Scroll Indicator Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#1A0C3F] to-transparent pointer-events-none sm:hidden opacity-30" />
    </div>
    );
}
