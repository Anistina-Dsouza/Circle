import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home as HomeIcon,
    Users,
    Video,
    MessageSquare,
    Bell
} from 'lucide-react';

const MobileNavItem = ({ icon, to, dot }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `relative flex items-center justify-center p-3 transition-all ${isActive ? 'text-[#8b31ff]' : 'text-gray-500 hover:text-gray-300'
            }`
        }
    >
        {icon}
        {dot && (
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#8b31ff] rounded-full border-2 border-[#050214]"></div>
        )}
    </NavLink>
);

const BottomNav = () => {
    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#050214]/80 backdrop-blur-xl border-t border-white/5 px-6 py-2 flex items-center justify-between z-50">
            <MobileNavItem icon={<HomeIcon size={24} />} to="/home" />
            <MobileNavItem icon={<Users size={24} />} to="/circles" />
            <MobileNavItem icon={<Video size={24} />} to="/meetings" />
            <MobileNavItem icon={<MessageSquare size={24} />} to="/chat" />
            <MobileNavItem icon={<Bell size={24} />} to="/notifications" dot />
        </nav>
    );
};

export default BottomNav;
