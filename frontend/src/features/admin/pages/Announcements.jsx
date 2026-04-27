import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import axios from "axios";
import { Send, Clock, Eye, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

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
      <div className="max-w-4xl mx-auto px-0 sm:px-4">

        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Platform Announcements
          </h1>
          <p className="text-purple-300 mt-2 text-sm sm:text-base">
            Broadcast important updates to the entire Circle ecosystem.
          </p>
        </div>

        {/* Announcement Form */}
        <form onSubmit={handleSubmit} className="bg-[#240046]/40 backdrop-blur-sm rounded-3xl p-6 sm:p-10 border border-purple-900/40 shadow-xl">

          <div className="flex items-center gap-3 mb-8 justify-center sm:justify-start">
            <div className="w-6 h-6 bg-purple-500 rounded-full shadow-lg shadow-purple-500/20"></div>
            <span className="text-xl font-semibold tracking-tight">Circle</span>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-widest text-purple-400 mb-3 font-semibold">
              Announcement Title
            </label>
            <input
              type="text"
              placeholder="E.g. System Maintenance Update"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              id="announcement-title"
              className="w-full bg-[#1a0033]/60 px-6 py-4 rounded-xl border border-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all"
              required
            />
          </div>

          {/* Message */}
          <div className="mb-8">
            <label className="block text-xs uppercase tracking-widest text-purple-400 mb-3 font-semibold">
              Broadcast Message
            </label>
            <textarea
              rows="5"
              placeholder="What's happening on Circle?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              id="announcement-message"
              className="w-full bg-[#1a0033]/60 px-6 py-4 rounded-xl border border-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-white transition-all"
              required
            />
            <div className="text-right text-[10px] text-purple-500 mt-2 font-medium">
              {message.length}/500 characters
            </div>
          </div>

          {/* Button */}
          <button 
            type="submit" 
            id="broadcast-btn"
            disabled={submitting || !title.trim() || !message.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-purple-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {submitting ? 'Broadcasting...' : 'Send Announcement'}
          </button>

          <p className="text-center text-purple-500 text-[10px] mt-4 uppercase tracking-tighter">
            This action will natively broadcast to the system dashboard immediately.
          </p>

        </form>

        {/* Past Announcements */}
        <div className="mt-16">

          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Past Announcements
            </h2>
            <span className="text-purple-400 text-sm cursor-pointer hover:text-purple-300 transition-colors font-medium">
              View All Archive
            </span>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center p-10 text-purple-500">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center p-10 text-purple-400 border border-purple-900/40 rounded-2xl bg-[#240046]/30">
                No announcements have been broadcasted yet.
              </div>
            ) : announcements.map((a) => (
              <div
                key={a._id}
                className="bg-[#240046]/40 p-6 sm:p-8 rounded-2xl border border-purple-900/40 hover:bg-[#240046]/60 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                  <h3 className="text-lg font-bold tracking-tight">
                    {a.title}
                  </h3>
                  <span className="text-[10px] bg-purple-900/60 px-3 py-1 rounded-full text-purple-300 font-bold tracking-widest">
                    BROADCASTED
                  </span>
                </div>

                <p className="text-purple-200/80 leading-relaxed max-w-4xl break-words whitespace-pre-wrap text-sm sm:text-base">
                  {a.message}
                </p>

                <div className="flex flex-wrap gap-4 sm:gap-6 text-[11px] text-purple-400 mt-6 font-medium">
                  <div className="flex items-center gap-2" title="Broadcast Date">
                    <Clock size={14} className="text-purple-500" />
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                  {a.reach !== undefined && a.reach !== null && (
                    <div className="flex items-center gap-2" title="Impressions tracked simulated reach">
                      <Eye size={14} className="text-purple-500" />
                      {a.reach >= 1000 ? `${(a.reach / 1000).toFixed(1)}K` : a.reach} reached
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 sm:gap-3 mt-12">
            <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-purple-900/40 hover:bg-purple-600 transition-colors">
              <ChevronLeft size={18} />
            </button>

            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm font-medium transition-colors ${
                  p === 1
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : "bg-purple-900/40 hover:bg-purple-600"
                }`}
              >
                {p}
              </button>
            ))}

            <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-purple-900/40 hover:bg-purple-600 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}