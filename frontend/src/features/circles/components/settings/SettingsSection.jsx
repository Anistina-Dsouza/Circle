import React from 'react';

const SettingsSection = ({ title, description, icon: Icon, children, badge }) => {
    return (
        <div className="bg-[#1A1140]/60 backdrop-blur-md border border-white/5 rounded-[32px] p-8 mb-6 hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden group">
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500">
                            <Icon size={22} strokeWidth={2} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                            <p className="text-sm text-gray-500 font-medium">{description}</p>
                        </div>
                    </div>
                    {badge && (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${badge.style}`}>
                            {badge.text}
                        </span>
                    )}
                </div>

                <div className="space-y-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SettingsSection;
