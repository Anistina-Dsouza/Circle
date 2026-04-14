import React, { useRef, useEffect } from 'react';
import { Send, Smile, Plus, MoreVertical, Heart, Reply } from 'lucide-react';

/* ── placeholder messages ── */
const PLACEHOLDER_MSGS = [
    {
        id: 1,
        name: 'Jordan Smith',
        time: '10:42 AM',
        text: "Hey everyone! Has anyone checked out the new Figma updates? The auto-layout properties are a complete game changer for component libraries 🚀",
        reactions: [{ icon: '🔥', count: 4 }, { icon: '💯', count: 2 }],
        avatar: 'https://i.pravatar.cc/40?img=3',
        isMe: false,
        date: 'Today',
    },
    {
        id: 2,
        name: 'Elena Rodriguez',
        time: '11:06 AM',
        text: "I was just playing with them! The 'wrap' feature is exactly what we needed for the grid systems in our current project.",
        reactions: [],
        avatar: 'https://i.pravatar.cc/40?img=5',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=60',
        imageCaption: "Here's what our grid looks like now 👆",
        isMe: true, // User message
        date: 'Today',
    },
    {
        id: 3,
        name: 'Marcus Lee',
        time: '11:24 AM',
        text: "Can someone record the voice hangout later? I have a client call at the same time.",
        reactions: [],
        avatar: 'https://i.pravatar.cc/40?img=8',
        isMe: false,
        date: 'Today',
    },
];

/* ── date separator ── */
const DateDivider = ({ date }) => (
    <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span className="text-[10px] font-bold text-gray-500 tracking-wide px-4 py-1 rounded-full bg-white/5 border border-white/5">
            {date}
        </span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/10 to-transparent" />
    </div>
);

/* ── single message bubble ──────────────────────────── */
const ChatMessage = ({ msg }) => {
    const isMe = msg.isMe;

    return (
        <div className={`flex gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-300 ${isMe ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            {!isMe && (
                <div className="shrink-0 pt-1">
                    <img
                        src={msg.avatar}
                        alt={msg.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white/5"
                    />
                </div>
            )}

            <div className={`flex flex-col max-w-[85%] ${isMe ? 'items-end' : 'items-start'}`}>
                {/* Name and time */}
                <div className={`flex items-baseline gap-2 mb-1.5 px-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-[11px] font-bold tracking-wide ${isMe ? 'text-violet-300' : 'text-gray-400'}`}>
                        {isMe ? 'You' : msg.name}
                    </span>
                    <span className="text-[10px] text-gray-600 font-medium">{msg.time}</span>
                </div>

                {/* Bubble Container */}
                <div className={`relative px-4 py-2.5 rounded-2xl border transition-all duration-300 group shadow-sm ${
                    isMe
                        ? 'bg-violet-600/30 border-violet-500/40 rounded-tr-none shadow-violet-900/10'
                        : 'bg-[#1a1138]/60 border-white/5 backdrop-blur-md rounded-tl-none shadow-black/20'
                }`}>
                    <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap selection:bg-violet-500/40">
                        {msg.text}
                    </p>

                    {/* Image Attachment */}
                    {msg.image && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-white/5 shadow-lg group/img">
                            <div className="relative overflow-hidden">
                                <img
                                    src={msg.image}
                                    alt=""
                                    className="w-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                            </div>
                            {msg.imageCaption && (
                                <p className="text-[10px] text-gray-500 bg-black/20 px-3 py-2 italic">
                                    {msg.imageCaption}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Hover Actions Bar - Refined (Bottom Left) */}
                    <div className={`absolute -bottom-3 left-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-0.5 p-1 bg-[#12082A] border border-white/10 rounded-full shadow-2xl backdrop-blur-xl z-20 pointer-events-none group-hover:pointer-events-auto`}>
                        <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all" title="Reply"><Reply size={11} /></button>
                        <button className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-white/10 rounded-full transition-all" title="React"><Heart size={11} /></button>
                        <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all" title="More"><MoreVertical size={11} /></button>
                    </div>
                </div>

                {/* Reactions */}
                {msg.reactions?.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {msg.reactions.map((r, i) => (
                            <button
                                key={i}
                                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[11px] hover:bg-violet-500/20 hover:border-violet-500/20 transition-all"
                            >
                                <span>{r.icon}</span>
                                <span className="text-gray-400 font-bold">{r.count}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ── main component ──────────────────────────────────── */
const CircleChatArea = ({ messageInput, setMessageInput }) => {
    const endRef = useRef(null);

    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, []);

    return (
        <div
            className="flex-1 flex flex-col rounded-3xl border border-[#2A1550] overflow-hidden shadow-2xl relative"
            style={{
                background: 'linear-gradient(160deg, #12082A 0%, #1A0D40 100%)',
                minHeight: '520px'
            }}
        >
            {/* Chat header area (optional, could show "Community Chat" or something) */}
            <div className="px-6 py-3 border-b border-white/5 bg-white/2 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-gray-300 tracking-wide">Live Chat</span>
                </div>
                <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-[#12082A] bg-gray-800" />
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-[#12082A] bg-violet-600 flex items-center justify-center text-[10px] font-bold text-white">
                        +12
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 no-scrollbar scroll-smooth">
                <DateDivider date="Today" />

                {PLACEHOLDER_MSGS.map(msg => (
                    <ChatMessage key={msg.id} msg={msg} />
                ))}

                <div ref={endRef} className="h-4" />
            </div>

            {/* Input bar */}
            <div className="p-6 bg-gradient-to-t from-[#12082A] to-transparent">
                <div className="flex items-center gap-3 bg-[#0F0529]/80 border border-[#2A1550] rounded-2xl px-4 py-2 hover:border-violet-500/30 transition-all group/input focus-within:ring-2 focus-within:ring-violet-500/20 shadow-inner backdrop-blur-md">
                    <button className="p-2 text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-xl transition-all shrink-0">
                        <Plus size={20} />
                    </button>

                    <input
                        type="text"
                        value={messageInput}
                        onChange={e => setMessageInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && messageInput.trim()) { setMessageInput(''); } }}
                        placeholder="Share something with the circle..."
                        className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none py-2"
                    />

                    <div className="flex items-center gap-1 shrink-0">
                        <button className="p-2 text-gray-500 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 rounded-xl transition-all">
                            <Smile size={20} />
                        </button>

                        <button
                            disabled={!messageInput.trim()}
                            onClick={() => { if (messageInput.trim()) setMessageInput(''); }}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-violet-900/40 disabled:opacity-30 disabled:grayscale hover:scale-105 active:scale-95 transition-all"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CircleChatArea;
