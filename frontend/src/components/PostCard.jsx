import React from 'react';

const PostCard = ({ post }) => {
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
                <p className="text-base text-gray-100 font-medium leading-relaxed mb-2 opacity-90 group-hover:opacity-100 transition-opacity">
                    {post.caption}
                </p>
            </div>
        </div>
    );
};

export default PostCard;
