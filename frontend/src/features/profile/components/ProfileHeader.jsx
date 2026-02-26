import React, { useState } from 'react';
import { MessageSquare, UserCheck, UserPlus, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ value, label }) => (
    <div className="flex flex-col items-center justify-center bg-[#1E1B3A] border border-white/5 rounded-2xl px-8 py-5 flex-1 hover:border-purple-500/30 transition-all duration-300">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">{label}</span>
    </div>
);

const ProfileHeader = ({ user, isOwnProfile = false }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    return (
        <div className="flex flex-col items-center text-center pt-10 pb-6">
            {/* Avatar */}
            <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-400 shadow-2xl shadow-purple-500/40">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover border-4 border-[#0F0529]"
                    />
                </div>
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-[#0F0529]" />
            </div>

            {/* Name & Bio */}
            <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
            <p className="text-gray-400 max-w-md leading-relaxed text-sm px-4 mb-8">
                {user.bio}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 mb-10">
                {isOwnProfile ? (
                    <Link
                        to="/profile/edit"
                        className="flex items-center space-x-2 px-7 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] font-semibold text-white transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 active:scale-95"
                    >
                        <Edit2 size={16} />
                        <span>Edit Profile</span>
                    </Link>
                ) : (
                    <>
                        <button
                            onClick={() => setIsFollowing(!isFollowing)}
                            className={`flex items-center space-x-2 px-7 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${isFollowing
                                ? 'bg-[#1E1B3A] border border-purple-500/50 text-purple-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400'
                                : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-lg shadow-purple-500/20'
                                }`}
                        >
                            {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
                            <span>{isFollowing ? 'Following' : 'Follow'}</span>
                        </button>
                        <button className="flex items-center space-x-2 px-7 py-2.5 rounded-full bg-[#1E1B3A] border border-white/10 hover:border-purple-500/40 font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95">
                            <MessageSquare size={16} />
                            <span>Message</span>
                        </button>
                        <Link
                            to="/profile/edit"
                            className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#1E1B3A] border border-white/10 hover:border-purple-500/40 font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            <Edit2 size={16} />
                            <span>Edit Profile</span>
                        </Link>
                    </>
                )}
            </div>

            {/* Stats Row */}
            <div className="flex items-center space-x-4 w-full max-w-lg">
                <StatCard value={user.followers} label="Followers" />
                <StatCard value={user.following} label="Following" />
                <StatCard value={user.stories} label="Stories" />
            </div>
        </div>
    );
};

export default ProfileHeader;
