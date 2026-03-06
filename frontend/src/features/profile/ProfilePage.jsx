import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import FeedNavbar from '../feed/components/FeedNavbar';
import ProfileHeader from './components/ProfileHeader';
import ActiveStories from './components/ActiveStories';

const ProfilePage = () => {
    const { username } = useParams();
    const baseUrl = import.meta.env.VITE_API_URL;

    const [user, setUser] = useState(null);
    const [stories, setStories] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserFollowing, setCurrentUserFollowing] = useState([]);

    // Use ref to track if component is mounted
    const isMounted = useRef(true);

    // Get logged-in user from localStorage - memoize this
    const loggedInUser = useRef(null);
    // Initialize loggedInUser once
    if (!loggedInUser.current) {
        try {
            const stored = localStorage.getItem('user');
            loggedInUser.current = stored ? JSON.parse(stored) : null;

        } catch {
            loggedInUser.current = null;
        }
    }

    const isOwnProfile = loggedInUser.current?.username === username;

    // Memoize the fetch function
    const fetchProfileData = useCallback(async () => {
        if (!username) return;

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Set auth header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Fetch all data in parallel
            // We also fetch logged in user's following list to show correct follow status in modals
            const requests = [
                axios.get(`${baseUrl}/api/users/${username}`),
                axios.get(`${baseUrl}/api/moments/user/${username}`),
                axios.get(`${baseUrl}/api/users/${username}/followers`),
                axios.get(`${baseUrl}/api/users/${username}/following`)
            ];

            if (!isOwnProfile && loggedInUser.current?.username) {
                requests.push(axios.get(`${baseUrl}/api/users/${loggedInUser.current.username}/following`));
            }

            const results = await Promise.all(requests);
            const [userRes, storiesRes, followersRes, followingRes, currentUserFollowingRes] = results;

            // Only update state if component is still mounted
            if (!isMounted.current) return;
            console.log('Raw API Responses:', {
                user: userRes.data,
                stories: storiesRes.data.moments,
                followers: followersRes.data,
                following: followingRes.data
            });

            // Helper function to safely extract array data
            const extractArray = (response) => {
                if (!response?.data) return [];

                // Case 1: { data: { data: [...] } }
                if (response.data.data && Array.isArray(response.data.data)) {
                    return response.data.data;
                }

                // Case 2: { data: [...] }
                if (Array.isArray(response.data)) {
                    return response.data;
                }
                if (response.data.moments && Array.isArray(response.data.moments)) {
                    return response.data.moments;
                }
                // Case 3: { data: { followers: [...] } } or { data: { following: [...] } }
                if (response.data.followers && Array.isArray(response.data.followers)) {
                    return response.data.followers;
                }
                if (response.data.following && Array.isArray(response.data.following)) {
                    return response.data.following;
                }

                // Case 4: { data: { data: { followers: [...] } } }
                if (response.data?.data?.followers && Array.isArray(response.data.data.followers)) {
                    return response.data.data.followers;
                }
                if (response.data.data?.following && Array.isArray(response.data.data.following)) {
                    return response.data.data.following;
                }

                return [];
            };

            // Extract user data
            const profileUser = userRes.data.user || userRes.data.data || userRes.data;
            // Extract arrays safely
            const userStories = extractArray(storiesRes);
            const userFollowers = extractArray(followersRes);
            const userFollowing = extractArray(followingRes);


            setUser(profileUser);
            setStories(userStories);
            setFollowers(userFollowers);
            setFollowing(userFollowing);

            if (isOwnProfile) {
                setCurrentUserFollowing(userFollowing);
            } else if (currentUserFollowingRes) {
                setCurrentUserFollowing(extractArray(currentUserFollowingRes));
            }

        } catch (err) {
            console.error('Error fetching profile data:', err);

            // Only update state if component is still mounted
            if (!isMounted.current) return;

            setError(err.response?.data?.message || err.message || 'Failed to load profile');

            // If it's own profile and API fails, fallback to localStorage data
            if (isOwnProfile && loggedInUser.current) {
                setUser({
                    username: loggedInUser.current.username,
                    displayName: loggedInUser.current.displayName || loggedInUser.current.username,
                    bio: loggedInUser.current.bio || 'No bio yet',
                    profilePic: loggedInUser.current.profilePic,
                    stats: loggedInUser.current.stats || {
                        followerCount: 0,
                        followingCount: 0,
                        momentCount: 0
                    }
                });
                setStories([]);
                setFollowers([]);
                setFollowing([]);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, [username, baseUrl, isOwnProfile]); // Remove loggedInUser from dependencies

    useEffect(() => {
        // Set mounted flag
        isMounted.current = true;

        // Fetch data
        fetchProfileData();

        // Cleanup function to prevent state updates on unmounted component
        return () => {
            isMounted.current = false;
        };
    }, [fetchProfileData]); // Only depend on fetchProfileData

    // Format user data to match mockUser structure
    const formatUserForHeader = useCallback(() => {
        if (!user) return null;

        // Ensure followers is an array
        const followersArray = Array.isArray(followers) ? followers : [];
        const followingArray = Array.isArray(following) ? following : [];

        // Check if current user is following this profile
        let isFollowing = false;
        if (loggedInUser.current?._id && followersArray.length > 0) {
            isFollowing = followersArray.some(follow => {
                // Handle different follow object structures
                const followerUser = follow.follower || follow;
                const followerId = followerUser?._id || followerUser;

                if (followerId) {
                    return followerId.toString() === loggedInUser.current._id.toString();
                }
                return false;
            });
        }

        return {
            username: user.username,
            name: user.displayName || user.username,
            bio: user.bio || 'No bio yet',
            avatar: user.profilePic || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
            followers: (followers.length || 0).toLocaleString(),
            following: (following.length || 0).toLocaleString(),
            stories: (user.stats?.momentCount || stories.length || 0).toLocaleString(),
            _id: user._id,
            isFollowing
        };
    }, [user, followers, following, stories]);

    // Format stories to match mockStories structure
    const formatStoriesForDisplay = useCallback(() => {
        const storiesArray = Array.isArray(stories) ? stories : [];
        if (!storiesArray.length) return [];

        return storiesArray.map(story => {
            // Calculate time left
            const expiresAt = new Date(story.expiresAt);
            const now = new Date();
            const hoursLeft = Math.max(0, Math.floor((expiresAt - now) / (1000 * 60 * 60)));

            let timeLeftText = '';
            if (hoursLeft > 0) {
                timeLeftText = `${hoursLeft}h left`;
            } else {
                timeLeftText = 'Expiring soon';
            }

            return {
                id: story._id || story.id,
                title: story.caption || 'Untitled Moment',
                description: story.caption || 'No description',
                timeLeft: timeLeftText,
                image: story.media?.url || 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            };
        });
    }, [stories]);

    // Format follows to match FollowListModal structure
    const formatFollowsForDisplay = useCallback((followsArray) => {
        const array = Array.isArray(followsArray) ? followsArray : [];
        return array.map(follow => {
            // Handle different follow object structures (sometimes it's { follower: { ... } }, sometimes it's the user directly)
            const userData = follow.follower || follow.following || follow;

            // Check if logged in user is following this specific user
            // We now use the logged-in user's following list
            const isFollowing = Array.isArray(currentUserFollowing) && currentUserFollowing.some(f => {
                const fUser = f.following || f;
                return (fUser._id || fUser).toString() === (userData._id || userData).toString();
            });

            return {
                _id: userData._id || userData.id,
                name: userData.displayName || userData.username || 'User',
                username: userData.username || 'unknown',
                avatar: userData.profilePic || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
                isFollowing: isFollowing,
                isOnline: false // We don't have this info from follows API usually
            };
        });
    }, [currentUserFollowing]);

    // Handle follow/unfollow
    const handleFollowToggle = useCallback(async (targetUserId) => {
        const idToToggle = targetUserId || user?._id;
        if (!idToToggle) return;

        // Check if we are currently following this specific user
        const isCurrentlyFollowing = targetUserId
            ? following.some(f => (f.following?._id || f._id || f).toString() === targetUserId.toString())
            : formatUserForHeader()?.isFollowing;

        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_URL;

            if (isCurrentlyFollowing) {
                // Unfollow
                await axios.delete(`${baseUrl}/api/users/${idToToggle}/unfollow`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Update current user's following list locally
                setCurrentUserFollowing(prev => prev.filter(f => {
                    const fUser = f.following || f;
                    return (fUser._id || fUser).toString() !== idToToggle.toString();
                }));

                // If this is the own profile we're viewing, update the following state too
                if (isOwnProfile) {
                    setFollowing(prev => prev.filter(f => {
                        const fUser = f.following || f;
                        return (fUser._id || fUser).toString() !== idToToggle.toString();
                    }));
                }

                // If we unfollowed the profile we are looking at, update followers list and count too
                if (!isOwnProfile && idToToggle === user?._id) {
                    setFollowers(prev => prev.filter(f => {
                        const fUser = f.follower || f;
                        return (fUser._id || fUser).toString() !== loggedInUser.current?._id?.toString();
                    }));

                    setUser(prev => ({
                        ...prev,
                        stats: {
                            ...prev.stats,
                            followerCount: Math.max(0, (prev.stats?.followerCount || 0) - 1)
                        }
                    }));
                }
            } else {
                // Follow
                await axios.post(`${baseUrl}/api/users/${idToToggle}/follow`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Add to current user's following list
                const newFollowing = {
                    following: {
                        _id: idToToggle,
                        // We might not have full data for this user
                    }
                };
                setCurrentUserFollowing(prev => [newFollowing, ...prev]);

                // If this is the own profile we're viewing, update the following state too
                if (isOwnProfile) {
                    setFollowing(prev => [newFollowing, ...prev]);
                }

                // If we followed the profile we are looking at, update followers list and count too
                if (!isOwnProfile && idToToggle === user?._id) {
                    const newFollower = {
                        follower: {
                            _id: loggedInUser.current._id,
                            username: loggedInUser.current.username,
                            displayName: loggedInUser.current.displayName,
                            profilePic: loggedInUser.current.profilePic
                        }
                    };
                    setFollowers(prev => [newFollower, ...prev]);

                    setUser(prev => ({
                        ...prev,
                        stats: {
                            ...prev.stats,
                            followerCount: (prev.stats?.followerCount || 0) + 1
                        }
                    }));
                }
            }
        } catch (error) {
            console.error('Follow toggle error:', error);
        }
    }, [user, baseUrl, currentUserFollowing, isOwnProfile, formatUserForHeader]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F0529] text-white font-sans">
                <FeedNavbar />
                <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                    <div className="text-center">
                        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="min-h-screen bg-[#0F0529] text-white font-sans">
                <FeedNavbar />
                <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                    <div className="text-center max-w-md px-6">
                        <div className="text-6xl mb-4">😕</div>
                        <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
                        <p className="text-gray-400 mb-6">{error}</p>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const headerUser = formatUserForHeader();
    const displayStories = formatStoriesForDisplay();

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans selection:bg-purple-500/30">
            <FeedNavbar />

            <main className="max-w-5xl mx-auto px-6 py-8">
                {headerUser && (
                    <ProfileHeader
                        user={headerUser}
                        isOwnProfile={isOwnProfile}
                        onFollowToggle={handleFollowToggle}
                        followers={formatFollowsForDisplay(followers)}
                        following={formatFollowsForDisplay(following)}
                    />
                )}

                {displayStories.length > 0 ? (
                    <ActiveStories stories={displayStories} />
                ) : (
                    <div className="mt-10 text-center py-16 bg-white/5 rounded-2xl">
                        <div className="text-6xl mb-4">📸</div>
                        <h3 className="text-xl font-semibold mb-2">No Moments Yet</h3>
                        <p className="text-gray-400">
                            {isOwnProfile
                                ? "You haven't shared any moments. Create your first moment!"
                                : `${headerUser?.name} hasn't shared any moments yet.`}
                        </p>
                    </div>
                )}

                {/* Bottom spacing */}
                <div className="h-16" />
            </main>
        </div>
    );
};

export default ProfilePage;