import { Palette, Terminal, Dumbbell, Film, Settings, Hexagon, Users, Sparkles, LayoutGrid } from "lucide-react";
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
    <div className="rounded-[24px] sm:rounded-[32px] bg-[#1A0C3F]/50 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 sm:px-10 py-6 sm:py-8 border-b border-white/5 gap-6">
            <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">COMMUNITY SEED</h2>
                <div className="flex items-center gap-2 mt-2">
                    <Sparkles size={12} className="text-purple-400" />
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">Growth Telemetry</p>
                </div>
            </div>
            <Link to="/admin/communities" className="w-full sm:w-auto flex items-center justify-center gap-3 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all bg-white/5 px-6 py-3 rounded-2xl border border-white/5 group/btn shadow-xl">
                <span>AUDIT ALL</span>
                <LayoutGrid size={14} className="group-hover/btn:rotate-90 transition-transform duration-500" />
            </Link>
        </div>

        {/* Column Headings - HIDDEN ON MOBILE */}
        <div className="hidden md:flex px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 border-b border-white/5 bg-white/[0.01]">
            <div className="flex-1">Platform Circle</div>
            <div className="w-[25%] text-center">Niche Category</div>
            <div className="w-[15%] text-center">Node Count</div>
            <div className="w-12 text-right"></div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/5">
            {circles && circles.length > 0 ? (
                circles.map((c, i) => (
                    <div
                        key={c._id || i}
                        className="group flex flex-col md:flex-row md:items-center px-6 sm:px-10 py-6 sm:py-8 hover:bg-white/[0.03] transition-all relative"
                    >
                        <div className="absolute left-0 w-1 h-0 bg-purple-500 group-hover:h-2/3 top-1/6 transition-all duration-500 rounded-r-full" />

                        {/* Circle */}
                        <div className="flex-1 flex gap-4 sm:gap-6 items-center overflow-hidden mb-4 md:mb-0">
                            <div className="relative shrink-0">
                                {c.coverImage && c.coverImage !== 'default_circle.png' ? (
                                    <img src={c.coverImage} className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-white/5 shadow-2xl group-hover:scale-105 transition-transform duration-500" alt={c.name} />
                                ) : (
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#11052C] border border-white/10 rounded-2xl flex items-center justify-center text-purple-400 shadow-2xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                                        {getDefaultIcon(c.category)}
                                    </div>
                                )}
                                <div className="absolute -top-1 -left-1 w-5 h-5 bg-[#1A0C3F] border border-white/10 rounded-full flex items-center justify-center text-[8px] font-black text-white/40 shadow-lg">
                                    {i + 1}
                                </div>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-base font-black text-white group-hover:text-purple-300 transition-colors truncate tracking-tight">{c.name}</span>
                                <div className="flex items-center gap-2 md:hidden mt-1">
                                    <span className="text-[9px] text-purple-400 font-black uppercase tracking-widest">{c.category}</span>
                                    <div className="w-1 h-1 rounded-full bg-white/10" />
                                    <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">
                                        {c.stats?.memberCount || c.members?.length || 0} Nodes
                                    </span>
                                </div>
                                <span className="hidden md:block text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">ID: {c._id?.substring(0, 8)}</span>
                            </div>
                        </div>

                        {/* Category - Desktop only */}
                        <div className="hidden md:block w-[25%] text-center">
                            <span className="text-[10px] font-black px-4 py-1.5 rounded-full bg-white/5 text-white/40 border border-white/5 uppercase tracking-[0.1em] group-hover:border-purple-500/20 group-hover:text-purple-300 transition-all">
                                {c.category}
                            </span>
                        </div>

                        {/* Members - Desktop only */}
                        <div className="hidden md:flex w-[15%] justify-center">
                            <div className="flex items-center gap-2.5">
                                <Users size={14} className="text-purple-500/60" />
                                <span className="text-sm font-black text-white tabular-nums group-hover:scale-110 transition-transform">
                                    {c.stats?.memberCount || c.members?.length || 0}
                                </span>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="w-full md:w-12 flex justify-end mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-white/5">
                            <Link to="/admin/communities" className="w-full md:w-auto">
                                <button className="w-full md:w-auto flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white/5 text-white/30 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95">
                                    <Settings size={16} />
                                    <span className="md:hidden text-[10px] font-black uppercase tracking-widest">CONFIGURE NODE</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                )
            )) : (
                <div className="py-32 text-center flex flex-col items-center gap-4">
                    <Hexagon size={40} className="text-white/10" />
                    <span className="text-white/20 font-black uppercase tracking-[0.3em] text-sm italic">Zero Growth Detected</span>
                </div>
            )}
        </div>
    </div>

    );
}
