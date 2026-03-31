import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Users, Share2, Settings, Send, Smile, Paperclip, Plus,
    Loader2, Globe, Lock, Calendar, CheckCircle, Hash,
    Bell, Megaphone, Lightbulb, CalendarDays, ChevronRight,
    Flame, Heart
} from 'lucide-react';
import FeedNavbar from '../../feed/components/FeedNavbar';

/* ── small helpers ─────────────────────────────────────── */
const DEFAULT_COVER =
    'https://images.unsplash.com/photo-1557682260-96773eb01377?q=80&w=2629&auto=format&fit=crop';
const DEFAULT_AVATAR = 'https://i.pinimg.com/736x/24/de/64/24de6482109345ed57693bcd21b42927.jpg';

const getMemberName  = (u = {}) => u.displayName || u.username || 'Member';
const getMemberPic   = (u = {}) => u.profilePic || DEFAULT_AVATAR;
const getMemberOnline = (u = {}) => u.onlineStatus?.status === 'online';

const formatCount = (n) => {
    if (!n) return '0';
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
};

/* ── static channel definitions ─────────────────────────── */
const CHANNELS = [
    { id: 'general',       icon: Hash,          label: 'general',       active: true  },
    { id: 'announcements', icon: Megaphone,      label: 'announcements', active: false },
    { id: 'events',        icon: CalendarDays,   label: 'events',        active: false },
    { id: 'inspiration',   icon: Lightbulb,      label: 'inspiration',   active: false },
];

/* ── placeholder chat messages (until real chat is wired) ─ */
const PLACEHOLDER_MSGS = [
    {
        id: 1,
        name: 'Jordan Smith',
        time: '10:42 AM',
        text: "Hey everyone! Has anyone checked out the new Figma updates? The auto-layout properties are a complete game changer for component libraries 🚀",
        reactions: [{ icon: '🔥', count: 4 }, { icon: '💯', count: 2 }],
        avatar: 'https://i.pravatar.cc/40?img=3',
    },
    {
        id: 2,
        name: 'Elena Rodriguez',
        time: '11:06 AM',
        text: "I was just playing with them! The 'wrap' feature is exactly what we needed for the grid systems in our current project.",
        reactions: [],
        avatar: 'https://i.pravatar.cc/40?img=5',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=60',
        imageCaption: "Here's what our grid looks like now 👆",
    },
    {
        id: 3,
        name: 'Marcus Lee',
        time: '11:24 AM',
        text: "Can someone record the voice hangout later? I have a client call at the same time.",
        reactions: [],
        avatar: 'https://i.pravatar.cc/40?img=8',
    },
];

