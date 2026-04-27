import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, Calendar, ChevronRight, MessageCircle, AlertCircle, Video } from 'lucide-react';
import meetingService from '../../meetings/services/meetingService';
import RSVPButton from '../../meetings/components/RSVPButton';

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
const MeetingCard = ({ meeting, currentUserId, onMeetingUpdated }) => {
    const startDate = new Date(meeting.startTime);
    const time = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateDisplay = startDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const isToday = new Date().toDateString() === startDate.toDateString();

    const members = meeting.participants || [];
    const acceptedMembers = members.filter(m => m.status === 'accepted' || m.status === 'attended');
    
    const userParticipant = members.find(m => {
        const pId = m.user?._id || m.user?.id || m.user;
        return pId?.toString() === currentUserId?.toString();
    });
    const initialStatus = userParticipant ? userParticipant.status : 'invited';

    const isFinished = meeting.endTime ? new Date() > new Date(meeting.endTime) : false;
    const isActuallyLive = meeting.status === 'live' && !isFinished;

    return (
        <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-white/10 transition-all group/card">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-400 text-[9px] font-black uppercase tracking-wider">
                        {isToday ? 'Today' : dateDisplay}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">{time}</span>
                </div>
                {isActuallyLive && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                        <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">Live</span>
                    </div>
                )}
            </div>

            <h4 
                onClick={() => window.open(meeting.meetingLink, '_blank')}
                className="text-white font-bold text-sm mb-1 group-hover/card:text-violet-400 transition-colors cursor-pointer hover:underline decoration-violet-500/50"
            >
                {meeting.title}
            </h4>
            {meeting.description && (
                <p className="text-gray-500 text-[10px] leading-relaxed mb-3 line-clamp-2">
                    {meeting.description}
                </p>
            )}
            
            {/* Social Context / Avatars */}
            {acceptedMembers.length > 0 && (
                <div className="flex items-center gap-2 mb-4 bg-white/[0.02] p-1.5 rounded-xl border border-white/5">
                    <div className="flex items-center -space-x-1.5">
                        {acceptedMembers.slice(0, 3).map((m, i) => (
                            <img
                                key={m._id || i}
                                src={getMemberPic(m.user)}
                                alt=""
                                className="w-5 h-5 rounded-full object-cover border-2 border-[#12082A] relative z-10"
                            />
                        ))}
                    </div>
                    <p className="text-[9px] text-gray-500 truncate">
                        <span className="font-bold text-gray-300">{getMemberName(acceptedMembers[0].user)}</span>
                        {acceptedMembers.length > 1 && ` +${acceptedMembers.length - 1} more`}
                    </p>
                </div>
            )}
            
            {isActuallyLive ? (
                <button 
                    onClick={() => window.open(meeting.meetingLink, '_blank')}
                    className="w-full py-2.5 rounded-xl text-[10px] font-black flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-violet-900/20 active:scale-95"
                >
                    <Video size={12} fill="currentColor" />
                    JOIN LIVE SESSION
                </button>
            ) : (
                <RSVPButton 
                    meetingId={meeting._id} 
                    initialStatus={initialStatus} 
                    onStatusChange={onMeetingUpdated} 
                />
            )}
        </div>
    );
};

/* ───────── main panel ───────── */
const CircleMembersPanel = ({ circle, slug }) => {
    const membersList = (circle?.members || []).slice(0, 5);
    const totalCount  = circle?.stats?.memberCount || 0;
    const baseUrl = import.meta.env.VITE_API_URL;

    const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = loggedInUser?._id;

    const [upcomingMeetings, setUpcomingMeetings] = useState([]);
    const [loadingMeetings, setLoadingMeetings] = useState(true);

    useEffect(() => {
        if (circle?._id) {
            const fetchMeetings = async () => {
                try {
                    console.log('Fetching meetings for circle:', circle._id);
                    setLoadingMeetings(true);
                    const res = await meetingService.getCircleMeetings(circle._id);
                    if (res?.success) {
                        setUpcomingMeetings(res.data || []);
                    }
                } catch (error) {
                    console.error('Failed to fetch upcoming meetings for circle:', error);
                } finally {
                    setLoadingMeetings(false);
                }
            };
            fetchMeetings();
        }
    }, [circle?._id]);

    const now = new Date();
    const validMeetings = upcomingMeetings.filter(m => !m.endTime || new Date(m.endTime) > now);

    return (
        <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4 lg:sticky lg:top-24 self-start">

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
                    ) : validMeetings.length > 0 ? (
                        validMeetings.map((meeting) => (
                            <MeetingCard
                                key={meeting._id}
                                meeting={meeting}
                                currentUserId={currentUserId}
                                onMeetingUpdated={(updatedMeeting) => {
                                    setUpcomingMeetings(prev => prev.map(m => m._id === updatedMeeting._id ? updatedMeeting : m));
                                }}
                            />
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
