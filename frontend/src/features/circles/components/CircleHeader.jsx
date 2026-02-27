import React from 'react';
import { Search } from 'lucide-react';

const CircleHeader = () => {
    return (
        <div className="text-center pt-16 pb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">
                Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Your Circle</span>
            </h1>

            <div className="max-w-2xl mx-auto relative group mb-12">
                {/* Glow behind the search bar */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200"></div>

                <div className="relative flex items-center bg-[#1A1140] border border-white/10 rounded-full px-6 py-4 focus-within:border-purple-500/50 transition-all shadow-2xl">
                    <Search className="text-gray-400 group-focus-within:text-purple-400 transition-colors mr-3" size={20} />
                    <input
                        type="text"
                        placeholder="Search for circles or topics..."
                        className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500 text-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default CircleHeader;
