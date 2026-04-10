import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedNavbar from '../../feed/components/FeedNavbar';
import PastMeetingRow from '../components/PastMeetingRow/PastMeetingRow';
import { Plus, Settings, Trash2, Edit, Video, ArrowLeft } from 'lucide-react';
import meetingService from '../services/meetingService';

const ManageMeetingsPage = () => {
    const navigate = useNavigate();
    const [myMeetings, setMyMeetings] = useState([
        {
            id: 101,
            title: 'Design Critique: New Branding',
            circle: 'Circle Designers',
            date: 'OCT 15, 2023',
            time: '2:00 PM',
            zoomId: '876 4321 9087',
            passcode: '123456',
            status: 'SCHEDULED'
        },
        {
            id: 102,
            title: 'Marketing Weekly Sync',
            circle: 'Marketing Hub',
            date: 'OCT 18, 2023',
            time: '11:00 AM',
            zoomId: '543 2211 0098',
            passcode: '998877',
            status: 'SCHEDULED'
        }
    ]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this meeting? This will also remove it from Zoom.')) {
            setMyMeetings(myMeetings.filter(m => m.id !== id));
            // Actual API call: meetingService.deleteMeeting(id);
        }
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
                    {myMeetings.length > 0 ? (
                        myMeetings.map((meeting) => (
                            <div key={meeting.id} className="bg-[#1A0833] border border-white/5 rounded-2xl p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-purple-500/20 transition-all shadow-xl group">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-5 md:gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shrink-0">
                                        <Video size={28} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg md:text-xl font-bold mb-1.5 text-white truncate">{meeting.title}</h3>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-400">
                                            <span className="text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-md">{meeting.circle}</span>
                                            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-600"></div>
                                            <span className="font-medium">{meeting.date} at {meeting.time}</span>
                                            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-600"></div>
                                            <span className="font-mono bg-white/5 px-2 py-1 rounded text-[10px] tracking-wider uppercase opacity-80">ID: {meeting.zoomId}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                                    <button className="flex-1 lg:flex-none bg-[#0F0529] border border-white/10 hover:border-white/30 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-white/5">
                                        <Edit size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(meeting.id)}
                                        className="flex-1 lg:flex-none bg-[#330808]/50 border border-red-500/20 hover:border-red-500/40 text-red-400 px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-[#330808]"
                                    >
                                        <Trash2 size={16} />
                                    <button className="w-full lg:w-auto bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">
                                        Start Meeting
                                    </button>
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
