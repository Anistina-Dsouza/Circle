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
        if (!mediaUrl && !mediaFile && !caption.trim()) {
            alert('Please provide an image, or write some text for your story');
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
            } else if (mediaUrl) {
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
            } else {
                response = await axios.post(`${baseUrl}/api/moments`, {
                    media: {
                        type: 'text',
                        text: caption
                    },
                    caption: '',
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
        <div className="relative bg-[#1E1B3A]/50 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-4 mb-8 shadow-lg shadow-purple-900/10">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Content Section (Avatar + Input) */}
                <div className="flex items-start space-x-4 flex-1">
                    {/* User Avatar */}
                    <div className="relative shrink-0 pt-1">
                        <img
                            src={profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}
                            alt="Profile"
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-purple-500/30 object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-0.5 sm:p-1 border-2 border-[#1E1B3A]">
                            <Plus size={8} className="text-white sm:w-[10px] sm:h-[10px]" />
                        </div>
                    </div>

                    <div className="flex-1">
                        {/* Caption Input */}
                        <div className="bg-[#2D2A4A]/50 rounded-2xl px-6 py-3 border border-white/5 hover:border-purple-500/30 transition-colors focus-within:border-purple-500/50 overflow-hidden">
                            <textarea
                                rows="1"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value.slice(0, 200))}
                                maxLength={200}
                                placeholder={`What's on your mind, ${user?.displayName || user?.username || 'User'}?`}
                                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm resize-none py-1 custom-scrollbar min-h-[36px]"
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 sm:ml-4 pr-1">
                    <div className="relative flex items-center gap-1 sm:gap-2">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-2.5 sm:p-3 transition-all rounded-full ${mediaFile ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            title="Upload Image"
                        >
                            <ImageIcon size={22} className="sm:w-6 sm:h-6" />
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
                            className={`p-2.5 sm:p-3 transition-all rounded-full ${(!mediaFile && mediaUrl) || showUrlInput ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            title="Add Image URL"
                        >
                            <LinkIcon size={22} className="sm:w-6 sm:h-6" />
                        </button>

                        {/* Pop-over URL Input */}
                        {showUrlInput && (
                            <div className="fixed sm:absolute inset-x-4 sm:inset-auto sm:right-0 top-[30%] sm:top-full mt-4 sm:w-72 bg-[#1A1140] border border-purple-500/30 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in slide-in-from-top-2 duration-200 z-50">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Add Media</span>
                                        <span className="text-xs font-bold text-white">Paste Image Link</span>
                                    </div>
                                    <button onClick={() => setShowUrlInput(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/50" />
                                        <input
                                            type="url"
                                            value={tempUrl}
                                            onChange={(e) => setTempUrl(e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full bg-[#0F0529] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 placeholder:text-gray-600 transition-all"
                                            autoFocus
                                            onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                                        />
                                    </div>
                                    <button 
                                        onClick={handleUrlSubmit}
                                        className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98]"
                                    >
                                        Apply Image
                                    </button>
                                </div>
                                {/* Arrow only on desktop */}
                                <div className="hidden sm:block absolute -top-2 right-6 w-4 h-4 bg-[#1A1140] border-l border-t border-purple-500/30 rotate-45"></div>
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={handlePostStory}
                        disabled={loading || status === 'success'}
                        className={`
                            bg-gradient-to-r from-purple-400 to-purple-600 text-white px-5 sm:px-8 py-2.5 rounded-full font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 flex-1 sm:flex-none
                            ${(loading || status === 'success') ? 'opacity-70 scale-100' : ''}
                        `}
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : status === 'success' ? (
                            <CheckCircle2 size={16} />
                        ) : (
                            <>
                                <span className="text-xs sm:text-sm font-black tracking-widest">POST</span>
                                <Plus size={16} />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Media Preview - Popping from the side/bottom */}
            {mediaUrl && (
                <div className="mt-4 flex items-center space-x-3 px-4 py-2 bg-purple-500/5 rounded-2xl border border-purple-500/10 animate-in slide-in-from-left-2 duration-300">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-purple-500/50 shadow-lg group">
                        <img src={mediaUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Preview" />
                        <button 
                            onClick={() => setMediaUrl('')}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} className="text-white" />
                        </button>
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Image Attached</span>
                        <span className="text-[9px] text-gray-400 truncate pr-4">{mediaFile ? mediaFile.name : mediaUrl}</span>
                    </div>
                    <button 
                        onClick={() => { setMediaUrl(''); setMediaFile(null); }}
                        className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreateStoryBar;
