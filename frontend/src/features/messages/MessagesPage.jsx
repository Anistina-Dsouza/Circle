import React, { useState } from 'react';
import FeedNavbar from '../feed/components/FeedNavbar';
import MessagesSidebar from './components/MessagesSidebar';
import ChatArea from './components/ChatArea';
import { useLocation } from 'react-router-dom';

const MessagesPage = () => {
    const location = useLocation();
    const [selectedChat, setSelectedChat] = useState(location.state?.selectedChat || null);


    return (
        <div className="h-screen bg-[#0F0529] text-white font-sans selection:bg-purple-500/30 flex flex-col overflow-hidden">
            <FeedNavbar activePage="Messages" />

            <main className="flex-1 max-w-7xl mx-auto w-full flex overflow-hidden relative">
                {/* Sidebar - Hidden on mobile if a chat is selected */}
                <div className={`w-full md:w-1/3 border-r border-white/5 h-full transition-all duration-300 ${selectedChat ? 'hidden md:block' : 'block'}`}>
                    <MessagesSidebar selectedChat={selectedChat} onSelectChat={setSelectedChat} />
                </div>

                {/* Chat Area - Full screen on mobile if a chat is selected */}
                <div className={`flex-1 flex-col h-full transition-all duration-300 ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
                    {selectedChat ? (
                        <div className="flex-1 flex flex-col h-full relative">
                            {/* Mobile Back Button Overlay */}
                            <button 
                                onClick={() => setSelectedChat(null)}
                                className="md:hidden absolute top-4 left-4 z-[60] p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                            </button>
                            <ChatArea chatId={selectedChat} />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-[#1A1140]/10 text-gray-500">
                             <div className="p-6 bg-white/5 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                             </div>
                             <p className="font-bold tracking-widest text-xs uppercase">Select a chat to start messaging</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MessagesPage;
