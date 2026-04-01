import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, Globe, Lock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function TrendingCommunities() {
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/circles?limit=3`);
        if (res.data.success) {
          setCircles(res.data.circles);
        }
      } catch (err) {
        console.error('Failed to fetch trending circles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, [baseUrl]);

  return (
    <section className="py-24 bg-[#0F0529] relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl text-left">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 font-black">Circles</span>
            </h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              Real places. Real people. Discover where you truly belong.
            </p>
          </div>
          
          <Link 
            to="/circles" 
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-violet-300 font-bold hover:bg-violet-500/10 hover:text-violet-200 transition-all group shadow-xl"
          >
            Explore All 
            <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-violet-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium tracking-wide">Fetching circles...</p>
          </div>
        ) : circles.length === 0 ? (
          <div className="rounded-[40px] border border-dashed border-white/10 bg-white/2 py-24 text-center">
            <p className="text-gray-500 text-lg italic">No trending circles yet. Start one today!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {circles.map((c, i) => (
              <div 
                key={c._id || i}
                className="group relative rounded-[32px] overflow-hidden border border-white/5 bg-[#120B2F]/40 backdrop-blur-3xl hover:border-violet-500/30 transition-all duration-700 flex flex-col shadow-2xl shadow-black/60 hover:-translate-y-2"
              >
                {/* Decorative overlay for "premium" feel */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Image Section */}
                <div className="relative h-60 overflow-hidden">
                  <img 
                    src={c.coverImage?.startsWith('http') ? c.coverImage : `https://images.unsplash.com/photo-1557682260-96773eb01377?q=80&w=1000`} 
                    alt={c.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120B2F] via-transparent to-transparent opacity-90" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-5 left-5 px-3.5 py-1.5 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] leading-none">
                      {c.category || 'Discovery'}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 pt-6 flex flex-col flex-1 relative">
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-violet-300 transition-colors">
                    {c.name}
                  </h3>
                  
                  <div className="flex items-center gap-5 text-sm text-gray-500 mb-8">
                    <span className="flex items-center gap-2">
                      <Users size={15} className="text-violet-500/60" />
                      <span className="font-bold text-gray-300">{c.stats?.memberCount || 0}</span> members
                    </span>
                    <span className="flex items-center gap-2">
                      <Globe size={15} className="text-sky-500/60" />
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Public</span>
                    </span>
                  </div>

                  <Link
                    to={`/circles/${c.slug}/join`}
                    className="mt-auto w-full py-4 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-white font-extrabold text-sm text-center hover:bg-violet-600 hover:border-violet-400 transition-all shadow-xl group-hover:shadow-violet-600/20 active:scale-[0.98]"
                  >
                    Join the Circle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

