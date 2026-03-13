import React from 'react';
import FeedNavbar from './components/FeedNavbar';
import FeedHeader from './components/FeedHeader';
import CreateStoryBar from './components/CreateStoryBar';
import StoriesBar from './components/StoriesBar';
import FeedGrid from './components/FeedGrid';

const FeedPage = () => {
    const [refreshKey, setRefreshKey] = React.useState(0);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-[#0F0529] text-white  font-sans selection:bg-purple-500/30">
            <FeedNavbar />

            <main className="max-w-7xl mx-auto  px-6 py-8">
                <FeedHeader />

                <CreateStoryBar onPostSuccess={handleRefresh} />

                <StoriesBar key={`stories-${refreshKey}`} onPostSuccess={handleRefresh} />

                <FeedGrid key={`feed-${refreshKey}`} />
            </main>
        </div>
    );
};

export default FeedPage;
