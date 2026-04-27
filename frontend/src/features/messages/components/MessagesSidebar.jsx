import React, { useState, useEffect } from 'react';
import { Search, Edit, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import NewChatModal from './NewChatModal';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const MessagesSidebar = ({ selectedChat, onSelectChat }) => {
    const navigate = useNavigate();

    // Safe user ID retrieval
    const currentUserId = (() => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr || userStr === 'undefined') return null;
            return JSON.parse(userStr)?._id;
        } catch (err) {
            console.error("Error parsing user from localStorage", err);
            return null;
        }
    })();

    const [conversations, setConversations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, messages, online
    const [filteredConversations, setFilteredConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showNewChatModal, setShowNewChatModal] = useState(false);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${BACKEND_URL}/api/dm/conversations`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setConversations(res.data.conversations || []);
                setFilteredConversations(res.data.conversations || []);
            } catch (err) {
                console.error('Error fetching conversations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    useEffect(() => {
        let filtered = [...conversations];

        // Apply Search
        if (searchTerm.trim()) {
            filtered = filtered.filter(chat => {
                const otherParticipant = chat.participants?.find(p => {
                    const pUser = p.user;
                    const pUserId = pUser?._id || pUser;
                    return pUserId && pUserId !== currentUserId;
                })?.user;
                const chatName = (otherParticipant?.displayName || otherParticipant?.username || '').toLowerCase();
                return chatName.includes(searchTerm.toLowerCase());
            });
        }

        // Apply Filters
        if (filterType === 'messages') {
            filtered = filtered.filter(chat => chat.lastMessage && chat.lastMessage.content?.text);
        } else if (filterType === 'online') {
            filtered = filtered.filter(chat => {
                const otherParticipant = chat.participants?.find(p => {
                    const pUser = p.user;
                    const pUserId = pUser?._id || pUser;
                    return pUserId && pUserId !== currentUserId;
                })?.user;
                return otherParticipant?.onlineStatus?.status === 'online';
            });
        }

        setFilteredConversations(filtered);
    }, [searchTerm, filterType, conversations]);


    useEffect(() => {
        if (conversations.length === 0) return;

        const token = localStorage.getItem('token');
        const socket = io(BACKEND_URL, {
            auth: { token }
        });

        socket.on('connect', () => {
            // Join all conversation rooms so the sidebar can receive updates for them
            conversations.forEach(chat => {
                socket.emit('join_conversation', chat._id);
            });
        });

        socket.on('newMessage', (newMessage) => {
            setConversations(prev => {
                const chatIndex = prev.findIndex(c => c._id === newMessage.conversationId);
                if (chatIndex === -1) return prev; // If it's a completely new unseen conversation, we'd ideally fetch it, but skipping for now

                const updatedChats = [...prev];
                const updatedChat = { ...updatedChats[chatIndex] };
                
                updatedChat.lastMessage = newMessage;
                updatedChat.lastActivity = newMessage.createdAt || Date.now();

                // Remove from current position and unshift to top
                updatedChats.splice(chatIndex, 1);
                updatedChats.unshift(updatedChat);

                return updatedChats;
            });
        });

        return () => {
            if (socket) {
                conversations.forEach(chat => socket.emit('leave_conversation', chat._id));
                socket.disconnect();
            }
        };
    }, [conversations.length]); // Re-bind only if the total count changes (naive but works for loaded chats)
    return (
        <div className="h-full flex flex-col bg-[#0F0529]">
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Messages
                </h2>
                <button 
                    onClick={() => setShowNewChatModal(true)}
                    className="p-2 bg-[#7C3AED] rounded-full hover:bg-[#6D28D9] transition shadow-lg shadow-purple-500/20 active:scale-95"
                >
                    <Edit size={18} className="text-white" />
                </button>
            </div>


            {/* Search */}
            <div className="px-6 pb-6 relative">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="relative">
                        <button 
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className={`p-2 rounded-xl transition-all ${filterType !== 'all' ? 'text-violet-400 bg-violet-400/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Filter size={18} />
                        </button>
                        
                        {showFilterMenu && (
                            <div className="absolute top-full left-0 mt-3 w-56 bg-[#1A1140]/95 border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-2 space-y-1">
                                    {[
                                        { id: 'all', label: 'All Conversations' },
                                        { id: 'messages', label: 'With Messages' },
                                        { id: 'online', label: 'Online Friends' }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => {
                                                setFilterType(opt.id);
                                                setShowFilterMenu(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === opt.id ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 bg-[#1E1B3A] rounded-xl px-4 py-3 flex items-center border border-white/5 focus-within:border-purple-500/50 transition-colors">
                        <Search className="text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search conversations..."
                            className="bg-transparent border-none outline-none text-white ml-3 w-full placeholder-gray-500 text-sm"
                        />
                    </div>
                </div>
            </div>



            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 no-scrollbar">
                {loading ? (
                    <div className="text-gray-400 text-center py-10 flex flex-col items-center">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-xs uppercase tracking-widest font-bold">Synchronizing...</p>
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className="text-gray-400 text-center py-10 px-6">
                        <p className="text-sm italic mb-2">No conversations found</p>
                        <p className="text-[10px] uppercase tracking-wider text-gray-600">Start a new chat using the edit button above</p>
                    </div>
                ) : (
                    filteredConversations.map((chat) => {
                        // Figure out the other participant
                        const otherParticipant = chat.participants?.find(p => {
                            const pUser = p.user;
                            const pUserId = pUser?._id || pUser;
                            return pUserId && pUserId !== currentUserId;
                        })?.user;
                        const chatName = otherParticipant?.displayName || otherParticipant?.username || 'Unknown User';
                        const avatar = otherParticipant?.profilePic || 'https://via.placeholder.com/150';
                        const online = otherParticipant?.onlineStatus?.status === 'online';
                        const id = chat._id;
                        const lastMessage = chat.lastMessage?.content?.text || 'No messages yet';
                        const lastActivity = chat.lastActivity || chat.updatedAt;
                        
                        // Format time (Today or Date)
                        const dateObj = new Date(lastActivity);
                        const isToday = dateObj.toDateString() === new Date().toDateString();
                        const timeStr = isToday 
                            ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

                        return (
                            <div
                                key={id}
                                onClick={() => onSelectChat(id)}
                                className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 flex items-start space-x-4 ${selectedChat === id
                                        ? 'bg-violet-600/10 border border-violet-500/30'
                                        : 'hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    <div 
                                        className="relative group"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (otherParticipant?.username) navigate(`/profile/${otherParticipant.username}`);
                                        }}
                                    >
                                        <img
                                            src={avatar}
                                            alt={chatName}
                                            className="w-12 h-12 rounded-full object-cover border border-white/10 group-hover:border-violet-500/50 transition-all active:scale-90"
                                        />
                                        {online && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0F0529]"></div>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (otherParticipant?.username) navigate(`/profile/${otherParticipant.username}`);
                                            }}
                                            className={`font-bold truncate text-sm tracking-tight hover:text-violet-400 transition-colors ${selectedChat === id ? 'text-white' : 'text-gray-300'}`}
                                        >
                                            {chatName}
                                        </h3>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <span className={`text-[10px] font-bold uppercase tracking-tighter ${selectedChat === id ? 'text-violet-300' : 'text-gray-600'}`}>
                                                {timeStr}
                                            </span>
                                            {chat.unreadCount > 0 && (
                                                <div className="bg-violet-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/30 animate-in zoom-in-50 duration-300">
                                                    {chat.unreadCount}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pr-1">
                                        <p className={`text-xs truncate max-w-[180px] ${selectedChat === id ? 'text-violet-200/60' : 'text-gray-500'}`}>
                                            {lastMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>


                        );
                    })
                )}
            </div>

            {/* New Chat Modal */}
            {showNewChatModal && (
                <NewChatModal 
                    onClose={() => setShowNewChatModal(false)} 
                    onStartChat={async (chatId) => {
                        // After starting a chat, we need to ensure it's in our list
                        // We could refetch, but let's try to find it first or add it
                        try {
                            const token = localStorage.getItem('token');
                            const res = await axios.get(`${BACKEND_URL}/api/dm/conversations/${chatId}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            if (res.data.conversation) {
                                setConversations(prev => {
                                    const exists = prev.find(c => c._id === chatId);
                                    if (exists) return prev;
                                    return [res.data.conversation, ...prev];
                                });
                            }
                        } catch (err) {
                            console.error("Failed to fetch new conversation details", err);
                        }
                        
                        onSelectChat(chatId);
                        setShowNewChatModal(false);
                    }}
                />
            )}

        </div>
    );
};

export default MessagesSidebar;
