import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Phone, Video, MoreVertical, MessageCircle, ChevronDown, User, Heart as HeartIcon, Coffee, Music, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';


const ChatArea = ({ chatId }) => {
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

    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatDetails, setChatDetails] = useState(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [hasNewMessages, setHasNewMessages] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef(null);
    const scrollRef = useRef(null);
    const socketRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const emojiCategories = [
        { id: 'smileys', icon: <Smile size={16} />, emojis: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😮‍💨', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😶‍🌫️', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '😵‍💫', '🤐', '🥴', '🤢', '🤮', '🤧', '🤨', '🧐'] },
        { id: 'hearts', icon: <HeartIcon size={16} />, emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆒', '🆓', 'ℹ️', '🆔', 'Ⓜ️', '🆕', '🆖', '🆗', '🆙', '🆚', '🈁', '🈂️', '🈚', '🈯', '🈲'] },
        { id: 'food', icon: <Coffee size={16} />, emojis: ['🍎', '🍏', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌽', '🥕', '🫑', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🍛', '🍜', '🍲', '🍱', '🍣', '🍤', '🍿', '🥟', '🍳', '🥡', '🍚', '🍙', '🍘', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯'] },
        { id: 'activities', icon: <Music size={16} />, emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🎳', '🏏', '🏑', '🏒', '🏓', '🏸', '🥊', '🥋', '🥅', '⛳', '⛸️', '🎣', '🤿', '🎿', '🏂', '🛷', '🛼', '🎯', '🪀', '🪁', '🎮', '🕹️', '🎰', '🎲', '🧩', '🧸', '🪅', '🪆', '🎨', '🖼️', '🧵', '🪡', '🧶', '🎬', '🎤', '🎧', '📻', '🎸', '🎹', '🎺', '🎻', '🪕', '🥁', '🪘', '🎷'] },
        { id: 'objects', icon: <Camera size={16} />, emojis: ['⌚', '📱', '📲', '💻', '⌨️', '🖱️', '🖨️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🧱', '🪜', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🦯', '🛒', '🚬', '⚰️', '⚱️', '🪦', '🧿', '🔮', '🧿', '🧿'] }
    ];

    const [activeEmojiCategory, setActiveEmojiCategory] = useState('smileys');



    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setHasNewMessages(false);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleScroll = () => {
        const element = scrollRef.current;
        if (!element) return;
        const { scrollTop, scrollHeight, clientHeight } = element;
        const distance = scrollHeight - scrollTop - clientHeight;
        if (distance > 100) {
            setShowScrollButton(true);
        } else {
            setShowScrollButton(false);
            setHasNewMessages(false);
        }
    };

    useEffect(() => {
        if (!chatId) return;
        setMessages([]); // Clear old messages
        setChatDetails(null); // Clear old details
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [chatRes, msgRes] = await Promise.all([
                    axios.get(`${BACKEND_URL}/api/dm/conversations/${chatId}`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BACKEND_URL}/api/dm/conversations/${chatId}/messages`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setChatDetails(chatRes.data.conversation);
                // Format messages from backend
                const backendMessages = msgRes.data.messages || [];
                const formatted = backendMessages.map(msg => {
                    const senderObj = msg.sender;
                    const senderId = senderObj?._id || senderObj;
                    return {
                        id: msg._id,
                        sender: senderId === currentUserId ? 'me' : 'them',
                        text: msg.content?.text || '',
                        time: new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                        date: new Date(msg.createdAt).toLocaleDateString()
                    };
                });
                setMessages(formatted);
            } catch (err) {
                console.error("Failed to fetch chat data", err);
            }
        };
        fetchData();
    }, [chatId]);


    useEffect(() => {
        // Initialize socket connection
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        socketRef.current = io(backendUrl, {
            auth: { token }
        });

        // Once connected, join the conversation room
        socketRef.current.on('connect', () => {
            console.log('Connected to socket server');
            if (chatId) {
                socketRef.current.emit('join_conversation', chatId);
            }
        });

        // Listen for new messages
        socketRef.current.on('newMessage', (newMessage) => {
             console.log('New message received via socket:', newMessage);
             const senderObj = newMessage.sender;
             const senderId = senderObj?._id || senderObj;
             // Only add if we didn't send it (or we can use it to replace the optimistic one)
             if (senderId !== currentUserId) {
                  const formattedMessage = {
                      id: newMessage._id || Date.now(),
                      sender: 'them',
                      text: newMessage.content?.text || '',
                      time: new Date(newMessage.createdAt || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                      date: new Date(newMessage.createdAt || Date.now()).toLocaleDateString()
                  };
                  setMessages((prev) => [...prev, formattedMessage]);
                  
                  // Check if user is scrolled up
                  const element = scrollRef.current;
                  if (element && element.scrollHeight - element.scrollTop - element.clientHeight > 150) {
                      setHasNewMessages(true);
                  }
             }
        });

        // Listen for updated messages
        socketRef.current.on('messageUpdated', (updatedMessage) => {
            setMessages((prev) => prev.map(msg => 
                msg.id === updatedMessage._id 
                ? { ...msg, text: updatedMessage.content?.text || msg.text } 
                : msg
            ));
        });

        return () => {
            if (socketRef.current) {
                if (chatId) {
                    socketRef.current.emit('leave_conversation', chatId);
                }
                socketRef.current.disconnect();
            }
        };
    }, [chatId]);

    // Close emoji picker on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update whenever chat ID changes
    useEffect(() => {
        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('join_conversation', chatId);
        }
    }, [chatId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !chatId) return;
        
        const tempId = Date.now();
        const textToSubmit = inputText.trim();
        const newMsg = {
            id: tempId,
            sender: 'me',
            text: textToSubmit,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            date: new Date().toLocaleDateString()
        };
        
        // Optimistically add to state
        setMessages((prev) => [...prev, newMsg]);
        setInputText('');
        
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${BACKEND_URL}/api/dm/conversations/${chatId}/messages`, {
                content: { text: textToSubmit }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Optionally update the tempId with the real ID
            setMessages((prev) => prev.map(m => m.id === tempId ? { ...m, id: res.data.message._id } : m));
        } catch (err) {
            console.error("Failed to send message", err);
            // Optionally remove the message or mark as failed
        }
    };

    if (!chatId) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#0a041c] relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-fuchsia-600/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center text-center px-10">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center mb-8 border border-white/5 shadow-2xl backdrop-blur-xl">
                        <MessageCircle size={40} className="text-violet-400" />
                    </div>
                    
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                        Welcome to your Inner Circle
                    </h2>
                    
                    <p className="text-gray-400 max-w-md leading-relaxed mb-8">
                        Stay connected with your favorite people. Select a conversation from the sidebar to dive back into your messages, or start a new chat with someone special.
                    </p>
                    
                    <div className="flex gap-2">
                        <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            Secure
                        </div>
                        <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            Encrypted
                        </div>
                        <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            Private
                        </div>
                    </div>
                </div>
                
                {/* Bottom decorative bar */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-30">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                    <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em]">System Online</span>
                </div>
            </div>
        );
    }

    const groupedMessages = messages.reduce((acc, msg) => {
        if (!acc[msg.date]) acc[msg.date] = [];
        acc[msg.date].push(msg);
        return acc;
    }, {});

    const DateDivider = ({ date }) => (
        <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-[10px] font-bold text-gray-500 tracking-wide px-4 py-1 rounded-full bg-white/5 border border-white/5">
                {date}
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/10 to-transparent" />
        </div>
    );


    const otherParticipant = chatDetails?.participants?.find(p => {
        const pUser = p.user;
        const pUserId = pUser?._id || pUser;
        return pUserId && pUserId !== currentUserId;
    })?.user;
    const chatUser = otherParticipant?.displayName || otherParticipant?.username || 'Unknown User';
    const chatAvatar = otherParticipant?.profilePic || 'https://via.placeholder.com/150';
    const chatStatus = otherParticipant?.onlineStatus?.status === 'online' ? 'Active now' : 'Offline';

    return (
        <div className="flex flex-col h-full bg-[#0F0529]">
            {/* Header */}
            <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-white/2 backdrop-blur-md">
                <div className="flex items-center space-x-4">
                    {otherParticipant ? (
                        <>
                            <Link to={`/profile/${otherParticipant.username}`} className="relative shrink-0 active:scale-95 transition-transform">
                                <img
                                    src={chatAvatar}
                                    alt={chatUser}
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20"
                                />
                                {otherParticipant?.onlineStatus?.status === 'online' && (
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0F0529]"></div>
                                )}
                            </Link>
                            <div>
                                <Link to={`/profile/${otherParticipant.username}`} className="font-bold text-white text-lg hover:text-violet-400 transition-colors">
                                    {chatUser}
                                </Link>
                                <p className="text-xs text-purple-400 font-medium">{chatStatus}</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center space-x-4 animate-pulse">
                            <div className="w-10 h-10 rounded-full bg-white/5" />
                            <div className="space-y-2">
                                <div className="w-24 h-4 bg-white/5 rounded-full" />
                                <div className="w-16 h-3 bg-white/5 rounded-full" />
                            </div>
                        </div>
                    )}
                </div>



                <div className="flex items-center space-x-6 text-gray-400">
                    {/* Placeholder icons for actions */}
                </div>
            </div>

            {/* Messages */}
            <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-8 py-6 space-y-2 no-scrollbar relative"
                style={{
                    background: 'linear-gradient(160deg, #12082A 0%, #1A0D40 100%)'
                }}
            >

                {Object.entries(groupedMessages).map(([date, msgs]) => (
                    <div key={date}>
                        <DateDivider date={date} />
                        <div className="space-y-4">
                            {msgs.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex w-full ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex max-w-[75%] ${msg.sender === 'me' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} items-end space-x-3`}>
                                        {msg.sender === 'them' && (
                                            <Link to={`/profile/${otherParticipant?.username}`} className="shrink-0 mb-2 active:scale-90 transition-transform">
                                                <img
                                                    src={chatAvatar}
                                                    alt="Sender"
                                                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white/5 hover:ring-violet-500/30 transition-all cursor-pointer"
                                                />
                                            </Link>
                                        )}


                                        <div className="flex flex-col space-y-1">
                                            <div
                                                className={`px-5 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm transition-all hover:brightness-110 ${msg.sender === 'me'
                                                        ? 'bg-violet-600 text-white rounded-tr-none shadow-violet-900/10 border border-violet-500/20'
                                                        : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/5 backdrop-blur-sm'
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>
                                            <span className={`text-[10px] text-gray-600 font-medium ${msg.sender === 'me' ? 'text-right pr-1' : 'text-left pl-1'}`}>
                                                {msg.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Scroll to latest button */}
            {showScrollButton && (
                <button
                    onClick={scrollToBottom}
                    className="fixed bottom-32 right-12 md:right-16 p-4 rounded-full bg-violet-600 text-white shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:bg-violet-500 hover:scale-110 active:scale-95 transition-all z-[9999] flex items-center justify-center group"
                    title="Go to latest messages"
                >
                    <ChevronDown size={24} className="group-hover:translate-y-0.5 transition-transform" />
                    {hasNewMessages && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[#12082A] animate-pulse" />
                    )}
                </button>
            )}

            {/* Input Area */}
            <div className="p-6 bg-[#0F0529] border-t border-white/5">
                <form
                    onSubmit={handleSend}
                    className="flex items-center space-x-3 bg-[#1E1B3A] rounded-full px-2 py-2 pr-2 border border-white/5 focus-within:border-purple-500/50 transition-colors shadow-lg"
                >
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none outline-none text-white px-6 placeholder-gray-500"
                    />
                    <div className="relative" ref={emojiPickerRef}>
                        <button 
                            type="button" 
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className={`p-2 transition-colors ${showEmojiPicker ? 'text-violet-400' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Smile size={20} />
                        </button>

                        {showEmojiPicker && (
                            <div className="absolute bottom-full right-0 mb-4 bg-[#1A1140] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl z-[100] w-72 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
                                {/* WhatsApp style category tabs */}
                                <div className="flex bg-black/20 p-1">
                                    {emojiCategories.map(cat => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setActiveEmojiCategory(cat.id)}
                                            className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all ${activeEmojiCategory === cat.id ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'}`}
                                        >
                                            {cat.icon}
                                        </button>
                                    ))}
                                </div>
                                
                                {/* Emoji Grid */}
                                <div className="p-4 max-h-56 overflow-y-auto custom-scrollbar grid grid-cols-6 gap-3 bg-[#12082A]">
                                    {emojiCategories.find(cat => cat.id === activeEmojiCategory).emojis.map((emoji, idx) => (
                                        <button
                                            key={`${emoji}-${idx}`}
                                            type="button"
                                            onClick={() => {
                                                setInputText(prev => prev + emoji);
                                            }}
                                            className="text-2xl hover:scale-125 transition-transform active:scale-90 flex items-center justify-center"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>

                                
                                <div className="px-4 py-2 border-t border-white/5 bg-black/10 flex justify-between items-center text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                    <span>{activeEmojiCategory}</span>
                                    <button 
                                        onClick={() => setShowEmojiPicker(false)}
                                        className="text-violet-400 hover:text-violet-300"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    <button
                        type="submit"
                        className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Send size={18} className="ml-0.5" />
                    </button>
                </form>
                <div className="text-center mt-3">
                    <p className="text-[10px] text-gray-600 flex items-center justify-center gap-1">
                        Messages are private and secure in your Circle.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatArea;
