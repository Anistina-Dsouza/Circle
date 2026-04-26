import React from 'react';

const ManagementTabs = ({ activeTab, onTabChange, counts }) => {
    const tabs = [
        { id: 'requests', label: 'Join Requests', count: counts.requests },
        { id: 'members', label: 'Active Members', count: counts.members },
        { id: 'moderators', label: 'Moderators', count: counts.moderators },
        { id: 'banned', label: 'Banned', count: counts.banned },
    ];

    return (
        <div className="flex items-center gap-1 p-1 bg-[#1A1140]/60 backdrop-blur-md border border-white/5 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
                        flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs tracking-wide transition-all whitespace-nowrap
                        ${activeTab === tab.id 
                            ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-lg shadow-purple-500/20' 
                            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
                    `}
                >
                    {tab.label}
                    {tab.count > 0 && (
                        <span className={`
                            px-2 py-0.5 rounded-md text-[10px]
                            ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500'}
                        `}>
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default ManagementTabs;
