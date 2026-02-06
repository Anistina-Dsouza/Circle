import React from 'react';

const FeedHeader = () => {
    return (
        <header className="px-10 py-8 flex items-center justify-between sticky top-0 bg-[#050214]/80 backdrop-blur-xl z-20">
            <h1 className="text-3xl font-bold">Feed</h1>
            <div className="flex bg-[#130c2d] p-1.5 rounded-2xl border border-white/5">
                <button className="px-8 py-2 rounded-xl bg-[#8b31ff] text-sm font-bold shadow-lg shadow-purple-500/20">Live</button>
                <button className="px-8 py-2 rounded-xl text-gray-400 text-sm font-bold hover:text-white transition-colors">Upcoming</button>
            </div>
        </header>
    );
};

export default FeedHeader;
