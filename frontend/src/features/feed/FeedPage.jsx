import React from 'react';
import FeedNavbar from './components/FeedNavbar';
import FeedHeader from './components/FeedHeader';
import CreateStoryBar from './components/CreateStoryBar';
import StoriesBar from './components/StoriesBar';
import FeedGrid from './components/FeedGrid';
import MyCirclesPanel from '../circles/components/MyCirclesPanel';

const FeedPage = () => {
    const [refreshKey, setRefreshKey] = React.useState(0);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans selection:bg-purple-500/30">
            <FeedNavbar />

            <main className="max-w-7xl mx-auto px-6 py-8">
                <FeedHeader />

                {/* Two-column layout: feed (left) + circles panel (right) */}
                <div className="flex gap-8 items-start">
                    {/* Left: feed content */}
                    <div className="flex-1 min-w-0">
                        <CreateStoryBar onPostSuccess={handleRefresh} />
                        <StoriesBar key={`stories-${refreshKey}`} onPostSuccess={handleRefresh} />
                        <FeedGrid key={`feed-${refreshKey}`} />
                    </div>

                    {/* Right: My Circles panel (hidden on small screens) */}
                    <div className="hidden lg:block">
                        <MyCirclesPanel />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FeedPage;
