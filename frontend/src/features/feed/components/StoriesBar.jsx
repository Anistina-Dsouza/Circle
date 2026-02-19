import React from 'react';
import { Plus } from 'lucide-react';

const users = [
    { id: 1, name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80', active: true },
    { id: 2, name: 'Jordan', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80', active: false },
    { id: 3, name: 'Mila', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80', active: true },
];

const StoryCircle = ({ name, avatar, isAdd = false }) => (
    <div className="flex flex-col items-center space-y-2 cursor-pointer group">
        <div className={`
      w-16 h-16 rounded-full p-[3px] 
      ${isAdd ? 'border-2 border-dashed border-gray-500 hover:border-white' : 'bg-gradient-to-tr from-yellow-400 to-purple-600 group-hover:from-yellow-300 group-hover:to-pink-500'}
      transition-all duration-300 transform group-hover:scale-110 shadow-lg shadow-purple-500/20
    `}>
            <div className="w-full h-full bg-[#0F0529] rounded-full p-[2px] overflow-hidden flex items-center justify-center">
                {isAdd ? (
                    <Plus size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                ) : (
                    <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
                )}
            </div>
        </div>
        <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">{name}</span>
    </div>
);

const StoriesBar = () => {
    return (
        <div className="flex items-center space-x-6 overflow-x-auto py-4 scrollbar-hide mb-8">
            <StoryCircle name="Add Story" isAdd />
            {users.map(user => (
                <StoryCircle key={user.id} {...user} />
            ))}
        </div>
    );
};

export default StoriesBar;
