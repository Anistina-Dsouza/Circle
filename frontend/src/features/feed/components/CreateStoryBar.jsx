import React, { useState, useRef } from 'react';
import { Link as LinkIcon, Send, Plus, Loader2, CheckCircle2, X, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const CreateStoryBar = ({ onPostSuccess }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [mediaUrl, setMediaUrl] = useState('');
    const [status, setStatus] = useState('idle'); // idle, success, error
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [tempUrl, setTempUrl] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const fileInputRef = useRef(null);

    const profilePic = user?.profilePic;
    const baseUrl = import.meta.env.VITE_API_URL;

    const handleUrlSubmit = () => {
        if (tempUrl.trim()) {
            setMediaFile(null);
            setMediaUrl(tempUrl.trim());
            setShowUrlInput(false);
            setTempUrl('');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaFile(file);
            setMediaUrl(URL.createObjectURL(file));
            setShowUrlInput(false);
        }
    };

    const handlePostStory = async () => {
        if (!mediaUrl && !mediaFile) {
            alert('Please provide an image URL or file for your story');
            setShowUrlInput(true);
            return;
        }

        setLoading(true);
        setStatus('idle');
        try {
            const token = localStorage.getItem('token');
            let response;

            if (mediaFile) {
                const formData = new FormData();
                formData.append('media', mediaFile);
                formData.append('caption', caption);
                formData.append('duration', 24);
                formData.append('audience', 'public');
                
                response = await axios.post(`${baseUrl}/api/moments`, formData, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                response = await axios.post(`${baseUrl}/api/moments`, {
                    media: {
                        url: mediaUrl,
                        type: 'image' 
                    },
                    caption,
                    duration: 24,
                    audience: 'public'
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            if (response.data.success) {
                setCaption('');
                setMediaUrl('');
                setMediaFile(null);
                setStatus('success');
                
                // Soft refresh
                if (onPostSuccess) {
                    onPostSuccess();
                }

                setTimeout(() => {
                    setStatus('idle');
                }, 2000);
            }
        } catch (error) {
            console.error('Error posting story:', error);
            setStatus('error');
            alert(error.response?.data?.error || 'Failed to post story');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative mb-10 max-w-2xl mx-auto">
            {/* Quick Post Bar (Matches Screenshot) */}
            <div className="bg-[#1E1B3A]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-2 pr-3 flex items-center shadow-2xl shadow-purple-900/20 group transition-all hover:border-purple-500/30">
                {/* User Avatar with Plus Badge */}
                <div 
                    className="relative shrink-0 cursor-pointer active:scale-95 transition-transform"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <img
                        src={profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}
                        alt="Profile"
                        className="w-11 h-11 rounded-full border-2 border-purple-500/20 object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-1 border-2 border-[#1E1B3A] shadow-lg">
                        <Plus size={10} className="text-white" strokeWidth={4} />
                    </div>
                </div>

                {/* Vertical Divider (Matches Screenshot '|') */}
                <div className="h-6 w-px bg-white/10 mx-4" />

                {/* Main Input Area - More compact */}
                <div className="flex-1 min-w-0">
                    <input
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="What's happening?"
                        className="w-full bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm font-medium px-2"
                    />
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-2.5 transition-all rounded-xl ${mediaFile ? 'bg-purple-500/20 text-purple-400' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        title="Upload Media"
                    >
                        <ImageIcon size={20} />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        className="hidden" 
                        accept="image/*,video/*"
                    />
                    
                    <button 
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className={`p-2.5 transition-all rounded-xl ${(!mediaFile && mediaUrl) || showUrlInput ? 'bg-purple-500/20 text-purple-400' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        title="Add Link"
                    >
                        <LinkIcon size={20} />
                    </button>

                    {/* Pop-over URL Input */}
                    {showUrlInput && (
                        <div className="absolute right-0 bottom-full mb-6 w-72 bg-[#1A1140] border border-purple-500/30 rounded-3xl p-5 shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300 z-[100] backdrop-blur-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Add Media Link</span>
                                <button onClick={() => setShowUrlInput(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="url"
                                    value={tempUrl}
                                    onChange={(e) => setTempUrl(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-600"
                                    autoFocus
                                    onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                                />
                                <button 
                                    onClick={handleUrlSubmit}
                                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-900/40"
                                >
                                    Apply Content
                                </button>
                            </div>
                            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-[#1A1140] border-r border-b border-purple-500/30 rotate-45"></div>
                        </div>
                    )}

                    <div className="w-px h-6 bg-white/10 mx-2" />

                    {/* Post Button */}
                    <button 
                        onClick={handlePostStory}
                        disabled={loading || status === 'success'}
                        className={`
                            bg-gradient-to-br from-purple-500 to-purple-700 text-white p-2.5 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center
                            ${(loading || status === 'success') ? 'opacity-70 scale-100' : ''}
                        `}
                    >
                        {loading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : status === 'success' ? (
                            <CheckCircle2 size={20} />
                        ) : (
                            <Plus size={20} strokeWidth={3} />
                        )}
                    </button>
                </div>
            </div>

            {/* Media Preview Overlay */}
            {mediaUrl && (
                <div className="absolute top-full left-0 right-0 mt-3 px-4 py-3 bg-[#1E1B3A]/80 backdrop-blur-xl rounded-[2rem] border border-purple-500/20 animate-in slide-in-from-top-2 duration-500 flex items-center gap-4 z-20">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-2xl group">
                        <img src={mediaUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Preview" />
                        <button 
                            onClick={() => setMediaUrl('')}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} className="text-white" />
                        </button>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-0.5">Media Attached</p>
                        <p className="text-[10px] text-gray-400 truncate font-medium">{mediaFile ? mediaFile.name : mediaUrl}</p>
                    </div>
                    <button 
                        onClick={() => { setMediaUrl(''); setMediaFile(null); }}
                        className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-full text-gray-500 transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreateStoryBar;