/* ══════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════ */
const CircleDetailsPage = () => {
    const { slug }        = useParams();
    const navigate        = useNavigate();
    const messagesEndRef  = useRef(null);

    const [circle,       setCircle]       = useState(null);
    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [activeChannel, setActiveChannel] = useState('general');

    const baseUrl = import.meta.env.VITE_API_URL;

    const currentUser = (() => {
        try { return JSON.parse(localStorage.getItem('user') || '{}'); }
        catch { return {}; }
    })();

    /* fetch circle */
    useEffect(() => {
        const fetchCircle = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${baseUrl}/api/circles/${slug}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                if (res.data.success) {
                    const c = res.data.circle;
                    if (!c.isMember) {
                        navigate(`/circles/${slug}/join`);
                        return;
                    }
                    setCircle(c);
                }
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load circle.');
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchCircle();
    }, [slug, baseUrl, navigate]);

    const isCreator = circle && (
        circle.creator?._id === currentUser._id ||
        circle.creator?._id === currentUser.id  ||
        circle.creator     === currentUser._id  ||
        circle.creator     === currentUser.id
    );

    /* ── loading / error screens ─────────────────────────── */
    if (loading) return (
        <div className="min-h-screen bg-[#0F0529] flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-violet-500 animate-spin mb-4" />
            <p className="text-gray-400 font-medium">Loading circle…</p>
        </div>
    );

    if (error || !circle) return (
        <div className="min-h-screen bg-[#0F0529] flex flex-col items-center justify-center text-white text-center px-6">
            <h1 className="text-2xl font-bold mb-3">Circle not found</h1>
            <p className="text-gray-400 mb-6 text-sm">{error}</p>
            <Link to="/circles" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                ← Back to Explore
            </Link>
        </div>
    );

    /* ── real members list ───────────────────────────────── */
    const membersList = (circle.members || []).slice(0, 5);

    /* ── story bubbles from real members ─────────────────── */
    const storyMembers = (circle.members || []).slice(0, 4);

    /* ═══════════════════════════════════════════════════════
       RENDER
    ═══════════════════════════════════════════════════════ */
    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans flex flex-col">
            <FeedNavbar activePage="Circles" />

            {/* ── COVER IMAGE ─────────────────────────────── */}
            <div className="relative h-48 w-full overflow-hidden shrink-0">
                <img
                    src={circle.coverImage?.startsWith('http') ? circle.coverImage : DEFAULT_COVER}
                    alt={circle.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-[#0F0529]" />
            </div>

            {/* ── HEADER ROW (overlaps cover) ──────────────── */}
            <div className="max-w-[1400px] w-full mx-auto px-6 -mt-14 relative z-10 mb-5">
                <div className="flex items-end justify-between gap-4 flex-wrap">

                    {/* Avatar + info */}
                    <div className="flex items-end gap-5">
                        <div className="w-24 h-24 rounded-full border-4 border-[#0F0529] overflow-hidden shadow-2xl shadow-violet-900/40 shrink-0">
                            <img
                                src={circle.coverImage?.startsWith('http') ? circle.coverImage : DEFAULT_AVATAR}
                                alt={circle.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="pb-1">
                            <h1 className="text-2xl font-extrabold text-white leading-tight mb-1">
                                {circle.name}
                            </h1>
                            <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                                <span className="flex items-center gap-1">
                                    {circle.type === 'private' ? <Lock size={11} /> : <Globe size={11} />}
                                    {circle.type === 'private' ? 'Private' : 'Public'} Community
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users size={11} />
                                    {formatCount(circle.stats?.memberCount)} Members
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                                    {formatCount(Math.floor((circle.stats?.memberCount || 0) * 0.15))} Online Now
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 pb-1">
                        {isCreator ? (
                            <Link
                                to={`/circles/${slug}/manage`}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold shadow-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all"
                            >
                                <Settings size={14} />
                                Manage
                            </Link>
                        ) : (
                            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-violet-600 text-white text-sm font-bold shadow-lg">
                                <CheckCircle size={14} />
                                Joined
                            </span>
                        )}
                        <button className="p-2.5 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition-colors text-gray-300">
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════
                THREE-COLUMN BODY
            ══════════════════════════════════════════════ */}
            <div className="max-w-[1400px] w-full mx-auto px-6 pb-10 flex gap-5 flex-1 items-start">

                {/* ── LEFT SIDEBAR ─────────────────────────── */}
                <aside className="w-52 shrink-0 flex flex-col gap-6 sticky top-24">

                    {/* Channels */}
                    <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">
                            Channels
                        </p>
                        <ul className="space-y-0.5">
                            {CHANNELS.map((ch) => {
                                const Icon = ch.icon;
                                const isActive = activeChannel === ch.id;
                                return (
                                    <li key={ch.id}>
                                        <button
                                            onClick={() => setActiveChannel(ch.id)}
                                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all group ${
                                                isActive
                                                    ? 'bg-violet-600/20 text-violet-300'
                                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                            }`}
                                        >
                                            <Icon size={15} className={isActive ? 'text-violet-400' : 'text-gray-600 group-hover:text-gray-400'} />
                                            <span>{ch.label}</span>
                                            {isActive && (
                                                <span className="ml-auto w-2 h-2 rounded-full bg-violet-400 shrink-0" />
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Direct Messages — top members */}
                    {membersList.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">
                                Direct Messages
                            </p>
                            <ul className="space-y-0.5">
                                {membersList.map((m) => {
                                    const u      = m.user || {};
                                    const name   = getMemberName(u);
                                    const pic    = getMemberPic(u);
                                    const online = getMemberOnline(u);
                                    const uname  = u.username;
                                    return (
                                        <li key={m._id || u._id}>
                                            <Link
                                                to={`/profile/${uname}`}
                                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all group"
                                            >
                                                <div className="relative shrink-0">
                                                    <img
                                                        src={pic}
                                                        alt={name}
                                                        className="w-6 h-6 rounded-full object-cover"
                                                    />
                                                    <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0F0529] ${online ? 'bg-green-400' : 'bg-gray-600'}`} />
                                                </div>
                                                <span className="truncate font-medium group-hover:text-white transition-colors">
                                                    {name}
                                                </span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </aside>

                {/* ── CENTER: CHAT ─────────────────────────── */}
                <div className="flex-1 min-w-0 flex flex-col gap-4">

                    {/* Story bubbles row */}
                    {storyMembers.length > 0 && (
                        <div className="flex items-center gap-4 px-1">
                            {/* Add story */}
                            <div className="flex flex-col items-center gap-1.5">
                                <button className="w-14 h-14 rounded-full border-2 border-dashed border-violet-500/50 flex items-center justify-center hover:border-violet-400 transition-colors bg-violet-600/10">
                                    <Plus size={20} className="text-violet-400" />
                                </button>
                                <span className="text-[10px] text-gray-500">Add Story</span>
                            </div>

                            {storyMembers.map((m) => {
                                const u    = m.user || {};
                                const name = getMemberName(u);
                                const pic  = getMemberPic(u);
                                const uname = u.username;
                                return (
                                    <Link to={`/profile/${uname}`} key={m._id || u._id} className="flex flex-col items-center gap-1.5 group">
                                        <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-br from-violet-500 to-fuchsia-600 group-hover:from-violet-400 group-hover:to-pink-500 transition-all">
                                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#0F0529]">
                                                <img src={pic} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-400 group-hover:text-white transition-colors truncate max-w-[56px] text-center">
                                            {name.split(' ')[0]}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Chat area */}
                    <div
                        className="flex flex-col overflow-hidden rounded-3xl border border-[#2A1550]"
                        style={{ background: 'linear-gradient(160deg, #12082A 0%, #1A0D40 100%)', minHeight: '520px' }}
                    >
                        {/* Description strip */}
                        {circle.description && (
                            <div className="border-b border-[#2A1550] px-6 py-3">
                                <p className="text-gray-400 text-xs leading-relaxed">{circle.description}</p>
                            </div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                            {PLACEHOLDER_MSGS.map((msg) => (
                                <div key={msg.id} className="flex gap-3.5">
                                    <img src={msg.avatar} alt={msg.name} className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-sm font-semibold text-white">{msg.name}</span>
                                            <span className="text-[11px] text-gray-600">{msg.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-300 leading-relaxed">{msg.text}</p>

                                        {msg.image && (
                                            <div className="mt-3 rounded-2xl overflow-hidden max-w-xs border border-white/5">
                                                <img src={msg.image} alt="" className="w-full object-cover" />
                                                {msg.imageCaption && (
                                                    <p className="text-xs text-gray-500 px-3 py-2">{msg.imageCaption}</p>
                                                )}
                                            </div>
                                        )}

                                        {msg.reactions?.length > 0 && (
                                            <div className="flex items-center gap-2 mt-2">
                                                {msg.reactions.map((r, i) => (
                                                    <button
                                                        key={i}
                                                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs hover:bg-violet-500/15 hover:border-violet-500/30 transition-all"
                                                    >
                                                        <span>{r.icon}</span>
                                                        <span className="text-gray-400 font-medium">{r.count}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message input */}
                        <div className="border-t border-[#2A1550] px-5 py-4">
                            <div className="flex items-center gap-3 bg-[#0F0529]/60 border border-[#2A1550] rounded-2xl px-4 py-3">
                                <button className="text-gray-500 hover:text-gray-300 transition-colors shrink-0">
                                    <Plus size={18} />
                                </button>
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && setMessageInput('')}
                                    placeholder={`Message #${activeChannel}`}
                                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
                                />
                                <button className="text-gray-500 hover:text-gray-300 transition-colors shrink-0">
                                    <Smile size={18} />
                                </button>
                                <button
                                    disabled={!messageInput.trim()}
                                    onClick={() => setMessageInput('')}
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white disabled:opacity-40 hover:from-violet-500 hover:to-fuchsia-500 transition-all shrink-0"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT SIDEBAR ────────────────────────── */}
                <aside className="w-64 shrink-0 flex flex-col gap-4 sticky top-24">

                    {/* Upcoming Meetings */}
                    <div className="rounded-3xl border border-[#2A1550] overflow-hidden"
                        style={{ background: 'linear-gradient(160deg, #12082A 0%, #1A0D40 100%)' }}>
                        <div className="flex items-center justify-between px-5 pt-5 pb-3">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Upcoming Meetings</h3>
                            <span className="text-[9px] font-bold text-white bg-violet-600 px-2.5 py-1 rounded-full tracking-wider">
                                TODAY
                            </span>
                        </div>

                        <div className="px-4 pb-4 space-y-3">
                            {/* Meeting 1 */}
                            <div className="p-4 bg-white/3 rounded-2xl border border-white/5">
                                <p className="text-[11px] text-violet-400 font-bold mb-1">4:00 PM</p>
                                <p className="text-white font-semibold text-sm mb-1">Weekly Design Sync</p>
                                <p className="text-gray-500 text-[11px] leading-relaxed mb-3">
                                    Discussing the Q3 roadmap and component audit.
                                </p>
                                {/* avatars row */}
                                <div className="flex items-center gap-1 mb-3">
                                    {(circle.members || []).slice(0, 3).map((m, i) => (
                                        <img
                                            key={i}
                                            src={getMemberPic(m.user || {})}
                                            alt=""
                                            className="w-5 h-5 rounded-full object-cover border border-[#12082A] -ml-1 first:ml-0"
                                        />
                                    ))}
                                </div>
                                <button className="w-full py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold hover:from-violet-500 hover:to-fuchsia-500 transition-all flex items-center justify-center gap-1.5">
                                    <Calendar size={11} />
                                    RSVP Now
                                </button>
                            </div>

                            {/* Meeting 2 */}
                            <div className="p-4 bg-white/3 rounded-2xl border border-white/5">
                                <p className="text-[11px] text-fuchsia-400 font-bold mb-1">6:30 PM</p>
                                <p className="text-white font-semibold text-sm mb-3">Portfolio Critiques</p>
                                <button className="w-full py-2 rounded-xl border border-violet-500/30 text-violet-400 text-xs font-bold hover:bg-violet-500/10 transition-all">
                                    RSVP Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Members — REAL DATA */}
                    <div className="rounded-3xl border border-[#2A1550] overflow-hidden"
                        style={{ background: 'linear-gradient(160deg, #12082A 0%, #1A0D40 100%)' }}>
                        <div className="flex items-center justify-between px-5 pt-5 pb-3">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Members</h3>
                            <Link
                                to={`/circles/${slug}/members`}
                                className="text-[11px] text-violet-400 hover:text-violet-300 font-medium transition-colors flex items-center gap-0.5"
                            >
                                View All <ChevronRight size={12} />
                            </Link>
                        </div>

                        <div className="px-4 pb-5 space-y-3">
                            {membersList.length === 0 && (
                                <p className="text-xs text-gray-600 text-center py-4">No members yet</p>
                            )}
                            {membersList.map((m) => {
                                const u      = m.user || {};
                                const name   = getMemberName(u);
                                const pic    = getMemberPic(u);
                                const online = getMemberOnline(u);
                                const uname  = u.username;

                                /* color dot by role */
                                const dotColor =
                                    m.role === 'admin'     ? 'bg-yellow-400' :
                                    m.role === 'moderator' ? 'bg-blue-400'   :
                                    online                 ? 'bg-green-400'  : 'bg-gray-600';

                                return (
                                    <Link
                                        key={m._id || u._id}
                                        to={`/profile/${uname}`}
                                        className="flex items-center gap-3 group"
                                    >
                                        <div className="relative shrink-0">
                                            <img
                                                src={pic}
                                                alt={name}
                                                className="w-9 h-9 rounded-full object-cover group-hover:ring-2 group-hover:ring-violet-500/50 transition-all"
                                            />
                                            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#12082A] ${dotColor}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors truncate">
                                                {name}
                                            </p>
                                            <p className="text-[11px] text-gray-600 capitalize">{m.role}</p>
                                        </div>
                                    </Link>
                                );
                            })}

                            {(circle.stats?.memberCount || 0) > 5 && (
                                <Link
                                    to={`/circles/${slug}/members`}
                                    className="block text-center text-[11px] text-gray-600 hover:text-violet-400 transition-colors pt-1"
                                >
                                    + {circle.stats.memberCount - 5} more members →
                                </Link>
                            )}
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
};

export default CircleDetailsPage;
