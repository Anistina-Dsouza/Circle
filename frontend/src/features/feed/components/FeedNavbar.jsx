import React, { useState, useEffect } from 'react';
import { Home, Users, Video, MessageSquare, Search, Bell, Menu, X, LogOut, Compass } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FeedNavbar = ({ activePage = 'Home' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        loadUserData();

        const handleSocketConnected = () => {
            setUser(prev => prev ? { ...prev, onlineStatus: { ...prev.onlineStatus, status: 'online' } } : prev);
        };
        const handleSocketDisconnected = () => {
            setUser(prev => prev ? { ...prev, onlineStatus: { ...prev.onlineStatus, status: 'offline' } } : prev);
        };

        window.addEventListener('socketConnected', handleSocketConnected);
        window.addEventListener('socketDisconnected', handleSocketDisconnected);

        return () => {
            window.removeEventListener('socketConnected', handleSocketConnected);
            window.removeEventListener('socketDisconnected', handleSocketDisconnected);
        };
    }, []);

    const loadUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Fetch fresh data from backend to ensure real-time online status
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                try {
                    const response = await axios.get(`${baseUrl}/api/auth/me`);
                    if (response.data.success) {
                        setUser(response.data.user);
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                    }
                } catch (err) {
                    console.error('Could not refresh user data:', err);
                }

            } else {
                navigate('/login');
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            localStorage.clear();
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const loadUnreadCount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.get(`${baseUrl}/api/notifications/unread-count`);
            if (response.data.success) {
                setUnreadCount(response.data.count);
            }
        } catch (err) {
            console.error('Could not load unread count:', err);
        }
    };

    useEffect(() => {
        if (!loading && user) {
            loadUnreadCount();
        }
    }, [loading, user]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        delete axios.defaults.headers.common['Authorization'];

        window.location.href = '/login';
    };

    const NavItem = ({ icon: Icon, label, to, active, isMobile = false }) => (
        <Link
            to={to}
            onClick={() => isMobile && setIsOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-2xl cursor-pointer transition-all ${active 
                ? 'bg-[#7C3AED] text-white shadow-lg shadow-purple-500/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
        >
            <Icon size={20} />
            <span className={`font-semibold ${isMobile ? 'block' : 'hidden lg:block'}`}>{label}</span>
        </Link>
    );

    if (loading) {
        return (
            <nav className="sticky top-0 z-50 bg-[#0F0529] border-b border-white/5 px-4 sm:px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse flex items-center justify-between">
                        <div className="flex items-center space-x-8">
                            <div className="w-10 h-10 bg-purple-800/50 rounded-full"></div>
                            <div className="h-8 w-24 bg-purple-800/50 rounded"></div>
                        </div>
                        <div className="w-10 h-10 bg-purple-800/50 rounded-full"></div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="sticky top-0 z-50 bg-[#0F0529]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Left: Logo & Nav */}
                <div className="flex items-center space-x-8">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                            <div className="w-5 h-5 bg-[#3C096C] rounded-full relative overflow-hidden">
                                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-white" />
                            </div>
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">Circle</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-1">
                        <NavItem icon={Home} label="Home" to="/feed" active={activePage === 'Home'} />
                        <NavItem icon={Compass} label="Explore" to="/explore" active={activePage === 'Explore'} />
                        <NavItem icon={Users} label="Circles" to="/circles" active={activePage === 'Circles'} />
                        <NavItem icon={Video} label="Meetings" to="/meetings" active={activePage === 'Meetings'} />
                        <NavItem icon={MessageSquare} label="Messages" to="/messages" active={activePage === 'Messages'} />
                    </div>
                </div>

                {/* Right: Search & Profile */}
                <div className="flex items-center space-x-3 sm:space-x-6">
                    <div className="hidden lg:flex items-center bg-[#1E1B3A] rounded-full px-4 py-2.5 w-64 border border-white/5 focus-within:border-purple-500/50 transition-colors">
                        <Search className="text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search circles..."
                            className="bg-transparent border-none outline-none text-white ml-3 w-full placeholder-gray-500 text-sm"
                        />
                    </div>

                    <Link 
                        to="/notifications" 
                        className={`transition-colors relative p-2 rounded-full hover:bg-white/5 ${activePage === 'Notifications' ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Bell size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F0529]"></span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link to={`/profile/${user.username}`} className="flex items-center space-x-3 cursor-pointer group">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                                        {user.displayName || user.username}
                                    </p>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-green-400">
                                        {user.onlineStatus?.status === 'online' ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                                <img
                                    src={user.profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}
                                    alt={user.username}
                                    className="w-10 h-10 rounded-full border-2 border-purple-500/30 object-cover group-hover:border-purple-500 transition-all shadow-lg"
                                />
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="hidden sm:flex p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded-full transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-purple-900/20 active:scale-95"
                        >
                            Login
                        </Link>
                    )}

                    <button 
                        className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all" 
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#0F0529]/95 backdrop-blur-2xl border-b border-white/5 py-4 px-4 flex flex-col space-y-1 animate-in slide-in-from-top-2 duration-300">
                    <NavItem icon={Home} label="Home" to="/feed" active={activePage === 'Home'} isMobile />
                    <NavItem icon={Compass} label="Explore" to="/explore" active={activePage === 'Explore'} isMobile />
                    <NavItem icon={Users} label="Circles" to="/circles" active={activePage === 'Circles'} isMobile />
                    <NavItem icon={Video} label="Meetings" to="/meetings" active={activePage === 'Meetings'} isMobile />
                    <NavItem icon={MessageSquare} label="Messages" to="/messages" active={activePage === 'Messages'} isMobile />

                    {user && (
                        <div className="pt-6 mt-2 border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <Link
                                    to={`/profile/${user.username}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center space-x-3"
                                >
                                    <img
                                        src={user.profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}
                                        alt={user.username}
                                        className="w-8 h-8 rounded-full border-2 border-purple-500/20"
                                    />
                                    <div>
                                        <p className="text-xs font-bold text-white">{user.displayName || user.username}</p>
                                    </div>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default FeedNavbar;