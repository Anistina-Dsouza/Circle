import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
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
    <div className="min-h-screen bg-[#10002B] text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="lg:ml-64">

        <main className="p-10 max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold">
              Platform Announcements
            </h1>
            <p className="text-purple-300 mt-2">
              Broadcast important updates to the entire Circle ecosystem.
            </p>
          </div>

          {/* Announcement Form */}
          <form onSubmit={handleSubmit} className="bg-[#240046] rounded-3xl p-10 border border-purple-900/40 shadow-xl">

            <div className="flex items-center gap-3 mb-8">
              <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
              <span className="text-xl font-semibold">Circle</span>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-widest text-purple-300 mb-3">
                Announcement Title
              </label>
              <input
                type="text"
                placeholder="E.g. System Maintenance Update"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                className="w-full bg-[#1a0033] px-6 py-4 rounded-xl border border-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                required
              />
            </div>

            {/* Message */}
            <div className="mb-8">
              <label className="block text-xs uppercase tracking-widest text-purple-300 mb-3">
                Broadcast Message
              </label>
              <textarea
                rows="5"
                placeholder="What's happening on Circle?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                className="w-full bg-[#1a0033] px-6 py-4 rounded-xl border border-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-white"
                required
              />
              <div className="text-right text-xs text-purple-400 mt-2">
                {message.length}/500 characters
              </div>
            </div>

            {/* Button */}
            <button 
              type="submit" 
              disabled={submitting || !title.trim() || !message.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-purple-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {submitting ? 'Broadcasting...' : 'Send Announcement'}
            </button>

            <p className="text-center text-purple-400 text-xs mt-4">
              This action will natively broadcast to the system dashboard immediately.
            </p>

          </form>

          {/* Past Announcements */}
          <div className="mt-16">

            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">
                Past Announcements
              </h2>
              <span className="text-purple-400 text-sm cursor-pointer hover:text-purple-300">
                View All Archive
              </span>
            </div>

            <div className="space-y-6">
              {loading ? (
                <div className="flex justify-center p-10 text-purple-500">
                  <Loader2 className="w-10 h-10 animate-spin" />
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center p-10 text-purple-400 border border-purple-900/40 rounded-2xl bg-[#240046]/50">
                  No announcements have been broadcasted yet.
                </div>
              ) : announcements.map((a) => (
                <div
                  key={a._id}
                  className="bg-[#240046] p-8 rounded-2xl border border-purple-900/40 hover:bg-purple-900/20 transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">
                      {a.title}
                    </h3>
                    <span className="text-xs bg-purple-900/40 px-4 py-1 rounded-full text-purple-300">
                      BROADCASTED
                    </span>
                  </div>

                  <p className="text-purple-300 leading-relaxed max-w-4xl break-words whitespace-pre-wrap">
                    {a.message}
                  </p>

                  <div className="flex gap-6 text-xs text-purple-400 mt-5">
                    <div className="flex items-center gap-2" title="Broadcast Date">
                      <Clock size={14} />
                      {new Date(a.createdAt).toLocaleString()}
                    </div>
                    {a.reach !== undefined && a.reach !== null && (
                      <div className="flex items-center gap-2" title="Impressions tracked simulated reach">
                        <Eye size={14} />
                        {a.reach >= 1000 ? `${(a.reach / 1000).toFixed(1)}K` : a.reach} reached
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-12">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-900/40 hover:bg-purple-600 transition">
                <ChevronLeft size={18} />
              </button>

              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`w-10 h-10 rounded-full ${
                    p === 1
                      ? "bg-purple-500 text-white"
                      : "bg-purple-900/40 hover:bg-purple-600"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-900/40 hover:bg-purple-600 transition">
                <ChevronRight size={18} />
              </button>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}