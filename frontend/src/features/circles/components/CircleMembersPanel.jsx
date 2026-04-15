import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Calendar, ChevronRight, MessageCircle } from 'lucide-react';
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
const MeetingCard = ({ meeting, currentUserId, onMeetingUpdated }) => {
    const time = new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const members = meeting.participants || [];
    const acceptedMembers = members.filter(m => m.status === 'accepted' || m.status === 'attended');
    
    // Find initial status for current user
    const userParticipant = members.find(m => {
        const pId = m.user?._id || m.user;
        return pId?.toString() === currentUserId?.toString();
    });
    const initialStatus = userParticipant ? userParticipant.status : 'invited';

    const handleStatusChange = (updatedMeeting) => {
        if (onMeetingUpdated) {
            onMeetingUpdated(updatedMeeting);
        }
    };

    return (
        <div className="p-4 bg-white/3 rounded-2xl border border-white/5">
            <p className="text-[11px] font-bold mb-1 text-violet-400">{time}</p>
            <p className="text-white font-semibold text-sm mb-1">{meeting.title}</p>
            {meeting.description && <p className="text-gray-500 text-[11px] leading-relaxed mb-4">{meeting.description}</p>}
            
            {/* Social Context / Avatars */}
            {acceptedMembers.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center -space-x-2">
                        {acceptedMembers.slice(0, 3).map((m, i) => (
                            <img
                                key={m._id || i}
                                src={getMemberPic(m.user)}
                                alt=""
                                className="w-6 h-6 rounded-full object-cover border-2 border-[#12082A] relative z-10"
                            />
                        ))}
                    </div>
                    <p className="text-[10px] text-gray-400">
                        <span className="font-semibold text-gray-300">{getMemberName(acceptedMembers[0].user)}</span>
                        {acceptedMembers.length > 1 && ` and ${acceptedMembers.length - 1} other${acceptedMembers.length - 1 > 1 ? 's' : ''}`} going
                    </p>
                </div>
            )}
            
            <RSVPButton 
                meetingId={meeting._id} 
                initialStatus={initialStatus} 
                onStatusChange={handleStatusChange} 
            />
        </div>
    );
};

/* ───────── main panel ───────── */
const CircleMembersPanel = ({ circle, slug }) => {
    const membersList = (circle?.members || []).slice(0, 5);
    const totalCount  = circle?.stats?.memberCount || 0;

    const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = loggedInUser?._id;

    const [upcomingMeetings, setUpcomingMeetings] = useState([]);
    const [loadingMeetings, setLoadingMeetings] = useState(true);

    useEffect(() => {
        if (circle?._id) {
            const fetchMeetings = async () => {
                try {
                    setLoadingMeetings(true);
                    const res = await meetingService.getUpcomingMeetings(circle._id);
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
                    {loadingMeetings ? (
                        <p className="text-xs text-center text-gray-500 py-4">Loading meetings...</p>
                    ) : upcomingMeetings.length > 0 ? (
                        upcomingMeetings.map((meeting) => (
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
                        <p className="text-xs text-center text-gray-500 py-4">No upcoming meetings</p>
                    )}
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
