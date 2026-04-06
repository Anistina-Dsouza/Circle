import { useState } from "react";
import axios from "axios";
import { X, AlertTriangle, Loader2 } from "lucide-react";

export default function ReportModal({ isOpen, onClose, reportedItemId, reportedItemType }) {
  const [reason, setReason] = useState("spam");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      await axios.post(`${baseUrl}/api/reports`, {
        reportedItemId,
        reportedItemType,
        reason,
        description
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      alert("Report submitted successfully.");
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a0033] border border-purple-900/50 w-full max-w-md rounded-3xl p-6 relative shadow-2xl">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Report {reportedItemType}</h2>
            <p className="text-sm text-gray-400">Our moderators will review this within 24 hours.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-purple-300">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-[#2a004a] text-white border border-purple-900/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition cursor-pointer"
            >
              <option value="spam">Spam / Bot Account</option>
              <option value="harassment">Hate Speech & Harassment</option>
              <option value="inappropriate">Inappropriate Content</option>
              <option value="other">Other Violation</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-purple-300">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details to aid our team..."
              rows={4}
              className="bg-[#2a004a] text-white border border-purple-900/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center min-w-[120px] bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-full text-sm font-bold transition disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Submit Report"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
