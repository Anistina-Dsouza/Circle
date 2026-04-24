import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedNavbar from '../../feed/components/FeedNavbar';
import { Calendar, Clock, Video, Users, ArrowLeft, Check, Loader, AlertCircle } from 'lucide-react';
import meetingService from '../services/meetingService';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const ScheduleMeetingPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        circle: '',
        date: '',
        time: '',
        description: '',
        scheduledDuration: 60,
    });
    const [myCircles, setMyCircles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Meeting title is required';
        if (!formData.circle) newErrors.circle = 'Please select a community circle';
        if (!formData.date) newErrors.date = 'Meeting date is required';
        if (!formData.time) newErrors.time = 'Meeting time is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        const fieldName = id.replace('meeting-', '');
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: '' }));
        }
        setError(null);
    };

    useEffect(() => {
        const fetchCircles = async () => {
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                const res = await axios.get(`${BACKEND_URL}/api/meetings/eligible-circles`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.data.success) {
                    setMyCircles(res.data.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch user circles", err);
            }
        };

        fetchCircles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setLoading(true);
        setError(null);
        try {
            // Combine date and time
            const dateTimeString = `${formData.date}T${formData.time}:00`;
            const startTime = new Date(dateTimeString).toISOString();

            if (new Date(dateTimeString) < new Date()) {
                setError("Meeting date and time cannot be set in the past.");
                setLoading(false);
                return;
            }

            const payload = {
                title: formData.title,
                description: formData.description,
                startTime,
                scheduledDuration: formData.scheduledDuration,
                circle: formData.circle || undefined,
                settings: {
                    requirePassword: false
                }
            };

            await meetingService.createMeeting(payload);
            navigate('/meetings');
        } catch (err) {
            console.error('Error creating meeting:', err);
            setError(err.response?.data?.message || 'Failed to schedule Zoom meeting. Please verify your Zoom credentials or try again.');
        } finally {
            setLoading(false);
        }
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

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-400 ml-1">Meeting Title</label>
                                <input
                                    id="meeting-title"
                                    type="text"
                                    placeholder="e.g., Weekly Design Sync"
                                    className={`w-full bg-[#0F0529] border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.title ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-purple-500/50'}`}
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                                {errors.title && (
                                    <div className="flex items-center mt-1 text-red-500 text-xs gap-1 ml-1">
                                        <AlertCircle size={12} />
                                        <span>{errors.title}</span>
                                    </div>
                                )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400 ml-1 flex items-center gap-2">
                                    <Users size={14} /> Select Circle (Optional)
                                </label>
                                <select
                                    id="meeting-circle"
                                    className={`w-full bg-[#0F0529] border rounded-xl px-4 py-3 focus:outline-none transition-colors appearance-none ${errors.circle ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-purple-500/50'}`}
                                    value={formData.circle}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Choose a community to host for</option>
                                    {myCircles.map(circle => (
                                        <option key={circle.id || circle._id} value={circle._id}>{circle.name}</option>
                                    ))}
                                </select>
                                {errors.circle && (
                                    <div className="flex items-center mt-1 text-red-500 text-xs gap-1 ml-1">
                                        <AlertCircle size={12} />
                                        <span>{errors.circle}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400 ml-1 flex items-center gap-2">
                                    <Video size={14} /> Platform
                                </label>
                                <select
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors appearance-none"
                                    disabled
                                >
                                    <option>Zoom (Auto-connected)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400 ml-1 flex items-center gap-2">
                                    <Calendar size={14} /> Date
                                </label>
                                <input
                                    id="meeting-date"
                                    type="date"
                                    className={`w-full bg-[#0F0529] border rounded-xl px-4 py-3 focus:outline-none transition-colors invert-calendar-icon ${errors.date ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-purple-500/50'}`}
                                    value={formData.date}
                                    min={new Date().toLocaleDateString('en-CA')}
                                    onChange={handleChange}
                                />
                                {errors.date && (
                                    <div className="flex items-center mt-1 text-red-500 text-xs gap-1 ml-1">
                                        <AlertCircle size={12} />
                                        <span>{errors.date}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400 ml-1 flex items-center gap-2">
                                    <Clock size={14} /> Time
                                </label>
                                <input
                                    id="meeting-time"
                                    type="time"
                                    className={`w-full bg-[#0F0529] border rounded-xl px-4 py-3 focus:outline-none transition-colors invert-calendar-icon ${errors.time ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-purple-500/50'}`}
                                    value={formData.time}
                                    onChange={handleChange}
                                />
                                {errors.time && (
                                    <div className="flex items-center mt-1 text-red-500 text-xs gap-1 ml-1">
                                        <AlertCircle size={12} />
                                        <span>{errors.time}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400 ml-1 flex items-center gap-2">
                                    <Clock size={14} /> Duration
                                </label>
                                <select
                                    id="meeting-duration"
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors appearance-none"
                                    value={formData.scheduledDuration}
                                    onChange={(e) => setFormData({ ...formData, scheduledDuration: parseInt(e.target.value) })}
                                    required
                                >
                                    <option value="15">15 mins</option>
                                    <option value="30">30 mins</option>
                                    <option value="45">45 mins</option>
                                    <option value="60">1 hour</option>
                                    <option value="90">1.5 hours</option>
                                    <option value="120">2 hours</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-400 ml-1">Description (Agenda)</label>
                            <textarea
                                id="meeting-description"
                                rows="3"
                                placeholder="What will this meeting be about?"
                                className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <button
                            id="schedule-meeting-btn"
                            type="submit"
                            disabled={loading}
                            className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4 
                                ${loading 
                                    ? 'bg-purple-600/50 cursor-not-allowed' 
                                    : 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20'}`}
                        >
                            {loading ? (
                                <Loader id="meeting-loader" size={20} className="animate-spin" />
                            ) : (
                                <Check size={20} />
                            )}
                            {loading ? 'Generating Zoom Room...' : 'Schedule Meeting'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ScheduleMeetingPage;
