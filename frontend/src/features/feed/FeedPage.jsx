import React from 'react';
import FeedNavbar from './components/FeedNavbar';
import FeedHeader from './components/FeedHeader';
import CreatePost from './components/CreatePost';
import StoriesBar from './components/StoriesBar';
import FeedGrid from './components/FeedGrid';

const FeedPage = () => {
    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans selection:bg-purple-500/30">
            <FeedNavbar />

            <main className="max-w-7xl mx-auto px-6 py-8">
                <FeedHeader />

                <CreatePost />

                <StoriesBar />

                <FeedGrid />
            </main>
        </div>
    );
};

export default FeedPage;
