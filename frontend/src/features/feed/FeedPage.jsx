import React from 'react';
import FeedNavbar from './components/FeedNavbar';
import FeedHeader from './components/FeedHeader';
import CreateStoryBar from './components/CreateStoryBar';
import StoriesBar, { DiscoverGrid } from './components/StoriesBar';
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

                {/* Responsive layout: feed (main) + circles panel (stacks on mobile) */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* feed content */}
                    <div className="w-full lg:flex-1 min-w-0 flex flex-col">
                        <div className="contents">
                            <CreateStoryBar onPostSuccess={handleRefresh} />
                            <StoriesBar key={`stories-${refreshKey}`} onPostSuccess={handleRefresh} />
                            
                            {/* Highlights/Feed Section */}
                            <FeedGrid key={`feed-${refreshKey}`} />

                            {/* My Circles panel (Mobile ONLY) */}
                            <div className="block lg:hidden mb-8">
                                <MyCirclesPanel />
                            </div>
                        </div>
                    </div>

                    {/* My Circles panel (Desktop ONLY: sticky on desktop) */}
                    <div className="hidden lg:block w-80 shrink-0 lg:sticky lg:top-24">
                        <MyCirclesPanel />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FeedPage;
