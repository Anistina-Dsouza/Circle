import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, Users, Compass } from 'lucide-react';
import FeedNavbar from '../feed/components/FeedNavbar';
import UserCard from './components/UserCard';
import useFollowData from '../../hooks/useFollowData';

const ExploreUsersPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseUrl = import.meta.env.VITE_API_URL;

    // Use current user's follow data for the buttons
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const { following: currentUserFollowing, followUser, unfollowUser } = useFollowData(currentUser.username);

    const fetchSuggestedUsers = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${baseUrl}/api/users/suggestions`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const filtered = (response.data.users || []).filter(u => 
                    u.username?.toLowerCase() !== 'admin' && u.role !== 'admin'
                );
                setUsers(filtered);
            }
        } catch (err) {
            console.error('Error fetching suggestions:', err);
            // If suggestions fail, fall back to a generic search so the page isn't empty
            fetchUsers('a');
        } finally {
            setLoading(false);
        }
    }, [baseUrl]);

    const fetchUsers = useCallback(async (query = '') => {
        if (query.length < 2) return;

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${baseUrl}/api/users/search?q=${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const filtered = (response.data.users || []).filter(u => 
                    u.username?.toLowerCase() !== 'admin' && u.role !== 'admin'
                );
                setUsers(filtered);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to search users. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [baseUrl]);

    // Initial load: Fetch suggested users
    useEffect(() => {
        fetchSuggestedUsers();
    }, [fetchSuggestedUsers]);

    // Debounced search
    useEffect(() => {
        // If query is too short but not empty, do nothing
        if (searchQuery.length > 0 && searchQuery.length < 2) return;

        const timer = setTimeout(() => {
            if (searchQuery.length >= 2) {
                fetchUsers(searchQuery);
            } else if (searchQuery.length === 0) {
                // If cleared, go back to suggestions
                fetchSuggestedUsers();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, fetchUsers, fetchSuggestedUsers]);

    const handleFollowToggle = async (userId, isFollowing) => {
        // Optimistically update local users state for immediate follower count feedback
        setUsers(prevUsers => prevUsers.map(u => {
            if (u._id === userId) {
                return {
                    ...u,
                    stats: {
                        ...u.stats,
                        followerCount: Math.max(0, (u.stats?.followerCount || 0) + (isFollowing ? -1 : 1))
                    }
                };
            }
            return u;
        }));

        if (isFollowing) {
            await unfollowUser(userId);
        } else {
            await followUser(userId);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans selection:bg-purple-500/30">
            <FeedNavbar activePage="Explore" />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <Compass className="text-purple-500" size={24} />
                            <h1 className="text-4xl font-black tracking-tight">Explore</h1>
                        </div>
                        <p className="text-gray-400">Search for people to connect with in the community.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Type a name to search..."
                            className="block w-full pl-12 pr-4 py-4 bg-[#1E1B3A] border border-white/5 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all shadow-2xl"
                        />
                    </div>
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 font-medium">Searching...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
                        <p className="text-red-400">{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center space-x-2 mb-10">
                            <Users size={20} className="text-purple-400" />
                            <h2 className="text-xl font-bold text-white tracking-tight">
                                {searchQuery.length >= 2 ? `Results for "${searchQuery}"` : 'Suggested For You'}
                            </h2>
                        </div>

                        {users.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {users.map((user) => (
                                    <UserCard
                                        key={user._id}
                                        user={user}
                                        currentUserFollowing={currentUserFollowing}
                                        onFollowToggle={handleFollowToggle}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-[#1E1B3A]/30 border border-dashed border-white/10 rounded-3xl">
                                {!localStorage.getItem('token') ? (
                                    <>
                                        <Users size={48} className="text-white/10 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-300 mb-2">Join the Community</h3>
                                        <p className="text-gray-500 max-w-xs mx-auto mb-6">Log in to see personalized suggestions and connect with people in your circles.</p>
                                        <Link 
                                            to="/login"
                                            className="inline-flex items-center px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95"
                                        >
                                            Log In Now
                                        </Link>
                                    </>
                                ) : searchQuery.length < 2 ? (
                                     <>
                                         <Compass size={48} className="text-white/10 mx-auto mb-4" />
                                         <h3 className="text-xl font-bold text-gray-400 mb-2">Search to find users</h3>
                                         <p className="text-gray-600 max-w-xs mx-auto">Enter at least 2 characters to start searching for people.</p>
                                     </>
                                 ) : (
                                     <>
                                         <Search size={48} className="text-gray-700 mx-auto mb-4" />
                                         <h3 className="text-xl font-bold text-white mb-2">No users found</h3>
                                         <p className="text-gray-500 max-w-xs mx-auto">No users match your criteria. Try searching for someone else!</p>
                                     </>
                                 )}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default ExploreUsersPage;
