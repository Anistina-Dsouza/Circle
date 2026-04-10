import React from 'react';
import { MoreHorizontal, Users, User, Video } from 'lucide-react';

const UpcomingMeetingCard = ({ meeting }) => {
    return (
        <div className="bg-[#1A0833] rounded-2xl p-6 border border-white/5 flex flex-col relative group hover:border-purple-500/30 transition-colors">
            {/* Top row: Status Badge & Menu */}
            <div className="flex justify-between items-start mb-6">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${meeting.statusColor}`}>
                    {meeting.status}
                </span>
                <button className="text-gray-500 hover:text-white transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Title & Details */}
            <h3 className="text-xl font-bold text-white mb-3">{meeting.title}</h3>
            <div className="space-y-2 mb-8">
                <div className="flex items-center text-sm text-gray-400">
                    <Users size={16} className="mr-2" />
                    <span>{meeting.circle}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                    <User size={16} className="mr-2" />
                    <span>Host: {meeting.host}</span>
                </div>
            </div>

            <div className="mt-auto">
                {/* Date/Time & Avatars row */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">{meeting.dateLabel}</p>
                        <p className="text-lg font-bold text-white tracking-tight">{meeting.time}</p>
                    </div>
                    <div className="flex items-center">
                        <div className="flex -space-x-2">
                            {meeting.attendees.map((avatar, idx) => (
                                <img
                                    key={idx}
                                    src={avatar}
                                    alt="Attendee"
                                    className="w-8 h-8 rounded-full border-2 border-[#1A0833] object-cover"
                                />
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-[#1A0833] bg-[#2D114A] flex items-center justify-center text-xs font-medium text-purple-200">
                                +{meeting.plusCount}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Join Button */}
                <button className={`w-full flex items-center justify-center gap-2 ${meeting.btnColor} text-white py-3 rounded-lg font-semibold transition-colors`}>
                    <Video size={18} />
                    <span>Join via Zoom</span>
                </button>
            </div>
        </div>
    );
};

export default UpcomingMeetingCard;
