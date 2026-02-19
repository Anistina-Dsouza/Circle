import React, { useState } from 'react';

const FeedHeader = () => {
    const [activeTab, setActiveTab] = useState('live');

    return (
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Your Feed
            </h1>
            <div className="bg-[#1E1B3A] p-1 rounded-full flex border border-white/5">
                <button
                    onClick={() => setActiveTab('live')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'live' ? 'bg-[#7C3AED] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    Live
                </button>
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'upcoming' ? 'bg-[#7C3AED] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    Upcoming
                </button>
            </div>
        </div>
    );
};

export default FeedHeader;
