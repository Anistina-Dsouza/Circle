import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedNavbar from '../../feed/components/FeedNavbar';
import UpcomingMeetingCard from '../components/UpcomingMeetingCard/UpcomingMeetingCard';
import { ArrowLeft, Calendar, Search, Loader } from 'lucide-react';
import meetingService from '../services/meetingService';

const UpcomingMeetingsPage = () => {
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                setLoading(true);
                const res = await meetingService.getUpcomingMeetings();
                if (res.success && res.data) {
                    const mappedData = res.data.map(m => {
                        const dateObj = new Date(m.startTime);
                        const attendees = m.participants?.map(p => p.user?.profile?.profileImage || 'https://i.pravatar.cc/150?u=1').slice(0, 3) || [];
                        const plusCount = m.participants?.length > 3 ? m.participants.length - 3 : 0;

                        return {
                            id: m._id,
                            status: 'UPCOMING',
                            statusColor: 'bg-purple-500/20 text-purple-300',
                            title: m.title,
                            circle: m.circle?.name || 'General Community',
                            host: m.host?.profile?.displayName || m.host?.username || 'Unknown',
                            dateLabel: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(),
                            time: dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                            attendees: attendees.length ? attendees : ['https://ui-avatars.com/api/?name=User&background=random'],
                            plusCount: plusCount,
                            btnColor: 'bg-[#8B5CF6] hover:bg-[#7C3AED]',
                            meetingLink: m.meetingLink
                        };
                    });
                    setMeetings(mappedData);
                }
            } catch (err) {
                console.error("Failed to load upcoming meetings", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMeetings();
    }, []);

    const filteredMeetings = meetings.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.circle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans">
            <FeedNavbar />

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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-white/30 transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/5 animate-pulse min-h-[320px] flex flex-col">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="h-5 w-24 bg-white/10 rounded-full" />
                                    <div className="h-5 w-5 bg-white/10 rounded" />
                                </div>
                                <div className="h-8 w-3/4 bg-white/10 rounded-xl mb-4" />
                                <div className="space-y-3 mb-10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-white/5 rounded shadow-inner" />
                                        <div className="h-4 w-32 bg-white/5 rounded" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-white/5 rounded shadow-inner" />
                                        <div className="h-4 w-40 bg-white/5 rounded" />
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="space-y-2">
                                            <div className="h-3 w-12 bg-white/5 rounded" />
                                            <div className="h-6 w-20 bg-white/10 rounded" />
                                        </div>
                                        <div className="flex -space-x-2">
                                            {[1,2,3].map(j => <div key={j} className="w-8 h-8 rounded-full bg-white/5 border-2 border-[#0F0529]" />)}
                                        </div>
                                    </div>
                                    <div className="w-full h-12 bg-white/10 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredMeetings.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl">
                        <Calendar size={48} className="mx-auto text-white/20 mb-4" />
                        <h3 className="text-xl font-bold text-gray-400 mb-2">No upcoming meetings found</h3>
                        <p className="text-gray-500">Looks like your schedule is clear.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredMeetings.map((meeting) => (
                            <div key={meeting.id} className="group cursor-pointer" onClick={(e) => {
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
                        
                        <div className="border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center p-12 text-center group hover:bg-white/[0.02] transition-all">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/30 mb-4 group-hover:scale-110 transition-transform">
                                <Calendar size={24} />
                            </div>
                            <h3 className="text-white/40 font-bold mb-1">More sessions coming soon</h3>
                            <p className="text-white/20 text-xs">Stay tuned for more updates from your circles</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default UpcomingMeetingsPage;
