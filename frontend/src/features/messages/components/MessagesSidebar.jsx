import React from 'react';
import { Search, Edit, Filter } from 'lucide-react';

const conversations = [
    {
        id: 1,
        user: 'Sasha Moon',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
        lastMessage: 'Are we still meeting at the Neon Bar later?',
        time: '2m ago',
        unread: 0,
        online: true
    },
    {
        id: 2,
        user: 'Felix Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
        lastMessage: 'Shared a new concept design...',
        time: '1h ago',
        unread: 2,
        online: false
    },
    {
        id: 3,
        user: 'Elena Vance',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
        lastMessage: 'Thanks for the feedback!',
        time: '4h ago',
        unread: 0,
        online: true
    },
    {
        id: 4,
        user: 'Marcus Thorne',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
        lastMessage: 'See you then!',
        time: 'Yesterday',
        unread: 0,
        online: false
    },
    {
        id: 5,
        user: 'Design Sprint Team',
        avatar: '', // Group chat placeholder
        isGroup: true,
        lastMessage: 'Leo: Check out the latest frames.',
        time: '2d ago',
        unread: 0,
        online: false
    }
];

const MessagesSidebar = ({ selectedChat, onSelectChat }) => {
    return (
        <div className="h-full flex flex-col bg-[#0F0529]">
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Messages
                </h2>
                <button className="p-2 bg-[#7C3AED] rounded-full hover:bg-[#6D28D9] transition shadow-lg shadow-purple-500/20">
                    <Edit size={18} className="text-white" />
                </button>
            </div>

            {/* Search */}
            <div className="px-6 pb-6">
                <div className="flex items-center space-x-3 mb-2">
                    <button className="text-gray-400 hover:text-white">
                        <Filter size={18} />
                    </button>
                    <div className="flex-1 bg-[#1E1B3A] rounded-xl px-4 py-3 flex items-center border border-white/5 focus-within:border-purple-500/50 transition-colors">
                        <Search className="text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="bg-transparent border-none outline-none text-white ml-3 w-full placeholder-gray-500 text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent">
                {conversations.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 flex items-start space-x-4 ${selectedChat === chat.id
                                ? 'bg-[#2D2A4A]/60 border border-purple-500/30'
                                : 'hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        {/* Avatar */}
                        <div className="relative">
                            {chat.isGroup ? (
                                <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center border border-white/10">
                                    <div className="grid grid-cols-2 gap-0.5 p-1">
                                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                                    </div>
                                </div>
                            ) : (
                                <img
                                    src={chat.avatar}
                                    alt={chat.user}
                                    className="w-12 h-12 rounded-full object-cover border border-white/10"
                                />
                            )}
                            {chat.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0F0529]"></div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                                <h3 className={`font-semibold truncate text-sm ${selectedChat === chat.id ? 'text-white' : 'text-gray-200'}`}>
                                    {chat.user}
                                </h3>
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{chat.time}</span>
                            </div>
                            <p className={`text-sm truncate ${chat.unread > 0 ? 'text-white font-medium' : 'text-gray-400'
                                }`}>
                                {chat.lastMessage}
                            </p>
                        </div>

                        {/* Unread Badge */}
                        {chat.unread > 0 && (
                            <div className="self-center ml-2">
                                <span className="bg-[#7C3AED] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                                    {chat.unread}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessagesSidebar;
