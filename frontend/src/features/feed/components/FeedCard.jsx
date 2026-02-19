import React from 'react';

const FeedCard = ({ user, time, caption, image }) => {
    return (
        <div className="group relative overflow-hidden rounded-3xl mb-6 bg-[#1E1B3A] border border-white/5 hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 z-10" />

            <img
                src={image}
                alt={caption}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
            />

            {/* Top Section */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full border border-white/50" />
                    <span className="text-sm font-medium text-white">{user.name}</span>
                </div>

                <span className="bg-[#7C3AED]/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-lg border border-white/10">
                    {time}
                </span>
            </div>

            {/* Bottom Section */}
            <div className="absolute bottom-6 left-6 right-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-medium leading-relaxed drop-shadow-md">
                    {caption}
                </p>
            </div>
        </div>
    );
};

export default FeedCard;
