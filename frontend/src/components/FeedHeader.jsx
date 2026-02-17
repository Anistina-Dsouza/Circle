import React from 'react';

const FeedHeader = () => {
    return (
        <header className="px-6 md:px-10 py-6 md:py-8 flex items-center justify-between sticky top-0 bg-[#050214]/80 backdrop-blur-xl z-20 border-b border-white/5 lg:border-none">
            <div className="flex items-center gap-3 lg:hidden">
                <div className="w-8 h-8 bg-gradient-to-br from-[#8b31ff] to-[#4f18a3] rounded-xl flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <h1 className="text-xl font-bold">Feed</h1>
            </div>

            <h1 className="hidden lg:block text-3xl font-bold">Feed</h1>

            <div className="flex items-center gap-4">
                <div className="flex bg-[#130c2d] p-1 rounded-xl md:rounded-2xl border border-white/5">
                    <button className="px-4 md:px-8 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-[#8b31ff] text-[12px] md:text-sm font-bold shadow-lg shadow-purple-500/20">Live</button>
                    <button className="px-4 md:px-8 py-1.5 md:py-2 rounded-lg md:rounded-xl text-gray-400 text-[12px] md:text-sm font-bold hover:text-white transition-colors">Upcoming</button>
                </div>

                <div className="lg:hidden relative">
                    <img src="https://i.pravatar.cc/150?u=alex" alt="" className="w-8 h-8 rounded-full border border-[#8b31ff]" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#050214] rounded-full"></div>
                </div>
            </div>
        </header>
    );
};

export default FeedHeader;
