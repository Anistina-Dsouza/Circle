import React from 'react';
import { CheckCircle2, Download } from 'lucide-react';

const PastMeetingRow = ({ meeting }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-white/[0.02] transition-colors gap-4">
            {/* Left: Icon & Info */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1e0a36] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                    <h4 className="text-base font-bold text-white mb-0.5">{meeting.title}</h4>
                    <p className="text-xs text-gray-500">{meeting.description}</p>
                </div>
            </div>

            {/* Right: Date & Download icon */}
            <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-48">
                <div className="text-right flex-1 sm:flex-none">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">DATE</p>
                    <p className="text-sm font-semibold text-gray-300">{meeting.date}</p>
                </div>
                <button className="text-gray-500 hover:text-white transition-colors flex-shrink-0">
                    <Download size={20} />
                </button>
            </div>
        </div>
    );
};

export default PastMeetingRow;
