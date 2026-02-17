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
        <div className="px-6 md:px-10 mb-8 md:mb-10">
            <div className="bg-[#130c2d] p-3 md:p-5 rounded-2xl md:rounded-[2.5rem] flex items-center gap-3 md:gap-5 border border-white/5">
                <img src="https://i.pravatar.cc/150?u=alex" alt="" className="w-8 h-8 md:w-12 md:h-12 rounded-full hidden xs:block" />
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share a moment..."
                    className="bg-transparent flex-grow outline-none text-sm md:text-base text-gray-300 placeholder:text-gray-500 min-w-0"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <div className="flex items-center gap-3 md:gap-4 shrink-0">
                    <ImageIcon size={20} className="text-gray-400 cursor-pointer hover:text-white transition-colors hidden sm:block" />
                    <button
                        onClick={handleSubmit}
                        className="bg-[#8b31ff] px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl text-[12px] md:text-sm font-black tracking-widest hover:bg-[#7c28eb] transition-all transform active:scale-95 shadow-lg shadow-purple-500/20"
                    >
                        POST
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
