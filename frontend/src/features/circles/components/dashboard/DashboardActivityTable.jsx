import React from 'react';
import { Activity } from 'lucide-react';

const DashboardActivityTable = ({ activities }) => {
    return (
        <div className="bg-[#1A1140]/60 backdrop-blur-md border border-white/5 rounded-[32px] p-8 hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Activity size={20} className="text-purple-500" />
                        </div>
                        <h2 className="text-xl font-black tracking-tight">Recent Activity</h2>
                    </div>
                    <button className="text-[10px] font-black text-gray-500 hover:text-purple-400 tracking-wide transition-colors">Full Logs</button>
                </div>

                <div className="space-y-1">
                    {activities.map((item) => (
                        <div key={item.id} className="group/item flex items-center gap-4 py-4 px-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5">
                            <div className="relative">
                                <img 
                                    src={item.avatar} 
                                    alt="" 
                                    className="w-11 h-11 rounded-full border-2 border-white/5 group-hover/item:border-purple-500/50 transition-colors object-cover" 
                                />
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#1A1140] rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-gray-200 group-hover/item:text-white transition-colors">{item.user}</h4>
                                <p className="text-[11px] text-gray-500 group-hover/item:text-gray-400 transition-colors">{item.action}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-[9px] font-bold text-gray-600 mb-1 tracking-wide">{item.time}</p>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                                    item.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' :
                                    item.status === 'NEW' ? 'bg-purple-500/10 text-purple-400' :
                                    'bg-red-500/10 text-red-400'
                                }`}>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardActivityTable;
