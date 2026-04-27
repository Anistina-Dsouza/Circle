import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FeedNavbar from '../feed/components/FeedNavbar';
import ProfileHeader from './components/ProfileHeader';
import ActiveStories from './components/ActiveStories';
//import { useAuth } from '../../';
import FollowListModal from './components/FollowListModal';
const ProfilePage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_URL;

    const [user, setUser] = useState(null);
    const [stories, setStories] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [currentUserFollowing, setCurrentUserFollowing] = useState([]);

    // Modal states
    // Modal states (Moved to ProfileHeader)
    // const [modalOpen, setModalOpen] = useState(false);
    // const [modalType, setModalType] = useState(null);

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

    // Fetch profile data
    const fetchProfileData = useCallback(async () => {
        if (!username) return;

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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

            if (!isMounted.current) return;

            const extractArray = (response) => {
                if (!response?.data) return [];

                if (response.data.data && Array.isArray(response.data.data)) {
                    return response.data.data;
                }

                if (Array.isArray(response.data)) {
                    return response.data;
                }

                if (response.data.followers && Array.isArray(response.data.followers)) {
                    return response.data.followers;
                }
                if (response.data.following && Array.isArray(response.data.following)) {
                    return response.data.following;
                }

                if (response.data.moments && Array.isArray(response.data.moments)) {
                    return response.data.moments;
                }

                return [];
            };

            // Handle each response safely
            const profileUser = userRes.data.user || userRes.data.data || userRes.data;
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
            } else if (!isOwnProfile && loggedInUser.current?.username) {
                // If we didn't get a specific following res but we need it, try a fallback or just empty
                setCurrentUserFollowing([]);
            }

            // Check if current user follows this profile
            if (loggedInUser.current && !isOwnProfile) {
                const isUserFollowing = userFollowers.some(follow => {
                    const followerUser = follow.follower || follow;
                    const followerId = followerUser?._id || followerUser;
                    return followerId?.toString() === loggedInUser.current._id?.toString();
                });
                setIsFollowing(isUserFollowing);
            }

        } catch (err) {
            console.error('Error fetching profile data:', err);

            if (!isMounted.current) return;

            setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to load profile');

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
        isMounted.current = true;
        fetchProfileData();
        return () => {
            isMounted.current = false;
        };
    }, [fetchProfileData]); // Only depend on fetchProfileData

    // Format user data
    const formatUserForHeader = useCallback(() => {
        if (!user) return null;

        // Ensure followers is an array
        const followersArray = Array.isArray(followers) ? followers : [];
        // const followingArray = Array.isArray(following) ? following : [];


        // Check if current user is following this profile
        let isFollowing = false;
        if (loggedInUser.current?._id && followersArray.length > 0) {
            isFollowing = followersArray.some(follow => {
                if (!follow) return false;
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
            _id: user._id || user.id,
            username: user.username,
            name: user.displayName || user.username,
            bio: user.bio || 'No bio yet',
            avatar: user.profilePic || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
            followers: (followers.length || 0).toLocaleString(),
            following: (following.length || 0).toLocaleString(),
            stories: (user.stats?.momentCount || stories.length || 0).toLocaleString(),
            isFollowing: isFollowing
        };
    }, [user, followers, following, stories]);

    // Format stories
    const formatStoriesForDisplay = useCallback(() => {
        const storiesArray = Array.isArray(stories) ? stories : [];
        if (!storiesArray.length) return [];

        return storiesArray.filter(s => s && s.media).map(story => {
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
                title: story.caption || '',
                description: '',
                timeLeft: timeLeftText,
                image: story.media?.url || 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                type: story.media?.type || 'image',
            };
        });
    }, [stories]);

    // Core follow/unfollow function
    // const toggleFollow = useCallback(async (targetUserId, targetUsername) => {
    //     if (!targetUserId || !loggedInUser) return false;
    //
    //     try {
    //         const token = localStorage.getItem('token');
    //
    //         // Check current follow status
    //         const isCurrentlyFollowing = following.some(f => {
    //             const fUser = f.following || f;
    //             return (fUser._id || fUser).toString() === targetUserId.toString();
    //         });
    //
    //         if (isCurrentlyFollowing) {
    //             // Unfollow
    //             await axios.delete(`${baseUrl}/api/users/${targetUserId}/unfollow`, {
    //                 headers: { Authorization: `Bearer ${token}` }
    //             });
    //             console.log(`Unfollowed user: ${targetUsername}`);
    //         } else {
    //             // Follow
    //             await axios.post(`${baseUrl}/api/users/${targetUserId}/follow`, {}, {
    //                 headers: { Authorization: `Bearer ${token}` }
    //             });
    //             console.log(`Followed user: ${targetUsername}`);
    //         }
    //
    //         return true; // Success
    //     } catch (error) {
    //         console.error('Follow toggle error:', error);
    //         return false; // Failed
    //     }
    // }, [baseUrl, following, loggedInUser]);

    // Handle follow/unfollow from profile header
    const handleProfileFollowToggle = useCallback(async (targetUserId) => {
        if (!targetUserId || !loggedInUser.current) return;

        const previousIsFollowing = isFollowing;
        const previousFollowers = [...followers];

        try {
            const token = localStorage.getItem('token');

            // Optimistic update
            setIsFollowing(!isFollowing);

            if (isFollowing) {
                // Unfollow - remove current user from followers list
                setFollowers(prev => {
                    const prevArray = Array.isArray(prev) ? prev : [];
                    return prevArray.filter(follow => {
                        const followerUser = follow.follower || follow;
                        const followerId = followerUser?._id || followerUser;
                        return followerId?.toString() !== loggedInUser.current._id?.toString();
                    });
                });

                // Also update currentUserFollowing
                setCurrentUserFollowing(prev => prev.filter(f => (f._id || f).toString() !== targetUserId.toString()));

                await axios.delete(`${baseUrl}/api/users/${targetUserId}/unfollow`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Follow - add current user to followers list
                const newFollower = {
                    _id: loggedInUser.current._id,
                    username: loggedInUser.current.username,
                    displayName: loggedInUser.current.displayName,
                    profilePic: loggedInUser.current.profilePic
                };

                setFollowers(prev => {
                    const prevArray = Array.isArray(prev) ? prev : [];
                    return [newFollower, ...prevArray];
                });

                // Also update currentUserFollowing
                setCurrentUserFollowing(prev => [...prev, newFollower]);

                await axios.post(`${baseUrl}/api/users/${targetUserId}/follow`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error('Profile follow toggle error:', error);
            // Revert on error
            setIsFollowing(previousIsFollowing);
            setFollowers(previousFollowers);
        }
    }, [isFollowing, followers, loggedInUser, baseUrl]);

    // Helper to extract follow data from API response
    const extractFollowData = (data) => {
        if (data?.followers) return data.followers;
        if (data?.following) return data.following;
        if (Array.isArray(data)) return data;
        if (data?.data && Array.isArray(data.data)) return data.data;
        return [];
    };

    // Handle follow/unfollow from modals
    const handleModalFollowToggle = useCallback(async (targetUserId) => {
        if (!targetUserId || !loggedInUser.current) return false;

        // Prevent action on own profile
        if (targetUserId === loggedInUser.current._id?.toString()) {
            console.log('Cannot follow/unfollow yourself');
            return false;
        }

        try {
            const token = localStorage.getItem('token');

            // Check current follow status from the CURRENT USER's following list
            const isCurrentlyFollowing = currentUserFollowing.some(f => {
                const fUserId = f._id || f.id || f;
                return fUserId.toString() === targetUserId.toString();
            });


            if (isCurrentlyFollowing) {
                // Unfollow
                await axios.delete(`${baseUrl}/api/users/${targetUserId}/unfollow`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Follow
                await axios.post(`${baseUrl}/api/users/${targetUserId}/follow`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            // Refresh lists
            const requests = [];

            // Always refresh current profile lists to show updated counts if it's the target
            requests.push(axios.get(`${baseUrl}/api/users/${username}/followers`));
            requests.push(axios.get(`${baseUrl}/api/users/${username}/following`));

            // Also refresh logged in user's following list if it's not the same profile
            if (!isOwnProfile) {
                requests.push(axios.get(`${baseUrl}/api/users/${loggedInUser.current.username}/following`));
            }

            const results = await Promise.all(requests);

            setFollowers(extractFollowData(results[0].data));
            setFollowing(extractFollowData(results[1].data));

            if (!isOwnProfile) {
                setCurrentUserFollowing(extractFollowData(results[2].data));
            } else {
                setCurrentUserFollowing(extractFollowData(results[1].data));
            }

            return true;

        } catch (error) {
            console.error('Modal follow toggle error:', error);
            return false;
        }
    }, [baseUrl, username, currentUserFollowing, loggedInUser, isOwnProfile]);

    // Format follows for modal display
    const formatFollowsForModal = useCallback((followsArray) => {
        const array = Array.isArray(followsArray) ? followsArray : [];

        return array.filter(f => f).map(follow => {
            const userData = (follow && typeof follow === 'object') ? (follow.follower || follow.following || follow) : null;
            
            if (!userData) {
                return {
                    _id: 'deleted',
                    name: 'Deleted User',
                    username: 'deleted',
                    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
                    isFollowing: false,
                    isOwnProfile: false
                };
            }

            // Check if logged in user is following this specific user
            const isUserFollowing = loggedInUser.current ? currentUserFollowing.some(f => {
                const fUserId = f._id || f.id || f;
                return fUserId.toString() === (userData._id || userData.id || userData).toString();
            }) : false;

            return {
                _id: userData._id || userData.id,
                name: userData.displayName || userData.username || 'User',
                username: userData.username || 'unknown',
                avatar: userData.profilePic || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
                isFollowing: isUserFollowing,
                isOwnProfile: loggedInUser.current?.username === userData.username
            };
        });
    }, [currentUserFollowing]);

    // Open modal
    // Open modal
    // const openModal = (type) => {
    //     setModalType(type);
    //     setModalOpen(true);
    // };

    // Close modal
    // const closeModal = () => {
    //     setModalOpen(false);
    //     setModalType(null);
    // };

    // Handle initialising or opening chat
    const handleMessageClick = async (targetUserId) => {
        if (!targetUserId || !loggedInUser.current) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${baseUrl}/api/dm/conversations`,
                { recipientId: targetUserId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const conversationId = res.data.conversation._id;
            navigate('/messages', { state: { selectedChat: conversationId } });
        } catch (error) {
            console.error('Failed to initiate conversation:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F0529] text-white font-sans">
                <FeedNavbar />
                <main className="max-w-5xl mx-auto px-6 py-8 flex flex-col items-center">
                    {/* Header Skeleton - Center Aligned */}
                    <div className="w-full flex flex-col items-center text-center pt-10 pb-6 animate-pulse">
                        {/* Avatar Skeleton */}
                        <div className="w-32 h-32 rounded-full bg-white/10 border-4 border-white/5 mb-6" />

                        {/* Name & Bio Skeleton */}
                        <div className="h-8 w-48 bg-white/10 rounded-xl mb-3" />
                        <div className="h-4 w-64 bg-white/5 rounded-lg mb-8" />

                        {/* Buttons Skeleton */}
                        <div className="flex items-center space-x-3 mb-10">
                            <div className="h-10 w-32 bg-white/10 rounded-full" />
                            <div className="h-10 w-32 bg-white/10 rounded-full" />
                        </div>

                        {/* Stats Row Skeleton */}
                        <div className="flex items-center space-x-4 w-full max-w-lg mb-12">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex-1 h-24 bg-[#1E1B3A] border border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-2">
                                    <div className="h-6 w-10 bg-white/10 rounded" />
                                    <div className="h-2 w-16 bg-white/5 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stories Grid Skeleton */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-[4/5] bg-white/5 rounded-[3rem] animate-pulse overflow-hidden p-8 border border-white/5">
                                <div className="h-3/4 w-full bg-white/10 rounded-[2rem] mb-6" />
                                <div className="space-y-3">
                                    <div className="h-4 w-2/3 bg-white/10 rounded" />
                                    <div className="h-3 w-1/2 bg-white/5 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
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
    const formattedFollowers = formatFollowsForModal(followers);
    const formattedFollowing = formatFollowsForModal(following);

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans selection:bg-purple-500/30">
            <FeedNavbar />

            <main className="max-w-5xl mx-auto px-6 py-8">
                {headerUser && (
                    <ProfileHeader
                        user={headerUser}
                        isOwnProfile={isOwnProfile}
                        onFollowToggle={(userId) => handleProfileFollowToggle(userId)}     // For header button
                        onModalFollowToggle={handleModalFollowToggle}                      // For modals
                        onMessageClick={() => handleMessageClick(headerUser._id)}          // For message button
                        followers={formattedFollowers}
                        following={formattedFollowing}
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



                <div className="h-16" />
            </main>
        </div>
    );
};

export default ProfilePage;