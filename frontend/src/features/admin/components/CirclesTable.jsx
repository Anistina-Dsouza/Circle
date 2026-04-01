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
        <div className="p-6 rounded-[28px] bg-[radial-gradient(circle_at_top,#2a004a,#13001f)] border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">New Circles</h2>
                <Link to="/admin/communities">
                    <span className="text-purple-400 text-xs tracking-widest hover:text-purple-300 transition cursor-pointer">MANAGE</span>
                </Link>
            </div>

            {/* Column Headings */}
            <div className="flex text-xs uppercase tracking-widest text-gray-500 pb-4 border-b border-white/5">
                <div className="w-[45%] pl-2">Circle</div>
                <div className="w-[20%]">Category</div>
                <div className="w-[20%]">Members</div>
                <div className="w-[15%] text-right pr-2">Action</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/5">
                {circles && circles.length > 0 ? (
                    circles.map((c, i) => (
                        <div
                            key={c._id || i}
                            className="flex items-center py-4 hover:bg-purple-900/20 transition px-2 rounded-xl"
                        >
                            {/* Circle */}
                            <div className="w-[45%] flex gap-4 items-center overflow-hidden">
                                {c.coverImage && c.coverImage !== 'default_circle.png' ? (
                                    <img src={c.coverImage} className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-800/60 flex-shrink-0" alt={c.name} />
                                ) : (
                                    <div className="w-10 h-10 bg-purple-800/60 rounded-full flex items-center justify-center text-purple-300 flex-shrink-0">
                                        {getDefaultIcon(c.category)}
                                    </div>
                                )}
                                <span className="text-sm font-medium truncate">{c.name}</span>
                            </div>

                            {/* Category */}
                            <div className="w-[20%]">
                                <span className="text-xs px-3 py-1 rounded-full bg-purple-900/40 text-purple-300 truncate inline-block max-w-[90%]">
                                    {c.category}
                                </span>
                            </div>

                            {/* Members */}
                            <div className="w-[20%]">
                                <span className="text-xs px-3 py-1 rounded-full bg-purple-700/20 text-purple-200">
                                    {c.stats?.memberCount || c.members?.length || 0}
                                </span>
                            </div>

                            {/* Action */}
                            <div className="w-[15%] flex justify-end">
                                <Link to="/admin/communities">
                                    <button className="p-2 rounded-full hover:bg-purple-800/40 transition">
                                        <Settings size={16} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-8 text-center text-sm text-gray-400">
                        No circles have been created yet.
                    </div>
                )}
            </div>
        </div>
    );
}
