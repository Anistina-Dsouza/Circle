import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Users, Info, ArrowLeft, Loader2, Lock } from 'lucide-react';
import FeedNavbar from '../../feed/components/FeedNavbar';

const JoinCommunityPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [circle, setCircle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joinLoading, setJoinLoading] = useState(false);
    const [error, setError] = useState(null);
    const [introduction, setIntroduction] = useState('');
    const baseUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchCircle = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/circles/${slug}`);
                if (response.data.success) {
                    setCircle(response.data.circle);
                    if (response.data.circle.isMember) {
                        navigate('/circles');
                    }
                }
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch community details.');
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchCircle();
    }, [slug, baseUrl, navigate]);

    const handleJoinRequest = async () => {
        setJoinLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${baseUrl}/api/circles/${circle._id || circle.id}/join`,
                { message: introduction },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/circles');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send join request. Please try again.');
        } finally {
            setJoinLoading(false);
        }
    };

    const formatMemberCount = (count) => {
        if (!count) return '0';
        if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
        return count.toString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F0529] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-violet-500 animate-spin mb-4" />
                <p className="text-gray-400 font-medium">Locating Community...</p>
            </div>
        );
    }

    if (error && !circle) {
        return (
            <div className="min-h-screen bg-[#0F0529] flex flex-col items-center justify-center text-white px-6 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                    <Lock className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold mb-3">Community Not Found</h1>
                <p className="text-gray-400 mb-8 max-w-sm text-sm">{error}</p>
                <Link to="/circles" className="inline-flex items-center space-x-2 text-violet-400 hover:text-violet-300 font-medium transition-colors">
                    <ArrowLeft size={18} />
                    <span>Back to Explore</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans selection:bg-violet-500/30">
            <FeedNavbar activePage="Circles" />

            <div className="max-w-3xl mx-auto px-6 py-10">
                {/* Back Link */}
                <Link
                    to="/circles"
                    className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors font-medium mb-8 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-200" />
                    <span>Back to communities</span>
                </Link>

                {/* Main Card — two column layout */}
                <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-[#2A1550]"
                    style={{ background: 'linear-gradient(145deg, #16093A 0%, #1E0D4A 50%, #160840 100%)' }}>

                    {/* Top accent bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500" />

                    <div className="grid md:grid-cols-5">

                        {/* Left Panel — Circle summary */}
                        <div className="md:col-span-2 flex flex-col items-center justify-center px-8 py-10 text-center border-b md:border-b-0 md:border-r border-[#2A1550]"
                            style={{ background: 'rgba(10, 4, 28, 0.5)' }}>

                            {/* Avatar */}
                            <div className="relative inline-block mb-5">
                                <div className="w-28 h-28 rounded-full p-[2px] bg-gradient-to-b from-violet-500 to-fuchsia-700">
                                    <div className="w-full h-full bg-[#100535] rounded-full flex items-center justify-center overflow-hidden">
                                        <img
                                            src={circle.coverImage?.startsWith('http') ? circle.coverImage : 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'}
                                            alt={circle.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                {/* Glow */}
                                <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(139,92,246,0.4)] -z-10" />
                                {/* Type Badge */}
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white text-[9px] font-bold px-4 py-1 rounded-full tracking-widest uppercase border-2 border-[#100535] whitespace-nowrap">
                                    {circle.type?.toUpperCase() || 'COMMUNITY'}
                                </div>
                            </div>

                            <h1 className="text-xl font-bold text-white mt-3 mb-2 leading-snug">
                                {circle.name}
                            </h1>

                            {circle.description && (
                                <p className="text-gray-500 text-xs leading-relaxed mb-5">
                                    {circle.description}
                                </p>
                            )}

                            {/* Stats */}
                            <div className="flex items-center justify-center space-x-1.5 text-violet-400 text-sm font-medium mb-3">
                                <Users size={14} />
                                <span>{formatMemberCount(circle.stats?.memberCount)} Members</span>
                            </div>

                            {circle.category && (
                                <span className="inline-block text-[11px] font-semibold text-fuchsia-300/80 bg-fuchsia-950/50 border border-fuchsia-800/30 px-3 py-1 rounded-full">
                                    {circle.category}
                                </span>
                            )}
                        </div>

                        {/* Right Panel — Join Form */}
                        <div className="md:col-span-3 px-8 py-10">
                            <h2 className="text-xl font-bold text-white mb-1">Ready to join?</h2>
                            <p className="text-gray-500 text-xs mb-7">
                                {circle.type === 'private'
                                    ? 'This is a private circle. Introduce yourself and an admin will review your request.'
                                    : 'Write a short intro and send your request to become a member.'}
                            </p>

                            {/* Textarea */}
                            <div className="mb-5">
                                <label className="block text-sm font-semibold text-gray-200 mb-2">
                                    Introduce yourself to the admins
                                </label>
                                <div className="relative">
                                    <textarea
                                        value={introduction}
                                        onChange={(e) => setIntroduction(e.target.value.slice(0, 300))}
                                        placeholder={`Tell the community why you'd like to join ${circle.name}...`}
                                        rows={5}
                                        className="w-full bg-[#0A0420]/70 border border-[#2A1550] rounded-2xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/60 resize-none transition-colors leading-relaxed"
                                    />
                                    <div className="absolute bottom-3 right-4 text-xs text-gray-600 font-medium select-none">
                                        {introduction.length} / 300
                                    </div>
                                </div>
                            </div>

                            {/* Info Alert */}
                            <div className="flex items-start space-x-3 bg-violet-950/30 border border-violet-900/30 rounded-2xl px-4 py-3 mb-6">
                                <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                                    <Info size={11} className="text-white" />
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Your profile and introduction will be reviewed by the moderators. You'll receive a notification once they've made a decision.
                                </p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="mb-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                    {error}
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleJoinRequest}
                                    disabled={joinLoading || introduction.trim().length === 0}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-900/30 flex items-center justify-center space-x-2"
                                >
                                    {joinLoading && <Loader2 size={17} className="animate-spin" />}
                                    <span>Send Join Request</span>
                                </button>
                                <button
                                    onClick={() => navigate('/circles')}
                                    className="w-full py-3 rounded-2xl text-gray-500 hover:text-gray-300 font-medium text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Link */}
                <p className="mt-8 text-center text-sm text-gray-600">
                    Are you an admin?{' '}
                    <Link to="/admin/communities" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                        Manage join requests here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default JoinCommunityPage;
