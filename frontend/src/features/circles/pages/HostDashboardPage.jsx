import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
    Users, Shield, Clock, 
    UserPlus, Settings, PlusCircle, 
    ArrowLeft, LayoutDashboard
} from 'lucide-react';

import FeedNavbar from '../../feed/components/FeedNavbar';
import DashboardStatCard from '../components/dashboard/DashboardStatCard';
import DashboardQuickAction from '../components/dashboard/DashboardQuickAction';
import DashboardActivityTable from '../components/dashboard/DashboardActivityTable';
import DashboardSchedule from '../components/dashboard/DashboardSchedule';
import meetingService from '../../meetings/services/meetingService';

const HostDashboardPage = () => {
    const { slug } = useParams();
    const [circle, setCircle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([]);
    const [upcomingMeetings, setUpcomingMeetings] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const baseUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                // 1. Fetch Circle Details
                const circleRes = await axios.get(`${baseUrl}/api/circles/${slug}`, { headers });
                
                if (circleRes.data.success) {
                    const circleData = circleRes.data.circle;
                    setCircle(circleData);

                    // 2. Fetch Pending Requests Count
                    let pendingCount = 0;
                    try {
                        const pendingRes = await axios.get(`${baseUrl}/api/circles/${circleData._id}/pending-requests`, { headers });
                        if (pendingRes.data.success) {
                            pendingCount = pendingRes.data.stats.total;
                        }
                    } catch (err) {
                        console.error('Failed to fetch pending requests:', err);
                    }

                    // 3. Fetch Meetings
                    let fetchedMeetings = [];
                    try {
                        const meetingsRes = await meetingService.getUpcomingMeetings(circleData._id);
                        if (meetingsRes.success) {
                            fetchedMeetings = meetingsRes.data;
                            setUpcomingMeetings(fetchedMeetings);
                        }
                    } catch (err) {
                        console.error('Failed to fetch upcoming meetings:', err);
                    }

                    // 4. Construct Stats
                    setStats([
                        { label: 'Total Members', value: circleData?.stats?.memberCount || '0', icon: Users, color: 'text-purple-400' },
                        { label: 'Moderators', value: circleData?.moderators?.length || '0', icon: Shield, color: 'text-purple-400' },
                        { label: 'Pending Requests', value: pendingCount, icon: UserPlus, color: 'text-purple-400', pulse: pendingCount > 0 },
                        { label: 'Meetings', value: circleData?.stats?.meetingCount || '0', icon: Clock, color: 'text-purple-400' },
                    ]);
                    
                    // 5. Synthesize Activities
                    const activities = [];
                    (circleData.members || []).forEach(m => {
                        activities.push({
                            id: `join_${m.user._id}`,
                            user: m.user.displayName || m.user.username,
                            action: `Joined '${circleData.name}'`,
                            timestamp: new Date(m.joinedAt).getTime(),
                            status: 'ACTIVE',
                            avatar: m.user.profilePic || 'https://i.pravatar.cc/150?u=default'
                        });
                    });
                    
                    fetchedMeetings.forEach(mtg => {
                        activities.push({
                            id: `mtg_${mtg._id}`,
                            user: mtg.host?.displayName || mtg.host?.username || 'Host',
                            action: `Scheduled meeting: ${mtg.title}`,
                            timestamp: new Date(mtg.createdAt || mtg.startTime).getTime(),
                            status: 'NEW',
                            avatar: mtg.host?.profilePic || 'https://i.pravatar.cc/150?u=meeting'
                        });
                    });

                    activities.sort((a, b) => b.timestamp - a.timestamp);
                    
                    const formattedActivities = activities.slice(0, 10).map(act => {
                        const mins = Math.floor((new Date() - new Date(act.timestamp)) / 60000);
                        let timeStr;
                        if (mins < 0) timeStr = `Starts tightly`; // Using tightly as placeholder, but for creations it's past
                        else if (mins < 60) timeStr = `${mins} mins ago`;
                        else if (mins < 1440) timeStr = `${Math.floor(mins / 60)} hours ago`;
                        else timeStr = `${Math.floor(mins / 1440)} days ago`;

                        return { ...act, time: timeStr || 'Just now' };
                    });

                    setRecentActivity(formattedActivities);
                }
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug, baseUrl]);

    const displayedMembers = circle?.members?.slice(0, 4) || [];
    const remainingMembersCount = Math.max((circle?.stats?.memberCount || circle?.members?.length || 0) - 4, 0);

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans flex flex-col selection:bg-purple-500/30">
            <FeedNavbar activePage="Circles" />

            <div className="max-w-[1400px] w-full mx-auto px-6 py-8 flex-1">
                
                {/* Header Section */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <Link 
                            to={`/circles/${slug}`}
                            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 text-gray-400 hover:text-white transition-all group active:scale-90"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-purple-500 mb-1">
                                <LayoutDashboard size={12} />
                                <span>Host Control Center</span>
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tight">
                                {circle?.name || 'Loading Circle...'}
                            </h1>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex -space-x-3">
                            {displayedMembers.map((m, i) => (
                                <img 
                                    key={m.user._id || i} 
                                    className="w-8 h-8 rounded-full border-2 border-[#0F0529] object-cover bg-white/10" 
                                    src={m.user.profilePic || 'https://i.pravatar.cc/150?u=default'} 
                                    alt={m.user.username} 
                                    title={m.user.displayName || m.user.username} 
                                />
                            ))}
                            {remainingMembersCount > 0 && (
                                <div className="w-8 h-8 rounded-full border-2 border-[#0F0529] bg-[#1A1140] flex items-center justify-center text-[10px] font-bold text-purple-400">
                                    +{remainingMembersCount}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <DashboardStatCard key={i} {...stat} />
                    ))}
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    <DashboardQuickAction 
                        to={`/circles/${slug}/manage/participants`}
                        icon={Users}
                        title="Manage Members"
                        description="Approval queue & role assignments"
                    />
                    <DashboardQuickAction 
                        to={`/meetings/schedule?circle=${slug}`}
                        icon={PlusCircle}
                        title="Schedule Meeting"
                        description="Create a new gathering for the circle"
                        variant="primary"
                    />
                    <DashboardQuickAction 
                        to={`/circles/${slug}/manage/settings`}
                        icon={Settings}
                        title="Circle Settings"
                        description="Privacy, branding & permissions"
                    />
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
                    {/* Activity Table */}
                    <div className="lg:col-span-3">
                        <DashboardActivityTable activities={recentActivity} />
                    </div>

                    {/* Schedule Sidebar */}
                    <div className="lg:col-span-1">
                        <DashboardSchedule meetings={upcomingMeetings} />
                    </div>
                </div>
            </div>

            {/* Global Footer Alignment */}
            <footer className="w-full px-12 py-12 border-t border-white/5 text-[10px] text-gray-600 font-bold flex flex-col md:flex-row justify-between items-center bg-[#07011a]">
                <div>Secure Circle Administrative Portal • 2024 V1 Server</div>
                <div className="flex gap-12">
                    <a href="#" className="hover:text-purple-400 transition-colors">Safety</a>
                    <a href="#" className="hover:text-purple-400 transition-colors">Nodes</a>
                    <a href="#" className="hover:text-purple-400 transition-colors">Support</a>
                </div>
            </footer>
        </div>
    );
};

export default HostDashboardPage;
