import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Globe, Lock, Shield, Image as ImageIcon, Camera, Link as LinkIcon, X, LayoutGrid, Cpu, Palette, Gamepad2, Rocket, Briefcase } from 'lucide-react';
import FeedNavbar from '../../feed/components/FeedNavbar';
import PremiumDropdown from '../../../components/ui/PremiumDropdown';

const categoryOptions = [
    { value: 'Technology', label: 'Technology', icon: Cpu },
    { value: 'UI/UX Design', label: 'UI/UX Design', icon: LayoutGrid },
    { value: 'Gaming', label: 'Gaming', icon: Gamepad2 },
    { value: 'Digital Art', label: 'Digital Art', icon: Palette },
    { value: 'Web3', label: 'Web3', icon: Rocket },
    { value: 'Startups', label: 'Startups', icon: Briefcase }
];

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

    const [uploadModes, setUploadModes] = useState({
        profilePic: 'link', // 'link' or 'upload'
        coverImage: 'link'
    });

    const [files, setFiles] = useState({
        profilePic: null,
        coverImage: null
    });

    const [previews, setPreviews] = useState({
        profilePic: '',
        coverImage: ''
    });

    const profilePicInputRef = useRef(null);
    const coverImageInputRef = useRef(null);

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

    const handleFileSelect = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({ ...prev, [field]: file }));
            const url = URL.createObjectURL(file);
            setPreviews(prev => ({ ...prev, [field]: url }));
            setFormData(prev => ({ ...prev, [field]: url }));
        }
    };

    const handleUrlChange = (url, field) => {
        setFormData(prev => ({ ...prev, [field]: url }));
        setPreviews(prev => ({ ...prev, [field]: url }));
        setFiles(prev => ({ ...prev, [field]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_URL;

            // Use FormData to support file uploads
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('category', formData.category);
            submitData.append('type', formData.visibility);
            submitData.append('settings', JSON.stringify(formData.settings));

            // Profile Pic
            if (uploadModes.profilePic === 'upload' && files.profilePic) {
                submitData.append('profilePic', files.profilePic);
            } else if (formData.profilePic) {
                submitData.append('profilePicUrl', formData.profilePic);
            }

            // Cover Image
            if (uploadModes.coverImage === 'upload' && files.coverImage) {
                submitData.append('coverImage', files.coverImage);
            } else if (formData.coverImage) {
                submitData.append('coverImageUrl', formData.coverImage);
            }

            const response = await axios.post(`${baseUrl}/api/circles`, submitData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                navigate(`/circles/${response.data.circle.slug}`);
            }
        } catch (error) {
            console.error('Error creating circle:', error);
            alert(error.response?.data?.error || 'Failed to create circle');
        }
    };

    const ImageSection = ({ label, field, inputRef }) => (
        <div className="bg-[#1A1140]/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-400 ml-1">{label}</label>
                <div className="flex bg-[#0F0529]/80 p-1.5 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <button
                        type="button"
                        onClick={() => setUploadModes(prev => ({ ...prev, [field]: 'upload' }))}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 active:scale-95 uppercase ${uploadModes[field] === 'upload' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                    >
                        <Camera size={14} />
                        <span>Upload</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setUploadModes(prev => ({ ...prev, [field]: 'link' }))}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 active:scale-95 uppercase ${uploadModes[field] === 'link' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                    >
                        <LinkIcon size={14} />
                        <span>Link</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6 items-start">
                <div className={`relative ${field === 'profilePic' ? 'w-24 h-24' : 'w-full h-40'} bg-[#0F0529] rounded-2xl border border-dashed border-white/10 flex items-center justify-center overflow-hidden shrink-0 group`}>
                    {previews[field] ? (
                        <>
                            <img src={previews[field]} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => {
                                    setPreviews(prev => ({ ...prev, [field]: '' }));
                                    setFormData(prev => ({ ...prev, [field]: '' }));
                                    setFiles(prev => ({ ...prev, [field]: null }));
                                }}
                                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                        </>
                    ) : (
                        <ImageIcon size={32} className="text-gray-600" />
                    )}
                </div>

                <div className="flex-1 w-full">
                    {uploadModes[field] === 'upload' ? (
                        <div
                            onClick={() => inputRef.current?.click()}
                            className="w-full h-full border-2 border-dashed border-white/5 hover:border-purple-500/50 bg-[#0F0529] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group min-h-[100px]"
                        >
                            <Camera size={24} className="text-gray-600 mb-2 group-hover:text-purple-400 transition-colors" />
                            <p className="text-xs font-bold text-gray-500 group-hover:text-gray-400 transition-colors text-center">Click to upload {label.toLowerCase()}</p>
                            <input
                                type="file"
                                ref={inputRef}
                                onChange={(e) => handleFileSelect(e, field)}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    ) : (
                        <div className="relative group/input">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-purple-500 transition-colors">
                                <LinkIcon size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder={`Paste ${label.toLowerCase()} URL...`}
                                value={formData[field]}
                                onChange={(e) => handleUrlChange(e.target.value, field)}
                                className="w-full bg-[#0F0529] border border-white/10 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium text-sm text-gray-200 placeholder:text-gray-600 shadow-inner"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

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

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-[#1A1140]/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-400 mb-2 ml-1">Circle Name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Design Enthusiasts"
                                className="w-full bg-[#0F0529] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-lg font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-400 mb-2 ml-1">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="What is this circle about?"
                                rows="3"
                                className="w-full bg-[#0F0529] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-lg resize-none"
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* Media Selection */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ImageSection label="Profile Picture" field="profilePic" inputRef={profilePicInputRef} />
                        <ImageSection label="Cover Image" field="coverImage" inputRef={coverImageInputRef} />
                    </div>

                    {/* Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-[#1A1140]/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl flex flex-col relative z-20">
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-400 mb-2 ml-1">Category</label>
                            <PremiumDropdown
                                value={formData.category}
                                onChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                                options={categoryOptions}
                                icon={LayoutGrid}
                                placeholder="Select a category"
                            />
                        </div>

                        <div className="bg-[#1A1140]/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl relative z-10">
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2 ml-1">Visibility</label>
                                <div className="space-y-3 mt-4">
                                    <label className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border transition-all ${formData.visibility === 'public' ? 'bg-purple-500/10 border-purple-500/50 text-white' : 'bg-[#0F0529] border-white/5 text-gray-400 hover:border-white/10'}`}>
                                        <div className="flex items-center space-x-3">
                                            <Globe size={20} className={formData.visibility === 'public' ? 'text-purple-400' : 'text-gray-500'} />
                                            <span className="font-medium">Public</span>
                                        </div>
                                        <input type="radio" name="visibility" value="public" checked={formData.visibility === 'public'} onChange={handleChange} className="hidden" />
                                        {formData.visibility === 'public' && <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>}
                                    </label>
                                    <label className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border transition-all ${formData.visibility === 'private' ? 'bg-pink-500/10 border-pink-500/50 text-white' : 'bg-[#0F0529] border-white/5 text-gray-400 hover:border-white/10'}`}>
                                        <div className="flex items-center space-x-3">
                                            <Lock size={20} className={formData.visibility === 'private' ? 'text-pink-400' : 'text-gray-500'} />
                                            <span className="font-medium">Private</span>
                                        </div>
                                        <input type="radio" name="visibility" value="private" checked={formData.visibility === 'private'} onChange={handleChange} className="hidden" />
                                        {formData.visibility === 'private' && <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Permission Settings */}
                    <div className="bg-[#1A1140]/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Shield size={20} className="text-purple-400" />
                            Circle Permissions
                        </h3>
                        <div className="space-y-4">
                            {[
                                { id: 'allowMemberPosts', label: 'Allow members to post', desc: 'Anyone in the circle can create new posts' },
                                { id: 'allowMemberInvites', label: 'Allow members to invite', desc: 'Members can generate invite codes' },
                                { id: 'requirePostApproval', label: 'Require post approval', desc: 'Moderators must approve posts before they go live' }
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-[#0F0529] rounded-2xl border border-white/5">
                                    <div>
                                        <p className="font-semibold">{item.label}</p>
                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleSettingToggle(item.id)}
                                        className={`w-12 h-6 rounded-full transition-all relative ${formData.settings[item.id] ? 'bg-purple-600' : 'bg-gray-700'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.settings[item.id] ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-5 rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl shadow-purple-900/40 mt-4 flex items-center justify-center space-x-3"
                    >
                        <Plus size={24} />
                        <span>Launch Your Circle</span>
                    </button>
                </form>
            </main>
        </div>
    );
};

export default CreateCirclePage;
