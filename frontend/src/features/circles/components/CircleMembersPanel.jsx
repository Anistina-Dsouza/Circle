import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, Calendar, ChevronRight, MessageCircle, AlertCircle } from 'lucide-react';

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
            <Link to={`/profile/${uname}`} className="relative shrink-0">
                <img
                    src={pic}
                    alt={name}
                    className="w-9 h-9 rounded-full object-cover group-hover:ring-2 group-hover:ring-violet-500/50 transition-all text-xs"
                />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#12082A] ${dotColor}`} />
            </Link>

            <Link to={`/profile/${uname}`} className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors truncate">
                    {name}
                </p>
                <p className="text-[11px] text-gray-600 capitalize font-medium">{m.role}</p>
            </Link>

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
const MeetingCard = ({ meeting }) => {
    const navigate = useNavigate();
    const startTime = new Date(meeting.startTime);
    const timeString = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
        <div className="p-4 bg-white/3 rounded-2xl border border-white/5 hover:border-violet-500/20 transition-all group">
            <p className="text-[11px] font-bold mb-1 text-violet-400">{timeString}</p>
            <p className="text-white font-semibold text-sm mb-1 group-hover:text-violet-300 transition-colors truncate">{meeting.title}</p>
            {meeting.description && (
                <p className="text-gray-500 text-[11px] leading-relaxed mb-3 line-clamp-2">{meeting.description}</p>
            )}
            
            <button 
                onClick={() => {
                    if (meeting.meetingLink) {
                        window.open(meeting.meetingLink, '_blank');
                    } else {
                        navigate('/meetings/upcoming');
                    }
                }}
                className="w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-900/20"
            >
                <Calendar size={11} />
                {meeting.meetingLink ? 'Join Now' : 'RSVP Now'}
            </button>
        </div>
    );
};

/* ───────── main panel ───────── */
const CircleMembersPanel = ({ circle, slug }) => {
    const [meetings, setMeetings] = useState([]);
    const [loadingMeetings, setLoadingMeetings] = useState(true);
    const membersList = (circle?.members || []).slice(0, 5);
    const totalCount  = circle?.stats?.memberCount || 0;
    const baseUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchMeetings = async () => {
            if (!circle?._id) return;
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${baseUrl}/api/meetings/circle/${circle._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setMeetings(res.data.data || []);
                }
            } catch (err) {
                console.error('Failed to fetch circle meetings:', err);
            } finally {
                setLoadingMeetings(false);
            }
        };
        fetchMeetings();
    }, [circle?._id, baseUrl]);

    return (
        <aside className="w-72 shrink-0 flex flex-col gap-4 sticky top-24 self-start">

            {/* Upcoming Meetings */}
            <div className="rounded-3xl border border-[#2A1550] overflow-hidden bg-[#12082A] min-h-[140px] flex flex-col">
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Upcoming Meetings
                    </h3>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-gray-400">UPCOMING</span>
                    </div>
                </div>
                
                <div className="px-4 pb-4 space-y-3 flex-1 overflow-y-auto max-h-[350px] custom-scrollbar">
                    {loadingMeetings ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-2" />
                            <p className="text-[10px] text-gray-600">Gathering sessions...</p>
                        </div>
                    ) : meetings.length > 0 ? (
                        meetings.map(m => (
                            <MeetingCard key={m._id} meeting={m} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-10 h-10 bg-white/2 rounded-full flex items-center justify-center mb-3 text-gray-700">
                                <Calendar size={18} strokeWidth={1} />
                            </div>
                            <p className="text-[11px] text-gray-500 font-medium">No meetings scheduled</p>
                            <p className="text-[9px] text-gray-700 max-w-[120px] mt-1 italic">The host hasn't posted any future sessions yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Members */}
            <div className="rounded-3xl border border-[#2A1550] overflow-hidden bg-[#12082A]">
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Active Citizens
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
