import React from 'react';
import { useNavigate } from 'react-router-dom';
import FeedNavbar from '../../feed/components/FeedNavbar';
import UpcomingMeetingCard from '../components/UpcomingMeetingCard/UpcomingMeetingCard';
import PastMeetingRow from '../components/PastMeetingRow/PastMeetingRow';
import { Plus, Settings, MoreHorizontal, Video, Calendar, Clock } from 'lucide-react';

// Static Mock Data
const UPCOMING_MEETINGS = [
    {
        id: 1,
        status: 'LIVE SOON',
        statusColor: 'bg-purple-500/20 text-purple-300',
        title: 'Weekly Strategy Sync',
        circle: 'Circle Designers',
        host: 'Alex Rivera',
        dateLabel: 'TODAY',
        time: '4:00 PM',
        attendees: [
            'https://randomuser.me/api/portraits/men/32.jpg',
            'https://randomuser.me/api/portraits/women/44.jpg'
        ],
        plusCount: 12,
        btnColor: 'bg-[#8B5CF6] hover:bg-[#7C3AED]'
    },
    {
        id: 2,
        status: 'TOMORROW',
        statusColor: 'bg-white/10 text-gray-300',
        title: 'Global Content Workshop',
        circle: 'Marketing Hub',
        host: 'Sarah Chen',
        dateLabel: 'OCT 25',
        time: '10:30 AM',
        attendees: [
            'https://randomuser.me/api/portraits/women/68.jpg'
        ],
        plusCount: 45,
        btnColor: 'bg-[#8B5CF6] hover:bg-[#7C3AED]'
    },
    {
        id: 3,
        status: 'UPCOMING',
        statusColor: 'bg-white/10 text-gray-300',
        title: 'Product Roadmap Review',
        circle: 'Founders Circle',
        host: 'Marcus Thorne',
        dateLabel: 'OCT 27',
        time: '2:00 PM',
        attendees: [
            'https://randomuser.me/api/portraits/women/22.jpg',
            'https://randomuser.me/api/portraits/men/46.jpg'
        ],
        plusCount: 6,
        btnColor: 'bg-[#8B5CF6] hover:bg-[#7C3AED]'
    }
];

const PAST_MEETINGS = [
    {
        id: 1,
        title: 'Onboarding Session - Oct 12',
        description: 'Held with 24 attendees • 1h 20m duration',
        date: 'Oct 12, 2023'
    },
    {
        id: 2,
        title: 'UX Critique: Mobile Navigation',
        description: 'Held with 12 attendees • 45m duration',
        date: 'Oct 08, 2023'
    },
    {
        id: 3,
        title: 'Community Town Hall',
        description: 'Held with 86 attendees • 2h 00m duration',
        date: 'Sep 30, 2023'
    }
];

const MY_HOSTED_MEETINGS = [
    {
        id: 101,
        status: 'HOSTING',
        statusColor: 'bg-green-500/20 text-green-300',
        title: 'Design Critique: New Branding',
        circle: 'Circle Designers',
        host: 'You',
        dateLabel: 'OCT 15',
        time: '2:00 PM',
        attendees: [
            'https://randomuser.me/api/portraits/men/32.jpg',
            'https://randomuser.me/api/portraits/women/44.jpg'
        ],
        plusCount: 5,
        btnColor: 'bg-indigo-600 hover:bg-indigo-500'
    }
];

const MeetingsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans selection:bg-purple-500/30">
            <FeedNavbar activePage="Meetings" />

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Upcoming Meetings</h1>
                        <p className="text-gray-400">Join your community sessions and live syncs.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/meetings/schedule')}
                            className="flex items-center justify-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95"
                        >
                            <Plus size={18} />
                            <span>Schedule New</span>
                        </button>
                    </div>
                </div>

                {/* Latest Hosted Meeting Row */}
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

                    {MY_HOSTED_MEETINGS.length > 0 && (
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
                                            {MY_HOSTED_MEETINGS[0].status}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-white/60">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                            <span>{MY_HOSTED_MEETINGS[0].circle}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 leading-tight tracking-tight">
                                        {MY_HOSTED_MEETINGS[0].title}
                                    </h3>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs md:text-sm">
                                        <div className="flex items-center gap-2 text-white/50">
                                            <Calendar size={14} className="opacity-40" />
                                            <span className="font-semibold">{MY_HOSTED_MEETINGS[0].dateLabel}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/80">
                                            <Clock size={14} className="opacity-40" />
                                            <span className="font-black tracking-wide">{MY_HOSTED_MEETINGS[0].time}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 relative z-10 w-full lg:w-auto mt-4 lg:mt-0">
                                <div className="flex flex-col items-center sm:items-end gap-2">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.1em]">Participants</span>
                                    <div className="flex -space-x-3">
                                        {MY_HOSTED_MEETINGS[0].attendees.map((avatar, idx) => (
                                            <img key={idx} src={avatar} alt="Attendee" className="w-9 h-9 rounded-full border-2 border-[#150a2e] object-cover ring-1 ring-white/10" />
                                        ))}
                                        <div className="w-9 h-9 rounded-full border-2 border-[#150a2e] bg-white text-[#0F0529] flex items-center justify-center text-[11px] font-black ring-1 ring-white/10">
                                            +{MY_HOSTED_MEETINGS[0].plusCount}
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Start Meeting Logic
                                    }}
                                    className="w-full sm:w-auto bg-white text-[#0F0529] px-10 py-3.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 shadow-xl hover:bg-gray-100"
                                >
                                    <Video size={14} fill="currentColor" />
                                    <span>Start Session</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* All Upcoming Meetings Grid */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">All Upcoming Meetings</h2>
                        <button
                            onClick={() => navigate('/meetings/upcoming')}
                            className="text-[9px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-[0.15em]"
                        >
                            View All Upcoming
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {UPCOMING_MEETINGS.map((meeting) => (
                            <UpcomingMeetingCard key={meeting.id} meeting={meeting} />
                        ))}
                    </div>
                </div>

                {/* Past Meetings Section */}
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

                    <div className="bg-[#1A0833] rounded-2xl border border-white/5 overflow-hidden">
                        <div className="divide-y divide-white/5">
                            {PAST_MEETINGS.map((meeting) => (
                                <PastMeetingRow key={meeting.id} meeting={meeting} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MeetingsPage;
