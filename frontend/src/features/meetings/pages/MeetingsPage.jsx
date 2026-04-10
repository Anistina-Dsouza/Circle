import React from 'react';
import { useNavigate } from 'react-router-dom';
import FeedNavbar from '../../feed/components/FeedNavbar';
import UpcomingMeetingCard from '../components/UpcomingMeetingCard/UpcomingMeetingCard';
import PastMeetingRow from '../components/PastMeetingRow/PastMeetingRow';
import { Plus } from 'lucide-react';

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

                    <button
                        onClick={() => navigate('/meetings/schedule')}
                        className="flex items-center justify-center gap-2 bg-[#1E0B36] hover:bg-[#2D114A] border border-white/5 hover:border-purple-500/30 text-purple-300 px-5 py-2.5 rounded-xl font-medium transition-all"
                    >
                        <Plus size={18} />
                        <span>Schedule New</span>
                    </button>
                </div>

                {/* Upcoming Meetings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {UPCOMING_MEETINGS.map((meeting) => (
                        <UpcomingMeetingCard key={meeting.id} meeting={meeting} />
                    ))}
                </div>

                {/* Past Meetings Section */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Past Meetings</h2>
                        <button className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors">
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

