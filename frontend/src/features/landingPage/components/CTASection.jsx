import React from 'react';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-32 bg-[#0F0529] relative overflow-hidden px-6">
      
      {/* ── AURORA GRADIENT BACKGROUND ─────────────────────── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-violet-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] bg-violet-800/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="relative group overflow-hidden rounded-[60px] p-[1px] shadow-2xl shadow-violet-950/40">
          
          {/* Animated Border/Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/50 via-violet-500/30 to-violet-600/50 opacity-20 group-hover:opacity-40 transition-opacity duration-700" />

          {/* Main Card */}
          <div className="relative bg-[#0F0529]/90 backdrop-blur-3xl rounded-[59px] py-20 px-8 md:px-24 overflow-hidden border border-white/5">
            
            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
              style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />

            {/* Corner Shadow Boxes (Requested in dark purple shade) */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#050212]/40 border-r border-b border-white/5 shadow-inner" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#050212]/40 border-l border-b border-white/5 shadow-inner" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#050212]/40 border-r border-t border-white/5 shadow-inner" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#050212]/40 border-l border-t border-white/5 shadow-inner" />

            <div className="relative z-10 flex flex-col items-center">
              
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-10 transition-transform hover:scale-105 duration-500">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                <span className="text-[10px] font-black text-violet-300 uppercase tracking-[0.3em]">The Future of Community</span>
              </div>

              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.95] text-center max-w-4xl">
                Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-violet-300 to-violet-400 bg-300% animate-gradient">Meaningful</span> <br />
                Connections Begin.
              </h2>
              
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-14 font-medium leading-relaxed text-center">
                Join thousands of creators and communities building the next generation of social spaces. Your digital home is closer than you think.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto min-w-[220px] px-10 py-5 rounded-2xl bg-white text-[#0F0529] font-black text-lg hover:bg-gray-100 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3 group/btn"
                >
                  Get Started Free 
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                </Link>
                
                <Link
                  to="/login"
                  className="w-full sm:w-auto min-w-[220px] px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 group/btn2"
                >
                  <Zap size={18} className="text-violet-400 group-hover/btn2:fill-violet-400 transition-all" />
                  Sign In
                </Link>
              </div>


            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 300% 300%;
            animation: gradient 8s ease infinite;
          }
        `}
      </style>
    </section>
  );
}
