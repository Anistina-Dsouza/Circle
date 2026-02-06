import React, { useState } from 'react';
import { Video as VideoIcon } from 'lucide-react';

const MeetingCard = ({ meeting }) => {
    const [isJoined, setIsJoined] = useState(meeting.status === 'NOW');
    const [action, setAction] = useState(meeting.action);

    const handleAction = () => {
        if (action === 'Join') {
            // Logic for joining
            alert('Joining meeting...');
        } else if (action === 'RSVP') {
            setAction('Going');
        } else if (action === 'Going') {
            setAction('RSVP');
        }
    };

    return (
        <div className="bg-[#130c2d] p-5 rounded-[2rem] border border-white/5">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-semibold text-white">{meeting.title}</h3>
                {meeting.status && (
                    <span className="text-[9px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full uppercase">
                        {meeting.status}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 mb-4">
                <VideoIcon size={12} />
                <span className="text-[11px]">{meeting.time}</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                    {meeting.attendees.map((att, i) => (
                        <img key={i} src={att} alt="" className="w-6 h-6 rounded-full border-2 border-[#130c2d]" />
                    ))}
                    {meeting.extraAttendees > 0 && (
                        <div className="w-6 h-6 rounded-full bg-[#1e1445] border-2 border-[#130c2d] flex items-center justify-center text-[8px] font-bold text-white">
                            +{meeting.extraAttendees}
                        </div>
                    )}
                </div>
                <button
                    onClick={handleAction}
                    className={`px-5 py-1.5 rounded-xl text-xs font-bold transition-all ${action === 'Join' || action === 'Going'
                        ? 'bg-[#8b31ff] hover:bg-[#7c28eb] text-white'
                        : 'border border-white/10 hover:bg-white/5 text-gray-300'
                        }`}>
                    {action}
                </button>
            </div>
        </div>
    );
};

export default MeetingCard;
