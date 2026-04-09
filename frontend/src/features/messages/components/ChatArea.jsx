import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Phone, Video, MoreVertical } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';


const ChatArea = ({ chatId }) => {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatDetails, setChatDetails] = useState(null);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!chatId) return;
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
                const currentUserId = JSON.parse(localStorage.getItem('user'))?._id;
                const formatted = backendMessages.map(msg => ({
                    id: msg._id,
                    sender: msg.sender?._id === currentUserId || msg.sender === currentUserId ? 'me' : 'them',
                    text: msg.content?.text || '',
                    time: new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                }));
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
        socketRef.current = io(backendUrl);

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
             const currentUserId = JSON.parse(localStorage.getItem('user'))?._id;
             const senderObj = newMessage.sender;
             const senderId = senderObj?._id || senderObj;
             // Only add if we didn't send it (or we can use it to replace the optimistic one)
             if (senderId !== currentUserId) {
                 const formattedMessage = {
                     id: newMessage._id || Date.now(),
                     sender: 'them',
                     text: newMessage.content?.text || '',
                     time: new Date(newMessage.createdAt || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                 };
                 setMessages((prev) => [...prev, formattedMessage]);
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
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
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
            <div className="flex flex-col items-center justify-center h-full bg-[#0a041c]">
                <div className="text-gray-500 flex flex-col items-center">
                    <MoreVertical size={48} className="mb-4 opacity-50" />
                    <p>Select a conversation to start messaging</p>
                </div>
            </div>
        );
    }

    const currentUserId = JSON.parse(localStorage.getItem('user'))?._id;
    const otherParticipant = chatDetails?.participants?.find(p => p.user && p.user._id !== currentUserId)?.user;
    const chatUser = otherParticipant?.displayName || otherParticipant?.username || 'Unknown User';
    const chatAvatar = otherParticipant?.profilePic || 'https://via.placeholder.com/150';
    const chatStatus = otherParticipant?.onlineStatus === 'online' ? 'Active now' : 'Offline';

    return (
        <div className="flex flex-col h-full bg-[#0a041c]">
            {/* Header */}
            <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-[#0F0529]">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <img
                            src={chatAvatar}
                            alt={chatUser}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20"
                        />
                        {otherParticipant?.onlineStatus === 'online' && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0F0529]"></div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">{chatUser}</h3>
                        <p className="text-xs text-purple-400 font-medium">{chatStatus}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-6 text-gray-400">
                    {/* Placeholder icons for actions */}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent">
                <div className="flex justify-center mb-8">
                    <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Today</span>
                </div>

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex w-full ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[70%] ${msg.sender === 'me' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} items-end space-x-3`}>
                            {/* Avatar Only for 'them' messages */}
                            {msg.sender === 'them' && (
                                <img
                                    src={chatAvatar}
                                    alt="Sender"
                                    className="w-8 h-8 rounded-full object-cover mb-6"
                                />
                            )}

                            {/* Message Bubble + Time */}
                            <div className="flex flex-col space-y-1">
                                <div
                                    className={`px-6 py-4 rounded-3xl text-[15px] leading-relaxed relative ${msg.sender === 'me'
                                            ? 'bg-[#6D28D9] text-white rounded-tr-none shadow-lg shadow-purple-900/20'
                                            : 'bg-[#E9D5FF] text-[#1E1B3A] rounded-tl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                                <span className={`text-[10px] text-gray-500 font-medium mt-1 ${msg.sender === 'me' ? 'text-right' : 'text-left ml-2'}`}>
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

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
                    <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Smile size={20} />
                    </button>
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
