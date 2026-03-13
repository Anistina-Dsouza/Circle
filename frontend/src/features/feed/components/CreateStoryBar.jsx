import React, { useState } from 'react';
import { Link as LinkIcon, Send, Plus, Loader2, CheckCircle2, X } from 'lucide-react';
import axios from 'axios';

const CreateStoryBar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [mediaUrl, setMediaUrl] = useState('');
    const [mediaType, setMediaType] = useState('image');
    const [status, setStatus] = useState('idle'); // idle, success, error
    const [showUrlInput, setShowUrlInput] = useState(false);

    const profilePic = user?.profilePic;
    const baseUrl = import.meta.env.VITE_API_URL;

    const handleUrlSubmit = (url) => {
        if (url.trim()) {
            setMediaUrl(url.trim());
            // Basic detection for video
            if (url.match(/\.(mp4|webm|ogg)$/i)) {
                setMediaType('video');
            } else {
                setMediaType('image');
            }
            setShowUrlInput(false);
        }
    };

    const handlePostStory = async () => {
        if (!mediaUrl) {
            alert('Please provide an image or video URL for your story');
            setShowUrlInput(true);
            return;
        }

        setLoading(true);
        setStatus('idle');
        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.post(`${baseUrl}/api/moments`, {
                media: {
                    url: mediaUrl,
                    type: mediaType
                },
                caption,
                duration: 24,
                audience: 'public'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setCaption('');
                setMediaUrl('');
                setStatus('success');
                setTimeout(() => {
                    setStatus('idle');
                    window.location.reload(); 
                }, 1500);
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
        <div className="bg-[#1E1B3A]/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 mb-8 shadow-lg shadow-purple-900/10 transition-all">
            <div className="flex items-center space-x-4">
                {/* User Avatar */}
                <div className="relative shrink-0">
                    <img
                        src={profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-purple-500/30 object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-1 border-2 border-[#1E1B3A]">
                        <Plus size={10} className="text-white" />
                    </div>
                </div>

                <div className="flex-1 flex flex-col space-y-2">
                    {/* Caption Input */}
                    <div className="flex-1 bg-[#2D2A4A]/50 rounded-full px-6 py-3 border border-white/5 hover:border-purple-500/30 transition-colors focus-within:border-purple-500/50">
                        <input
                            type="text"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder={`Write a caption, ${user?.displayName || user?.username || 'User'}...`}
                            className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
                        />
                    </div>
                    
                    {/* URL Selection Input */}
                    {showUrlInput && (
                        <div className="flex items-center space-x-2 px-2 animate-in slide-in-from-top-1 duration-200">
                            <div className="flex-1 bg-[#160D33] rounded-full px-4 py-2 border border-blue-500/30 flex items-center">
                                <LinkIcon size={12} className="text-blue-400 mr-2" />
                                <input
                                    type="url"
                                    placeholder="Paste image or video URL..."
                                    className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-[10px]"
                                    autoFocus
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') handleUrlSubmit(e.target.value);
                                    }}
                                    onBlur={(e) => handleUrlSubmit(e.target.value)}
                                />
                            </div>
                            <button onClick={() => setShowUrlInput(false)} className="text-gray-500 hover:text-white">
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    {/* Preview of chosen URL */}
                    {mediaUrl && (
                        <div className="flex items-center space-x-3 px-3 py-1 bg-purple-500/5 rounded-xl border border-purple-500/10 w-fit">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-purple-500/30 shadow-sm">
                                {mediaType === 'image' ? (
                                    <img src={mediaUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <video src={mediaUrl} className="w-full h-full object-cover" />
                                )}
                                <button 
                                    onClick={() => setMediaUrl('')}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} className="text-white" />
                                </button>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">URL Media Set</span>
                                <span className="text-[8px] text-purple-400/60 truncate max-w-[200px]">{mediaUrl}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                    <button 
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className={`p-3 transition-all rounded-full ${showUrlInput ? 'bg-blue-500/20 text-blue-400' : 'text-blue-400 hover:bg-blue-500/10 shadow-lg shadow-blue-500/5'}`}
                        title="Add Media Link"
                    >
                        <LinkIcon size={24} />
                    </button>
                    
                    <button 
                        onClick={handlePostStory}
                        disabled={loading || status === 'success'}
                        className={`
                            bg-gradient-to-r from-purple-400 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all hover:scale-105 active:scale-95 flex items-center space-x-2
                            ${(loading || status === 'success') ? 'opacity-70 scale-100' : ''}
                        `}
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : status === 'success' ? (
                            <CheckCircle2 size={16} />
                        ) : (
                            <>
                                <span className="hidden sm:inline">STORY</span>
                                <Plus size={16} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateStoryBar;
