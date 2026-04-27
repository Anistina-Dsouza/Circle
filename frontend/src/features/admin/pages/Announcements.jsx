import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import axios from "axios";
import { Send, Clock, Eye, ChevronLeft, ChevronRight, Loader2, Radio, Bell, History, ArrowRight } from "lucide-react";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const baseUrl = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/announcements`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setAnnouncements(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    
    setSubmitting(true);
    try {
      const response = await axios.post(`${baseUrl}/api/announcements`, {
        title,
        message
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        setTitle("");
        setMessage("");
        // Instantly inject new announcement to the top
        setAnnouncements([response.data.data, ...announcements]);
      }
    } catch (err) {
      console.error("Failed to post announcement:", err);
      alert(err.response?.data?.message || "Failed to create announcement");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-xl">
                <Bell size={24} />
            </div>
            <div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none uppercase">
                    Broadcast Node
                </h1>
                <p className="text-white/40 mt-2 text-xs sm:text-sm font-black uppercase tracking-[0.2em]">
                    Synchronize Ecosystem Updates
                </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Announcement Form */}
            <div className="lg:col-span-5">
                <form onSubmit={handleSubmit} className="bg-[#1A0C3F]/50 backdrop-blur-xl rounded-[32px] p-8 sm:p-10 border border-white/10 shadow-2xl sticky top-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Radio size={20} className="text-purple-500 animate-pulse" />
                        <span className="text-lg font-black uppercase tracking-widest text-white">Live Uplink</span>
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3 font-black">
                        Signal Title
                        </label>
                        <input
                        type="text"
                        placeholder="System Maintenance..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={100}
                        id="announcement-title"
                        className="w-full bg-white/5 px-6 py-4 rounded-2xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white transition-all placeholder:text-white/10 font-bold"
                        required
                        />
                    </div>

                    {/* Message */}
                    <div className="mb-8">
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3 font-black">
                        Transmission Content
                        </label>
                        <textarea
                        rows="6"
                        placeholder="What's happening on Circle?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={500}
                        id="announcement-message"
                        className="w-full bg-white/5 px-6 py-4 rounded-2xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none text-white transition-all placeholder:text-white/10 font-medium"
                        required
                        />
                        <div className="flex justify-between items-center mt-3">
                            <span className="text-[9px] text-white/20 font-black uppercase tracking-widest italic">Encrypted Transmission</span>
                            <div className="text-[10px] text-purple-400 font-black tabular-nums">
                            {message.length}/500
                            </div>
                        </div>
                    </div>

                    {/* Button */}
                    <button 
                        type="submit" 
                        id="broadcast-btn"
                        disabled={submitting || !title.trim() || !message.trim()}
                        className="w-full bg-purple-600 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-purple-500 active:scale-[0.98] transition-all shadow-xl shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    >
                        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        {submitting ? 'TRANSMITTING...' : 'INITIATE BROADCAST'}
                    </button>

                    <p className="text-center text-white/20 text-[9px] mt-6 uppercase tracking-widest font-black leading-relaxed">
                        Signal will propagate to all system dashboards immediately.
                    </p>
                </form>
            </div>

            {/* Past Announcements */}
            <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-10">
                    <History size={20} className="text-white/20" />
                    <h2 className="text-xl font-black uppercase tracking-widest text-white/60">
                        Signal Archive
                    </h2>
                </div>

                <div className="space-y-6">
                    {loading ? (
                    <div className="flex flex-col items-center justify-center p-32 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Retrieving Archive...</span>
                    </div>
                    ) : announcements.length === 0 ? (
                    <div className="text-center p-20 text-white/20 border border-white/5 rounded-[32px] bg-white/[0.02] font-black uppercase tracking-[0.2em] italic">
                        No historical signals recorded.
                    </div>
                    ) : announcements.map((a) => (
                    <div
                        key={a._id}
                        className="bg-[#1A0C3F]/30 p-8 sm:p-10 rounded-[32px] border border-white/5 hover:border-purple-500/30 transition-all duration-500 group relative overflow-hidden"
                    >
                        {/* Status bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500/20 group-hover:bg-purple-500 transition-colors" />

                        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                        <h3 className="text-xl font-black tracking-tight text-white group-hover:text-purple-300 transition-colors">
                            {a.title}
                        </h3>
                        <span className="text-[9px] bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-white/40 font-black tracking-[0.2em] uppercase">
                            VERIFIED
                        </span>
                        </div>

                        <p className="text-white/60 leading-relaxed break-words whitespace-pre-wrap text-sm sm:text-base font-medium">
                        {a.message}
                        </p>

                        <div className="flex flex-wrap gap-6 text-[10px] text-white/20 mt-8 font-black uppercase tracking-widest border-t border-white/5 pt-6">
                        <div className="flex items-center gap-2" title="Broadcast Date">
                            <Clock size={14} className="text-purple-500/50" />
                            {new Date(a.createdAt).toLocaleDateString()} @ {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {a.reach !== undefined && a.reach !== null && (
                            <div className="flex items-center gap-2" title="Impressions tracked">
                            <Eye size={14} className="text-purple-500/50" />
                            {a.reach >= 1000 ? `${(a.reach / 1000).toFixed(1)}K` : a.reach} Reach
                            </div>
                        )}
                        <button className="ml-auto flex items-center gap-1.5 text-purple-400 hover:text-white transition-colors group/link">
                            <span>DETAILS</span>
                            <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                        </button>
                        </div>
                    </div>
                    ))}
                </div>

                {/* Pagination */}
                {announcements.length > 0 && (
                    <div className="flex justify-center items-center gap-3 mt-16">
                        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-purple-600 transition-all text-white/40 hover:text-white border border-white/5 shadow-xl">
                        <ChevronLeft size={20} />
                        </button>

                        {[1, 2, 3].map((p) => (
                        <button
                            key={p}
                            className={`w-12 h-12 rounded-2xl text-xs font-black transition-all border ${
                            p === 1
                                ? "bg-purple-600 text-white border-purple-500 shadow-xl shadow-purple-900/20"
                                : "bg-white/5 text-white/20 hover:bg-white/10 border-white/5"
                            }`}
                        >
                            0{p}
                        </button>
                        ))}

                        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-purple-600 transition-all text-white/40 hover:text-white border border-white/5 shadow-xl">
                        <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}
