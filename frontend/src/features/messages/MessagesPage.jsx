import React, { useState } from 'react';
import FeedNavbar from '../feed/components/FeedNavbar';
import MessagesSidebar from './components/MessagesSidebar';
import ChatArea from './components/ChatArea';
import { useLocation } from 'react-router-dom';

const MessagesPage = () => {
    const location = useLocation();
    const [selectedChat, setSelectedChat] = useState(location.state?.selectedChat || null);


    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans selection:bg-purple-500/30 flex flex-col">
            <FeedNavbar activePage="Messages" />

            <main className="flex-1 max-w-7xl mx-auto w-full flex h-[calc(100vh-80px)] overflow-hidden">
                {/* Sidebar */}
                <div className="w-full md:w-1/3 border-r border-white/5 h-full">
                    <MessagesSidebar selectedChat={selectedChat} onSelectChat={setSelectedChat} />
                </div>

                {/* Chat Area */}
                <div className="hidden md:flex flex-1 flex-col h-full">
                    <ChatArea chatId={selectedChat} />
                </div>
            </main>
        </div>
    );
};

export default MessagesPage;
