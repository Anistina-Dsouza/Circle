import React, { useState } from 'react';
import { Send, Smile, Phone, Video, MoreVertical } from 'lucide-react';

const activeChatData = {
    id: 1,
    user: 'Sasha Moon',
    status: 'Active now',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    messages: [
        {
            id: 1,
            sender: 'them',
            text: "Hey! I was thinking about the project timeline. Do you think we can wrap up the DM interface by Friday?",
            time: '10:42 AM'
        },
        {
            id: 2,
            sender: 'me',
            text: "Absolutely! Most of the components are ready. I'm just polishing the responsive states right now.",
            time: '10:45 AM'
        },
        {
            id: 3,
            sender: 'them',
            text: "That's great news! 🚀",
            time: '10:46 AM'
        },
        {
            id: 4,
            sender: 'them',
            text: "Are we still meeting at the Neon Bar later to celebrate the launch?",
            time: '10:48 AM',
            hasTail: true
        },
        {
            id: 5,
            sender: 'me',
            text: "Yes, for sure. See you at 8 PM!",
            time: '10:52 AM',
            hasTail: true
        }
    ]
};

const ChatArea = ({ chatId }) => {
    const [inputText, setInputText] = useState('');

    // Find chat data based on ID - using mock data for now
    const chat = activeChatData;

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        console.log('Sending:', inputText);
        setInputText('');
    };

    return (
        <div className="flex flex-col h-full bg-[#0a041c]">
            {/* Header */}
            <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-[#0F0529]">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <img
                            src={chat.avatar}
                            alt={chat.user}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20"
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0F0529]"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">{chat.user}</h3>
                        <p className="text-xs text-purple-400 font-medium">{chat.status}</p>
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

                {chat.messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex w-full ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[70%] ${msg.sender === 'me' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} items-end space-x-3`}>
                            {/* Avatar Only for 'them' messages */}
                            {msg.sender === 'them' && (
                                <img
                                    src={chat.avatar}
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
