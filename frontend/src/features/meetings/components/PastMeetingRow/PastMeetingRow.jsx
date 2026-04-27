import React, { useState } from 'react';
import { CheckCircle2, Download, Loader, Eye, X } from 'lucide-react';
import meetingService from '../../services/meetingService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const PastMeetingRow = ({ meeting }) => {
    const [downloading, setDownloading] = useState(false);
    const [viewing, setViewing] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleView = async () => {
        try {
            setViewing(true);
            const res = await meetingService.getMeetingById(meeting.id || meeting._id);
            if (res.success && res.data) {
                setViewData(res.data);
                setShowModal(true);
            }
        } catch (err) {
            console.error("Failed to fetch meeting details", err);
            alert("Failed to fetch meeting details. Please try again.");
        } finally {
            setViewing(false);
        }
    };

    const handleDownload = async () => {
        try {
            setDownloading(true);
            const res = await meetingService.getMeetingById(meeting.id || meeting._id);
            if (res.success && res.data) {
                const m = res.data;
                const doc = new jsPDF();
                
                // Add Title
                doc.setFontSize(22);
                doc.setTextColor(40, 40, 40);
                doc.text('Meeting Report', 14, 22);
                
                // Meeting Title
                doc.setFontSize(16);
                doc.setTextColor(139, 92, 246); // Purple
                doc.text(m.title, 14, 32);
                
                // Details
                doc.setFontSize(11);
                doc.setTextColor(80, 80, 80);
                
                const dateStr = new Date(m.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                const timeStr = `${new Date(m.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(m.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                const hostName = m.host?.displayName || m.host?.username || 'Unknown';
                const circleName = m.circle?.name || 'General Community';
                
                let startY = 44;
                doc.text(`Date & Time: ${dateStr} | ${timeStr}`, 14, startY);
                startY += 7;
                doc.text(`Hosted By: ${hostName}`, 14, startY);
                startY += 7;
                doc.text(`Circle: ${circleName}`, 14, startY);
                
                if (m.description) {
                    startY += 9;
                    const splitDescription = doc.splitTextToSize(`Description: ${m.description}`, 180);
                    doc.text(splitDescription, 14, startY);
                    startY += (splitDescription.length * 5);
                }
                
                startY += 12;
                
                // Participant Table
                const tableColumn = ["#", "Participant Name", "Username", "Status"];
                const tableRows = [];
                
                if (m.participants && m.participants.length > 0) {
                    m.participants.forEach((p, idx) => {
                        const name = p.user?.displayName || p.user?.username || 'Unknown User';
                        const username = p.user?.username ? `@${p.user.username}` : 'N/A';
                        const status = p.status.toUpperCase();
                        tableRows.push([idx + 1, name, username, status]);
                    });
                } else {
                    tableRows.push(["-", "No participant data available", "-", "-"]);
                }
                
                autoTable(doc, {
                    head: [tableColumn],
                    body: tableRows,
                    startY: startY,
                    theme: 'striped',
                    headStyles: { fillColor: [139, 92, 246] }, // Purple-500
                    styles: { fontSize: 10, cellPadding: 3 },
                    margin: { top: 10 }
                });
                
                doc.save(`${m.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'Meeting'}_Report.pdf`);
            }
        } catch (err) {
            console.error("Failed to download meeting report", err);
            alert("Failed to fetch meeting report. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-white/[0.02] transition-colors gap-4">
            {/* Left: Icon & Info */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1e0a36] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                    <h4 className="text-base font-bold text-white mb-0.5">{meeting.title}</h4>
                    <p className="text-xs text-gray-500">{meeting.description}</p>
                </div>
            </div>

            {/* Right: Date & Download icon */}
            <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-48">
                <div className="text-right flex-1 sm:flex-none">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">DATE</p>
                    <p className="text-sm font-semibold text-gray-300">{meeting.date}</p>
                </div>
                <div className="flex items-center gap-3">
                    {meeting.canViewReport && (
                        <>
                            <button 
                                onClick={handleView}
                                disabled={viewing}
                                className="text-gray-500 hover:text-purple-400 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="View Details"
                            >
                                {viewing ? <Loader size={20} className="animate-spin text-purple-400" /> : <Eye size={20} />}
                            </button>
                            <button 
                                onClick={handleDownload}
                                disabled={downloading}
                                className="text-gray-500 hover:text-white transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Download Report"
                            >
                                {downloading ? <Loader size={20} className="animate-spin text-purple-400" /> : <Download size={20} />}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* View Modal */}
            {showModal && viewData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                    <div className="bg-[#1A0833] border border-white/10 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <div className="p-5 sm:p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#1A0833] z-10">
                            <h3 className="text-xl font-bold text-white tracking-tight pr-4 truncate">{viewData.title}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5 shrink-0">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-5 sm:p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300 mb-8">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <strong className="text-purple-400/80 uppercase text-[9px] font-black tracking-widest block mb-1.5">Date & Time</strong> 
                                    <span className="font-medium text-white">{new Date(viewData.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span><br />
                                    <span className="text-gray-400 text-xs">{new Date(viewData.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(viewData.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <strong className="text-purple-400/80 uppercase text-[9px] font-black tracking-widest block mb-1.5">Hosted By</strong> 
                                    <div className="flex items-center gap-2">
                                        <img src={viewData.host?.profile?.profileImage || `https://ui-avatars.com/api/?name=${viewData.host?.displayName || viewData.host?.username || 'U'}&background=random`} alt="Host" className="w-6 h-6 rounded-full border border-white/10" />
                                        <span className="font-medium text-white line-clamp-1">{viewData.host?.displayName || viewData.host?.username || 'Unknown'}</span>
                                    </div>
                                </div>
                                {viewData.circle && (
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 sm:col-span-2">
                                        <strong className="text-purple-400/80 uppercase text-[9px] font-black tracking-widest block mb-1.5">Circle / Community</strong> 
                                        <span className="font-medium text-white">{viewData.circle.name}</span>
                                    </div>
                                )}
                                {viewData.description && (
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 sm:col-span-2">
                                        <strong className="text-purple-400/80 uppercase text-[9px] font-black tracking-widest block mb-1.5">Description</strong> 
                                        <p className="text-gray-400 text-sm leading-relaxed">{viewData.description}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">Participants</h4>
                                    <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-[10px] font-black">{viewData.participants?.length || 0} TOTAL</span>
                                </div>
                                
                                {viewData.participants && viewData.participants.length > 0 ? (
                                    <ul className="space-y-2.5">
                                        {viewData.participants.map((p, idx) => (
                                            <li key={idx} className="flex items-center gap-3 bg-white/[0.02] hover:bg-white/[0.04] p-3 rounded-xl border border-white/5 transition-colors">
                                                <div className="flex-shrink-0 w-6 text-center text-[10px] font-black text-gray-500">{idx + 1}</div>
                                                <img 
                                                    src={p.user?.profile?.profileImage || `https://ui-avatars.com/api/?name=${p.user?.displayName || p.user?.username || 'U'}&background=random`} 
                                                    alt="User" 
                                                    className="w-8 h-8 rounded-full border border-white/10" 
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-white text-sm truncate">{p.user?.displayName || p.user?.username || 'Unknown User'}</div>
                                                    <div className="text-[10px] text-gray-500 truncate">@{p.user?.username || 'unknown'}</div>
                                                </div>
                                                <span className={`flex-shrink-0 text-[9px] px-2.5 py-1 rounded-md uppercase font-black tracking-widest border ${
                                                    p.status === 'attended' || p.status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                                    p.status === 'declined' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center py-6 bg-white/[0.02] rounded-xl border border-dashed border-white/10">
                                        <p className="text-sm text-gray-500 italic">No participant data tracked for this session.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 sm:p-5 border-t border-white/5 flex justify-end bg-black/20">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest transition-all active:scale-95">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PastMeetingRow;
