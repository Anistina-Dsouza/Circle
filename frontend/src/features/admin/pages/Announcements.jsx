import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import axios from "axios";
import { Send, Clock, Eye, ChevronLeft, ChevronRight, Loader2, Megaphone, Radio } from "lucide-react";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const baseUrl = import.meta.env.VITE_API_URL || '';
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

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

  // Pagination Logic
  const totalPages = Math.ceil(announcements.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAnnouncements = announcements.slice(indexOfFirstItem, indexOfLastItem);

  const Pagination = ({ className = "" }) => {
    if (totalPages <= 1) return null;
    return (
      <div className={`flex justify-center items-center gap-3 ${className}`}>
        <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/20 hover:text-white hover:bg-purple-600 hover:border-purple-500 transition-all shadow-xl disabled:opacity-10"
        >
            <ChevronLeft size={18} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-10 h-10 rounded-2xl text-[10px] font-black transition-all border ${
                    p === currentPage
                        ? "bg-purple-600 text-white border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                        : "bg-white/5 text-white/20 border-white/10 hover:text-white hover:bg-white/10"
                }`}
            >
                {p}
            </button>
        ))}

        <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/20 hover:text-white hover:bg-purple-600 hover:border-purple-500 transition-all shadow-xl disabled:opacity-10"
        >
            <ChevronRight size={18} />
        </button>
      </div>
    );
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
      <div className="max-w-4xl mx-auto px-2">

        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
             <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Megaphone size={24} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400/60">Announcements</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Broadcast System
          </h1>
          <p className="text-white/40 mt-3 text-sm sm:text-base font-black uppercase tracking-widest max-w-xl">
            Broadcast important updates to the entire Circle ecosystem.
          </p>
        </div>

        {/* Announcement Form */}
        <form onSubmit={handleSubmit} className="bg-[#1A0C3F]/50 backdrop-blur-xl rounded-[32px] p-8 sm:p-12 border border-white/10 shadow-2xl relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="flex items-center gap-4 mb-10 justify-center sm:justify-start">
            <div className="w-8 h-8 bg-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20 group-hover:rotate-12 transition-transform duration-500">
                <Radio size={16} className="text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">New Announcement</span>
          </div>

          {/* Title */}
          <div className="mb-8">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4 font-black">
              Title
            </label>
            <input
              type="text"
              placeholder="E.g. System Maintenance Update"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              id="announcement-title"
              className="w-full bg-white/5 px-6 py-5 rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white transition-all placeholder:text-white/10 font-bold"
              required
            />
          </div>

          {/* Message */}
          <div className="mb-10">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4 font-black">
              Message
            </label>
            <textarea
              rows="6"
              placeholder="What's happening on Circle?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              id="announcement-message"
              className="w-full bg-white/5 px-6 py-5 rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none text-white transition-all placeholder:text-white/10 font-medium leading-relaxed"
              required
            />
            <div className="text-right text-[9px] text-white/20 mt-3 font-black uppercase tracking-widest">
              {message.length} <span className="opacity-50">/ 500 characters</span>
            </div>
          </div>

          {/* Button */}
          <button 
            type="submit" 
            id="broadcast-btn"
            disabled={submitting || !title.trim() || !message.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] text-white flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-purple-500/40 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-purple-900/20"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {submitting ? 'Sending...' : 'Send Announcement'}
          </button>

          <p className="text-center text-white/10 text-[9px] mt-6 font-black uppercase tracking-[0.3em] italic">
            Broadcasted to all users immediately.
          </p>

        </form>

        {/* Past Announcements */}
        <div className="mt-20">

          <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-6 border-b border-white/5 pb-8">
            <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Previous Announcements
                </h2>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest italic">History of platform updates</p>
            </div>
            <span className="text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer hover:text-white transition-all bg-white/5 px-6 py-2 rounded-full border border-white/5">
            View All
            </span>
          </div>

          {/* Top Pagination */}
          {!loading && <Pagination className="mb-10" />}

          <div className="space-y-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Loading...</span>
              </div>
            ) : currentAnnouncements.length === 0 ? (
              <div className="text-center p-20 text-white/20 border border-white/5 rounded-[32px] bg-white/[0.02] font-black uppercase tracking-[0.3em] italic text-sm">
                No announcements found.
              </div>
            ) : currentAnnouncements.map((a) => (
              <div
                key={a._id}
                className="bg-[#1A0C3F]/50 backdrop-blur-xl p-8 sm:p-10 rounded-[32px] border border-white/10 hover:border-purple-500/20 transition-all duration-500 relative group"
              >
                <div className="absolute left-0 top-1/4 w-1 h-0 bg-purple-500 group-hover:h-1/2 transition-all duration-500 rounded-r-full" />

                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                  <h3 className="text-xl font-black text-white tracking-tight group-hover:text-purple-300 transition-colors">
                    {a.title}
                  </h3>
                  <span className="text-[9px] bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-white/40 font-black tracking-widest uppercase group-hover:border-purple-500/30 group-hover:text-purple-400 transition-all">
                    Broadcasted
                  </span>
                </div>

                <p className="text-white/60 leading-relaxed max-w-4xl break-words whitespace-pre-wrap text-sm sm:text-base font-medium">
                  {a.message}
                </p>

                <div className="flex flex-wrap gap-6 sm:gap-10 text-[10px] text-white/20 mt-8 font-black uppercase tracking-widest border-t border-white/5 pt-8">
                  <div className="flex items-center gap-3" title="Broadcast Date">
                    <Clock size={14} className="text-purple-500/50" />
                    <span>{new Date(a.createdAt).toLocaleString()}</span>
                  </div>
                  {a.reach !== undefined && a.reach !== null && (
                    <div className="flex items-center gap-3" title="Reach">
                      <Eye size={14} className="text-purple-500/50" />
                      <span>{a.reach >= 1000 ? `${(a.reach / 1000).toFixed(1)}K` : a.reach} Reach</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Pagination className="mt-16" />

        </div>

      </div>
    </AdminLayout>
  );
}
