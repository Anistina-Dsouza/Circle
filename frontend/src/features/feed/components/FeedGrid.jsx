import React from 'react';
import FeedCard from './FeedCard';

const posts = []; 

const FeedGrid = ({ loading = false }) => {
    if (loading) return (
        <div className="columns-1 md:columns-2 gap-8 space-y-8">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="break-inside-avoid relative overflow-hidden rounded-[2.5rem] mb-10 bg-white/5 border border-white/5 animate-pulse aspect-[4/5]">
                    {/* Top Section Simulation */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
                            <div className="w-6 h-6 rounded-full bg-white/20" />
                            <div className="h-3 w-16 bg-white/20 rounded-full" />
                        </div>
                        <div className="h-7 w-20 bg-white/20 rounded-full" />
                    </div>

                    {/* Image Area Simulation */}
                    <div className="w-full h-full bg-white/[0.02]" />

                    {/* Bottom Section Simulation */}
                    <div className="absolute bottom-10 left-8 right-8 z-10 space-y-3">
                        <div className="h-5 w-full bg-white/10 rounded-xl" />
                        <div className="h-5 w-4/5 bg-white/5 rounded-xl" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="columns-1 md:columns-2 gap-8 space-y-8">
            {posts.map(post => (
                <div key={post.id} className="break-inside-avoid mb-10">
                    <FeedCard {...post} />
                </div>
            ))}
        </div>
    );
};

export default FeedGrid;
