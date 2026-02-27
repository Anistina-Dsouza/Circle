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
            const [userRes, storiesRes, followersRes, followingRes] = await Promise.all([
                axios.get(`${baseUrl}/api/users/${username}`),
                axios.get(`${baseUrl}/api/moments/user/${username}`),
                axios.get(`${baseUrl}/api/users/${username}/followers`),
                axios.get(`${baseUrl}/api/users/${username}/following`)
            ]);

            console.log('here is story data frontend: ',storiesRes)
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
                if(response.data.moments && Array.isArray(response.data.moments)){
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
                if (response.data.data?.followers && Array.isArray(response.data.data.followers)) {
                    return response.data.data.followers;
                }
                if (response.data.data?.following && Array.isArray(response.data.data.following)) {
                    return response.data.data.following;
                }
                
                return [];
            };

            // Extract user data
            const profileUser = userRes.data.data || userRes.data;
            console.log("fetching profile",profileUser)
            // Extract arrays safely
            const userStories = extractArray(storiesRes);
            const userFollowers = extractArray(followersRes);
            const userFollowing = extractArray(followingRes);

            console.log('Extracted data:', { 
                profileUser, 
                userStories, 
                userFollowers, 
                userFollowing,
                followersType: Array.isArray(userFollowers) ? 'array' : typeof userFollowers,
                followingType: Array.isArray(userFollowing) ? 'array' : typeof userFollowing
            });

            setUser(profileUser);
            setStories(userStories);
            setFollowers(userFollowers);
            setFollowing(userFollowing);
            
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
            followers: followersArray.length.toLocaleString() || '0',
            following: followingArray.length.toLocaleString() || '0',
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

    // Handle follow/unfollow
    const handleFollowToggle = useCallback(async () => {
        if (!user?._id) return;

        try {
            const token = localStorage.getItem('token');
            
            if (formatUserForHeader()?.isFollowing) {
                // Unfollow
                await axios.delete(`${baseUrl}/api/users/${user._id}/unfollow`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Update followers list - ensure it's an array
                setFollowers(prev => {
                    const prevArray = Array.isArray(prev) ? prev : [];
                    return prevArray.filter(follow => {
                        const followerUser = follow.follower || follow;
                        const followerId = followerUser?._id || followerUser;
                        return followerId?.toString() !== loggedInUser.current?._id?.toString();
                    });
                });
            } else {
                // Follow
                await axios.post(`${baseUrl}/api/users/${user._id}/follow`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Add to followers list
                const newFollower = {
                    follower: {
                        _id: loggedInUser.current._id,
                        username: loggedInUser.current.username,
                        displayName: loggedInUser.current.displayName,
                        profilePic: loggedInUser.current.profilePic
                    }
                };
                
                setFollowers(prev => {
                    const prevArray = Array.isArray(prev) ? prev : [];
                    return [newFollower, ...prevArray];
                });
            }
        } catch (error) {
            console.error('Follow toggle error:', error);
        }
    }, [user, baseUrl, formatUserForHeader]);

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