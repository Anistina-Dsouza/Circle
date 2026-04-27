import React, { useState, useEffect } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Star, ChevronRight, Check, Trash2, Filter, Megaphone } from 'lucide-react';
import FeedNavbar from '../../feed/components/FeedNavbar';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NotificationsPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    const handleNotifClick = (noti) => {
        // Mark as read
        if (!noti.isRead) {
            markAsRead(noti._id || noti.id);
        }

        // Handle Redirection
        switch (noti.type) {
            case 'follow':
                if (noti.sender?.username) {
                    navigate(`/profile/${noti.sender.username}`);
                }
                break;
            case 'message':
            case 'flash_reply':
                if (noti.relatedItem?.id) {
                    navigate(`/messages`, { state: { selectedChat: noti.relatedItem.id } });
                } else {
                    navigate(`/messages`);
                }
                break;
            case 'mention':
                if (noti.relatedItem?.type === 'circle' && noti.relatedItem?.id) {
                    navigate(`/circles/${noti.relatedItem.id}`);
                } else if (noti.relatedItem?.type === 'moment' && noti.sender?.username) {
                    navigate(`/stories/${noti.sender.username}`);
                } else if (noti.relatedItem?.id) {
                    // Default to messages only if we are reasonably sure it's a DM
                    // (e.g., if type is 'message' or null and ID exists)
                    navigate(`/messages`, { state: { selectedChat: noti.relatedItem.id } });
                } else {
                    navigate(`/messages`);
                }
                break;
            case 'reaction':
                if (noti.sender?.username) {
                    navigate(`/stories/${noti.sender.username}`);
                }
                break;
            case 'circle_invite':
            case 'circle_join':
            case 'circle_message':
                if (noti.relatedItem?.id) {
                    navigate(`/circles/${noti.relatedItem.id}`);
                } else {
                    navigate(`/circles`);
                }
                break;
            default:
                break;
        }
    };

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const [notifRes, annRes] = await Promise.all([
                axios.get(`${backendUrl}/api/notifications`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${backendUrl}/api/announcements`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: { success: false } }))
            ]);
            if (notifRes.data.success) {
                setNotifications(notifRes.data.data);
            }
            if (annRes.data.success) {
                setAnnouncements(annRes.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'reaction':
            case 'like': return <Heart className="text-red-500" size={16} fill="currentColor" />;
            case 'follow': return <UserPlus className="text-blue-500" size={16} />;
            case 'mention':
            case 'message': return <MessageCircle className="text-purple-500" size={16} />;
            case 'circle_invite':
            case 'circle_join': return <Star className="text-yellow-500" size={16} fill="currentColor" />;
            default: return <Bell size={16} />;
        }
    };

    const markAllRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${backendUrl}/api/notifications/mark-all-read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const clearAll = async () => {
        if (window.confirm('Clear all notifications?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${backendUrl}/api/notifications/clear-all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications([]);
            } catch (error) {
                console.error('Failed to clear notifications:', error);
            }
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${backendUrl}/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'all') return true;
        if (activeTab === 'unread') return !n.isRead;
        // Group similar types for tabs
        if (activeTab === 'like') return n.type === 'reaction' || n.type === 'like';
        if (activeTab === 'mention') return n.type === 'mention' || n.type === 'message' || n.type === 'flash_reply';
        if (activeTab === 'followers') return n.type === 'follow';
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
                    {['all', 'unread', 'mention', 'like', 'followers', 'announcements'].map(tab => (
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
                    {loading ? (
                        <div className="text-center text-gray-500 py-10">Loading notifications...</div>
                    ) : activeTab === 'announcements' ? (
                        announcements.length === 0 ? (
                            <div className="bg-[#12082A]/50 border border-dashed border-white/10 rounded-3xl p-16 text-center flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <Megaphone className="text-gray-600" size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-300 mb-1">No Announcements</h3>
                                <p className="text-gray-500 text-sm max-w-xs mx-auto">No global announcements from the admin team yet.</p>
                            </div>
                        ) : (
                            announcements.map((ann) => (
                                <div key={ann._id} className="group relative bg-[#12082A] border border-blue-500/30 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.05)] transition-all duration-300 p-4 rounded-3xl flex gap-4 items-start">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-500 rounded-r-full" />
                                    
                                    <div className="shrink-0 relative">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 ring-2 ring-white/5">
                                            <Megaphone size={24} />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="text-sm font-black text-blue-400">Admin Announcement</span>
                                                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">• {formatTime(ann.createdAt)}</span>
                                            </div>
                                        </div>
                                        <h4 className="text-white font-bold text-base mb-1">{ann.title}</h4>
                                        <p className="text-sm leading-relaxed text-gray-300 font-medium whitespace-pre-wrap">
                                            {ann.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )
                    ) : filteredNotifications.length === 0 ? (
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
                                key={noti._id || noti.id}
                                onClick={() => handleNotifClick(noti)}
                                className={`group relative bg-[#12082A] border transition-all duration-300 p-4 rounded-3xl flex gap-4 items-start cursor-pointer active:scale-[0.98] ${
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
                                        src={noti.sender?.profilePic || noti.sender?.avatar || 'https://via.placeholder.com/150'} 
                                        alt={noti.sender?.displayName || noti.sender?.name || 'System'} 
                                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/5"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#12082A] border border-white/10 flex items-center justify-center shadow-2xl">
                                        {getIcon(noti.type)}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {noti.sender ? (
                                                <Link to={`/profile/${noti.sender.username}`} onClick={(e) => e.stopPropagation()} className="text-sm font-black hover:text-purple-400 transition-colors">
                                                    {noti.sender.displayName || noti.sender.username}
                                                </Link>
                                            ) : (
                                                <span className="text-sm font-black">System</span>
                                            )}
                                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">• {formatTime(noti.createdAt || noti.time)}</span>
                                        </div>
                                        {!noti.isRead && (
                                            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                                        )}
                                    </div>
                                    <p className={`text-sm leading-relaxed ${noti.isRead ? 'text-gray-400' : 'text-gray-200 font-medium'}`}>
                                        {noti.message || noti.content}
                                    </p>
                                </div>

                                <button className="self-center p-2 text-gray-700 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {activeTab === 'announcements' ? (
                    announcements.length > 0 && (
                        <div className="mt-12 text-center text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                            Showing {announcements.length} announcements
                        </div>
                    )
                ) : (
                    notifications.length > 0 && (
                        <div className="mt-12 text-center text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                            Showing {filteredNotifications.length} of {notifications.length} notifications
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;