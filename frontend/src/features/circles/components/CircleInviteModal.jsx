import React, { useState, useEffect } from 'react';
import { X, Copy, Check, RefreshCw, Link as LinkIcon, Key, Loader2 } from 'lucide-react';
import axios from 'axios';

/* generate a QR code image URL via free public API — no npm package needed */
const getQrUrl = (text) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=10&data=${encodeURIComponent(text)}`;


/* small copy-button with "Copied!" flash */
const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* fallback */
            const el = document.createElement('textarea');
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                copied
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20'
            }`}
        >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

/* main modal */
const CircleInviteModal = ({ isOpen, onClose, circle, isAdmin }) => {
    const [inviteCode,     setInviteCode]     = useState(circle?.inviteCode || '');
    const [regenLoading,   setRegenLoading]   = useState(false);

    const baseUrl   = import.meta.env.VITE_API_URL;
    const isPrivate = circle?.type === 'private';

    /* build the join URL */
    const inviteToken = circle?.inviteCode || '';
    const joinUrl = `${window.location.origin}/circles/${circle?.slug}/join${inviteToken ? `?code=${inviteToken}` : ''}`;

    useEffect(() => {
        if (circle?.inviteCode) setInviteCode(circle.inviteCode);
    }, [circle?.inviteCode]);

    if (!isOpen) return null;

    const handleRegenerateCode = async () => {
        setRegenLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `${baseUrl}/api/circles/${circle._id}/generate-invite`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.inviteCode) setInviteCode(res.data.inviteCode);
        } catch (err) {
            console.error('Failed to regenerate invite code', err);
        } finally {
            setRegenLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div
                className="w-full max-w-sm rounded-3xl border border-[#2A1550] shadow-2xl overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #12082A 0%, #1a0d40 100%)' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
                    <h2 className="text-base font-bold text-white">Invite to {circle?.name}</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center py-6 px-6 border-b border-white/5">
                    <div className="p-3 rounded-2xl bg-white shadow-lg shadow-violet-900/30 mb-3">
                        <img
                            src={getQrUrl(joinUrl)}
                            alt="QR Code"
                            width={160}
                            height={160}
                            className="rounded-lg"
                        />
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                        Scan to join <span className="text-violet-300 font-medium">{circle?.name}</span>
                    </p>
                </div>

                {/* Join Link */}
                <div className="px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-1.5 mb-2">
                        <LinkIcon size={12} className="text-gray-500" />
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Join Link</p>
                    </div>
                    <div className="flex items-center gap-2 bg-[#0F0529]/60 border border-white/10 rounded-2xl px-3 py-2.5">
                        <p className="flex-1 text-xs text-gray-300 truncate font-mono">{joinUrl}</p>
                        <CopyButton text={joinUrl} />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-5">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-2xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 font-semibold text-sm transition-all"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CircleInviteModal;
