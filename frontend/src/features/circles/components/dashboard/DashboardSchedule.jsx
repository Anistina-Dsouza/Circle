import React from 'react';
import { Calendar } from 'lucide-react';

const DashboardSchedule = () => {
    return (
        <div className="bg-[#1A1140]/60 backdrop-blur-md border border-white/5 rounded-[32px] p-8 hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden group h-full flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Calendar size={20} className="text-purple-500" />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Upcoming Today</h2>
                </div>

                <div className="flex-1 space-y-8">
                    <div className="flex gap-5 group/item cursor-pointer">
                        <div className="text-center min-w-[45px] p-2 bg-white/5 rounded-xl border border-white/5 group-hover/item:border-purple-500/30 transition-colors">
                            <p className="text-xl font-black leading-none text-white">14</p>
                            <p className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mt-1">Oct</p>
                        </div>
                        <div className="space-y-1 py-1">
                            <p className="text-sm font-bold text-gray-200 group-hover/item:text-white transition-colors truncate uppercase tracking-tight">Product Strategy 2.0</p>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                                <span>14:00</span>
                                <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                <span className="text-purple-500/70">Private</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-5 group/item cursor-pointer">
                        <div className="text-center min-w-[45px] p-2 bg-white/5 rounded-xl border border-white/5 group-hover/item:border-purple-500/30 transition-colors">
                            <p className="text-xl font-black leading-none text-white">14</p>
                            <p className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mt-1">Oct</p>
                        </div>
                        <div className="space-y-1 py-1">
                            <p className="text-sm font-bold text-gray-200 group-hover/item:text-white transition-colors truncate uppercase tracking-tight">Community Townhall</p>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                                <span>17:30</span>
                                <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                <span className="text-purple-500/70">Public</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="mt-10 w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-gray-500 hover:text-white hover:bg-purple-600/10 hover:border-purple-500/40 transition-all uppercase tracking-[0.2em] shadow-lg">
                    Full Calendar
                </button>
            </div>
        </div>
    );
};

export default DashboardSchedule;
