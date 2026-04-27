import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import axios from 'axios';
import CreateStoryModal from '../../feed/components/CreateStoryModal';

const DEFAULT_AVATAR = 'https://i.pinimg.com/736x/24/de/64/24de6482109345ed57693bcd21b42927.jpg';

/* ── single story bubble ─────────────────────────────── */
const StoryBubble = ({ name, avatar, username, isAdd = false, onClick }) => {
    const bubble = (
        <div
            onClick={onClick}
            className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
        >
            <div className={`w-14 h-14 rounded-full transition-all duration-300 group-hover:scale-105 ${
                isAdd
                    ? 'border-2 border-dashed border-violet-500/50 group-hover:border-violet-400 bg-violet-600/10 flex items-center justify-center'
                    : 'p-[2px] bg-gradient-to-br from-violet-500 to-fuchsia-600 group-hover:from-violet-400 group-hover:to-pink-500 shadow-lg shadow-violet-900/30'
            }`}>
                {isAdd ? (
                    <Plus size={20} className="text-violet-400 group-hover:text-violet-300 transition-colors" />
                ) : (
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#0F0529]">
                        <img
                            src={avatar || DEFAULT_AVATAR}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                )}
            </div>
            <span className="text-[10px] text-gray-400 group-hover:text-white transition-colors truncate max-w-[56px] text-center font-medium">
                {isAdd ? 'Your Story' : name?.split(' ')[0]}
            </span>
        </div>
    );

    // Add button: click handler, no navigation
    if (isAdd || !username) return bubble;

    // Story bubble: navigate to story viewer
    return <Link to={`/stories/${username}`}>{bubble}</Link>;
};

/* ── loading skeleton ─────────────────────────────────── */
const StorySkeleton = () => (
    <div className="flex items-center gap-4">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col items-center gap-1.5 animate-pulse">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10" />
                <div className="h-2 w-10 bg-white/5 rounded" />
            </div>
        ))}
    </div>
);

/* ── main component ───────────────────────────────────── */
const CircleStoriesBar = ({ circleMemberIds = [], onPostSuccess }) => {
    const [stories, setStories]       = useState([]);
    const [loading, setLoading]       = useState(true);
    const [storyModalOpen, setStoryModalOpen] = useState(false);

    const baseUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (circleMemberIds.length === 0) {
            setLoading(false);
            return;
        }

        const fetchCircleStories = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.post(`${baseUrl}/api/moments/members`, 
                    { userIds: circleMemberIds },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (res.data.success) {
                    setStories(res.data.moments.map(m => ({
                        id: m.user?._id,
                        name: m.user?.displayName || m.user?.username,
                        username: m.user?.username,
                        avatar: m.user?.profilePic || DEFAULT_AVATAR,
                    })));
                }
            } catch (err) {
                console.error('Circle stories fetch failed:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCircleStories();
    }, [baseUrl, circleMemberIds.join(',')]);

    const handleModalClose = () => {
        setStoryModalOpen(false);
        onPostSuccess?.();
    };

    return (
        <>
            <div className="flex items-center gap-4 px-1 overflow-x-auto no-scrollbar pb-1">
                {/* Add story */}
                <StoryBubble isAdd onClick={() => setStoryModalOpen(true)} />

                {loading ? (
                    <StorySkeleton />
                ) : stories.length === 0 ? (
                    <p className="text-xs text-gray-600 italic ml-2">
                        No stories from circle members yet
                    </p>
                ) : (
                    stories.map(s => (
                        <StoryBubble
                            key={s.id}
                            name={s.name}
                            avatar={s.avatar}
                            username={s.username}
                        />
                    ))
                )}
            </div>

            {storyModalOpen && (
                <CreateStoryModal isOpen={storyModalOpen} onClose={handleModalClose} />
            )}
        </>
    );
};

export default CircleStoriesBar;
