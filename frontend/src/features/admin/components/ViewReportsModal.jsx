import { useState, useEffect } from "react";
import axios from "axios";
import { X, Loader2, AlertTriangle, User } from "lucide-react";

export default function ViewReportsModal({ isOpen, onClose, itemId, itemType, onDismiss }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && itemId) {
      fetchReports();
    }
  }, [isOpen, itemId]);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await axios.get(`${baseUrl}/api/admin/reports/${itemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setReports(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss(itemId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a0033] border border-purple-900/50 w-full max-w-2xl rounded-3xl p-6 relative shadow-2xl max-h-[85vh] flex flex-col">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition">
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Pending Reports</h2>
            <p className="text-sm text-gray-400">{reports.length} Open Flags for this {itemType}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-6">
          {loading ? (
            <div className="flex justify-center p-10">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center p-6 text-red-400">{error}</div>
          ) : reports.length === 0 ? (
            <div className="text-center p-10 text-gray-400">No pending reports found for this item.</div>
          ) : (
            reports.map((report) => (
              <div key={report._id} className="bg-[#240046] border border-red-900/30 rounded-xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    {report.reason}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {report.description ? (
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed bg-[#1a0033] p-4 rounded-lg">
                    "{report.description}"
                  </p>
                ) : (
                  <p className="text-gray-500 italic text-sm mb-4">No additional description provided.</p>
                )}

                <div className="flex items-center gap-2 mt-2 pt-4 border-t border-purple-900/40">
                  <User size={14} className="text-purple-400" />
                  <span className="text-xs text-purple-300">
                    Reported by: <span className="font-semibold text-white">{report.reporter?.displayName || report.reporter?.username || 'Unknown User'}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-purple-900/30 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition"
          >
            Close
          </button>
          
          <button
            onClick={handleDismiss}
            disabled={loading || reports.length === 0}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg shadow-red-900/30 transition disabled:opacity-50"
          >
            Clear All Flags
          </button>
        </div>

      </div>
    </div>
  );
}
