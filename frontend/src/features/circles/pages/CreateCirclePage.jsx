import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Globe, Lock, Shield, Image as ImageIcon, Upload, Link as LinkIcon, Camera } from 'lucide-react';
import FeedNavbar from '../../feed/components/FeedNavbar';

const CreateCirclePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Technology',
        visibility: 'public',
        profilePic: '',
        coverImage: '',
        settings: {
            allowMemberPosts: true,
            allowMemberInvites: true,
            requirePostApproval: false
        }
    });

    const [profilePicType, setProfilePicType] = useState('link'); // 'link' or 'upload'
    const [coverImageType, setCoverImageType] = useState('link'); // 'link' or 'upload'
    
    const profileInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const handleSettingToggle = (setting) => {
        setFormData(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                [setting]: !prev.settings[setting]
            }
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, [field]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/circles`, {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                type: formData.visibility,
                profilePic: formData.profilePic,
                coverImage: formData.coverImage,
                settings: formData.settings
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                navigate(`/circles/${response.data.circle.slug}`);
            }
        } catch (error) {
            console.error('Error creating circle:', error);
            alert(error.response?.data?.error || 'Failed to create circle');
        }
    };

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans">
            <FeedNavbar activePage="Circles" />

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex items-center space-x-4 mb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 hover:bg-white/5 rounded-full transition-all border border-white/5 hover:border-purple-500/30"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Create a New Circle</h1>
                        <p className="text-gray-400">Set the stage for your new community.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Cover Image Section */}
                    <div className="relative group">
                        <div className="w-full h-48 rounded-[2.5rem] bg-[#1A1140] border-2 border-white/5 overflow-hidden relative shadow-2xl">
                            {formData.coverImage ? (
                                <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-gradient-to-br from-[#1A1140] to-[#0F0529]">
                                    <ImageIcon size={48} className="mb-2 opacity-20" />
                                    <p className="text-xs font-black uppercase tracking-widest">No Cover Image</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button type="button" onClick={() => { setCoverImageType('upload'); coverInputRef.current?.click(); }} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-md">
                                    <Upload size={20} />
                                </button>
                                <button type="button" onClick={() => setCoverImageType('link')} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-md">
                                    <LinkIcon size={20} />
                                </button>
                            </div>
                        </div>
                        
                        {/* Profile Pic Overlap */}
                        <div className="absolute -bottom-10 left-10 group/profile">
                            <div className="w-24 h-24 rounded-full border-4 border-[#0F0529] bg-[#1A1140] shadow-2xl relative overflow-hidden">
                                {formData.profilePic ? (
                                    <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700 bg-[#1A1140]">
                                        <Camera size={32} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/profile:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                                    <button type="button" onClick={() => { setProfilePicType('upload'); profileInputRef.current?.click(); }} className="p-1.5 hover:text-purple-400 transition-colors">
                                        <Upload size={16} />
                                    </button>
                                    <button type="button" onClick={() => setProfilePicType('link')} className="p-1.5 hover:text-purple-400 transition-colors">
                                        <LinkIcon size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Hidden Inputs */}
                        <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'profilePic')} />
                        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'coverImage')} />
                    </div>

                    <div className="pt-8 space-y-8">
                        {/* Image URL Inputs (Conditional) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {profilePicType === 'link' && (
                                <div className="bg-[#1A1140]/60 backdrop-blur-md border border-purple-500/20 rounded-3xl p-6 animate-in slide-in-from-top-2">
                                    <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3 block">Profile Pic URL</label>
                                    <input
                                        type="url"
                                        name="profilePic"
                                        value={formData.profilePic}
                                        onChange={handleChange}
                                        placeholder="Paste image URL..."
                                        className="w-full bg-[#0F0529] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-all text-sm"
                                    />
                                </div>
                            )}
                            {coverImageType === 'link' && (
                                <div className="bg-[#1A1140]/60 backdrop-blur-md border border-purple-500/20 rounded-3xl p-6 animate-in slide-in-from-top-2">
                                    <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3 block">Cover Image URL</label>
                                    <input
                                        type="url"
                                        name="coverImage"
                                        value={formData.coverImage}
                                        onChange={handleChange}
                                        placeholder="Paste image URL..."
                                        className="w-full bg-[#0F0529] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-all text-sm"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="bg-[#1A1140]/60 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                            <div>
                                <label htmlFor="name" className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Circle Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Design Enthusiasts"
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-xl font-bold"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="What is this circle about?"
                                    rows="4"
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-lg font-medium resize-none"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        {/* Settings Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-[#1A1140]/60 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 space-y-6 shadow-2xl">
                                <label htmlFor="category" className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-1">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-purple-500 transition-all text-lg font-bold appearance-none cursor-pointer"
                                >
                                    <option>Technology</option>
                                    <option>UI/UX Design</option>
                                    <option>Gaming</option>
                                    <option>Digital Art</option>
                                    <option>Web3</option>
                                    <option>Startups</option>
                                </select>
                            </div>

                            <div className="bg-[#1A1140]/60 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 space-y-6 shadow-2xl">
                                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-1">Visibility</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`flex flex-col items-center gap-3 p-5 rounded-3xl cursor-pointer border-2 transition-all ${formData.visibility === 'public' ? 'bg-purple-500/10 border-purple-500/50 text-white' : 'bg-[#0F0529] border-white/5 text-gray-500 hover:border-white/10'}`}>
                                        <Globe size={24} className={formData.visibility === 'public' ? 'text-purple-400' : 'text-gray-600'} />
                                        <span className="font-bold text-sm">Public</span>
                                        <input type="radio" name="visibility" value="public" checked={formData.visibility === 'public'} onChange={handleChange} className="hidden" />
                                    </label>
                                    <label className={`flex flex-col items-center gap-3 p-5 rounded-3xl cursor-pointer border-2 transition-all ${formData.visibility === 'private' ? 'bg-pink-500/10 border-pink-500/50 text-white' : 'bg-[#0F0529] border-white/5 text-gray-500 hover:border-white/10'}`}>
                                        <Lock size={24} className={formData.visibility === 'private' ? 'text-pink-400' : 'text-gray-600'} />
                                        <span className="font-bold text-sm">Private</span>
                                        <input type="radio" name="visibility" value="private" checked={formData.visibility === 'private'} onChange={handleChange} className="hidden" />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Permission Settings */}
                        <div className="bg-[#1A1140]/60 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <Shield size={24} className="text-purple-400" />
                                Community Permissions
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { id: 'allowMemberPosts', label: 'Allow members to post', desc: 'Anyone in the circle can create new posts' },
                                    { id: 'allowMemberInvites', label: 'Allow members to invite', desc: 'Members can generate invite codes' },
                                    { id: 'requirePostApproval', label: 'Require post approval', desc: 'Moderators must approve posts before they go live' }
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-6 bg-[#0F0529] rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div>
                                            <p className="font-bold">{item.label}</p>
                                            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleSettingToggle(item.id)}
                                            className={`w-14 h-7 rounded-full transition-all relative ${formData.settings[item.id] ? 'bg-purple-600 shadow-[0_0_15px_rgba(124,58,237,0.5)]' : 'bg-gray-800'}`}
                                        >
                                            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-lg ${formData.settings[item.id] ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-6 rounded-[2.5rem] bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 text-white font-black text-xl tracking-widest uppercase transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-purple-900/40 mt-6 flex items-center justify-center space-x-4"
                        >
                            <Plus size={28} strokeWidth={3} />
                            <span>Launch Your Circle</span>
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default CreateCirclePage;
