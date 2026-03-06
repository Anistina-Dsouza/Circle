import React from 'react';
import { UserPlus, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserCard = ({ user, currentUserFollowing = [], onFollowToggle }) => {
    // Check if the current user is following this specific user
    const isFollowing = currentUserFollowing.some(f => {
        const followedUser = f.following || f;
        return (followedUser._id || followedUser).toString() === user._id.toString();
    });

    return (
        <div className="bg-[#1E1B3A] border border-white/5 rounded-3xl p-6 hover:border-purple-500/30 transition-all duration-300 group">
            <div className="flex flex-col items-center text-center">
                <Link to={`/profile/${user.username}`} className="relative mb-4 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-purple-600 to-pink-500 shadow-xl shadow-purple-500/20">
                        <img
                            src={user.profilePic || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'}
                            alt={user.username}
                            className="w-full h-full rounded-full object-cover border-4 border-[#1E1B3A]"
                        />
                    </div>
                </Link>

                <Link to={`/profile/${user.username}`}>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                        {user.displayName || user.username}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">@{user.username}</p>
                </Link>

                <div className="flex items-center justify-center space-x-6 w-full mb-6 py-3 border-y border-white/5">
                    <div className="text-center">
                        <p className="text-white font-bold text-sm tracking-tight">{user.stats?.followerCount || 0}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Followers</p>
                    </div>
                    <div className="text-center">
                        <p className="text-white font-bold text-sm tracking-tight">{user.stats?.followingCount || 0}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Following</p>
                    </div>
                </div>

                <button
                    onClick={() => onFollowToggle(user._id, isFollowing)}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-300 ${isFollowing
                            ? 'bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-400/50'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20'
                        }`}
                >
                    {isFollowing ? (
                        <>
                            <UserCheck size={16} />
                            <span>Following</span>
                        </>
                    ) : (
                        <>
                            <UserPlus size={16} />
                            <span>Follow</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default UserCard;
