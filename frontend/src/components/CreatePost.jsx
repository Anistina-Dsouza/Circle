import React, { useState } from 'react';
import { Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

const CreatePost = ({ onPost }) => {
    const [content, setContent] = useState('');

    const handleSubmit = () => {
        if (!content.trim()) return;
        onPost({
            id: Date.now(),
            user: 'Alex', // Current user
            avatar: 'https://i.pravatar.cc/150?u=alex',
            timeLeft: 'JUST NOW',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe', // Mock image
            caption: content,
        });
        setContent('');
    };

    return (
        <div className="px-10 mb-10">
            <div className="bg-[#130c2d] p-5 rounded-[2.5rem] flex items-center gap-5 border border-white/5">
                <img src="https://i.pravatar.cc/150?u=alex" alt="" className="w-12 h-12 rounded-full" />
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share a moment with your circles..."
                    className="bg-transparent flex-grow outline-none text-base text-gray-300 placeholder:text-gray-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <div className="flex items-center gap-4">
                    <ImageIcon size={22} className="text-gray-400 cursor-pointer hover:text-white transition-colors" />
                    <VideoIcon size={22} className="text-gray-400 cursor-pointer hover:text-white transition-colors" />
                    <button
                        onClick={handleSubmit}
                        className="bg-[#8b31ff] px-8 py-3 rounded-2xl text-sm font-black tracking-widest hover:bg-[#7c28eb] transition-all transform active:scale-95 shadow-lg shadow-purple-500/20"
                    >
                        POST
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
