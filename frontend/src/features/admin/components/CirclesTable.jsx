import { Palette, Terminal, Dumbbell, Film, Settings, Hexagon, Layers } from "lucide-react";
import { Link } from "react-router-dom";

export default function CirclesTable({ circles }) {

    const getDefaultIcon = (category) => {
        switch (category?.toLowerCase()) {
            case 'creative':
            case 'art':
                return <Palette size={18} />;
            case 'tech':
            case 'technology':
                return <Terminal size={18} />;
            case 'health':
            case 'fitness':
                return <Dumbbell size={18} />;
            case 'entertainment':
            case 'hobbies':
                return <Film size={18} />;
            default:
                return <Hexagon size={18} />;
        }
    };

    return (
    <div className="rounded-[24px] sm:rounded-[32px] bg-[#1A0C3F]/50 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 group/container hover:border-indigo-500/20">
        {/* Header */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center px-6 sm:px-10 py-6 sm:py-9 border-b border-white/5 gap-4 bg-white/[0.02]">
            <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                    <Layers size={14} className="text-indigo-400" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400/60">Cluster Pulse</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tighter">Emerging Nodes</h2>
            </div>
            <Link to="/admin/communities" className="flex items-center gap-3 text-white/40 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all bg-white/5 px-6 py-2.5 rounded-2xl border border-white/5 whitespace-nowrap group">
                <span>Manage Hub</span>
                <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" />
            </Link>
        </div>

        {/* Column Headings */}
        <div className="flex px-6 sm:px-10 py-5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/5 bg-white/[0.01]">
            <div className="flex-1">Cluster Signature</div>
            <div className="hidden lg:block w-[20%] text-center">Classification</div>
            <div className="w-[20%] text-center">Node Count</div>
            <div className="w-12 text-right"></div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/5">
            {circles && circles.length > 0 ? (
                circles.map((c, i) => (
                    <div
                        key={c._id || i}
                        className="group flex items-center px-6 sm:px-10 py-6 sm:py-8 hover:bg-white/[0.04] transition-all relative overflow-hidden"
                    >
                        <div className="absolute left-0 w-1 h-0 bg-indigo-500 group-hover:h-full top-0 transition-all duration-500 rounded-r-full shadow-[0_0_20px_rgba(99,102,241,0.5)]" />

                        {/* Circle */}
                        <div className="flex-1 flex gap-4 sm:gap-6 items-center overflow-hidden pr-4">
                            <div className="relative shrink-0">
                                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />
                                {c.coverImage && c.coverImage !== 'default_circle.png' ? (
                                    <img src={c.coverImage} className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-[18px] sm:rounded-[22px] object-cover ring-2 ring-white/10 flex-shrink-0 group-hover:scale-105 transition-all duration-500" alt={c.name} />
                                ) : (
                                    <div className="relative w-11 h-11 sm:w-14 sm:h-14 bg-white/5 border border-white/10 rounded-[18px] sm:rounded-[22px] flex items-center justify-center text-indigo-400 flex-shrink-0 shadow-xl group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-400 transition-all duration-500">
                                        {getDefaultIcon(c.category)}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col overflow-hidden space-y-1">
                                <span className="text-sm sm:text-lg font-black text-white group-hover:text-indigo-300 transition-colors truncate">{c.name}</span>
                                <span className="text-[9px] sm:text-[10px] text-white/20 uppercase font-black tracking-widest sm:hidden truncate">{c.category}</span>
                            </div>
                        </div>

                        {/* Category - LG only */}
                        <div className="hidden lg:block w-[20%] text-center">
                            <span className="text-[9px] font-black px-4 py-1.5 rounded-full bg-white/5 text-white/30 border border-white/5 uppercase tracking-[0.2em] truncate inline-block max-w-[90%] group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-all">
                                {c.category}
                            </span>
                        </div>

                        {/* Members */}
                        <div className="w-[20%] flex justify-center">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)] animate-pulse" />
                                <span className="text-xs sm:text-sm font-black text-white tabular-nums group-hover:text-indigo-300 transition-colors">
                                    {c.stats?.memberCount || c.members?.length || 0}
                                </span>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="w-12 flex justify-end">
                            <Link to="/admin/communities">
                                <button className="p-3 rounded-2xl bg-white/5 text-white/20 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl group-hover:rotate-12">
                                    <Settings size={16} />
                                </button>
                            </Link>
                        </div>
                    </div>
                ))
            ) : (
                <div className="py-32 text-center text-xs text-white/10 italic font-black uppercase tracking-[0.4em]">
                    Zero Clusters Detected
                </div>
            )}
        </div>
    </div>

    );
}

