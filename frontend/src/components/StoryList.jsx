import React from 'react';
import { Plus } from 'lucide-react';

const StoryList = ({ stories }) => {
    return (
        <div className="px-6 md:px-10 flex gap-4 md:gap-8 mb-8 md:mb-10 overflow-x-auto no-scrollbar">
            <div className="flex flex-col items-center gap-2 md:gap-3 shrink-0">
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border-2 border-dashed border-[#8b31ff]/40 flex items-center justify-center cursor-pointer hover:border-[#8b31ff] transition-all group">
                    <Plus size={24} className="text-[#8b31ff] group-hover:scale-110 transition-transform md:w-7 md:h-7" />
                </div>
                <span className="text-[11px] md:text-[13px] font-medium text-gray-400">Add Story</span>
            </div>
            {stories.map(story => (
                <div key={story.id} className="flex flex-col items-center gap-2 md:gap-3 shrink-0 cursor-pointer group">
                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-full p-[2px] md:p-[3px] border-2 border-[#8b31ff] transition-transform group-hover:scale-105">
                        <img src={story.avatar} alt={story.name} className="w-full h-full rounded-full object-cover border-2 border-[#050214]" />
                    </div>
                    <span className="text-[11px] md:text-[13px] font-medium text-gray-400 group-hover:text-white transition-colors">{story.name}</span>
                </div>
            ))}
        </div>
    );
};

export default StoryList;
