import React from 'react';
import {
    Plus,
    Image as ImageIcon,
    Video as VideoIcon,
    Users
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import RightSidebar from '../components/RightSidebar';

const Home = () => {
    const stories = [
        { id: 1, name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        { id: 2, name: 'Jordan', avatar: 'https://i.pravatar.cc/150?u=jordan' },
        { id: 3, name: 'Mila', avatar: 'https://i.pravatar.cc/150?u=mila' },
    ];

    const posts = [
        {
            id: 1,
            user: 'Sarah',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
            timeLeft: '2H LEFT',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
            caption: 'Exploring the new digital gallery! The purple lighting is so aesthetic.',
        },
        {
            id: 2,
            user: 'Devin',
            avatar: 'https://i.pravatar.cc/150?u=devin',
            timeLeft: '15M LEFT',
            image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5',
            caption: 'Just finished the new design system for the Circle community!',
        },
        {
            id: 3,
            user: 'Jordan',
            avatar: 'https://i.pravatar.cc/150?u=jordan',
            timeLeft: '5H LEFT',
            image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
            caption: 'Morning coffee and coding session. Best way to start the day.',
        },
        {
            id: 4,
            user: 'Mila',
            avatar: 'https://i.pravatar.cc/150?u=mila',
            timeLeft: '8H LEFT',
            image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e',
            caption: 'Abstract thoughts on a Tuesday.',
        }
    ];

    const circles = [
        { id: 1, name: 'Design', icon: <Users size={20} className="text-white" />, count: 3, color: 'bg-purple-600' },
        { id: 2, name: 'Code', icon: <ImageIcon size={20} className="text-white" />, count: 0, color: 'bg-gray-800' },
        { id: 3, name: 'Music', icon: <VideoIcon size={20} className="text-white" />, count: 12, color: 'bg-purple-900' },
        { id: 4, name: 'Gym', icon: <Plus size={20} className="text-white" />, count: 0, color: 'bg-gray-800' },
    ];

    const meetings = [
        { id: 1, title: 'Design Sync: Web V3', time: '14:00 - 15:00', status: 'NOW', attendees: ['https://i.pravatar.cc/150?u=a', 'https://i.pravatar.cc/150?u=b'], extraAttendees: 4, action: 'Join' },
        { id: 2, title: 'Community Town Hall', time: '17:30 - 18:30', status: '', attendees: ['https://i.pravatar.cc/150?u=c', 'https://i.pravatar.cc/150?u=d'], extraAttendees: 22, action: 'RSVP' },
        { id: 3, title: 'Weekly Growth Check', time: 'Tomorrow, 10:00', status: '', attendees: ['https://i.pravatar.cc/150?u=e'], extraAttendees: 2, action: 'RSVP' },
    ];

    return (
        <div className="flex h-screen bg-[#050214] text-white font-sans overflow-hidden">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-grow flex flex-col h-screen overflow-y-auto no-scrollbar">
                <header className="px-10 py-8 flex items-center justify-between sticky top-0 bg-[#050214]/80 backdrop-blur-xl z-20">
                    <h1 className="text-3xl font-bold">Feed</h1>
                    <div className="flex bg-[#130c2d] p-1.5 rounded-2xl border border-white/5">
                        <button className="px-8 py-2 rounded-xl bg-[#8b31ff] text-sm font-bold shadow-lg shadow-purple-500/20">Live</button>
                        <button className="px-8 py-2 rounded-xl text-gray-400 text-sm font-bold hover:text-white transition-colors">Upcoming</button>
                    </div>
                </header>

                {/* Create Post */}
                <div className="px-10 mb-10">
                    <div className="bg-[#130c2d] p-5 rounded-[2.5rem] flex items-center gap-5 border border-white/5">
                        <img src="https://i.pravatar.cc/150?u=alex" alt="" className="w-12 h-12 rounded-full" />
                        <input
                            type="text"
                            placeholder="Share a moment with your circles..."
                            className="bg-transparent flex-grow outline-none text-base text-gray-300 placeholder:text-gray-500"
                        />
                        <div className="flex items-center gap-4">
                            <ImageIcon size={22} className="text-gray-400 cursor-pointer hover:text-white transition-colors" />
                            <VideoIcon size={22} className="text-gray-400 cursor-pointer hover:text-white transition-colors" />
                            <button className="bg-[#8b31ff] px-8 py-3 rounded-2xl text-sm font-black tracking-widest hover:bg-[#7c28eb] transition-all transform active:scale-95 shadow-lg shadow-purple-500/20">POST</button>
                        </div>
                    </div>
                </div>

                {/* Stories */}
                <div className="px-10 flex gap-8 mb-10 overflow-x-auto no-scrollbar">
                    <div className="flex flex-col items-center gap-3 shrink-0">
                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#8b31ff]/40 flex items-center justify-center cursor-pointer hover:border-[#8b31ff] transition-all group">
                            <Plus size={28} className="text-[#8b31ff] group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-[13px] font-medium text-gray-400">Add Story</span>
                    </div>
                    {stories.map(story => (
                        <div key={story.id} className="flex flex-col items-center gap-3 shrink-0 cursor-pointer group">
                            <div className="w-20 h-20 rounded-full p-[3px] border-2 border-[#8b31ff] transition-transform group-hover:scale-105">
                                <img src={story.avatar} alt={story.name} className="w-full h-full rounded-full object-cover border-2 border-[#050214]" />
                            </div>
                            <span className="text-[13px] font-medium text-gray-400 group-hover:text-white transition-colors">{story.name}</span>
                        </div>
                    ))}
                </div>

                {/* Post Grid */}
                <div className="px-10 grid grid-cols-2 gap-8 pb-12">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </main>

            <RightSidebar circles={circles} meetings={meetings} />
        </div>
    );
};

export default Home;
