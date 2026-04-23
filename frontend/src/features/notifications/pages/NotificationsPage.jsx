import React, { useState } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Star, ChevronRight, Check, Trash2, Filter } from 'lucide-react';
import FeedNavbar from '../../feed/components/FeedNavbar';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'like',
            user: {
                name: 'khushiepal',
                username: 'khushiepal',
                avatar: 'https://via.placeholder.com/150'
            },
            content: 'liked your moment from last night! ',
            time: '2m ago',
            isRead: false
        },
        {
            id: 2,
            type: 'follow',
            user: {
                name: 'maryam',
                username: 'maryam',
                avatar: 'https://via.placeholder.com/150'
            },
            content: 'started following you. Connect back?',
            time: '15m ago',
            isRead: false
        },
        {
            id: 3,
            type: 'mention',
            user: {
                name: 'kalagipandya',
                username: 'kalagipandya',
                avatar: 'https://via.placeholder.com/150'
            },
            content: 'mentioned you in a comment: "@sakina check this out!"',
            time: '2h ago',
            isRead: true
        },
        {
            id: 4,
            type: 'circle_invite',
            user: {
                name: 'Design Enthusiasts',
                username: 'design_circle',
                avatar: 'https://via.placeholder.com/150'
            },
            content: 'invited you to join the "Design Patterns" circle.',
            time: '5h ago',
            isRead: true
        }
    ]);

    const getIcon = (type) => {
        switch (type) {
            case 'like': return <Heart className="text-red-500" size={16} fill="currentColor" />;
            case 'follow': return <UserPlus className="text-blue-500" size={16} />;
            case 'mention': return <MessageCircle className="text-purple-500" size={16} />;
            case 'circle_invite': return <Star className="text-yellow-500" size={16} fill="currentColor" />;
            default: return <Bell size={16} />;
        }
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const clearAll = () => {
        if (window.confirm('Clear all notifications?')) {
            setNotifications([]);
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'all') return true;
        if (activeTab === 'unread') return !n.isRead;
        return n.type === activeTab;
    });

    return (
        <div className="min-h-screen bg-[#0A051D] text-white selection:bg-purple-500/30">
            <FeedNavbar />

            <div className="max-w-3xl mx-auto pt-24 pb-20 px-6">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight mb-1 flex items-center gap-3">
                            Notifications
                            {notifications.filter(n => !n.isRead).length > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                                    {notifications.filter(n => !n.isRead).length} NEW
                                </span>
                            )}
                        </h1>
                        <p className="text-gray-500 text-sm">Stay updated with your circle's activity</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={markAllRead}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
                        >
                            <Check size={14} /> Mark all read
                        </button>
                        <button 
                            onClick={clearAll}
                            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
                        >
                            <Trash2 size={14} /> Clear all
                        </button>
                    </div>
                </div>

                {/* Tabs / Filter Area */}
                <div className="flex items-center gap-1 bg-[#12082A] p-1.5 rounded-2xl border border-white/5 mb-6 overflow-x-auto no-scrollbar">
                    {['all', 'unread', 'mention', 'like', 'circle_invite'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                activeTab === tab 
                                ? 'bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-lg' 
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }`}
                        >
                            {tab.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <div className="bg-[#12082A]/50 border border-dashed border-white/10 rounded-3xl p-16 text-center flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <Bell className="text-gray-600" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-300 mb-1">Silence is golden</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">No notifications found in this category.</p>
                        </div>
                    ) : (
                        filteredNotifications.map((noti) => (
                            <div 
                                key={noti.id}
                                className={`group relative bg-[#12082A] border transition-all duration-300 p-4 rounded-3xl flex gap-4 items-start active:scale-[0.98] ${
                                    noti.isRead 
                                    ? 'border-white/5 opacity-80' 
                                    : 'border-purple-500/30 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.05)]'
                                }`}
                            >
                                {/* Left Icon & Color Strip */}
                                {!noti.isRead && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-purple-500 rounded-r-full" />
                                )}

                                <div className="shrink-0 relative">
                                    <img 
                                        src={noti.user.avatar} 
                                        alt={noti.user.name} 
                                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/5"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#12082A] border border-white/10 flex items-center justify-center shadow-2xl">
                                        {getIcon(noti.type)}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <Link to={`/profile/${noti.user.username}`} className="text-sm font-black hover:text-purple-400 transition-colors">
                                                {noti.user.name}
                                            </Link>
                                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">• {noti.time}</span>
                                        </div>
                                        {!noti.isRead && (
                                            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                                        )}
                                    </div>
                                    <p className={`text-sm leading-relaxed ${noti.isRead ? 'text-gray-400' : 'text-gray-200 font-medium'}`}>
                                        {noti.content}
                                    </p>
                                </div>

                                <button className="self-center p-2 text-gray-700 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {notifications.length > 0 && (
                    <div className="mt-12 text-center text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                        Showing {filteredNotifications.length} of {notifications.length} notifications
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
