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
        <div className="w-full grid grid-cols-2 gap-2">
            <button
                onClick={() => handleRsvp('accepted')}
                disabled={loading}
                className={`py-2 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5 transition-all border ${
                    status === 'accepted' 
                        ? 'bg-green-500/20 border-green-500/50 text-green-400 shadow-lg shadow-green-900/20' 
                        : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                }`}
            >
                {loading && status === 'accepted' ? (
                    <Loader2 size={12} className="animate-spin" />
                ) : (
                    <Check size={12} className={status === 'accepted' ? 'text-green-400' : ''} />
                )}
                GOING
            </button>

            <button
                onClick={() => handleRsvp('declined')}
                disabled={loading}
                className={`py-2 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5 transition-all border ${
                    status === 'declined' 
                        ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-lg shadow-red-900/20' 
                        : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                }`}
            >
                {loading && status === 'declined' ? (
                    <Loader2 size={12} className="animate-spin" />
                ) : (
                    <X size={12} className={status === 'declined' ? 'text-red-400' : ''} />
                )}
                NOPE
            </button>
        </div>
    );
};

export default RSVPButton;
