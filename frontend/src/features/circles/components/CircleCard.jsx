import React from 'react';
import { Users, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
const CircleCard = ({ circle }) => {
    return (
        <div className="bg-[#1A1140]/60 backdrop-blur-sm rounded-3xl p-6 border border-white/5 hover:border-purple-500/50 transition-all duration-500 group relative overflow-hidden">
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-[1px]">
                        <div className="w-full h-full rounded-2xl bg-[#1A1140] flex items-center justify-center overflow-hidden">
                            <img 
                                src={circle.coverImage?.startsWith('http') ? circle.coverImage : 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'} 
                                alt={circle.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                        </div>
                    </div>
                    {(circle.isFeatured || circle.stats?.memberCount > 100) && (
                        <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border border-white/10 bg-purple-500/10 text-purple-400 border-purple-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            <span>{circle.stats?.memberCount > 1000 ? 'Popular' : 'Active'}</span>
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {circle.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
                    {circle.description}
                </p>

                <div className="flex items-center space-x-6 mb-8 text-gray-400/80">
                    <div className="flex items-center space-x-2">
                        <Users size={16} className="text-purple-500/70" />
                        <span className="text-sm font-medium">{(circle.stats?.memberCount || 0).toLocaleString()} members</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Zap size={16} className="text-purple-500/70" />
                        <span className="text-sm font-medium capitalize">{circle.category}</span>
                    </div>
                </div>

                <Link 
                    to={`/circles/${circle.slug}`}
                    className="block w-full text-center py-3.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold transition-all transform active:scale-95 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]"
                >
                    View Circle
                </Link>
            </div>
        </div>
    );
};

export default CircleCard;
