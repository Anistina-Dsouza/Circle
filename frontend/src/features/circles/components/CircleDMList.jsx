import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const DEFAULT_AVATAR = 'https://i.pinimg.com/736x/24/de/64/24de6482109345ed57693bcd21b42927.jpg';

const getMemberName  = (u = {}) => u.displayName || u.username || 'Member';
const getMemberPic   = (u = {}) => u.profilePic || DEFAULT_AVATAR;
const getMemberOnline = (u = {}) => u.onlineStatus?.status === 'online';

const CircleDMList = ({ members = [] }) => {
    const navigate = useNavigate();

    if (members.length === 0) return null;

    return (
        <aside className="w-52 shrink-0 flex flex-col gap-1 sticky top-24 self-start">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">
                Members
            </p>

            {members.slice(0, 8).map((m) => {
                const u      = m.user || {};
                const name   = getMemberName(u);
                const pic    = getMemberPic(u);
                const online = getMemberOnline(u);
                const uname  = u.username;

                return (
                    <div key={m._id || u._id} className="flex items-center gap-2.5 px-2 py-2 rounded-xl group hover:bg-white/5 transition-all">
                        {/* Avatar → profile */}
                        <Link to={`/profile/${uname}`} className="relative shrink-0">
                            <img
                                src={pic}
                                alt={name}
                                className="w-7 h-7 rounded-full object-cover"
                            />
                            <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0F0529] ${online ? 'bg-green-400' : 'bg-gray-700'}`} />
                        </Link>

                        {/* Name → profile */}
                        <Link
                            to={`/profile/${uname}`}
                            className="flex-1 min-w-0 text-sm font-medium text-gray-400 group-hover:text-white transition-colors truncate"
                        >
                            {name}
                        </Link>

                        {/* DM icon → messages */}
                        <button
                            onClick={() => navigate(`/messages?user=${uname}`)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all shrink-0"
                            title={`Message ${name}`}
                        >
                            <MessageCircle size={13} />
                        </button>
                    </div>
                );
            })}
        </aside>
    );
};

export default CircleDMList;
