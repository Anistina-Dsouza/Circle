import React from 'react';

const DashboardStatCard = ({ label, value, icon: Icon, change, pulse }) => {
    return (
        <div className="bg-[#1A1140]/60 backdrop-blur-sm rounded-3xl p-6 border border-white/5 hover:border-purple-500/50 transition-all duration-500 group relative overflow-hidden flex items-center min-h-[110px]">
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 flex items-center gap-5 w-full">
                {/* Icon on the left */}
                <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500 shrink-0">
                    <Icon size={24} strokeWidth={2} />
                </div>

                {/* Text grouped on the right */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between pointer-events-none">
                        <h3 className="text-3xl font-black text-white tracking-tight group-hover:text-purple-400 transition-colors duration-500">
                            {value}
                        </h3>
                        {change && (
                            <span className="text-[9px] font-black bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-md border border-purple-500/20 tracking-tight shrink-0">
                                {change}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-500 text-[10px] font-bold tracking-tight truncate">
                        {label}
                    </p>
                </div>
                
                {pulse && (
                    <div className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardStatCard;
