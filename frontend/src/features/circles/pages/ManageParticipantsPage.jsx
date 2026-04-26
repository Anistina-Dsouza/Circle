import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Users, ArrowLeft, Search, Loader2, Sparkles, UserCheck } from 'lucide-react';
import FeedNavbar from '../../feed/components/FeedNavbar';
import ManagementTabs from '../components/management/ManagementTabs';
import MemberManagementItem from '../components/management/MemberManagementItem';
import JoinRequestItem from '../components/management/JoinRequestItem';
import BannedUserItem from '../components/management/BannedUserItem';
import { ShieldX } from 'lucide-react';

const ManageParticipantsPage = () => {
    const { slug } = useParams();
    const [circle, setCircle] = useState(null);
    const [activeTab, setActiveTab] = useState('members');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const baseUrl = import.meta.env.VITE_API_URL;

    // Data state
    const [members, setMembers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [bannedUsers, setBannedUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                // 1. Fetch Circle to get ID
                const circleRes = await axios.get(`${baseUrl}/api/circles/${slug}`, { headers });
                
                if (circleRes.data.success && circleRes.data.circle) {
                    const circleData = circleRes.data.circle;
                    setCircle(circleData);

                    // 2. Fetch Members
                    const membersRes = await axios.get(`${baseUrl}/api/circles/${circleData?._id}/members`, { headers });
                    if (membersRes.data.success) {
                        // Transform members to match UI needs
                        const transformedMembers = membersRes.data.members.map(m => ({
                            id: m.user?._id,
                            name: m.user?.displayName || m.user?.username || 'Unknown User',
                            username: m.user?.username,
                            role: m.role,
                            joinedDate: new Date(m.joinedAt).toLocaleDateString(),
                            avatar: m.user?.profilePic
                        }));
                        setMembers(transformedMembers);
                    }

                    // 3. Fetch Requests
                    const requestsRes = await axios.get(`${baseUrl}/api/circles/${circleData?._id}/pending-requests`, { headers });
                    if (requestsRes.data.success) {
                        const transformedRequests = requestsRes.data.pendingRequests.map(r => ({
                            id: r._id,
                            userId: r.user?._id,
                            name: r.user?.displayName || r.user?.username || 'Unknown User',
                            username: r.user?.username,
                            time: new Date(r.requestedAt).toLocaleDateString(),
                            avatar: r.user?.profilePic,
                            message: r.introduction
                        }));
                        setRequests(transformedRequests);
                    }

                    // 4. Fetch Banned Users
                    const bannedRes = await axios.get(`${baseUrl}/api/circles/${circleData?._id}/banned-members`, { headers });
                    if (bannedRes.data.success) {
                        const transformedBanned = bannedRes.data.bannedUsers.map(b => ({
                            id: b.user?._id,
                            name: b.user?.displayName || b.user?.username || 'Unknown User',
                            username: b.user?.username,
                            bannedDate: new Date(b.bannedAt).toLocaleDateString(),
                            avatar: b.user?.profilePic,
                            reason: b.reason
                        }));
                        setBannedUsers(transformedBanned);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch management data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug, baseUrl]);

    // Handlers
    const handleApprove = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${baseUrl}/api/circles/${circle._id}/requests/${requestId}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                // Refresh data
                const approvedRequest = requests.find(r => r.id === requestId);
                setRequests(prev => prev.filter(r => r.id !== requestId));
                // Add to members list locally for immediate feedback
                if (approvedRequest) {
                  setMembers(prev => [...prev, {
                      id: approvedRequest.userId,
                      name: approvedRequest.name,
                      role: 'member',
                      joinedDate: 'Just now',
                      avatar: approvedRequest.avatar
                  }]);
                }
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to approve request');
        }
    };

    const handleReject = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${baseUrl}/api/circles/${circle._id}/requests/${requestId}/reject`, {
                rejectionReason: 'Does not meet community guidelines'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setRequests(prev => prev.filter(r => r.id !== requestId));
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to reject request');
        }
    };

    const handleKick = async (memberId) => {
        if (!window.confirm("Are you sure you want to remove this member?")) return;
        
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`${baseUrl}/api/circles/${circle._id}/members/${memberId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setMembers(prev => prev.filter(m => m.id !== memberId));
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to remove member');
        }
    };

    const handleChangeRole = async (memberId, newRole) => {
        try {
            const token = localStorage.getItem('token');
            let res;
            
            if (newRole === 'moderator' || newRole === 'admin') {
                res = await axios.post(`${baseUrl}/api/circles/${circle._id}/moderators`, { 
                    userId: memberId,
                    role: newRole 
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                res = await axios.delete(`${baseUrl}/api/circles/${circle._id}/moderators/${memberId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            if (res.data.success) {
                setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to change role');
        }
    };

    const handleMute = async (memberId, shouldMute) => {
        try {
            const token = localStorage.getItem('token');
            const endpoint = shouldMute ? 'mute' : 'unmute';
            let duration = null;

            if (shouldMute) {
                const input = window.prompt("Mute duration in minutes? (leave empty for indefinite)", "60");
                if (input === null) return; // Cancelled
                duration = input ? parseInt(input) : null;
            }

            const res = await axios.post(`${baseUrl}/api/circles/${circle._id}/members/${memberId}/${endpoint}`, 
                shouldMute ? { duration } : {}, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setMembers(prev => prev.map(m => m.id === memberId ? { ...m, isMuted: shouldMute, mutedUntil: res.data.mutedUntil } : m));
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update mute status');
        }
    };

    const handleBan = async (memberId) => {
        const reason = window.prompt("Reason for banning this user?", "Violating community guidelines");
        if (reason === null) return;

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${baseUrl}/api/circles/${circle._id}/members/${memberId}/ban`, 
                { reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                const bannedMember = members.find(m => m.id === memberId);
                setMembers(prev => prev.filter(m => m.id !== memberId));
                if (bannedMember) {
                    setBannedUsers(prev => [...prev, {
                        ...bannedMember,
                        bannedDate: new Date().toLocaleDateString(),
                        reason
                    }]);
                }
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to ban user');
        }
    };

    const handleUnban = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`${baseUrl}/api/circles/${circle._id}/members/${userId}/unban`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setBannedUsers(prev => prev.filter(u => u.id !== userId));
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to unban user');
        }
    };

    // Filtered lists
    const filteredMembers = members.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             m.username?.toLowerCase().includes(searchQuery.toLowerCase());
        if (activeTab === 'moderators') return matchesSearch && (m.role === 'moderator' || m.role === 'admin');
        return matchesSearch;
    });

    const filteredRequests = requests.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredBanned = bannedUsers.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const counts = {
        requests: requests.length,
        members: members.length,
        moderators: members.filter(m => m.role === 'moderator' || m.role === 'admin').length,
        banned: bannedUsers.length
    };

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans flex flex-col selection:bg-purple-500/30">
            <FeedNavbar activePage="Circles" />
            
            <div className="max-w-[1200px] w-full mx-auto px-6 py-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <Link 
                            to={`/circles/${slug}/manage`} 
                            className="inline-flex items-center gap-2 text-purple-400 font-bold text-xs tracking-wide hover:text-purple-300 transition-colors mb-4 group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Host Dashboard
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-purple-600/10 border border-purple-500/20 rounded-3xl text-purple-500 shadow-xl shadow-purple-900/20">
                                <Users size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight">Manage Participants</h1>
                                <p className="text-gray-500 font-bold text-xs tracking-widest mt-1">Community Growth & Moderation</p>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text"
                            placeholder="Find a member..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="auth-input pl-12 focus:ring-purple-500/50"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <ManagementTabs 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                    counts={counts}
                />

                {/* Main Content Area */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-[#1A1140]/30 border border-dashed border-white/10 rounded-[40px]">
                        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                        <p className="text-gray-500 font-bold tracking-widest text-sm">Syncing member data...</p>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* JOIN REQUESTS VIEW */}
                        {activeTab === 'requests' && (
                            <>
                                {filteredRequests.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {filteredRequests.map(req => (
                                            <JoinRequestItem 
                                                key={req.id} 
                                                request={req} 
                                                onApprove={handleApprove} 
                                                onReject={handleReject} 
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-24 bg-[#1A1140]/20 border border-dashed border-white/5 rounded-[40px] text-center px-6">
                                        <div className="p-5 bg-purple-500/5 rounded-full mb-6 text-gray-700">
                                            <Sparkles size={48} strokeWidth={1} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-400 mb-2 tracking-wide">No Pending Requests</h3>
                                        <p className="text-gray-600 max-w-sm text-sm">Everyone who asked to join has been processed. Great job staying on top of your community!</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* MEMBERS & MODERATORS VIEW */}
                        {(activeTab === 'members' || activeTab === 'moderators') && (
                            <>
                                {filteredMembers.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filteredMembers.map(member => (
                                            <MemberManagementItem 
                                                key={member.id} 
                                                member={member} 
                                                onKick={handleKick} 
                                                onChangeRole={handleChangeRole} 
                                                onMute={handleMute}
                                                onBan={handleBan}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-24 bg-[#1A1140]/20 border border-dashed border-white/5 rounded-[40px] text-center px-6">
                                        <div className="p-5 bg-purple-500/5 rounded-full mb-6 text-gray-700">
                                            <UserCheck size={48} strokeWidth={1} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-400 mb-2 tracking-wide">No Members Found</h3>
                                        <p className="text-gray-600 max-w-sm text-sm">We couldn't find any members matching your current filters or search query.</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* BANNED VIEW */}
                        {activeTab === 'banned' && (
                            <>
                                {filteredBanned.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filteredBanned.map(user => (
                                            <BannedUserItem 
                                                key={user.id} 
                                                user={user} 
                                                onUnban={handleUnban} 
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-24 bg-[#1A1140]/20 border border-dashed border-white/5 rounded-[40px] text-center px-6">
                                        <div className="p-5 bg-red-500/5 rounded-full mb-6 text-gray-700">
                                            <ShieldX size={48} strokeWidth={1} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-400 mb-2 tracking-wide">No Banned Users</h3>
                                        <p className="text-gray-600 max-w-sm text-sm">Your community is peaceful! There are currently no banned users in this circle.</p>
                                    </div>
                                )}
                            </>
                        )}

                    </div>
                )}

                {/* Footer Section */}
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] text-gray-600 font-bold tracking-widest">
                        Circle Management Protocol • v2.0
                    </p>
                    <div className="flex gap-6">
                        <button className="text-[10px] text-purple-400/60 hover:text-purple-400 font-bold tracking-widest transition-colors">Export Member List</button>
                        <button className="text-[10px] text-purple-400/60 hover:text-purple-400 font-bold tracking-widest transition-colors">Bulk Actions</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageParticipantsPage;
