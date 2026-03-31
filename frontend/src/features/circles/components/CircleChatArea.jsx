import React, { useRef } from 'react';
import { Send, Smile, Plus } from 'lucide-react';

/* ── placeholder messages until real chat is wired ── */
const PLACEHOLDER_MSGS = [
    {
        id: 1,
        name: 'Jordan Smith',
        time: '10:42 AM',
        text: "Hey everyone! Has anyone checked out the new Figma updates? The auto-layout properties are a complete game changer for component libraries 🚀",
        reactions: [{ icon: '🔥', count: 4 }, { icon: '💯', count: 2 }],
        avatar: 'https://i.pravatar.cc/40?img=3',
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
    },
    {
        id: 3,
        name: 'Marcus Lee',
        time: '11:24 AM',
        text: "Can someone record the voice hangout later? I have a client call at the same time.",
        reactions: [],
        avatar: 'https://i.pravatar.cc/40?img=8',
    },
];

/* ── single message bubble ──────────────────────────── */
const ChatMessage = ({ msg }) => (
    <div className="flex gap-3.5">
        <img
            src={msg.avatar}
            alt={msg.name}
            className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
        />
        <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-semibold text-white">{msg.name}</span>
                <span className="text-[11px] text-gray-600">{msg.time}</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{msg.text}</p>

            {msg.image && (
                <div className="mt-3 rounded-2xl overflow-hidden max-w-xs border border-white/5">
                    <img src={msg.image} alt="" className="w-full object-cover" />
                    {msg.imageCaption && (
                        <p className="text-xs text-gray-500 px-3 py-2">{msg.imageCaption}</p>
                    )}
                </div>
            )}

            {msg.reactions?.length > 0 && (
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {msg.reactions.map((r, i) => (
                        <button
                            key={i}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs hover:bg-violet-500/15 hover:border-violet-500/30 transition-all"
                        >
                            <span>{r.icon}</span>
                            <span className="text-gray-400 font-medium">{r.count}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    </div>
);

/* ── main component ──────────────────────────────────── */
const CircleChatArea = ({ messageInput, setMessageInput }) => {
    const endRef = useRef(null);

    return (
        <div
            className="flex-1 flex flex-col rounded-3xl border border-[#2A1550] overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #12082A 0%, #1A0D40 100%)', minHeight: '520px' }}
        >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {PLACEHOLDER_MSGS.map(msg => (
                    <ChatMessage key={msg.id} msg={msg} />
                ))}
                <div ref={endRef} />
            </div>

            {/* Input bar */}
            <div className="border-t border-[#2A1550] px-5 py-4">
                <div className="flex items-center gap-3 bg-[#0F0529]/60 border border-[#2A1550] rounded-2xl px-4 py-3">
                    <button className="text-gray-500 hover:text-gray-300 transition-colors shrink-0">
                        <Plus size={18} />
                    </button>
                    <input
                        type="text"
                        value={messageInput}
                        onChange={e => setMessageInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') setMessageInput(''); }}
                        placeholder="Message the circle…"
                        className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
                    />
                    <button className="text-gray-500 hover:text-gray-300 transition-colors shrink-0">
                        <Smile size={18} />
                    </button>
                    <button
                        disabled={!messageInput.trim()}
                        onClick={() => setMessageInput('')}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white disabled:opacity-40 hover:from-violet-500 hover:to-fuchsia-500 transition-all shrink-0"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CircleChatArea;
