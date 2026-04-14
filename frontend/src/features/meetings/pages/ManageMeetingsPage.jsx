import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedNavbar from '../../feed/components/FeedNavbar';
import PastMeetingRow from '../components/PastMeetingRow/PastMeetingRow';
import { Plus, Settings, Trash2, Edit, Video, ArrowLeft, Loader } from 'lucide-react';
import meetingService from '../services/meetingService';

const ManageMeetingsPage = () => {
    const navigate = useNavigate();
    const [myMeetings, setMyMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHostMeetings = async () => {
            try {
                setLoading(true);
                const res = await meetingService.getMyHostedMeetings();
                if (res.success) {
                    setMyMeetings(res.data);
                }
            } catch (err) {
                console.error("Error fetching meetings:", err);
                setError("Failed to load meetings.");
            } finally {
                setLoading(false);
            }
        };

        fetchHostMeetings();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this meeting? This will also remove it from Zoom.')) {
            try {
                await meetingService.deleteMeeting(id);
                setMyMeetings(myMeetings.filter(m => m.id !== id && m._id !== id));
            } catch (err) {
                console.error("Failed to delete meeting", err);
                alert("Failed to delete meeting");
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options).toUpperCase();
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans">
            <FeedNavbar activePage="Meetings" />

            <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 md:mb-12">
                    <div>
                        <button
                            onClick={() => navigate('/meetings')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-3 group text-sm"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Back to All Meetings</span>
                        </button>
                        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Manage Your Meetings</h1>
                        <p className="text-sm md:text-base text-gray-400 mt-1">View and edit sessions you are hosting via Zoom.</p>
                    </div>

                    <button
                        onClick={() => navigate('/meetings/schedule')}
                        className="w-full sm:w-auto bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        Schedule New
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-20 text-purple-400">
                            <Loader className="animate-spin" size={32} />
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-400">{error}</div>
                    ) : myMeetings.length > 0 ? (
                        myMeetings.map((meeting) => (
                            <div key={meeting._id || meeting.id} className="bg-[#1A0833] border border-white/5 rounded-2xl p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-purple-500/20 transition-all shadow-xl group">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-5 md:gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shrink-0">
                                        <Video size={28} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg md:text-xl font-bold mb-1.5 text-white truncate">{meeting.title}</h3>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-400">
                                            {meeting.circle && (
                                                <>
                                                    <span className="text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-md">
                                                        {meeting.circle?.name || 'General Default'}
                                                    </span>
                                                    <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-600"></div>
                                                </>
                                            )}
                                            <span className="font-medium">{formatDate(meeting.startTime)} at {formatTime(meeting.startTime)}</span>
                                            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-600"></div>
                                            <span className="font-mono bg-white/5 px-2 py-1 rounded text-[10px] tracking-wider uppercase opacity-80">Zoom ID: {meeting.roomId || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                                    <button 
                                        onClick={() => handleDelete(meeting._id || meeting.id)}
                                        className="flex-1 lg:flex-none bg-[#330808]/50 border border-red-500/20 hover:border-red-500/40 text-red-400 px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-[#330808]"
                                    >
                                        <Trash2 size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Delete</span>
                                    </button>
                                    <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="w-full lg:w-auto bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center">
                                        Start Zoom
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-[#1A0833] rounded-3xl border border-dashed border-white/10">
                            <Video size={48} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-400">No meetings hosted yet</h3>
                            <p className="text-gray-500 mb-8">Start hosting sessions for your community circles!</p>
                            <button
                                onClick={() => navigate('/meetings/schedule')}
                                className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 px-6 py-2.5 rounded-xl transition-all"
                            >
                                Schedule Your First Meeting
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ManageMeetingsPage;
