import React from 'react';
import { useNavigate } from 'react-router-dom';
import FeedNavbar from '../../feed/components/FeedNavbar';
import UpcomingMeetingCard from '../components/UpcomingMeetingCard/UpcomingMeetingCard';
import { ArrowLeft, Calendar, Search } from 'lucide-react';

// Static Mock Data (Same as main page for consistency)
const UPCOMING_MEETINGS = [
    {
        id: 1,
        title: 'Q4 Product Strategy Sync',
        circle: 'Product Circle',
        host: 'Alex Riviera',
        date: 'OCT 24',
        time: '10:00 AM',
        attendees: [
            'https://i.pravatar.cc/150?u=1',
            'https://i.pravatar.cc/150?u=2',
            'https://i.pravatar.cc/150?u=3'
        ],
        plusCount: 12,
        isZoom: true
    },
    {
        id: 2,
        title: 'Developer Experience Workshop',
        circle: 'Engineering Circle',
        host: 'Sarah Chen',
        date: 'OCT 25',
        time: '2:30 PM',
        attendees: [
            'https://i.pravatar.cc/150?u=4',
            'https://i.pravatar.cc/150?u=5'
        ],
        plusCount: 45,
        isZoom: true
    },
    {
        id: 3,
        title: 'Community Town Hall',
        circle: 'Community Circle',
        host: 'Marc Wilson',
        date: 'OCT 26',
        time: '5:00 PM',
        attendees: [
            'https://i.pravatar.cc/150?u=6',
            'https://i.pravatar.cc/150?u=7',
            'https://i.pravatar.cc/150?u=8',
            'https://i.pravatar.cc/150?u=9'
        ],
        plusCount: 89,
        isZoom: false
    },
    {
        id: 4,
        title: 'Design System Governance',
        circle: 'Design Circle',
        host: 'Elena Rodriguez',
        date: 'OCT 27',
        time: '11:00 AM',
        attendees: [
            'https://i.pravatar.cc/150?u=12',
            'https://i.pravatar.cc/150?u=13'
        ],
        plusCount: 5,
        isZoom: true
    }
];

const UpcomingMeetingsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans">
            <FeedNavbar activePage="Meetings" />

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <button
                            onClick={() => navigate('/meetings')}
                            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4 group text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Dashboard</span>
                        </button>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                                <Calendar size={24} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Upcoming Sessions</h1>
                        </div>
                        <p className="text-white/50 max-w-xl">
                            Explore all scheduled meetings across your circles. Stay connected with your community.
                        </p>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by title or circle..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-white/30 transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {UPCOMING_MEETINGS.map((meeting) => (
                        <div key={meeting.id} className="group">
                             <UpcomingMeetingCard meeting={meeting} />
                        </div>
                    ))}
                    
                    {/* Placeholder for more */}
                    <div className="border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center p-12 text-center group hover:bg-white/[0.02] transition-all">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/30 mb-4 group-hover:scale-110 transition-transform">
                            <Calendar size={24} />
                        </div>
                        <h3 className="text-white/40 font-bold mb-1">More sessions coming soon</h3>
                        <p className="text-white/20 text-xs">Stay tuned for more updates from your circles</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UpcomingMeetingsPage;
