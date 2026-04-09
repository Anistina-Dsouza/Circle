import React, { useState, useEffect } from 'react';
import { Search, Edit, Filter } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const MessagesSidebar = ({ selectedChat, onSelectChat }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${BACKEND_URL}/api/dm/conversations`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setConversations(res.data.conversations || []);
            } catch (err) {
                console.error('Error fetching conversations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);
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
                {loading ? (
                    <div className="text-gray-400 text-center py-4">Loading...</div>
                ) : conversations.length === 0 ? (
                    <div className="text-gray-400 text-center py-4">No conversations yet.</div>
                ) : (
                    conversations.map((chat) => {
                        // Figure out the other participant
                        const currentUserId = JSON.parse(localStorage.getItem('user'))?._id;
                        const otherParticipant = chat.participants?.find(p => p.user && p.user._id !== currentUserId)?.user;
                        const chatName = otherParticipant?.displayName || otherParticipant?.username || 'Unknown User';
                        const avatar = otherParticipant?.profilePic || 'https://via.placeholder.com/150';
                        const online = otherParticipant?.onlineStatus === 'online';
                        const id = chat._id;
                        const lastMessage = chat.lastMessage?.content?.text || 'No messages yet';
                        const time = chat.lastActivity ? new Date(chat.lastActivity).toLocaleDateString() : '';

                        return (
                            <div
                                key={id}
                                onClick={() => onSelectChat(id)}
                                className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 flex items-start space-x-4 ${selectedChat === id
                                        ? 'bg-[#2D2A4A]/60 border border-purple-500/30'
                                        : 'hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                {/* Avatar */}
                                <div className="relative">
                                    <img
                                        src={avatar}
                                        alt={chatName}
                                        className="w-12 h-12 rounded-full object-cover border border-white/10"
                                    />
                                    {online && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0F0529]"></div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h3 className={`font-semibold truncate text-sm ${selectedChat === id ? 'text-white' : 'text-gray-200'}`}>
                                            {chatName}
                                        </h3>
                                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{time}</span>
                                    </div>
                                    <p className={`text-sm truncate text-gray-400`}>
                                        {lastMessage}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MessagesSidebar;
