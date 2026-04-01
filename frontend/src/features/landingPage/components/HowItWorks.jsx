import React from 'react';
import { Search, UserPlus, MessageCircle, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    icon: <Search className="w-6 h-6 text-violet-400" />,
    title: "Explore Circles",
    desc: "Discover public communities or get invited to private ones that match your interests."
  },
  {
    icon: <UserPlus className="w-6 h-6 text-fuchsia-400" />,
    title: "Join the Tribe",
    desc: "Introduce yourself to the members and join a space where you truly belong."
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-sky-400" />,
    title: "Start Circling",
    desc: "Engage in meaningful chats, share stories, and grow together with your people."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-[#0F0529] relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-fuchsia-600/10 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Getting Started is <span className="text-violet-400">Simple</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
            Three steps to finding your digital home. No complex onboarding, just pure connection.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-gradient-to-r from-violet-500/0 via-violet-500/30 to-violet-500/0" />

          {STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="relative mb-8">
                {/* Number badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0F0529] z-20">
                  {i + 1}
                </div>
                
                {/* Icon Container */}
                <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl group-hover:border-violet-500/40 group-hover:bg-violet-500/5 transition-all duration-500 relative z-10">
                  {step.icon}
                </div>

                {/* Pulsing ring on hover */}
                <div className="absolute inset-0 rounded-3xl bg-violet-500/20 scale-0 group-hover:scale-110 transition-transform duration-500 -z-0 opacity-0 group-hover:opacity-100 blur-xl" />
              </div>

              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-violet-300 transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm max-w-[240px]">
                {step.desc}
              </p>

              {i < STEPS.length - 1 && (
                <ArrowRight className="md:hidden mt-8 text-violet-500/40 animate-bounce" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}