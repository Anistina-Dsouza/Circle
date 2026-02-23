import React from 'react';
import { Image, Video, Send } from 'lucide-react';

const CreatePost = () => {
    return (
        <div className="bg-[#1E1B3A]/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 mb-8 shadow-lg shadow-purple-900/10">
            <div className="flex items-center space-x-4">
                <img
                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-purple-500/30 object-cover"
                />
                <div className="flex-1 bg-[#2D2A4A]/50 rounded-full px-6 py-3 border border-white/5 hover:border-purple-500/30 transition-colors focus-within:border-purple-500/50">
                    <input
                        type="text"
                        placeholder="Share a moment with your circles..."
                        className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-3 text-purple-400 hover:bg-purple-500/10 rounded-full transition-colors">
                        <Image size={24} />
                    </button>
                    <button className="p-3 text-pink-400 hover:bg-pink-500/10 rounded-full transition-colors">
                        <Video size={24} />
                    </button>
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all hover:scale-105 active:scale-95 flex items-center space-x-2">
                        <span>POST</span>
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
