import React, { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';

const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(Math.floor(Math.random() * 100));

    const handleLike = (e) => {
        e.stopPropagation();
        setLiked(!liked);
        setLikes(prev => liked ? prev - 1 : prev + 1);
    };

    return (
        <div className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-[#130c2d] border border-white/5 cursor-pointer shadow-2xl">
            <img
                src={post.image.includes('placeholder') ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800' : post.image}
                alt=""
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <img src={post.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-white/20" />
                        <span className="text-sm font-bold tracking-wide text-white">{post.user}</span>
                    </div>
                    <span className="bg-[#8b31ff]/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-black tracking-wider text-white">
                        {post.timeLeft}
                    </span>
                </div>

                <div className="mt-auto">
                    <p className="text-base text-gray-100 font-medium leading-relaxed mb-4 opacity-90 group-hover:opacity-100 transition-opacity">
                        {post.caption}
                    </p>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 group/btn transition-colors ${liked ? 'text-red-500' : 'text-gray-300 hover:text-white'}`}
                        >
                            <Heart size={20} className={`${liked ? 'fill-current scale-110' : ''} transition-transform duration-300`} />
                            <span className="text-xs font-bold">{likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                            <MessageCircle size={20} />
                            <span className="text-xs font-bold">{Math.floor(Math.random() * 20)}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
