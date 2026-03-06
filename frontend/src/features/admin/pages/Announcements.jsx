import Sidebar from "../components/Sidebar";
import { Send, Clock, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const announcements = [
  {
    title: "v2.4 Core Engine Update",
    message:
      "We've successfully updated the core synchronization engine. Users should experience 40% faster loading times on time-based feeds and improved connectivity.",
    date: "Yesterday at 4:00 PM",
    reach: "1.2M reached"
  },
  {
    title: "Holiday Theme Activation",
    message:
      "The Winter Solstice theme is now live for all users in the Northern Hemisphere. Enjoy the cozy aesthetics and new limited edition avatars...",
    date: "Dec 21, 2023 at 09:00 AM",
    reach: "840K reached"
  },
  {
    title: "Community Guidelines Update",
    message:
      "We have updated our Community Guidelines regarding AI-generated content. Please review the changes in the help center to ensure your posts...",
    date: "Dec 15, 2023 at 02:15 PM",
    reach: "2.1M reached"
  }
];

export default function Announcements() {
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
          <div className="bg-[#240046] rounded-3xl p-10 border border-purple-900/40 shadow-xl">

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
                className="w-full bg-[#1a0033] px-6 py-4 rounded-xl border border-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full bg-[#1a0033] px-6 py-4 rounded-xl border border-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <div className="text-right text-xs text-purple-400 mt-2">
                0/500 characters
              </div>
            </div>

            {/* Button */}
            <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-purple-900/40">
              <Send size={18} />
              Send Announcement
            </button>

            <p className="text-center text-purple-400 text-xs mt-4">
              This action will notify all active platform users immediately.
            </p>

          </div>

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
              {announcements.map((a, i) => (
                <div
                  key={i}
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

                  <p className="text-purple-300 leading-relaxed">
                    {a.message}
                  </p>

                  <div className="flex gap-6 text-xs text-purple-400 mt-5">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {a.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye size={14} />
                      {a.reach}
                    </div>
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