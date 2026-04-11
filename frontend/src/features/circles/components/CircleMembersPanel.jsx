import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Calendar, ChevronRight, MessageCircle } from 'lucide-react';

const DEFAULT_AVATAR = 'https://i.pinimg.com/736x/24/de/64/24de6482109345ed57693bcd21b42927.jpg';

const getMemberName  = (u = {}) => u.displayName || u.username || 'Member';
const getMemberPic   = (u = {}) => u.profilePic || DEFAULT_AVATAR;
const getMemberOnline = (u = {}) => u.onlineStatus?.status === 'online';

/* ───────── individual member row ───────── */
const MemberRow = ({ m }) => {
    const navigate = useNavigate();
    const u      = m.user || {};
    const name   = getMemberName(u);
    const pic    = getMemberPic(u);
    const online = getMemberOnline(u);
    const uname  = u.username;

    const dotColor =
        m.role === 'admin'     ? 'bg-yellow-400' :
        m.role === 'moderator' ? 'bg-blue-400'   :
        online                 ? 'bg-green-400'  : 'bg-gray-600';

    return (
        <div className="flex items-center gap-3 group">
            {/* Avatar → profile */}
            <Link to={`/profile/${uname}`} className="relative shrink-0">
                <img
                    src={pic}
                    alt={name}
                    className="w-9 h-9 rounded-full object-cover group-hover:ring-2 group-hover:ring-violet-500/50 transition-all"
                />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#12082A] ${dotColor}`} />
            </Link>

            {/* Name + role → profile */}
            <Link to={`/profile/${uname}`} className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors truncate">
                    {name}
                </p>
                <p className="text-[11px] text-gray-600 capitalize">{m.role}</p>
            </Link>

            {/* DM button → messages */}
            <button
                onClick={() => navigate(`/messages?user=${uname}`)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-all"
                title={`Message ${name}`}
            >
                <MessageCircle size={13} />
            </button>
        </div>
    );
};

/* ───────── upcoming meeting card ───────── */
const MeetingCard = ({ time, title, desc, accent, members, showRsvp }) => (
    <div className="p-4 bg-white/3 rounded-2xl border border-white/5">
        <p className={`text-[11px] font-bold mb-1 ${accent}`}>{time}</p>
        <p className="text-white font-semibold text-sm mb-1">{title}</p>
        {desc && <p className="text-gray-500 text-[11px] leading-relaxed mb-3">{desc}</p>}
        {members?.length > 0 && (
            <div className="flex items-center gap-1 mb-3">
                {members.slice(0, 3).map((m, i) => (
                    <img
                        key={i}
                        src={getMemberPic(m.user || {})}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover border border-[#12082A] -ml-1 first:ml-0"
                    />
                ))}
            </div>
        )}
        <button className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            showRsvp
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500'
                : 'border border-violet-500/30 text-violet-400 hover:bg-violet-500/10'
        }`}>
            <Calendar size={11} />
            RSVP Now
        </button>
    </div>
);

/* ───────── main panel ───────── */
const CircleMembersPanel = ({ circle, slug }) => {
    const membersList = (circle?.members || []).slice(0, 5);
    const totalCount  = circle?.stats?.memberCount || 0;

    return (
        <aside className="w-64 shrink-0 flex flex-col gap-4 sticky top-24 self-start">

            {/* Upcoming Meetings */}
            <div className="rounded-3xl border border-[#2A1550] overflow-hidden bg-[#12082A]">
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Upcoming Meetings
                    </h3>
                    <span className="text-[9px] font-bold text-white bg-violet-600 px-2.5 py-1 rounded-full tracking-wider">
                        TODAY
                    </span>
                </div>
                <div className="px-4 pb-4 space-y-3">
                    <MeetingCard
                        time="4:00 PM"
                        title="Weekly Design Sync"
                        desc="Discussing the Q3 roadmap and component audit."
                        accent="text-violet-400"
                        members={circle?.members}
                        showRsvp
                    />
                    <MeetingCard
                        time="6:30 PM"
                        title="Portfolio Critiques"
                        accent="text-fuchsia-400"
                        showRsvp={false}
                    />
                </div>
            </div>

            {/* Active Members */}
            <div className="rounded-3xl border border-[#2A1550] overflow-hidden bg-[#12082A]">
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <h3 className="text-[10px] font-bold text-gray-400">
                        Active Members
                    </h3>
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
                    {membersList.map((m) => (
                        <MemberRow key={m._id || m.user?._id} m={m} />
                    ))}
                    {totalCount > 5 && (
                        <Link
                            to={`/circles/${slug}/members`}
                            className="block text-center text-[11px] text-gray-600 hover:text-violet-400 transition-colors pt-1"
                        >
                            + {totalCount - 5} more members →
                        </Link>
                    )}
                </div>
            </div>

        </aside>
    );
};

export default CircleMembersPanel;
