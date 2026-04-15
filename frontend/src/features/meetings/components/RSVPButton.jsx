import React, { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import meetingService from '../services/meetingService';

const RSVPButton = ({ meetingId, initialStatus, onStatusChange }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(initialStatus || 'invited');

    const handleRsvp = async (newStatus) => {
        if (status === newStatus || loading) return;
        
        try {
            setLoading(true);
            const res = await meetingService.updateRSVP(meetingId, newStatus);
            if (res?.success) {
                setStatus(newStatus);
                if (onStatusChange) onStatusChange(res.data);
            }
        } catch (error) {
            console.error('RSVP update failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-[#1A0B36] rounded-xl p-1 flex items-center relative overflow-hidden border border-white/5">
            {/* Sliding Background */}
            <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-out ${
                    status === 'accepted' ? 'bg-gradient-to-r from-green-500 to-emerald-600 translate-x-0' :
                    status === 'declined' ? 'bg-white/10 translate-x-[calc(100%+8px)]' :
                    'opacity-0' 
                }`}
            />
            
            <button
                onClick={() => handleRsvp('accepted')}
                disabled={loading}
                className={`flex-1 relative z-10 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors group ${
                    status === 'accepted' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
            >
                <Check size={12} className={status === 'accepted' ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover:scale-100 group-hover:opacity-50 transition-all duration-300'} />
                Going
            </button>

            <button
                onClick={() => handleRsvp('declined')}
                disabled={loading}
                className={`flex-1 relative z-10 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors group ${
                    status === 'declined' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
            >
                <X size={12} className={status === 'declined' ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover:scale-100 group-hover:opacity-50 transition-all duration-300'} />
                Not Going
            </button>
            
            {loading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#1A0B36]/50">
                    <Loader2 size={16} className="text-emerald-400 animate-spin" />
                </div>
            )}
        </div>
    );
};

export default RSVPButton;
