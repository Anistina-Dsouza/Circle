import React, { useState } from 'react';
import { LogOut, AlertTriangle, X, Loader2 } from 'lucide-react';

const CircleLeaveModal = ({ isOpen, onClose, onConfirm, circleName, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div
                className="w-full max-w-md rounded-3xl border border-red-500/20 shadow-2xl overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #1a0820 0%, #1a0d30 100%)' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle size={18} className="text-red-400" />
                        </div>
                        <h2 className="text-base font-bold text-white">Leave Circle</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 text-center">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Are you sure you want to leave{' '}
                        <span className="font-bold text-white">{circleName}</span>?
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                        You'll need to request to join again to regain access.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-6 pb-6">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-3 rounded-2xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 font-semibold text-sm transition-all disabled:opacity-50"
                    >
                        Stay
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-red-900/30"
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <LogOut size={16} />
                        )}
                        {loading ? 'Leaving…' : 'Leave Circle'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CircleLeaveModal;
