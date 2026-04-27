import { useState, useEffect } from "react";
import axios from "axios";
import { X, Loader2, AlertTriangle, User, Calendar, ShieldCheck } from "lucide-react";

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
      setError("Failed to synchronize with reporting nodes.");
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6">
      <div className="bg-[#1A0C3F]/95 backdrop-blur-2xl border border-white/10 w-full max-w-2xl rounded-[32px] overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.5)] max-h-[90vh] flex flex-col">
        
        {/* Glow Header */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all z-10"
        >
          <X size={20} />
        </button>

        <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8 border-b border-white/5 relative">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">System Intervention</h2>
              <p className="text-[10px] sm:text-xs text-white/40 mt-1 uppercase tracking-[0.2em] font-black">
                {reports.length} Critical Flag{reports.length !== 1 ? 's' : ''} • {itemType} Audit
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 sm:py-8 no-scrollbar space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Decoding Signal...</span>
            </div>
          ) : error ? (
            <div className="text-center p-10 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 font-bold uppercase tracking-widest text-xs">
              {error}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center p-20 flex flex-col items-center gap-4">
              <ShieldCheck size={40} className="text-green-500/20" />
              <span className="text-white/20 font-black uppercase tracking-[0.3em] text-sm italic">Status: Stable Node</span>
            </div>
          ) : (
            reports.map((report) => (
              <div key={report._id} className="bg-white/5 border border-white/5 rounded-[24px] p-6 group hover:border-red-500/20 transition-all">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-5 border-b border-white/5">
                  <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {report.reason}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
                    <Calendar size={12} />
                    <span>{new Date(report.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute left-0 top-0 w-1 h-full bg-red-500/20 rounded-full" />
                  <div className="pl-6">
                    {report.description ? (
                      <p className="text-white/80 text-sm leading-relaxed font-medium italic">
                        "{report.description}"
                      </p>
                    ) : (
                      <p className="text-white/20 italic text-sm">No secondary telemetry provided.</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/5">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <User size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Origin Node</span>
                    <span className="text-xs font-bold text-white/60">
                      {report.reporter?.displayName || report.reporter?.username || 'Unknown Operator'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-6 sm:px-10 py-6 sm:py-8 border-t border-white/5 bg-white/[0.02] flex flex-col sm:flex-row justify-end gap-4 shrink-0">
          <button
            onClick={onClose}
            className="order-2 sm:order-1 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            Abort Audit
          </button>
          
          <button
            onClick={handleDismiss}
            disabled={loading || reports.length === 0}
            className="order-1 sm:order-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-900/20 transition-all disabled:opacity-30 disabled:grayscale"
          >
            Resolve All Violations
          </button>
        </div>

      </div>
    </div>
  );
}

