import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, Plus, ChevronRight, Loader2, Globe, Lock } from 'lucide-react';

const CircleItem = ({ circle }) => (
    <li>
        <Link
            to={`/circles/${circle.slug}`}
            className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-violet-500/10 transition-all group"
        >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-violet-500/20 group-hover:border-violet-500/50 transition-colors">
                <img
                    src={
                        (circle.profilePic && circle.profilePic !== '')
                            ? circle.profilePic
                            : (circle.coverImage && circle.coverImage !== '')
                                ? circle.coverImage
                                : 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
                    }
                    alt={circle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
                    {circle.name}
                </p>
                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Users size={10} />
                    {(circle.stats?.memberCount || 0).toLocaleString()}
                </p>
            </div>

            {/* Arrow */}
            <ChevronRight
                size={12}
                className="text-gray-700 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all shrink-0"
            />
        </Link>
    </li>
);

const MyCirclesPanel = () => {
    const [circles, setCircles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchMyCircles = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get(`${baseUrl}/api/circles/my-circles/list`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setCircles(res.data.circles || []);
                }
            } catch (err) {
                setError('Could not load circles');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyCircles();
    }, [baseUrl]);

    const token = localStorage.getItem('token');

    return (
        <aside className="w-72 shrink-0 sticky top-24 self-start flex flex-col gap-4">
            {/* Panel Card */}
            <div className="rounded-3xl border border-[#2A1550] overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #12082a 0%, #1a0d40 100%)' }}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#2A1550]">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                            <Users size={14} className="text-white" />
                        </div>
                        <h3 className="text-sm font-bold text-white tracking-tight">My Circles</h3>
                    </div>
                    <Link
                        to="/circles"
                        className="text-[11px] text-violet-400 hover:text-violet-300 font-semibold transition-colors"
                    >
                        Explore
                    </Link>
                </div>

                {/* Body */}
                <div className="px-3 py-3">
                    {!token ? (
                        <div className="text-center py-6 px-4">
                            <p className="text-gray-500 text-xs mb-3">Sign in to see your circles</p>
                            <Link
                                to="/login"
                                className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                            >
                                Log in →
                            </Link>
                        </div>
                    ) : loading ? (
                        <div className="space-y-3 px-1 py-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-3 px-3 py-2 animate-pulse">
                                    <div className="w-9 h-9 rounded-xl bg-white/5 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-2/3 bg-white/5 rounded" />
                                        <div className="h-2 w-1/3 bg-white/5 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <p className="text-center text-xs text-red-400 py-6">{error}</p>
                    ) : circles.length === 0 ? (
                        <div className="text-center py-6 px-3">
                            <div className="w-12 h-12 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-3">
                                <Users size={20} className="text-violet-400/50" />
                            </div>
                            <p className="text-gray-500 text-xs leading-relaxed mb-3">
                                You haven't joined any circles yet
                            </p>
                            <Link
                                to="/circles"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                            >
                                Browse communities <ChevronRight size={13} />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Created Circles */}
                            {circles.filter(c => (c.creator?._id || c.creator)?.toString() === JSON.parse(localStorage.getItem('user'))?._id?.toString()).length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 px-3">
                                        <span className="text-[10px] font-black text-violet-500 uppercase tracking-[0.15em]">Admin</span>
                                        <div className="h-[1px] flex-1 bg-violet-500/10" />
                                    </div>
                                    <ul className="space-y-1">
                                        {circles
                                            .filter(c => (c.creator?._id || c.creator)?.toString() === JSON.parse(localStorage.getItem('user'))?._id?.toString())
                                            .map((circle) => (
                                                <CircleItem key={circle._id} circle={circle} />
                                            ))
                                        }
                                    </ul>
                                </div>
                            )}

                            {/* Joined Circles */}
                            {circles.filter(c => (c.creator?._id || c.creator)?.toString() !== JSON.parse(localStorage.getItem('user'))?._id?.toString()).length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 px-3">
                                        <span className="text-[10px] font-black text-fuchsia-500 uppercase tracking-[0.15em]">Joined</span>
                                        <div className="h-[1px] flex-1 bg-fuchsia-500/10" />
                                    </div>
                                    <ul className="space-y-1">
                                        {circles
                                            .filter(c => (c.creator?._id || c.creator)?.toString() !== JSON.parse(localStorage.getItem('user'))?._id?.toString())
                                            .map((circle) => (
                                                <CircleItem key={circle._id} circle={circle} />
                                            ))
                                        }
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer CTA */}
                {!loading && circles.length > 0 && (
                    <div className="px-4 pb-4 pt-1">
                        <Link
                            to="/circles/create"
                            className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-2xl border border-dashed border-violet-500/30 text-violet-400 text-xs font-semibold hover:bg-violet-500/10 hover:border-violet-500/60 transition-all group"
                        >
                            <Plus size={13} className="group-hover:rotate-90 transition-transform duration-300" />
                            Create a Circle
                        </Link>
                    </div>
                )}
            </div>

            {/* Discover tip */}
            <div className="rounded-2xl border border-[#2A1550] px-4 py-4 text-center"
                style={{ background: 'rgba(124, 58, 237, 0.05)' }}>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                    Circles are time-based communities. Join one and share your moments with people who care.
                </p>
                <Link
                    to="/circles"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
                >
                    Discover Circles <ChevronRight size={12} />
                </Link>
            </div>
        </aside>
    );
};

export default MyCirclesPanel;
