import React, { useState } from 'react';
import {
    Plus,
    Image as ImageIcon,
    Video as VideoIcon,
    Users
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import RightSidebar from '../components/RightSidebar';
import CreatePost from '../components/CreatePost';
import StoryList from '../components/StoryList';
import FeedHeader from '../components/FeedHeader';

const Home = () => {
    const initialStories = [
        { id: 1, name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        { id: 2, name: 'Jordan', avatar: 'https://i.pravatar.cc/150?u=jordan' },
        { id: 3, name: 'Mila', avatar: 'https://i.pravatar.cc/150?u=mila' },
    ];

    const initialPosts = [
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

    const [posts, setPosts] = useState(initialPosts);
    const [stories] = useState(initialStories);

    const handleNewPost = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    return (
        <div className="flex h-screen bg-[#050214] text-white font-sans overflow-hidden">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-grow flex flex-col h-screen overflow-y-auto no-scrollbar">
                <FeedHeader />

                <CreatePost onPost={handleNewPost} />

                <StoryList stories={stories} />

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
