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
        <div className="rounded-[32px] bg-[#1A0C3F]/50 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-7 border-b border-white/5">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">New Circles</h2>
                    <p className="text-xs text-white/40 mt-1 uppercase tracking-widest font-black">Community Growth</p>
                </div>
                <Link to="/admin/communities" className="flex items-center gap-2 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <span>Manage</span>
                    <Settings size={12} />
                </Link>
            </div>

            {/* Column Headings */}
            <div className="flex px-8 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-white/30 border-b border-white/5 bg-white/[0.02]">
                <div className="w-[45%]">Circle</div>
                <div className="w-[20%]">Category</div>
                <div className="w-[20%]">Members</div>
                <div className="w-[15%] text-right">Action</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/5">
                {circles && circles.length > 0 ? (
                    circles.map((c, i) => (
                        <div
                            key={c._id || i}
                            className="group flex items-center px-8 py-6 hover:bg-white/[0.03] transition-all relative"
                        >
                            <div className="absolute left-0 w-1 h-0 bg-indigo-500 group-hover:h-1/2 top-1/4 transition-all duration-300 rounded-r-full" />

                            {/* Circle */}
                            <div className="w-[45%] flex gap-5 items-center overflow-hidden">
                                {c.coverImage && c.coverImage !== 'default_circle.png' ? (
                                    <img src={c.coverImage} className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white/5 flex-shrink-0 group-hover:scale-105 transition-transform" alt={c.name} />
                                ) : (
                                    <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-purple-400 flex-shrink-0 shadow-xl group-hover:bg-purple-500 group-hover:text-white transition-all">
                                        {getDefaultIcon(c.category)}
                                    </div>
                                )}
                                <span className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate">{c.name}</span>
                            </div>

                            {/* Category */}
                            <div className="w-[20%]">
                                <span className="text-[10px] font-black px-3 py-1.5 rounded-full bg-white/5 text-white/60 border border-white/5 uppercase tracking-tighter truncate inline-block max-w-[90%] group-hover:border-white/20 transition-all">
                                    {c.category}
                                </span>
                            </div>

                            {/* Members */}
                            <div className="w-[20%]">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                    <span className="text-xs font-black text-white/80">
                                        {c.stats?.memberCount || c.members?.length || 0}
                                    </span>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="w-[15%] flex justify-end">
                                <Link to="/admin/communities">
                                    <button className="p-3 rounded-xl bg-white/5 text-white/30 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-xl">
                                        <Settings size={16} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center text-sm text-white/20 italic">
                        No circles have been detected in the system.
                    </div>
                )}
            </div>
        </div>
    );
}
