import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Users, Share2, Settings, Loader2,
    Globe, Lock, CheckCircle, LogOut, UserPlus, Flag
} from 'lucide-react';

import FeedNavbar         from '../../feed/components/FeedNavbar';
import CircleDMList       from '../components/CircleDMList';
import CircleStoriesBar   from '../components/CircleStoriesBar';
import CircleChatArea     from '../components/CircleChatArea';
import CircleMembersPanel from '../components/CircleMembersPanel';
import CircleLeaveModal   from '../components/CircleLeaveModal';
import CircleInviteModal  from '../components/CircleInviteModal';
import ReportModal        from '../../../components/common/ReportModal';

/* ── helpers ──────────────────────────────────────────────── */
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1557682260-96773eb01377?q=80&w=2629&auto=format&fit=crop';

const formatCount = (n) => {
    if (!n) return '0';
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
};

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
const CircleDetailsPage = () => {
    const { slug }  = useParams();
    const navigate  = useNavigate();

    const [circle,       setCircle]       = useState(null);
    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState(null);
    const [refreshKey,   setRefreshKey]   = useState(0);

    /* modal state */
    const [leaveOpen,   setLeaveOpen]   = useState(false);
    const [leaveLoading, setLeaveLoading] = useState(false);
    const [inviteOpen,  setInviteOpen]  = useState(false);
    const [reportOpen,  setReportOpen]  = useState(false);

    const baseUrl = import.meta.env.VITE_API_URL;

    const currentUser = (() => {
        try { return JSON.parse(localStorage.getItem('user') || '{}'); }
        catch { return {}; }
    })();

    /* fetch circle ----------------------------------------- */
    useEffect(() => {
        const fetchCircle = async () => {
            setLoading(true);
            setError(null);
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
    }, [slug, baseUrl, navigate, refreshKey]);

    /* leave circle ----------------------------------------- */
    const handleLeave = async () => {
        setLeaveLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${baseUrl}/api/circles/${circle._id}/leave`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/circles');
        } catch (err) {
            console.error('Failed to leave circle:', err);
            setLeaveLoading(false);
            setLeaveOpen(false);
        }
    };

    /* derived ---------------------------------------------- */
    const isCreator = circle && (
        circle.creator?._id === currentUser._id ||
        circle.creator?._id === currentUser.id  ||
        circle.creator      === currentUser._id  ||
        circle.creator      === currentUser.id
    );

    const isAdmin = circle?.userRole === 'admin' || isCreator;

    const canInvite = isAdmin || circle?.settings?.allowMemberInvites !== false;

    const memberIds = (circle?.members || [])
        .map(m => m.user?._id)
        .filter(Boolean);

    /* ── loading ──────────────────────────────────────────── */
    if (loading) return (
        <div className="min-h-screen bg-[#0F0529] flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-violet-500 animate-spin mb-4" />
            <p className="text-gray-400 font-medium">Loading circle…</p>
        </div>
    );

    /* ── error ────────────────────────────────────────────── */
    if (error || !circle) return (
        <div className="min-h-screen bg-[#0F0529] flex flex-col items-center justify-center text-white text-center px-6">
            <h1 className="text-2xl font-bold mb-3">Circle not found</h1>
            <p className="text-gray-400 mb-6 text-sm">{error}</p>
            <Link to="/circles" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                ← Back to Explore
            </Link>
        </div>
    );

    /* ── render ─────────────────────────────────────────────  */
    const coverSrc       = (circle.coverImage && circle.coverImage.length > 5) ? circle.coverImage : DEFAULT_COVER;
    const onlineCount = (circle.members || []).filter(m => m.user?.onlineStatus?.status === 'online').length;
    const onlineDisplay = formatCount(Math.max(onlineCount, 0));

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans flex flex-col">
            <FeedNavbar activePage="Circles" />

            {/* COVER IMAGE */}
            <div className="relative h-48 w-full overflow-hidden shrink-0">
                <img src={coverSrc} alt={circle.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-[#0F0529]" />
            </div>

            {/* HEADER ROW */}
            <div className="max-w-[1400px] w-full mx-auto px-6 -mt-14 relative z-10 mb-6">
                <div className="flex items-end justify-between gap-4 flex-wrap">

                    {/* Avatar + info */}
                    <div className="flex items-end gap-5">
                        <div className="w-24 h-24 rounded-full border-4 border-[#0F0529] overflow-hidden shadow-2xl shadow-violet-900/40 shrink-0">
                            <img src={circle.profilePic || coverSrc} alt={circle.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="pb-1">
                            <h1 className="text-2xl font-extrabold text-white leading-tight mb-1.5">
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
                                    {onlineDisplay} Online Now
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pb-1 flex-wrap">

                        <button
                            onClick={() => setReportOpen(true)}
                            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-gray-400 font-semibold transition-all mr-1"
                            title="Report Circle"
                        >
                            <Flag size={15} />
                        </button>

                        {/* Invite button — visible to all members if allowed */}
                        {canInvite && (
                            <button
                                onClick={() => setInviteOpen(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/10 hover:bg-violet-500/20 hover:border-violet-500/30 text-white text-sm font-semibold transition-all"
                            >
                                <UserPlus size={14} />
                                Invite
                            </button>
                        )}

                        {/* Creator → Manage | Member → Joined + Leave */}
                        {isCreator ? (
                            <Link
                                to={`/circles/${slug}/manage`}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold shadow-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all"
                            >
                                <Settings size={14} /> Manage
                            </Link>
                        ) : (
                            <>
                                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-semibold">
                                    <CheckCircle size={14} /> Joined
                                </span>
                                <button
                                    onClick={() => setLeaveOpen(true)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 text-sm font-semibold transition-all"
                                >
                                    <LogOut size={14} /> Leave
                                </button>
                            </>
                        )}

                    </div>
                </div>
            </div>

            {/* 3-COLUMN BODY */}
            <div className="max-w-[1400px] w-full mx-auto px-6 pb-10 flex gap-10 flex-1 items-start">

                {/* CENTER: stories + chat */}
                <div className="flex-1 min-w-0 flex flex-col gap-4">
                    <CircleStoriesBar
                        circleMemberIds={memberIds}
                        onPostSuccess={() => setRefreshKey(k => k + 1)}
                    />
                    <CircleChatArea
                        circle={circle}
                    />
                </div>

                {/* RIGHT: meetings + members */}
                <CircleMembersPanel circle={circle} slug={slug} />
            </div>

            {/* MODALS */}
            <CircleLeaveModal
                isOpen={leaveOpen}
                onClose={() => setLeaveOpen(false)}
                onConfirm={handleLeave}
                circleName={circle.name}
                loading={leaveLoading}
            />

            <CircleInviteModal
                isOpen={inviteOpen}
                onClose={() => setInviteOpen(false)}
                circle={circle}
                isAdmin={isAdmin}
            />

            <ReportModal
                isOpen={reportOpen}
                onClose={() => setReportOpen(false)}
                reportedItemId={circle?._id}
                reportedItemType="Circle"
            />
        </div>
    );
};

export default CircleDetailsPage;
