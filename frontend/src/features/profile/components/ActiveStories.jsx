import React from 'react';
import { Clock } from 'lucide-react';

const StoryCard = ({ story }) => (
    <div className="group bg-[#1E1B3A] border border-white/5 hover:border-purple-500/30 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer">
        {/* Image */}
        <div className="relative overflow-hidden">
            <img
                src={story.image}
                alt={story.title}
                className="w-full h-44 object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B3A] via-transparent to-transparent" />

            {/* Time badge */}
            <div className="absolute top-3 left-3 flex items-center space-x-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <Clock size={12} className="text-purple-400" />
                <span className="text-xs text-white font-medium">{story.timeLeft}</span>
            </div>
        </div>

        {/* Content */}
        <div className="p-4">
            <h3 className="text-white font-bold mb-1">{story.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{story.description}</p>
        </div>
    </div>
);

const ActiveStories = ({ stories }) => (
    <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                <h2 className="text-xl font-bold text-white">Active Stories</h2>
            </div>
            <button className="text-xs font-semibold text-purple-400 hover:text-purple-300 uppercase tracking-widest transition-colors">
                Live Now
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
            ))}
        </div>
    </div>
);

export default ActiveStories;
