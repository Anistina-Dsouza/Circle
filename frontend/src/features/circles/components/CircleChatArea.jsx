import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Send, Smile, Plus, Heart, Reply, X } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';

/* ── date separator ── */
const DateDivider = ({ date }) => (
    <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span className="text-[10px] font-bold text-gray-500 tracking-wide px-4 py-1 rounded-full bg-white/5 border border-white/5">
            {date}
        </span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/10 to-transparent" />
    </div>
);

/* ── single message bubble ──────────────────────────── */
const ChatMessage = ({ msg, onToggleReaction, onReply }) => {
    const isMe = msg.isMe;
    const likedByMe = msg.likedByMe;

    return (
        <div className={`flex gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-300 ${isMe ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            {!isMe && (
                <Link to={`/profile/${msg.username}`} className="shrink-0 pt-1 active:scale-95 transition-transform">
                    <img
                        src={msg.avatar}
                        alt={msg.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white/5 hover:ring-violet-500/50 transition-all"
                    />
                </Link>
            )}

            <div className={`flex flex-col max-w-[85%] ${isMe ? 'items-end' : 'items-start'}`}>
                {/* Name and time */}
                <div className={`flex items-baseline gap-2 mb-1.5 px-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <Link to={`/profile/${msg.username}`} className={`text-[11px] font-bold tracking-wide hover:text-white transition-colors ${isMe ? 'text-violet-300' : 'text-gray-400'}`}>
                        {isMe ? 'You' : msg.name}
                    </Link>
                    <span className="text-[10px] text-gray-600 font-medium">{msg.time}</span>
                </div>

                {/* Bubble Container */}
                <div className={`relative px-4 py-2.5 rounded-2xl border transition-all duration-300 group shadow-sm ${
                    isMe
                        ? 'bg-violet-600/30 border-violet-500/40 rounded-tr-none shadow-violet-900/10'
                        : 'bg-[#1a1138]/60 border-white/5 backdrop-blur-md rounded-tl-none shadow-black/20'
                }`}>
                    
                    {/* Reply To Preview (Nested in bubble) */}
                    {msg.replyTo && (
                        <div className={`mb-2 p-2 rounded-lg text-xs border-l-4 overflow-hidden ${isMe ? 'bg-violet-900/40 border-violet-400' : 'bg-black/20 border-gray-500'}`}>
                            <p className="font-bold text-[10px] mb-0.5 text-violet-300">{msg.replyTo.name}</p>
                            <p className="line-clamp-1 opacity-60 text-gray-300">{msg.replyTo.text}</p>
                        </div>
                    )}

                    <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap selection:bg-violet-500/40">
                        {msg.text}
                    </p>

                    {/* Hover Actions Bar */}
                    <div className={`absolute -bottom-3 ${isMe ? 'right-2' : 'left-2'} opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-0.5 p-0.5 bg-[#12082A] border border-white/10 rounded-full shadow-2xl backdrop-blur-xl z-20 pointer-events-none group-hover:pointer-events-auto scale-90 origin-top`}>
                        <button 
                            onClick={() => onReply(msg)}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all" 
                            title="Reply"
                        >
                            <Reply size={12} />
                        </button>
                        <button 
                            onClick={() => onToggleReaction(msg.id)}
                            className={`p-1.5 rounded-full transition-all ${likedByMe ? 'text-red-500 bg-red-500/10' : 'text-gray-400 hover:text-red-400 hover:bg-white/10'}`} 
                            title={likedByMe ? "Unlike" : "Like"}
                        >
                            <Heart size={12} fill={likedByMe ? "currentColor" : "none"} />
                        </button>
                    </div>
                </div>

                {/* Visible Reactions */}
                {msg.reactions?.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {msg.reactions.map((r, i) => (
                            <button
                                key={i}
                                onClick={() => onToggleReaction(msg.id, r.icon)}
                                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] transition-all ${
                                    likedByMe && r.icon === '❤️'
                                    ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-violet-500/20'
                                }`}
                            >
                                <span>{r.icon}</span>
                                <span className="font-bold">{r.count}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ── main component ──────────────────────────────────── */
const CircleChatArea = ({ circle }) => {
    const circleId = circle?._id;
    const circleName = circle?.name;
    const members = circle?.members || [];
    const memberCount = circle?.stats?.memberCount || members.length;
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const endRef = useRef(null);
    const socketRef = useRef(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = currentUser._id || currentUser.id;

    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch messages
    useEffect(() => {
        if (!circleId) return;
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${backendUrl}/api/circlemessages/${circleId}/messages`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.messages) {
                    // console.log("messages - ", res.data.messages);
                    const formatted = res.data.messages.map(msg => formatBackendMessage(msg, currentUserId));
                    setMessages(formatted);
                }
            } catch (err) {
                console.error("Failed to fetch circle messages", err);
            }
        };
        fetchMessages();
    }, [circleId, backendUrl, currentUserId]);

    // Socket connection
    useEffect(() => {
        if (!circleId) return;

        const token = localStorage.getItem('token');
        socketRef.current = io(backendUrl, {
            auth: { token }
        });

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join_circle', circleId);
        });

        socketRef.current.on('newCircleMessage', (newMsg) => {
            const senderId = newMsg.sender?._id || newMsg.sender;
            if (senderId !== currentUserId) {
                setMessages(prev => [...prev, formatBackendMessage(newMsg, currentUserId)]);
            }
        });

        socketRef.current.on('circleMessageReacted', ({ messageId, reactions }) => {
            setMessages(prev => prev.map(msg => 
                msg.id === messageId 
                ? { 
                    ...msg, 
                    reactions: reactions.map(r => ({ icon: r.emoji, count: r.users?.length || 1 })),
                    likedByMe: reactions.some(r => r.emoji === '❤️' && r.users.some(u => (u._id || u) === currentUserId))
                  } 
                : msg
            ));
        });

        socketRef.current.on('circleMessageDeleted', ({ messageId }) => {
            setMessages(prev => prev.filter(msg => msg.id !== messageId));
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leave_circle', circleId);
                socketRef.current.disconnect();
            }
        };
    }, [circleId, backendUrl, currentUserId]);

    const formatBackendMessage = (msg, myUserId) => {
        const senderId = msg.sender?._id || msg.sender;
        const isMe = senderId === myUserId;
        
        // Find if I liked this
        const heartReaction = msg.reactions?.find(r => r.emoji === '❤️');
        const likedByMe = heartReaction?.users?.some(u => (u._id || u) === myUserId);

        return {
            id: msg._id || Date.now(),
            username: msg.sender?.username,
            name: msg.sender?.displayName || msg.sender?.username || 'Unknown',
            time: new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: msg.content?.text || '',
            reactions: msg.reactions?.map(r => ({ icon: r.emoji, count: r.users?.length || 1, users: r.users })) || [],
            avatar: msg.sender?.profilePic || `https://ui-avatars.com/api/?name=${msg.sender?.username || 'U'}&background=random`,
            isMe,
            likedByMe,
            replyTo: msg.replyTo ? {
                id: msg.replyTo._id,
                name: (msg.replyTo.sender?._id || msg.replyTo.sender) === myUserId ? 'You' : (msg.replyTo.sender?.displayName || msg.replyTo.sender?.username || 'Unknown'),
                text: msg.replyTo.content?.text || 'Media'
            } : null,
            date: new Date(msg.createdAt || Date.now()).toLocaleDateString()
        };
    };

    const handleToggleReaction = async (messageId, emoji = '❤️') => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${backendUrl}/api/circlemessages/${circleId}/messages/${messageId}/react`, 
                { emoji },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (res.data.reactions) {
                setMessages(prev => prev.map(msg => 
                    msg.id === messageId 
                    ? { 
                        ...msg, 
                        reactions: res.data.reactions.map(r => ({ icon: r.emoji, count: r.users?.length || 1 })),
                        likedByMe: res.data.reactions.some(r => r.emoji === '❤️' && r.users.some(u => (u._id || u) === currentUserId))
                      } 
                    : msg
                ));
            }
        } catch (err) {
            console.error("Failed to toggle reaction", err);
        }
    };

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        const textToSubmit = messageInput.trim();
        if (!textToSubmit || !circleId) return;

        const tempId = Date.now();
        const tempMsg = {
            id: tempId,
            username: currentUser.username,
            name: currentUser.displayName || currentUser.username || 'You',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: textToSubmit,
            reactions: [],
            avatar: currentUser.profilePic || `https://ui-avatars.com/api/?name=${currentUser.username || 'U'}&background=random`,
            isMe: true,
            replyTo: replyingTo ? { name: replyingTo.name, text: replyingTo.text } : null,
            date: new Date().toLocaleDateString()
        };

        setMessages(prev => [...prev, tempMsg]);
        setMessageInput('');
        const replyId = replyingTo?.id;
        setReplyingTo(null);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${backendUrl}/api/circlemessages/${circleId}/messages`, {
                content: { text: textToSubmit },
                replyTo: replyId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update tempId with real one
            setMessages(prev => prev.map(m => m.id === tempId ? formatBackendMessage(res.data.message, currentUserId) : m));
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    // Group messages by date
    const groupedMessages = messages.reduce((acc, msg) => {
        if (!acc[msg.date]) acc[msg.date] = [];
        acc[msg.date].push(msg);
        return acc;
    }, {});

    return (
        <div
            className="flex-1 flex flex-col rounded-3xl border border-[#2A1550] overflow-hidden shadow-2xl relative"
            style={{
                background: 'linear-gradient(160deg, #12082A 0%, #1A0D40 100%)',
                minHeight: '520px'
            }}
        >
            {/* Chat header area */}
            <div className="px-6 py-3 border-b border-white/5 bg-white/2 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{circleName || 'Live Chat'}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {members.slice(0, 4).map((m, i) => (
                            <img 
                                key={i} 
                                src={m.user?.profilePic || `https://ui-avatars.com/api/?name=${m.user?.username || 'U'}&background=random`} 
                                alt=""
                                className="w-6 h-6 rounded-full border-2 border-[#12082A] object-cover"
                            />
                        ))}
                    </div>
                    {memberCount > 4 && (
                        <span className="text-[10px] font-bold text-gray-400">
                            +{memberCount - 4} others
                        </span>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 no-scrollbar scroll-smooth">
                {Object.keys(groupedMessages).length === 0 ? (
                    <div className="flex justify-center mt-10 text-gray-500">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    Object.entries(groupedMessages).map(([date, msgs]) => (
                        <div key={date}>
                            <DateDivider date={date} />
                            {msgs.map(msg => (
                                <ChatMessage 
                                    key={msg.id} 
                                    msg={msg} 
                                    onToggleReaction={handleToggleReaction}
                                    onReply={setReplyingTo}
                                />
                            ))}
                        </div>
                    ))
                )}
                <div ref={endRef} className="h-4" />
            </div>

            {/* Input bar area */}
            <div className="p-6 bg-gradient-to-t from-[#12082A] to-transparent">
                
                {/* Reply Preview Bar */}
                {replyingTo && (
                    <div className="mb-2 bg-[#1A1140]/80 backdrop-blur-md border-l-4 border-violet-500 rounded-r-2xl p-3 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Replying to {replyingTo.name}</p>
                            <p className="text-xs text-gray-400 line-clamp-1 italic">"{replyingTo.text}"</p>
                        </div>
                        <button 
                            onClick={() => setReplyingTo(null)}
                            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-all active:scale-90"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-3 bg-[#0F0529]/80 border border-[#2A1550] rounded-2xl px-4 py-2 hover:border-violet-500/30 transition-all group/input focus-within:ring-2 focus-within:ring-violet-500/20 shadow-inner backdrop-blur-md">
                    <button className="p-2 text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-xl transition-all shrink-0">
                        <Plus size={20} />
                    </button>

                    <input
                        type="text"
                        value={messageInput}
                        onChange={e => setMessageInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSend(e); } }}
                        placeholder={replyingTo ? "Type your reply..." : "Share something with the circle..."}
                        className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none py-2"
                    />

                    <div className="flex items-center gap-1 shrink-0">
                        <button className="p-2 text-gray-500 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 rounded-xl transition-all">
                            <Smile size={20} />
                        </button>

                        <button
                            disabled={!messageInput.trim()}
                            onClick={handleSend}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-violet-900/40 disabled:opacity-30 disabled:grayscale hover:scale-105 active:scale-95 transition-all"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CircleChatArea;
