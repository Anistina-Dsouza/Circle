import React from 'react';
import { MessageSquare, Users, Shield, Zap, Heart, Globe } from 'lucide-react';

const FEATURES = [
  {
    icon: <MessageSquare className="w-6 h-6 text-violet-400" />,
    title: "Vibrant Messaging",
    desc: "Real-time communication with rich media, reactions, and a crystal-clear, glassmorphic interface."
  },
  {
    icon: <Users className="w-6 h-6 text-fuchsia-400" />,
    title: "Private Circles",
    desc: "Create exclusive spaces for your closest friends or team with full control over privacy and invites."
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    title: "Instant Connection",
    desc: "Find and join communities instantly. No clutter, no noise—just pure, meaningful connections."
  },
  {
    icon: <Shield className="w-6 h-6 text-emerald-400" />,
    title: "Safe & Secure",
    desc: "Powerful moderation tools and end-to-end focus on user safety and digital well-being."
  },
  {
    icon: <Heart className="w-6 h-6 text-rose-400" />,
    title: "Member Focused",
    desc: "Designed for people, not algorithms. Your feed is yours, curated by the circles you choose."
  },
  {
    icon: <Globe className="w-6 h-6 text-sky-400" />,
    title: "Global Reach",
    desc: "Connect with like-minded individuals from around the world across any category or interest."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#0F0529]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Human Connection</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Circle brings back what social spaces used to be. Meaningful, calm, and entirely yours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div 
              key={i}
              className="group p-8 rounded-3xl border border-white/5 bg-white/2 backdrop-blur-xl hover:bg-white/5 hover:border-violet-500/20 transition-all duration-300 shadow-lg shadow-black/20"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-violet-500/10 transition-all duration-300">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">
                {f.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm group-hover:text-gray-400 transition-colors">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
