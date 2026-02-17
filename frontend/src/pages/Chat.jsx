import React, { useState } from 'react';
import {
    Search,
    MoreVertical,
    Send,
    Smile,
    Paperclip,
    Phone,
    Video,
    Circle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { ArrowLeft as BackIcon } from 'lucide-react';

const Chat = () => {
    const [activeChat, setActiveChat] = useState(1);
    const [message, setMessage] = useState('');
    const [showMobileChat, setShowMobileChat] = useState(false);

    const chats = [
        { id: 1, name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?u=sarah', lastMessage: 'The new designs look amazing!', time: '2m ago', online: true, unread: 2 },
        { id: 2, name: 'Jordan Lee', avatar: 'https://i.pravatar.cc/150?u=jordan', lastMessage: 'Are we meeting at 5?', time: '1h ago', online: true, unread: 0 },
        { id: 3, name: 'Mila Kunis', avatar: 'https://i.pravatar.cc/150?u=mila', lastMessage: 'Sent you the files.', time: '3h ago', online: false, unread: 0 },
        { id: 4, name: 'Devin Page', avatar: 'https://i.pravatar.cc/150?u=devin', lastMessage: 'Thanks for the feedback!', time: 'Yesterday', online: true, unread: 0 },
    ];

    const messages = [
        { id: 1, sender: 'Sarah Wilson', text: "Hey! Have you seen the new design system update?", time: '10:00 AM', isMe: false },
        { id: 2, sender: 'Me', text: "Just saw it. The purple gradients are a great touch.", time: '10:02 AM', isMe: true },
        { id: 3, sender: 'Sarah Wilson', text: "Exactly! I think it really captures the 'Circle' vibe. Mindful and modern.", time: '10:05 AM', isMe: false },
        { id: 4, sender: 'Sarah Wilson', text: "The new designs look amazing!", time: '10:06 AM', isMe: false },
    ];

    const currentChat = chats.find(c => c.id === activeChat);

    const handleChatSelect = (id) => {
        setActiveChat(id);
        setShowMobileChat(true);
    };

    return (
        <div className="flex h-screen bg-[#050214] text-white font-sans overflow-hidden">
            <Sidebar />

            {/* Chat List Sidebar */}
            <div className={`w-full lg:w-96 border-r border-white/5 flex flex-col ${showMobileChat ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                        <h1 className="text-xl md:text-2xl font-bold">Messages</h1>
                        <div className="p-2 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
                            <MoreVertical size={20} className="text-gray-400" />
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full bg-[#130c2d] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#8b31ff]/50 transition-colors"
                        />
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto no-scrollbar px-4 space-y-2 pb-24 md:pb-8">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => handleChatSelect(chat.id)}
                            className={`flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all ${activeChat === chat.id ? 'bg-[#8b31ff] shadow-lg shadow-purple-500/20' : 'hover:bg-white/5'
                                }`}
                        >
                            <div className="relative shrink-0">
                                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white/10" />
                                {chat.online && (
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 md:w-4 md:h-4 bg-green-500 border-2 border-[#050214] rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-grow overflow-hidden">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className={`font-bold text-sm ${activeChat === chat.id ? 'text-white' : 'text-gray-200'}`}>{chat.name}</h3>
                                    <span className="text-[10px] text-gray-400 font-medium tracking-tight">{chat.time}</span>
                                </div>
                                <p className={`text-xs truncate ${activeChat === chat.id ? 'text-purple-100' : 'text-gray-500'}`}>
                                    {chat.lastMessage}
                                </p>
                            </div>
                            {chat.unread > 0 && activeChat !== chat.id && (
                                <div className="bg-[#8b31ff] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {chat.unread}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Chat Window */}
            <div className={`flex-grow flex flex-col bg-[#08041a] transition-all duration-300 ${showMobileChat ? 'flex' : 'hidden lg:flex'}`}>
                {/* Chat Header */}
                <div className="px-6 md:px-10 py-4 md:py-6 flex items-center justify-between border-b border-white/5 bg-[#050214]/50 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white"
                            onClick={() => setShowMobileChat(false)}
                        >
                            <BackIcon size={24} />
                        </button>
                        <div className="relative">
                            <img src={currentChat.avatar} alt={currentChat.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/10" />
                            {currentChat.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 md:w-3.5 md:h-3.5 bg-green-500 border-2 border-[#08041a] rounded-full"></div>
                            )}
                        </div>
                        <div>
                            <h2 className="font-bold text-base md:text-lg">{currentChat.name}</h2>
                            <p className="text-[10px] md:text-[11px] text-green-500 font-bold uppercase tracking-wider">
                                {currentChat.online ? 'Online Now' : 'Offline'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                        <button className="p-2 md:p-3 hover:bg-white/5 rounded-xl md:rounded-2xl text-gray-400 hover:text-white transition-all">
                            <Phone size={18} md:size={20} />
                        </button>
                        <button className="p-2 md:p-3 hover:bg-white/5 rounded-xl md:rounded-2xl text-gray-400 hover:text-white transition-all">
                            <Video size={18} md:size={20} />
                        </button>
                        <button className="p-2 md:p-3 hover:bg-white/5 rounded-xl md:rounded-2xl text-gray-400 hover:text-white transition-all">
                            <MoreVertical size={18} md:size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-grow overflow-y-auto no-scrollbar p-6 md:p-10 space-y-6">
                    <div className="flex justify-center my-6 md:my-8">
                        <span className="bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            Today
                        </span>
                    </div>

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`px-4 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-[2rem] text-sm leading-relaxed ${msg.isMe
                                    ? 'bg-[#8b31ff] text-white rounded-tr-none shadow-lg shadow-purple-500/10'
                                    : 'bg-[#130c2d] text-gray-200 rounded-tl-none border border-white/5'
                                    }`}>
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-gray-500 mt-2 mx-2 md:mx-4 font-medium tracking-tight">
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="p-4 md:p-8 pb-24 lg:pb-8">
                    <div className="bg-[#130c2d] border border-white/5 rounded-2xl md:rounded-[2.5rem] p-1.5 md:p-2 pr-3 md:pr-4 flex items-center gap-1 md:gap-2 shadow-2xl">
                        <button className="p-2 md:p-3 text-gray-400 hover:text-white transition-colors">
                            <Smile size={20} md:size={22} />
                        </button>
                        <button className="p-2 md:p-3 text-gray-400 hover:text-white transition-colors hidden sm:block">
                            <Paperclip size={20} md:size={22} />
                        </button>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Message..."
                            className="flex-grow bg-transparent border-none focus:outline-none text-sm px-2 text-white placeholder-gray-500 min-w-0"
                        />
                        <button
                            className={`p-3 md:p-4 rounded-full transition-all shrink-0 ${message.trim() ? 'bg-[#8b31ff] text-white shadow-lg' : 'bg-white/5 text-gray-600'
                                }`}
                        >
                            <Send size={18} md:size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {!showMobileChat && <BottomNav />}
        </div>
    );
};

export default Chat;
