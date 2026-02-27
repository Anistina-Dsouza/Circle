import React from 'react';
import FeedCard from './FeedCard';

const posts = [
    {
        id: 1,
        user: { name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80' },
        time: '2H LEFT',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80',
        caption: 'Exploring the new digital gallery! The purple lighting is so aesthetic.'
    },
    {
        id: 2,
        user: { name: 'Devin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80' },
        time: '15M LEFT',
        image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80',
        caption: 'Just finished the new design system for the Circle!'
    },
    {
        id: 3,
        user: { name: 'Jordan', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80' },
        time: '5H LEFT',
        image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80',
        caption: 'Coffee vibes for a busy Monday morning.'
    },
    {
        id: 4,
        user: { name: 'Mila', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80' },
        time: '8H LEFT',
        image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80',
        caption: 'The architecture here is just mind-blowing.'
    },
];

const FeedGrid = () => {
    return (
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
            {posts.map(post => (
                <div key={post.id} className="break-inside-avoid mb-6">
                    <FeedCard {...post} />
                </div>
            ))}
        </div>
    );
};

export default FeedGrid;
