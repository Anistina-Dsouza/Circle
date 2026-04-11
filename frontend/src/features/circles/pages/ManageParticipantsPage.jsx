import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, ArrowLeft, Search, Loader2, Sparkles, UserCheck } from 'lucide-react';
import FeedNavbar from '../../feed/components/FeedNavbar';
import ManagementTabs from '../components/management/ManagementTabs';
import MemberManagementItem from '../components/management/MemberManagementItem';
import JoinRequestItem from '../components/management/JoinRequestItem';

const ManageParticipantsPage = () => {
    const { slug } = useParams();
    const [activeTab, setActiveTab] = useState('members');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Mock initial data
    const [members, setMembers] = useState([
        { id: 1, name: 'Sarah Jenkins', role: 'member', joinedDate: '2 Oct 2024', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        { id: 2, name: 'Marcus King', role: 'moderator', joinedDate: '15 Sep 2024', avatar: 'https://i.pravatar.cc/150?u=marcus' },
        { id: 3, name: 'Leo David', role: 'member', joinedDate: '20 Sep 2024', avatar: 'https://i.pravatar.cc/150?u=leo' },
        { id: 4, name: 'Emma Wilson', role: 'member', joinedDate: '5 Oct 2024', avatar: 'https://i.pravatar.cc/150?u=emma' },
        { id: 5, name: 'Alex Rivera', role: 'moderator', joinedDate: '1 Sep 2024', avatar: 'https://i.pravatar.cc/150?u=alex' },
    ]);

    const [requests, setRequests] = useState([
        { id: 101, name: 'Olivia Chen', time: '2h ago', avatar: 'https://i.pravatar.cc/150?u=olivia', message: "Hey! I've been following your work for a while and would love to join the collective to learn and share." },
        { id: 102, name: 'James Wilson', time: '5h ago', avatar: 'https://i.pravatar.cc/150?u=james', message: "I'm a UI/UX designer looking to collaborate on community projects." }
    ]);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Handlers
    const handleApprove = (requestId) => {
        const request = requests.find(r => r.id === requestId);
        if (request) {
            setRequests(prev => prev.filter(r => r.id !== requestId));
            setMembers(prev => [...prev, {
                id: request.id,
                name: request.name,
                role: 'member',
                joinedDate: 'Just now',
                avatar: request.avatar
            }]);
        }
    };

    const handleReject = (requestId) => {
        setRequests(prev => prev.filter(r => r.id !== requestId));
    };

    const handleKick = (memberId) => {
        setMembers(prev => prev.filter(m => m.id !== memberId));
    };

    const handleChangeRole = (memberId, newRole) => {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    };

    // Filtered lists
    const filteredMembers = members.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (activeTab === 'moderators') return matchesSearch && m.role === 'moderator';
        return matchesSearch;
    });

    const filteredRequests = requests.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const counts = {
        requests: requests.length,
        members: members.length,
        moderators: members.filter(m => m.role === 'moderator').length
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
