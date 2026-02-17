import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home as HomeIcon,
    Users,
    Video,
    MessageSquare,
    Bell,
    Settings
} from 'lucide-react';

const NavItem = ({ icon, label, to, dot }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${isActive ? 'bg-[#8b31ff] text-white shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`
        }
    >
        <div className="flex items-center gap-4">
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </div>
        {dot && <div className="w-1.5 h-1.5 bg-[#8b31ff] rounded-full"></div>}
    </NavLink>
);

const Sidebar = () => {
    return (
        <aside className="hidden lg:flex w-72 flex-col bg-[#050214] border-r border-white/5 p-8 shrink-0 h-full">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8b31ff] to-[#4f18a3] rounded-2xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" />
                        <circle cx="12" cy="12" r="4" fill="white" />
                    </svg>
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">Circle</span>
            </div>

            <nav className="flex-grow space-y-4">
                <NavItem icon={<HomeIcon size={24} />} label="Home" to="/home" />
                <NavItem icon={<Users size={24} />} label="Circles" to="/circles" />
                <NavItem icon={<Video size={24} />} label="Meetings" to="/meetings" />
                <NavItem icon={<MessageSquare size={24} />} label="Messages" to="/chat" />
                <NavItem icon={<Bell size={24} />} label="Notifications" to="/notifications" dot />
            </nav>

            <div className="mt-auto">
                <div className="flex items-center justify-between bg-[#130c2d] p-4 rounded-[2rem] border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img src="https://i.pravatar.cc/150?u=alex" alt="Alex Rivera" className="w-12 h-12 rounded-full border-2 border-[#8b31ff]" />
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#130c2d] rounded-full"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">Alex Rivera</span>
                            <span className="text-[11px] text-gray-400">Active Now</span>
                        </div>
                    </div>
                    <div className="p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-gray-400">
                        <Settings size={20} />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

