import React, { useState, useEffect } from 'react';
import { Home, Users, Video, MessageSquare, Search, Bell, Menu, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FeedNavbar = ({ activePage = 'Home' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = () => {
        try {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);

                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                console.log("User loaded in navbar:", parsedUser);
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        delete axios.defaults.headers.common['Authorization'];

        navigate('/login');
    };

    const NavItem = ({ icon: Icon, label, to, active }) => (
        <Link
            to={to}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full cursor-pointer transition-colors ${active ? 'bg-[#7C3AED] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
        >
            <Icon size={20} />
            <span className="font-medium hidden lg:block">{label}</span>
        </Link>
    );

    if (loading) {
        return (
            <nav className="sticky top-0 z-50 bg-[#0F0529] border-b border-white/5 px-6 py-4">
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
        <nav className="sticky top-0 z-50 bg-[#0F0529] border-b border-white/5 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Left: Logo & Nav */}
                <div className="flex items-center space-x-8">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <div className="w-6 h-6 bg-[#3C096C] rounded-full relative overflow-hidden">
                                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-white" />
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">Circle</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-2">
                        <NavItem icon={Home} label="Home" to="/feed" active={activePage === 'Home'} />
                        <NavItem icon={Users} label="Circles" to="/circles" active={activePage === 'Circles'} />
                        <NavItem icon={Video} label="Meetings" to="/meetings" active={activePage === 'Meetings'} />
                        <NavItem icon={MessageSquare} label="Messages" to="/messages" active={activePage === 'Messages'} />
                    </div>
                </div>

                {/* Right: Search & Profile */}
                <div className="flex items-center space-x-6">
                    <div className="hidden md:flex items-center bg-[#1E1B3A] rounded-full px-4 py-2.5 w-64 border border-white/5 focus-within:border-purple-500/50 transition-colors">
                        <Search className="text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search circles..."
                            className="bg-transparent border-none outline-none text-white ml-3 w-full placeholder-gray-500 text-sm"
                        />
                    </div>

                    <button className="text-gray-400 hover:text-white transition-colors relative">
                        <Bell size={24} />
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0F0529]"></span>
                    </button>

                    {user ? (
                        <>
                            <Link to={`/profile/${user.username}`} className="flex items-center space-x-3 cursor-pointer group">
                                <div className="text-right hidden lg:block">
                                    <p className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">
                                        {user.displayName || user.username}
                                    </p>
                                    <p className="text-xs text-green-400">
                                        {user.onlineStatus?.status === 'online' ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                                <img
                                    src={user.profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}
                                    alt={user.username}
                                    className="w-10 h-10 rounded-full border-2 border-purple-500/30 object-cover group-hover:border-purple-500 transition-colors"
                                />

                            </Link>

                            <button
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                        >
                            Login
                        </Link>
                    )}

                    <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <Menu size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#0F0529] border-b border-white/5 py-4 px-6 flex flex-col space-y-4">
                    <NavItem icon={Home} label="Home" to="/feed" active={activePage === 'Home'} />
                    <NavItem icon={Users} label="Circles" to="/circles" active={activePage === 'Circles'} />
                    <NavItem icon={Video} label="Meetings" to="/meetings" active={activePage === 'Meetings'} />
                    <NavItem icon={MessageSquare} label="Messages" to="/messages" active={activePage === 'Messages'} />

                    {user && (
                        <div className="pt-4 border-t border-white/10">
                            <Link
                                to={`/profile/${user.username}`}
                                className="flex items-center space-x-3 py-2"
                            >
                                <img
                                    src={user.profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}
                                    alt={user.username}
                                    className="w-8 h-8 rounded-full"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-white">{user.displayName || user.username}</p>
                                    <p className="text-xs text-gray-400">@{user.username}</p>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default FeedNavbar;