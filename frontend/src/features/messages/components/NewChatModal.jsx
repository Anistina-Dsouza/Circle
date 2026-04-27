import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, Loader2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const NewChatModal = ({ onClose, onStartChat }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.trim().length > 1) {
                handleSearch();
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BACKEND_URL}/api/users/search?q=${searchTerm}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResults(res.data.users || []);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartChat = async (userId) => {
        if (creating) return;
        setCreating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${BACKEND_URL}/api/dm/conversations`, 
                { recipientId: userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.conversation) {
                onStartChat(res.data.conversation._id);
            }
        } catch (err) {
            console.error('Failed to start conversation:', err);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative w-full max-w-lg bg-[#0F0529] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                    <h3 className="text-xl font-black text-white italic tracking-tight">New Message</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            autoFocus
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name or username..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all text-sm"
                        />
                    </div>

                    <div className="max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-violet-500/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-violet-500/40 space-y-2">
                        {loading ? (
                            <div className="py-10 flex flex-col items-center justify-center text-gray-500">
                                <Loader2 size={24} className="animate-spin mb-2" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">Searching users...</p>
                            </div>
                        ) : results.length > 0 ? (
                            results.map(user => (
                                <div 
                                    key={user._id}
                                    onClick={() => handleStartChat(user._id)}
                                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <img 
                                            src={user.profilePic || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                                            alt="" 
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-gray-200 group-hover:text-white">{user.displayName || user.username}</p>
                                            <p className="text-[10px] text-gray-600 font-medium">@{user.username}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-violet-500 opacity-0 group-hover:opacity-100 transition-all">
                                        <UserPlus size={18} />
                                    </button>
                                </div>
                            ))
                        ) : searchTerm.length > 1 ? (
                            <div className="py-10 text-center text-gray-600">
                                <p className="text-sm italic">No users found for "{searchTerm}"</p>
                            </div>
                        ) : (
                            <div className="py-10 text-center text-gray-600">
                                <p className="text-sm italic opacity-40">Start typing to search people</p>
                            </div>
                        )}
                    </div>
                </div>

                {creating && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
                        <Loader2 size={32} className="text-violet-500 animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewChatModal;
