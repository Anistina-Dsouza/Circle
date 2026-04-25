import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedNavbar from '../../feed/components/FeedNavbar';
import UpcomingMeetingCard from '../components/UpcomingMeetingCard/UpcomingMeetingCard';
import PastMeetingRow from '../components/PastMeetingRow/PastMeetingRow';
import { Plus, Settings, MoreHorizontal, Video, Calendar, Clock, Loader } from 'lucide-react';
import meetingService from '../services/meetingService';

const MeetingsPage = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        hosted: [],
        upcoming: [],
        past: [],
        canHost: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const res = await meetingService.getDashboard();
                if (res.success && res.data) {
                    const mapUpcoming = (m) => {
                        const dateObj = new Date(m.startTime);
                        const attendees = m.participants?.map(p => p.user?.profile?.profileImage || 'https://i.pravatar.cc/150?u=1').slice(0, 3) || [];
                        const plusCount = m.participants?.length > 3 ? m.participants.length - 3 : 0;
                        return {
                            id: m._id,
                            status: 'UPCOMING',
                            statusColor: 'bg-purple-500/20 text-purple-300',
                            title: m.title,
                            circle: m.circle?.name || 'General Community',
                            host: m.host?.profile?.displayName || m.host?.username || 'You',
                            dateLabel: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(),
                            time: dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                            attendees: attendees.length ? attendees : ['https://ui-avatars.com/api/?name=User&background=random'],
                            plusCount: plusCount,
                            btnColor: 'bg-[#8B5CF6] hover:bg-[#7C3AED]',
                            meetingLink: m.meetingLink
                        };
                    };

                    const mapPast = (m) => {
                        const dateObj = new Date(m.startTime);
                        const attendeesCount = m.participants?.filter(p => p.status === 'attended').length || m.participants?.length || 0;
                        return {
                            id: m._id,
                            title: m.title,
                            description: `Held with ${attendeesCount} attendees • ${m.duration || m.scheduledDuration || 60}m duration`,
                            date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        };
                    };

                    const mapHosted = (m) => {
                        const dateObj = new Date(m.startTime);
                        const attendees = m.participants?.map(p => p.user?.profile?.profileImage || 'https://i.pravatar.cc/150?u=1').slice(0, 3) || [];
                        const plusCount = m.participants?.length > 3 ? m.participants.length - 3 : 0;
                        return {
                            id: m._id,
                            status: 'HOSTING',
                            statusColor: 'bg-green-500/20 text-green-300',
                            title: m.title,
                            circle: m.circle?.name || 'Your Meeting',
                            host: 'You',
                            dateLabel: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(),
                            time: dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                            attendees: attendees.length ? attendees : ['https://ui-avatars.com/api/?name=User&background=random'],
                            plusCount: plusCount,
                            btnColor: 'bg-indigo-600 hover:bg-indigo-500',
                            meetingLink: m.meetingLink
                        };
                    }

                    setDashboardData({
                        hosted: res.data.hosted.map(mapHosted),
                        upcoming: res.data.upcoming.map(mapUpcoming),
                        past: res.data.past.map(mapPast),
                        canHost: res.data.canHost
                    });
                }
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F0529] text-white font-sans">
                <FeedNavbar />
                <main className="max-w-6xl mx-auto px-6 py-8">
                    {/* Header Skeleton */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 animate-pulse">
                        <div className="space-y-3">
                            <div className="h-10 w-64 bg-white/10 rounded-xl" />
                            <div className="h-4 w-48 bg-white/5 rounded-lg" />
                        </div>
                        <div className="h-12 w-40 bg-white/10 rounded-xl" />
                    </div>

                    {/* Latest Meeting Row Skeleton */}
                    <div className="mb-12 animate-pulse">
                        <div className="h-8 w-48 bg-white/10 rounded-lg mb-6" />
                        <div className="h-40 w-full bg-[#1A1140]/50 rounded-[2.5rem] border border-white/5 p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-6 w-full lg:w-auto">
                                <div className="w-16 h-16 rounded-2xl bg-white/10 hidden sm:block" />
                                <div className="space-y-3 flex-1">
                                    <div className="h-4 w-32 bg-white/10 rounded-full" />
                                    <div className="h-8 w-64 bg-white/10 rounded-xl" />
                                    <div className="h-4 w-40 bg-white/5 rounded-lg" />
                                </div>
                            </div>
                            <div className="flex items-center gap-10">
                                <div className="flex -space-x-3">
                                    {[1,2,3].map(j => <div key={j} className="w-10 h-10 rounded-full bg-white/5 border-2 border-[#0F0529]" />)}
                                </div>
                                <div className="h-12 w-40 bg-white/10 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Grid Skeleton */}
                    <div className="space-y-6 animate-pulse">
                        <div className="flex justify-between">
                            <div className="h-8 w-40 bg-white/10 rounded-lg" />
                            <div className="h-4 w-24 bg-white/5 rounded-lg" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/5 min-h-[300px] flex flex-col">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="h-5 w-24 bg-white/10 rounded-full" />
                                        <div className="h-5 w-5 bg-white/10 rounded" />
                                    </div>
                                    <div className="h-8 w-3/4 bg-white/10 rounded-xl mb-4" />
                                    <div className="space-y-3 mb-10">
                                        <div className="h-4 w-32 bg-white/5 rounded" />
                                        <div className="h-4 w-40 bg-white/5 rounded" />
                                    </div>
                                    <div className="mt-auto">
                                        <div className="flex justify-between mb-6">
                                            <div className="h-6 w-20 bg-white/10 rounded" />
                                            <div className="flex -space-x-2">
                                                {[1,2,3].map(j => <div key={j} className="w-8 h-8 rounded-full bg-white/5 border-2 border-[#0F0529]" />)}
                                            </div>
                                        </div>
                                        <div className="h-12 w-full bg-white/10 rounded-lg" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    const { hosted, upcoming, past, canHost } = dashboardData;

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans selection:bg-purple-500/30">
            <FeedNavbar activePage="Meetings" />

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Meetings Dashboard</h1>
                        <p className="text-gray-400">Join your community sessions and live syncs.</p>
                    </div>

                    {canHost && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/meetings/schedule')}
                                className="flex items-center justify-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95"
                            >
                                <Plus size={18} />
                                <span>Schedule New</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Latest Hosted Meeting Row - ONLY FOR HOSTS */}
                {canHost && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Your Latest Meeting</h2>
                            <button
                                onClick={() => navigate('/meetings/manage')}
                                className="text-[9px] font-black text-white/50 hover:text-white bg-white/5 px-4 py-2 rounded-full uppercase tracking-[0.15em] transition-all border border-white/10 hover:border-white/20"
                            >
                                Manage All Sessions
                            </button>
                        </div>

                        {hosted.length > 0 ? (
                            <div 
                                onClick={() => navigate('/meetings/manage')}
                            className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-5 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group cursor-pointer hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 shadow-2xl relative overflow-hidden"
                        >
                            <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5 md:gap-8 relative z-10 w-full lg:w-auto">
                                <div className="hidden sm:flex w-14 md:w-16 h-14 md:h-16 rounded-2xl bg-white/[0.08] border border-white/10 items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                    <Video size={28} />
                                </div>
                                <div className="text-center sm:text-left">
                                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                                        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/10 text-white uppercase tracking-widest border border-white/10">
                                            {hosted[0].status}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-white/60">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                            <span>{hosted[0].circle}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 leading-tight tracking-tight">
                                        {hosted[0].title}
                                    </h3>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs md:text-sm">
                                        <div className="flex items-center gap-2 text-white/50">
                                            <Calendar size={14} className="opacity-40" />
                                            <span className="font-semibold">{hosted[0].dateLabel}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/80">
                                            <Clock size={14} className="opacity-40" />
                                            <span className="font-black tracking-wide">{hosted[0].time}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 relative z-10 w-full lg:w-auto mt-4 lg:mt-0">
                                <div className="flex flex-col items-center sm:items-end gap-2">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.1em]">Participants</span>
                                    <div className="flex -space-x-3">
                                        {hosted[0].attendees.map((avatar, idx) => (
                                            <img key={idx} src={avatar} alt="Attendee" className="w-9 h-9 rounded-full border-2 border-[#150a2e] object-cover ring-1 ring-white/10" />
                                        ))}
                                        <div className="w-9 h-9 rounded-full border-2 border-[#150a2e] bg-white text-[#0F0529] flex items-center justify-center text-[11px] font-black ring-1 ring-white/10">
                                            +{hosted[0].plusCount}
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (hosted[0].meetingLink) {
                                            window.open(hosted[0].meetingLink, '_blank');
                                        }
                                    }}
                                    className="w-full sm:w-auto bg-white text-[#0F0529] px-10 py-3.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 shadow-xl hover:bg-gray-100"
                                >
                                    <Video size={14} fill="currentColor" />
                                    <span>Start Session</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-gray-500">
                            <p>You have no scheduled meetings.</p>
                        </div>
                    )}
                </div>
                )}

                {/* All Upcoming Meetings Grid */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Upcoming Sessions</h2>
                        <button
                            onClick={() => navigate('/meetings/upcoming')}
                            className="text-[9px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-[0.15em]"
                        >
                            View All Upcoming
                        </button>
                    </div>
                    {upcoming.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcoming.map((meeting) => (
                                <div key={meeting.id} className="cursor-pointer" onClick={() => {
                                    if (meeting.meetingLink) {
                                        try {
                                            const userStr = localStorage.getItem('user');
                                            const user = userStr ? JSON.parse(userStr) : null;
                                            const displayName = user?.profile?.displayName || user?.username || 'Participant';
                                            const url = new URL(meeting.meetingLink);
                                            url.searchParams.set('uname', displayName);
                                            url.searchParams.set('un', btoa(displayName));
                                            window.open(url.toString(), '_blank');
                                        } catch (err) {
                                            window.open(meeting.meetingLink, '_blank');
                                        }
                                    }
                                }}>
                                    <UpcomingMeetingCard meeting={meeting} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No upcoming meetings from your circles.</p>
                        </div>
                    )}
                </div>

                {/* Past Meetings Section - ONLY FOR HOSTS */}
                {canHost && (
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Past Meetings</h2>
                            <button
                                onClick={() => navigate('/meetings/history')}
                                className="text-[9px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-[0.15em]"
                            >
                                View All History
                            </button>
                        </div>
                        
                        {past.length > 0 ? (
                            <div className="bg-[#1A0833] rounded-2xl border border-white/5 overflow-hidden">
                                <div className="divide-y divide-white/5">
                                    {past.map((meeting) => (
                                        <PastMeetingRow key={meeting.id} meeting={meeting} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-[#1A0833] rounded-2xl border border-white/5">
                                <p className="text-gray-500">No past meetings to display.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MeetingsPage;
