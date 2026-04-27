import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Image as ImageIcon, Video, Eye, Info, Send, Lock, Globe, Camera, Link as LinkIcon } from 'lucide-react';
import axios from 'axios';

const CreateStoryModal = ({ isOpen, onClose }) => {
    const [mediaType, setMediaType] = useState('image');
    const [mediaUrl, setMediaUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [duration, setDuration] = useState(24);
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploadMode, setUploadMode] = useState('device'); // 'device' or 'link'
    const [mediaFile, setMediaFile] = useState(null);
    const [error, setError] = useState('');
    
    const baseUrl = import.meta.env.VITE_API_URL;
    const user = JSON.parse(localStorage.getItem('user'));
    const fileInputRef = useRef(null);

    const durations = [
        { label: '1h', value: 1 },
        { label: '6h', value: 6 },
        { label: '12h', value: 12 },
        { label: '24h', value: 24, recommended: true },
        { label: '48h', value: 48 },
        { label: '7d', value: 168 }
    ];

    if (!isOpen) return null;

    const handleFileSelect = (e) => {
        setError('');
        const file = e.target.files[0];
        if (file) {
            // Client-side validation for file size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('File size exceeds 10MB limit. Please choose a smaller file.');
                return;
            }
            setMediaFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setMediaUrl(url); 
            setMediaType(file.type.startsWith('video') ? 'video' : 'image');
        }
    };

    const handleUrlChange = (url) => {
        setError('');
        setMediaFile(null);
        setMediaUrl(url);
        setPreviewUrl(url);
        // detection
        if (url.match(/\.(mp4|webm|ogg)$/i)) {
            setMediaType('video');
        } else {
            setMediaType('image');
        }
    };

    const handlePostStory = async () => {
        if (!mediaUrl && !mediaFile) {
            setError('Please upload an image or video first');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let response;

            if (uploadMode === 'device' && mediaFile) {
                const formData = new FormData();
                formData.append('media', mediaFile);
                formData.append('caption', caption);
                formData.append('duration', duration);
                formData.append('audience', isPublic ? 'public' : 'followers');
                
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
                        type: mediaType
                    },
                    caption,
                    duration,
                    audience: isPublic ? 'public' : 'followers'
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            if (response.data.success) {
                onClose();
            }
        } catch (error) {
            console.error('Error posting story:', error);
            const backendError = error.response?.data?.error || 'Failed to post story';
            setError(backendError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#160D33] w-full max-w-5xl rounded-[32px] overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 md:px-10 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                            <Plus size={24} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Create New Story</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X size={24} className="text-gray-400 hover:text-white" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col-reverse md:flex-row min-h-0">
                        {/* Left: Live Preview */}
                        <div className="w-full md:w-[40%] p-8 bg-[#0F0529]/50 flex flex-col items-center justify-center border-r border-white/5">
                            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-8 uppercase">Live Preview</span>
                            
                            {/* Mobile Frame */}
                            <div className="relative w-full max-w-[280px] aspect-[9/19] bg-[#1E1B3A] rounded-[40px] border-[6px] border-[#2D2A4A] shadow-2xl overflow-hidden p-3">
                                {/* Story Header */}
                                <div className="absolute top-6 left-6 right-6 z-10 flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-purple-500 p-0.5">
                                        <div className="w-full h-full rounded-full bg-gray-700 overflow-hidden">
                                            <img src={user?.profilePic} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white">{user?.displayName || user?.username}</span>
                                        <span className="text-[10px] text-gray-400">Just now</span>
                                    </div>
                                    <div className="ml-auto bg-black/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                                        <span className="text-[10px] font-bold text-purple-400">{duration}h</span>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="w-full h-full bg-[#160D33] rounded-[28px] overflow-hidden flex flex-col items-center justify-center relative">
                                    {previewUrl ? (
                                        mediaType === 'image' ? (
                                            <img src={previewUrl} className="w-full h-full object-cover" />
                                        ) : (
                                            <video src={previewUrl} className="w-full h-full object-cover" autoPlay muted loop />
                                        )
                                    ) : (
                                        <div className="flex flex-col items-center text-center px-6">
                                            <Eye size={40} className="text-purple-500/20 mb-4" />
                                            <p className="text-xs text-gray-500 font-medium">Content will appear here</p>
                                        </div>
                                    )}

                                    {/* Caption Overlay */}
                                    {caption && (
                                        <div className="absolute bottom-16 left-4 right-4 bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-white leading-relaxed line-clamp-3 italic">{caption}</p>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                                        <span className="text-[8px] tracking-[0.3em] font-black text-white/20 uppercase">Story Preview</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Controls */}
                        <div className="w-full md:w-[60%] p-8 space-y-8">
                            {/* Upload Content Container */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-gray-400">Upload Content</label>
                                    <div className="flex bg-[#1E1B3A] p-1 rounded-xl border border-white/5">
                                        <button 
                                            onClick={() => setUploadMode('device')}
                                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${uploadMode === 'device' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <Camera size={14} />
                                            <span>From Device</span>
                                        </button>
                                        <button 
                                            onClick={() => setUploadMode('link')}
                                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${uploadMode === 'link' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <LinkIcon size={14} />
                                            <span>Web Link</span>
                                        </button>
                                    </div>
                                </div>

                                {uploadMode === 'device' ? (
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-white/5 hover:border-purple-500/50 bg-[#1E1B3A]/30 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all group"
                                    >
                                        <div className="bg-purple-500/10 p-4 rounded-full group-hover:bg-purple-500/20 transition-colors mb-4">
                                            <ImageIcon size={32} className="text-purple-400" />
                                        </div>
                                        <h4 className="font-bold text-white mb-1">Drag and drop or click to upload</h4>
                                        <p className="text-xs text-gray-500">Supports JPG, PNG, MP4 up to 10MB</p>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleFileSelect} 
                                            className="hidden" 
                                            accept="image/*,video/*"
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-[#1E1B3A]/30 border border-white/5 rounded-3xl p-8 space-y-4">
                                        <div className="bg-blue-500/10 p-4 rounded-full w-fit mx-auto mb-2">
                                            <LinkIcon size={32} className="text-blue-400" />
                                        </div>
                                        <p className="text-xs text-center text-gray-400">Enter a public URL for an image or video</p>
                                        <input 
                                            type="text" 
                                            placeholder="https://images.unsplash.com/your-image.jpg" 
                                            className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all shadow-inner" 
                                            value={mediaUrl.startsWith('blob:') ? '' : mediaUrl} 
                                            onChange={(e) => handleUrlChange(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Expiration Time */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-gray-400">Expiration Time</label>
                                    <span className="text-[10px] font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded-md uppercase">Recommended: 24h</span>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                    {durations.map((d) => (
                                        <button
                                            key={d.value}
                                            onClick={() => setDuration(d.value)}
                                            className={`
                                                py-3 rounded-xl text-xs font-bold transition-all border
                                                ${duration === d.value 
                                                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-500/20' 
                                                    : 'bg-[#1E1B3A] border-white/5 text-gray-400 hover:border-white/10'
                                                }
                                            `}
                                        >
                                            {d.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Story Caption */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-gray-400">Story Caption</label>
                                    <span className="text-[10px] font-medium text-gray-600">{caption.length}/200</span>
                                </div>
                                <textarea
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value.slice(0, 200))}
                                    placeholder="Write something captivating..."
                                    className="w-full bg-[#1E1B3A]/30 border border-white/5 rounded-3xl p-6 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors resize-none h-[100px]"
                                ></textarea>
                            </div>

                            {/* Visibility */}
                            <div className="bg-[#1E1B3A]/50 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl ${isPublic ? 'bg-purple-500/10 text-purple-400' : 'bg-pink-500/10 text-pink-400'}`}>
                                        {isPublic ? <Globe size={20} /> : <Lock size={20} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Public Visibility</p>
                                        <p className="text-[10px] text-gray-500">{isPublic ? 'Anyone on Circle can see this' : 'Only your followers can see this'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsPublic(!isPublic)}
                                    className={`w-12 h-6 rounded-full relative transition-all ${isPublic ? 'bg-purple-600' : 'bg-gray-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md ${isPublic ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>
                            
                            {/* Error Display */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex items-center space-x-3">
                                    <div className="p-2 bg-red-500/20 rounded-full">
                                        <X size={16} className="text-red-400" />
                                    </div>
                                    <p className="text-sm font-medium text-red-400">{error}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 md:px-10 bg-[#0F0529]/80 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-3">
                        <Info size={16} className="text-purple-500" />
                        <p className="text-[10px] text-gray-500 font-medium">Stories are ephemeral and disappear after the selected time.</p>
                    </div>
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                        <button 
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePostStory}
                            disabled={loading}
                            className={`
                                flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-purple-700 text-white px-10 py-3.5 rounded-2xl font-bold shadow-xl shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-3
                                ${loading ? 'opacity-70 cursor-not-allowed' : ''}
                            `}
                        >
                            <span>{loading ? 'Posting...' : 'Post Story'}</span>
                            {!loading && <Send size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateStoryModal;
