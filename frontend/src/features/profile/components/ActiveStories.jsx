import React from 'react';
import { Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const StoryCard = ({ story }) => {
    const { username } = useParams();
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/stories/${username}`)}
            className="group relative bg-[#1E1B3A] border border-white/5 hover:border-purple-500/30 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 cursor-pointer aspect-[9/16]"
        >
            {/* Media Content */}
            <div className="absolute inset-0">
                {story.type === 'video' ? (
                    <video
                        src={`${story.image}#t=0.1`}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                        preload="metadata"
                        muted
                        playsInline
                    />
                ) : story.type === 'text' ? (
                    <div
                        className="w-full h-full flex items-center justify-center p-6 text-center overflow-hidden relative"
                        style={{
                            backgroundImage: `url('https://i.pinimg.com/736x/d5/48/96/d54896e952622eee393eb237abb734d1.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="absolute inset-0 bg-black/40" />
                        <p
                            className="text-white text-lg md:text-xl break-words group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100 drop-shadow-xl relative z-10"
                            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
                        >
                            {story.text || story.title}
                        </p>
                    </div>
                ) : (
                    <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                )}
                {/* Dark Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Top Bar: Time badge */}
            <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center space-x-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                    <Clock size={12} className="text-purple-400" />
                    <span className="text-[10px] text-white font-black uppercase tracking-wider">{story.timeLeft}</span>
                </div>
            </div>

            {/* Bottom Content Overlay */}
            {(story.title || story.description) && (
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    {story.title && (
                        <h3 className="text-white font-black text-sm mb-2 leading-tight drop-shadow-lg uppercase tracking-tight">
                            {story.title}
                        </h3>
                    )}
                    {story.description && (
                        <p className="text-gray-300 text-xs leading-relaxed line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                            {story.description}
                        </p>
                    )}

                    {/* Visual Indicator */}
                    <div className="mt-4 w-8 h-1 bg-purple-500 rounded-full group-hover:w-full transition-all duration-700" />
                </div>
            )}
        </div>
    );
};

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
