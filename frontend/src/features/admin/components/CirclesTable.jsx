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
    <div className="rounded-[24px] sm:rounded-[32px] bg-[#1A0C3F]/50 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500">
        {/* Header */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center px-6 sm:px-8 py-5 sm:py-7 border-b border-white/5 gap-4">
            <div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">New Circles</h2>
                <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest font-black">Community Growth</p>
            </div>
            <Link to="/admin/communities" className="flex items-center gap-2 text-purple-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all bg-white/5 px-4 py-2 rounded-full border border-white/5 whitespace-nowrap">
                <span>Manage</span>
                <Settings size={12} />
            </Link>
        </div>

        <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[500px] border-collapse">
                {/* Column Headings */}
                <thead>
                    <tr className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-white/30 border-b border-white/5 bg-white/[0.02]">
                        <th className="px-6 sm:px-8 py-4 text-left font-black">Circle</th>
                        <th className="px-4 py-4 text-center font-black hidden sm:table-cell">Category</th>
                        <th className="px-4 py-4 text-center font-black">Nodes</th>
                        <th className="px-6 sm:px-8 py-4 text-right font-black"></th>
                    </tr>
                </thead>

                {/* Rows */}
                <tbody className="divide-y divide-white/5">
                    {circles && circles.length > 0 ? (
                        circles.map((c, i) => (
                            <tr
                                key={c._id || i}
                                className="group hover:bg-white/[0.03] transition-all relative"
                            >
                                {/* Circle */}
                                <td className="px-6 sm:px-8 py-5 sm:py-6">
                                    <div className="flex gap-3 sm:gap-5 items-center overflow-hidden relative">
                                        <div className="absolute -left-6 sm:-left-8 w-1 h-0 bg-indigo-500 group-hover:h-full top-0 transition-all duration-300 rounded-r-full" />
                                        
                                        {c.coverImage && c.coverImage !== 'default_circle.png' ? (
                                            <img src={c.coverImage} className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl object-cover ring-2 ring-white/5 flex-shrink-0 group-hover:scale-105 transition-transform" alt={c.name} />
                                        ) : (
                                            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-purple-400 flex-shrink-0 shadow-xl group-hover:bg-purple-500 group-hover:text-white transition-all">
                                                {getDefaultIcon(c.category)}
                                            </div>
                                        )}
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate">{c.name}</span>
                                            <span className="text-[9px] text-white/20 uppercase font-black tracking-widest sm:hidden">{c.category}</span>
                                        </div>
                                    </div>
                                </td>

                                {/* Category - Desktop only */}
                                <td className="px-4 py-5 sm:py-6 text-center hidden sm:table-cell">
                                    <span className="text-[9px] font-black px-2 py-1 rounded-md bg-white/5 text-white/40 border border-white/5 uppercase tracking-tighter truncate inline-block max-w-[90%]">
                                        {c.category}
                                    </span>
                                </td>

                                {/* Members */}
                                <td className="px-4 py-5 sm:py-6">
                                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                        <span className="text-xs font-black text-white/80">
                                            {c.stats?.memberCount || c.members?.length || 0}
                                        </span>
                                    </div>
                                </td>

                                {/* Action */}
                                <td className="px-6 sm:px-8 py-5 sm:py-6 text-right">
                                    <Link to="/admin/communities">
                                        <button className="p-2.5 rounded-xl bg-white/5 text-white/30 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                            <Settings size={14} />
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">
                                <div className="py-20 text-center text-sm text-white/20 italic font-medium uppercase tracking-[0.2em]">
                                    No circles discovered.
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>


    );
}
