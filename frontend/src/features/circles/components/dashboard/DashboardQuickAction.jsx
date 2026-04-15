import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const DashboardQuickAction = ({ to, icon: Icon, title, description, variant = 'default' }) => {
    if (variant === 'primary') {
        return (
            <Link 
                to={to} 
                className="group flex items-center gap-5 p-6 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all hover:scale-[1.02] active:scale-95 border border-white/10"
            >
                <div className="p-4 bg-white/20 text-white rounded-2xl">
                    <Icon size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-lg text-white group-hover:tracking-wide transition-all tracking-tight">{title}</h4>
                    <p className="text-sm text-white/70">{description}</p>
                </div>
                <ChevronRight size={20} className="ml-auto text-white group-hover:translate-x-1 transition-all" />
            </Link>
        );
    }

    return (
        <Link 
            to={to} 
            className="group flex items-center gap-5 p-6 bg-[#1A1140]/60 backdrop-blur-sm border border-white/5 rounded-2xl hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] active:scale-95 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex items-center gap-5 w-full">
                <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl group-hover:bg-purple-500 group-hover:text-white transition-all">
                    <Icon size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors tracking-tight">{title}</h4>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
                <ChevronRight size={20} className="ml-auto text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
        </Link>
    );
};

export default DashboardQuickAction;
