import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, ArrowLeft, Search, Loader2, Sparkles, MessageCircle, Shield, UserCircle } from 'lucide-react';
import FeedNavbar from '../../feed/components/FeedNavbar';

const CircleMembersPage = () => {
    const { slug }  = useParams();
    const navigate = useNavigate();
    const [circle,  setCircle]  = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all'); // all, moderators, online

    const baseUrl = import.meta.env.VITE_API_URL;
    const DEFAULT_AVATAR = 'https://i.pinimg.com/736x/24/de/64/24de6482109345ed57693bcd21b42927.jpg';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                // 1. Fetch Circle
                const circleRes = await axios.get(`${baseUrl}/api/circles/${slug}`, { headers });
                if (circleRes.data.success) {
                    const circleData = circleRes.data.circle;
                    setCircle(circleData);

                    // 2. Fetch All Members
                    const membersRes = await axios.get(`${baseUrl}/api/circles/${circleData._id}/members`, { headers });
                    if (membersRes.data.success) {
                        setMembers(membersRes.data.members);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch members:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug, baseUrl]);

    // Filtering logic
    const filteredMembers = members.filter(m => {
        const user = m.user || {};
        const name = user.displayName || user.username || 'Unknown User';
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             user.username?.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (activeFilter === 'moderators') return matchesSearch && (m.role === 'moderator' || m.role === 'admin');
        if (activeFilter === 'online') return matchesSearch && user.onlineStatus?.status === 'online';
        return matchesSearch;
    });

    if (loading) return (
        <div className="min-h-screen bg-[#0F0529] flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-400 font-medium tracking-widest text-xs">COLLECTING COMMUNITY DATA...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans flex flex-col selection:bg-purple-500/30">
            <FeedNavbar activePage="Circles" />
            
            <div className="max-w-[1200px] w-full mx-auto px-6 py-10 flex-1">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <Link 
                            to={`/circles/${slug}`} 
                            className="inline-flex items-center gap-2 text-purple-400 font-bold text-xs tracking-wide hover:text-purple-300 transition-colors mb-4 group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Return to {circle?.name || 'Circle'}
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-purple-600/10 border border-purple-500/20 rounded-3xl text-purple-500 shadow-xl shadow-purple-900/20">
                                <Users size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight">{circle?.name} Members</h1>
                                <p className="text-gray-500 font-bold text-xs tracking-widest mt-2 uppercase">
                                    {members.filter(m => m.user?.onlineStatus?.status === 'online').length} Online
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text"
                            placeholder="Search by name or @username..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="auth-input pl-12 focus:ring-purple-500/40"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
                    {['all', 'moderators', 'online'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${
                                activeFilter === filter 
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' 
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Members Grid */}
                {filteredMembers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {filteredMembers.map(member => {
                            const u = member.user || {};
                            const name = u.displayName || u.username || 'Unknown';
                            const pic = u.profilePic || DEFAULT_AVATAR;
                            const isOnline = u.onlineStatus?.status === 'online';
                            const isAdmin = member.role === 'admin' || member.role === 'moderator';

                            return (
                                <div key={u._id} className="group p-5 bg-[#1A1140]/30 border border-white/5 rounded-[32px] hover:border-purple-500/30 hover:bg-[#1A1140]/50 transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <Link to={`/profile/${u.username}`} className="relative shrink-0 active:scale-95 transition-transform">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white/5 group-hover:ring-purple-500/50 transition-all">
                                                <img src={pic} alt={name} className="w-full h-full object-cover" />
                                            </div>
                                            {isOnline && (
                                                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#12082A] rounded-full" />
                                            )}
                                        </Link>
                                        
                                        <div className="flex-1 min-w-0">
                                            <Link to={`/profile/${u.username}`} className="flex items-center gap-1.5 overflow-hidden group/name">
                                                <h3 className="text-sm font-bold text-gray-200 truncate group-hover/name:text-purple-400 transition-colors">
                                                    {name}
                                                </h3>
                                                {isAdmin && (
                                                    <Shield size={12} className={member.role === 'admin' ? 'text-yellow-400' : 'text-blue-400'} />
                                                )}
                                            </Link>
                                            <Link to={`/profile/${u.username}`} className="text-[11px] text-gray-500 font-medium hover:text-gray-300 transition-colors block">
                                                @{u.username}
                                            </Link>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <button 
                                                onClick={() => navigate(`/messages?user=${u.username}`)}
                                                className="p-2.5 bg-white/5 rounded-xl text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all active:scale-90"
                                                title="Send Message"
                                            >
                                                <MessageCircle size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Footer Info */}
                                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                            member.role === 'admin' ? 'bg-yellow-400/10 text-yellow-400' : 
                                            member.role === 'moderator' ? 'bg-blue-400/10 text-blue-400' : 
                                            'bg-white/5 text-gray-500'
                                        }`}>
                                            {member.role}
                                        </span>
                                        <span className="text-[9px] text-gray-600 font-bold">
                                            JOINED {new Date(member.joinedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-[#1A1140]/20 border border-dashed border-white/5 rounded-[40px] text-center px-6">
                        <div className="p-6 bg-purple-500/5 rounded-full mb-6 text-gray-700">
                            <Sparkles size={64} strokeWidth={1} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-400 mb-2 tracking-wide">No Citizens Located</h3>
                        <p className="text-gray-600 max-w-sm text-sm">We couldn't find any community members that match your current search or filters.</p>
                        <button 
                            onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                            className="mt-6 text-purple-400 text-xs font-bold tracking-widest uppercase hover:text-purple-300 transition-colors"
                        >
                            Reset Discovery Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CircleMembersPage;
