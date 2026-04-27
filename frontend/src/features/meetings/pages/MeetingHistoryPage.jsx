import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedNavbar from '../../feed/components/FeedNavbar';
import PastMeetingRow from '../components/PastMeetingRow/PastMeetingRow';
import { ArrowLeft, Search, Filter, Loader } from 'lucide-react';
import meetingService from '../services/meetingService';

const MeetingHistoryPage = () => {
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchHistory = async (pageNumber) => {
        try {
            setLoading(true);
            const res = await meetingService.getMeetingHistory(`?page=${pageNumber}&limit=10`);
            if (res.success && res.data) {
                const mappedData = res.data.map(m => {
                    const dateObj = new Date(m.startTime);
                    const attendeesCount = m.participants?.filter(p => p.status === 'attended').length || m.participants?.length || 0;
                    return {
                        id: m._id,
                        title: m.title,
                        description: `Held with ${attendeesCount} attendees • ${m.duration || m.scheduledDuration || 60}m duration`,
                        date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        canViewReport: m.canViewReport
                    };
                });
                setMeetings(mappedData);
                setTotalPages(res.pagination?.pages || 1);
            }
        } catch (err) {
            console.error("Failed to load meeting history", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory(page);
    }, [page]);

    const filteredMeetings = meetings.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <div className="relative border border-white/5 rounded-xl">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search history..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-[#1A0833] rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 transition-colors w-full md:w-64"
                            />
                        </div>
                        <button className="bg-[#1A0833] border border-white/5 p-2.5 rounded-xl text-gray-400 hover:text-white hover:border-purple-500/30 transition-all">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {/* History List */}
                <div className="bg-[#1A0833] rounded-3xl border border-white/5 overflow-hidden shadow-2xl min-h-[300px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-full py-20 text-purple-500">
                            <Loader className="animate-spin" size={32} />
                        </div>
                    ) : filteredMeetings.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <p>No meeting history found.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {filteredMeetings.map((meeting) => (
                                <PastMeetingRow key={meeting.id} meeting={meeting} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        <button 
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-lg bg-[#1A0833] border border-white/5 text-gray-400 hover:text-white disabled:opacity-50"
                        >
                            Previous
                        </button>
                        
                        <button className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold">{page}</button>
                        
                        <button 
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 rounded-lg bg-[#1A0833] border border-white/5 text-gray-400 hover:text-white disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MeetingHistoryPage;
