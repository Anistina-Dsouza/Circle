import React from 'react';
import { useNavigate } from 'react-router-dom';
import FeedNavbar from '../../feed/components/FeedNavbar';
import PastMeetingRow from '../components/PastMeetingRow/PastMeetingRow';
import { ArrowLeft, Search, Filter } from 'lucide-react';

const EXTENDED_PAST_MEETINGS = [
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
    },
    {
        id: 4,
        title: 'Quarterly Planning Sync',
        description: 'Held with 15 attendees • 1h 00m duration',
        date: 'Sep 25, 2023'
    },
    {
        id: 5,
        title: 'Frontend Workshop: Tailwind CSS',
        description: 'Held with 42 attendees • 3h 00m duration',
        date: 'Sep 20, 2023'
    },
    {
        id: 6,
        title: 'Circle Designers: Logo Review',
        description: 'Held with 8 attendees • 50m duration',
        date: 'Sep 15, 2023'
    },
    {
        id: 7,
        title: 'Marketing Brainstorming',
        description: 'Held with 10 attendees • 1h 15m duration',
        date: 'Sep 10, 2023'
    },
    {
        id: 8,
        title: 'Founders Circle: Investment Pitch',
        description: 'Held with 5 attendees • 45m duration',
        date: 'Sep 05, 2023'
    }
];

const MeetingHistoryPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans">
            <FeedNavbar activePage="Meetings" />

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Back Link */}
                <button
                    onClick={() => navigate('/meetings')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Meetings</span>
                </button>

                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Meeting History</h1>
                        <p className="text-gray-400">All your past community sessions and syncs.</p>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search history..."
                                className="bg-[#1A0833] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 transition-colors w-full md:w-64"
                            />
                        </div>
                        <button className="bg-[#1A0833] border border-white/5 p-2.5 rounded-xl text-gray-400 hover:text-white hover:border-purple-500/30 transition-all">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {/* History List */}
                <div className="bg-[#1A0833] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                    <div className="divide-y divide-white/5">
                        {EXTENDED_PAST_MEETINGS.map((meeting) => (
                            <PastMeetingRow key={meeting.id} meeting={meeting} />
                        ))}
                    </div>
                </div>

                {/* Pagination Placeholder */}
                <div className="mt-8 flex justify-center gap-2">
                    <button className="px-4 py-2 rounded-lg bg-[#1A0833] border border-white/5 text-gray-400 hover:text-white disabled:opacity-50" disabled>Previous</button>
                    <button className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold">1</button>
                    <button className="px-4 py-2 rounded-lg bg-[#1A0833] border border-white/5 text-gray-400 hover:text-white">2</button>
                    <button className="px-4 py-2 rounded-lg bg-[#1A0833] border border-white/5 text-gray-400 hover:text-white">Next</button>
                </div>
            </main>
        </div>
    );
};

export default MeetingHistoryPage;
