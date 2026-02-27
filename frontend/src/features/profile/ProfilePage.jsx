import React from 'react';
import { useParams } from 'react-router-dom';
import FeedNavbar from '../feed/components/FeedNavbar';
import ProfileHeader from './components/ProfileHeader';
import ActiveStories from './components/ActiveStories';

// --- Static mock data ---
const mockUser = {
    username: 'elena_rodriguez',
    name: 'Elena Rodriguez',
    bio: 'Visual storyteller & digital architect. Exploring the intersection of time and social connection through the lens of Circle.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    followers: '2.4k',
    following: '842',
    stories: '856',
};

const mockStories = [
    {
        id: 1,
        title: 'Dusk in the City',
        description: 'Capturing the long shadows and violet hues of the bay area.',
        timeLeft: '12h left',
        image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 2,
        title: 'Form & Function',
        description: "Today's architectural study in the heart of downtown.",
        timeLeft: '4h left',
        image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 3,
        title: 'Morning Rituals',
        description: 'First brew of the day. Join me for a quick circle chat.',
        timeLeft: '22h left',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
];
// ------------------------

const ProfilePage = () => {
    const { username } = useParams();

    // Determine if this is the logged-in user's own profile
    const loggedInUser = (() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    })();

    const isOwnProfile = loggedInUser?.username === username;

    // In a real app you'd fetch the profile by username.
    // Use loggedInUser if it's own profile, otherwise fallback to mock
    const user = isOwnProfile ? {
        ...mockUser,
        ...loggedInUser,
        name: loggedInUser.displayName || loggedInUser.username,
        avatar: loggedInUser.profilePic || mockUser.avatar
    } : { ...mockUser, username: username || mockUser.username };

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans selection:bg-purple-500/30">
            <FeedNavbar />

            <main className="max-w-5xl mx-auto px-6 py-8">
                <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
                <ActiveStories stories={mockStories} />

                {/* Bottom spacing */}
                <div className="h-16" />
            </main>
        </div>
    );
};

export default ProfilePage;
