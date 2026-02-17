import React from 'react';
import { Calendar, Video as VideoIcon } from 'lucide-react';
import MeetingCard from './MeetingCard';

const RightSidebar = ({ circles, meetings }) => {
    return (
        <aside className="hidden xl:flex w-80 flex-col border-l border-white/5 bg-[#050214] p-8 shrink-0 overflow-y-auto no-scrollbar h-full">
            <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">My Circles</h2>
                    <button className="text-[10px] text-purple-400 hover:text-purple-300 font-bold">See All</button>
                </div>
                <div className="flex gap-4">
                    {circles.map(circle => (
                        <div key={circle.id} className="relative">
                            <div ripple="true" className={`w-12 h-12 ${circle.color} rounded-2xl flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}>
                                {circle.icon}
                            </div>
                            {circle.count > 0 && (
                                <div className="absolute -top-2 -right-2 bg-purple-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#050214]">
                                    {circle.count}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Upcoming Meetings</h2>
                    <Calendar size={16} className="text-gray-400" />
                </div>
                <div className="space-y-4">
                    {meetings.map(meeting => (
                        <MeetingCard key={meeting.id} meeting={meeting} />
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;
