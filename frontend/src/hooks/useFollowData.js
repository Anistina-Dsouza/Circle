import { useState, useEffect } from 'react';
import axios from 'axios';

const useFollowData = (username) => {
    const [followData, setFollowData] = useState({
        followers: [],
        following: [],
        followersCount: 0,
        followingCount: 0,
        isFollowing: false,
        loading: true,
        error: null
    });

    const baseUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchFollowData = async () => {
            if (!username) return;

            try {
                const token = localStorage.getItem('token');
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

                // Fetch followers and following in parallel
                const [followersRes, followingRes] = await Promise.all([
                    axios.get(`${baseUrl}/api/users/${username}/followers`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${baseUrl}/api/users/${username}/following`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                // Safely extract data from responses
                const extractData = (response) => {
                    if (!response) return [];
                    
                    // Handle different response structures
                    if (response.data?.data) {
                        // Case: { data: { data: [...] } } or { data: { followers: [...] } }
                        return Array.isArray(response.data.data) 
                            ? response.data.data 
                            : (response.data.data?.followers || response.data.data?.following || []);
                    } else if (response.data?.followers) {
                        // Case: { data: { followers: [...] } }
                        return response.data.followers;
                    } else if (response.data?.following) {
                        // Case: { data: { following: [...] } }
                        return response.data.following;
                    } else if (Array.isArray(response.data)) {
                        // Case: direct array
                        return response.data;
                    }
                    
                    return [];
                };

                const followers = extractData(followersRes);
                const following = extractData(followingRes);

                console.log('Extracted data:', { 
                    followers, 
                    following,
                    followersCount: followers.length,
                    followingCount: following.length 
                });

                // Check if current user is in the followers list
                let isFollowing = false;
                if (currentUser?._id && followers.length > 0) {
                    isFollowing = followers.some(follow => {
                        // Handle different follow object structures
                        const followerUser = follow.follower || follow;
                        const followerId = followerUser._id || followerUser;
                        
                        if (typeof followerId === 'object' && followerId._id) {
                            return followerId._id.toString() === currentUser._id.toString();
                        } else if (followerId) {
                            return followerId.toString() === currentUser._id.toString();
                        }
                        return false;
                    });
                }

                console.log('Follow check:', {
                    currentUserId: currentUser?._id,
                    profileUsername: username,
                    followersCount: followers.length,
                    isFollowing
                });

                setFollowData({
                    followers,
                    following,
                    followersCount: followers.length,
                    followingCount: following.length,
                    isFollowing,
                    loading: false,
                    error: null
                });

            } catch (error) {
                console.error('Error fetching follow data:', error);
                console.error('Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                
                setFollowData(prev => ({
                    ...prev,
                    loading: false,
                    error: error.response?.data?.message || 'Failed to load follow data'
                }));
            }
        };

        fetchFollowData();
    }, [username, baseUrl]);

    // Follow user
    const followUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            
            const response = await axios.post(`${baseUrl}/api/users/${userId}/follow`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('Follow response:', response.data);
            
            // Create a new follower object
            const newFollower = {
                follower: {
                    _id: currentUser._id,
                    username: currentUser.username,
                    displayName: currentUser.displayName || currentUser.username,
                    profilePic: currentUser.profilePic
                },
                followedAt: new Date().toISOString()
            };
            
            setFollowData(prev => ({
                ...prev,
                followers: [newFollower, ...prev.followers],
                followersCount: prev.followersCount + 1,
                isFollowing: true
            }));
            
            return { success: true };
        } catch (error) {
            console.error('Follow error:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Failed to follow user' 
            };
        }
    };

    // Unfollow user
    const unfollowUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            
            const response = await axios.delete(`${baseUrl}/api/users/${userId}/unfollow`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('Unfollow response:', response.data);
            
            // Remove current user from followers list
            setFollowData(prev => ({
                ...prev,
                followers: prev.followers.filter(follow => {
                    const followerUser = follow.follower || follow;
                    const followerId = followerUser._id || followerUser;
                    return followerId.toString() !== currentUser._id.toString();
                }),
                followersCount: Math.max(0, prev.followersCount - 1),
                isFollowing: false
            }));
            
            return { success: true };
        } catch (error) {
            console.error('Unfollow error:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Failed to unfollow user' 
            };
        }
    };

    return {
        followers: followData.followers,
        following: followData.following,
        followersCount: followData.followersCount,
        followingCount: followData.followingCount,
        isFollowing: followData.isFollowing,
        loading: followData.loading,
        error: followData.error,
        followUser,
        unfollowUser
    };
};

export default useFollowData;