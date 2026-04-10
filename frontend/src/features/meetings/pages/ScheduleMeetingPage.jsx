import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedNavbar from '../../feed/components/FeedNavbar';
import { Calendar, Clock, Video, Users, ArrowLeft, Check } from 'lucide-react';

const ScheduleMeetingPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        circle: '',
        date: '',
        time: '',
        description: '',
        link: 'https://zoom.us/j/meeting-id',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Meeting Scheduled:', formData);
        navigate('/meetings');
    };

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans">
            <FeedNavbar activePage="Meetings" />

            <main className="max-w-2xl mx-auto px-6 py-12">
                <button
                    onClick={() => navigate('/meetings')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Meetings</span>
                </button>

                <div className="bg-[#1A0833] rounded-3xl p-8 border border-white/5 shadow-2xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Schedule a Meeting</h1>
                        <p className="text-gray-400">Plan a live sync or workshop for your community.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-400 ml-1">Meeting Title</label>
                            <input
                                type="text"
                                placeholder="e.g., Weekly Design Sync"
                                className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400 ml-1 flex items-center gap-2">
                                    <Users size={14} /> Select Circle
                                </label>
                                <select
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors appearance-none"
                                    value={formData.circle}
                                    onChange={(e) => setFormData({ ...formData, circle: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Choose a circle</option>
                                    <option value="Circle Designers">Circle Designers</option>
                                    <option value="Marketing Hub">Marketing Hub</option>
                                    <option value="Founders Circle">Founders Circle</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400 ml-1 flex items-center gap-2">
                                    <Video size={14} /> Platform
                                </label>
                                <select
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors appearance-none"
                                    required
                                >
                                    <option>Zoom</option>
                                    <option>Google Meet</option>
                                    <option>Discord</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400 ml-1 flex items-center gap-2">
                                    <Calendar size={14} /> Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors invert-calendar-icon"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400 ml-1 flex items-center gap-2">
                                    <Clock size={14} /> Time
                                </label>
                                <input
                                    type="time"
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors invert-calendar-icon"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-400 ml-1">Description</label>
                            <textarea
                                rows="3"
                                placeholder="What will this meeting be about?"
                                className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            <Check size={20} />
                            Schedule Meeting
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ScheduleMeetingPage;
