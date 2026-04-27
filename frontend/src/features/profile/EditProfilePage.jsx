import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Save, Shield, Palette, User, Image as ImageIcon, Link as LinkIcon, X } from 'lucide-react';
import FeedNavbar from '../feed/components/FeedNavbar';
import axios from 'axios';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_URL;
    // const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
        profilePic: '',
        coverImage: '',
        preferences: {
            theme: 'dark',
            language: 'en'
        },
        privacy: {
            profileVisibility: 'public',
            messagePrivacy: 'everyone',
            showOnlineStatus: true
        }
    });

    const [uploadModes, setUploadModes] = useState({
        profilePic: 'link',
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

    useEffect(() => {
        const loadUserData = () => {
            try {
                const userData = localStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    setFormData({
                        displayName: user.displayName || '',
                        bio: user.bio || '',
                        profilePic: user.profilePic || '',
                        coverImage: user.coverImage || '',
                        preferences: {
                            theme: user.preferences?.theme || 'dark',
                            language: user.preferences?.language || 'en'
                        },
                        privacy: {
                            profileVisibility: user.privacy?.profileVisibility || 'public',
                            messagePrivacy: user.privacy?.messagePrivacy || 'everyone',
                            showOnlineStatus: user.privacy?.showOnlineStatus ?? true
                        }
                    });
                    setPreviews({
                        profilePic: user.profilePic || '',
                        coverImage: user.coverImage || ''
                    });
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };
        loadUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Handle nested fields (e.g., preferences.theme)
        if (name.includes('.')) {
            const [section, field] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        // Clear messages when user types
        setError('');
        setSuccess('');
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

    const validateForm = () => {
        if (formData.displayName && formData.displayName.length > 25) {
            setError('Display name must be less than 25 characters');
            return false;
        }
        if (formData.bio && formData.bio.length > 500) {
            setError('Bio must be less than 500 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setSaving(true);
        setError('');
        setSuccess('');
        
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Use FormData for file support
            const submitData = new FormData();
            submitData.append('displayName', formData.displayName || '');
            submitData.append('bio', formData.bio || '');
            submitData.append('preferences', JSON.stringify(formData.preferences));
            submitData.append('privacy', JSON.stringify(formData.privacy));

            // Handle Images
            if (uploadModes.profilePic === 'upload' && files.profilePic) {
                submitData.append('profilePic', files.profilePic);
            } else if (formData.profilePic) {
                submitData.append('profilePicUrl', formData.profilePic);
            }

            if (uploadModes.coverImage === 'upload' && files.coverImage) {
                submitData.append('coverImage', files.coverImage);
            } else if (formData.coverImage) {
                submitData.append('coverImageUrl', formData.coverImage);
            }

            const response = await axios.put(
                `${baseUrl}/api/users/profile`,
                submitData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );


            if (response.data.success) {
                // Update local storage with new user data
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                setSuccess('Profile updated successfully!');
                
                // Redirect after short delay
                setTimeout(() => {
                    navigate(`/profile/${response.data.user.username}`);
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            
            const errorMessage = error.response?.data?.error || 
                                error.response?.data?.message || 
                                error.message || 
                                'Failed to update profile';
            
            setError(errorMessage);
            
            // Handle token expiration
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans">
            <FeedNavbar />

            <main className="max-w-3xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-bold">Edit Profile</h1>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] font-semibold transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
                    >
                        <Save size={18} />
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>

                {/* Success/Error Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Media Section */}
                    <div className="grid grid-cols-1 gap-8">
                        {/* Profile Picture Card */}
                        <div className="bg-[#1E1B3A]/50 border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-500/10 rounded-xl">
                                        <Camera size={20} className="text-purple-400" />
                                    </div>
                                    <h2 className="text-lg font-bold tracking-tight">Profile Identity</h2>
                                </div>
                                <div className="flex bg-[#0F0529]/80 p-1 rounded-2xl border border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setUploadModes(prev => ({ ...prev, profilePic: 'upload' }))}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${uploadModes.profilePic === 'upload' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        Upload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUploadModes(prev => ({ ...prev, profilePic: 'link' }))}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${uploadModes.profilePic === 'link' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        Link
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-10">
                                <div className="relative group shrink-0">
                                    <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all duration-500 shadow-2xl">
                                        {previews.profilePic ? (
                                            <img src={previews.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-[#0F0529] flex items-center justify-center text-gray-700">
                                                <User size={48} />
                                            </div>
                                        )}
                                    </div>
                                    {previews.profilePic && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviews(prev => ({ ...prev, profilePic: '' }));
                                                setFormData(prev => ({ ...prev, profilePic: '' }));
                                                setFiles(prev => ({ ...prev, profilePic: null }));
                                            }}
                                            className="absolute -top-1 -right-1 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform z-10"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex-1 w-full space-y-4">
                                    {uploadModes.profilePic === 'upload' ? (
                                        <div 
                                            onClick={() => profilePicInputRef.current?.click()}
                                            className="w-full border-2 border-dashed border-white/5 hover:border-purple-500/50 hover:bg-purple-500/5 bg-[#0F0529] rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group"
                                        >
                                            <ImageIcon size={24} className="text-gray-600 mb-2 group-hover:text-purple-500 transition-colors" />
                                            <span className="text-xs font-bold text-gray-500">Click to upload photo</span>
                                            <input 
                                                type="file" 
                                                ref={profilePicInputRef}
                                                onChange={(e) => handleFileSelect(e, 'profilePic')}
                                                className="hidden" 
                                                accept="image/*" 
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Direct Image URL</label>
                                            <div className="relative">
                                                <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                                <input
                                                    type="url"
                                                    value={formData.profilePic}
                                                    onChange={(e) => handleUrlChange(e.target.value, 'profilePic')}
                                                    placeholder="https://example.com/photo.jpg"
                                                    className="w-full bg-[#0F0529] border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-purple-500 transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Cover Image Card */}
                        <div className="bg-[#1E1B3A]/50 border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-500/10 rounded-xl">
                                        <ImageIcon size={20} className="text-purple-400" />
                                    </div>
                                    <h2 className="text-lg font-bold tracking-tight">Cover Branding</h2>
                                </div>
                                <div className="flex bg-[#0F0529]/80 p-1 rounded-2xl border border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setUploadModes(prev => ({ ...prev, coverImage: 'upload' }))}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${uploadModes.coverImage === 'upload' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        Upload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUploadModes(prev => ({ ...prev, coverImage: 'link' }))}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${uploadModes.coverImage === 'link' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        Link
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="relative w-full h-40 rounded-3xl overflow-hidden bg-[#0F0529] border border-white/5 group">
                                    {previews.coverImage ? (
                                        <img src={previews.coverImage} alt="Cover" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                                            <ImageIcon size={32} className="mb-2 opacity-50" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">No Cover Set</span>
                                        </div>
                                    )}
                                    {previews.coverImage && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviews(prev => ({ ...prev, coverImage: '' }));
                                                setFormData(prev => ({ ...prev, coverImage: '' }));
                                                setFiles(prev => ({ ...prev, coverImage: null }));
                                            }}
                                            className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>

                                {uploadModes.coverImage === 'upload' ? (
                                    <div 
                                        onClick={() => coverImageInputRef.current?.click()}
                                        className="w-full border-2 border-dashed border-white/5 hover:border-purple-500/50 hover:bg-purple-500/5 bg-[#0F0529] rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group"
                                    >
                                        <Camera size={24} className="text-gray-600 mb-2 group-hover:text-purple-500 transition-colors" />
                                        <span className="text-xs font-bold text-gray-500">Upload cover image</span>
                                        <input 
                                            type="file" 
                                            ref={coverImageInputRef}
                                            onChange={(e) => handleFileSelect(e, 'coverImage')}
                                            className="hidden" 
                                            accept="image/*" 
                                        />
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input
                                            type="url"
                                            value={formData.coverImage}
                                            onChange={(e) => handleUrlChange(e.target.value, 'coverImage')}
                                            placeholder="https://example.com/banner.jpg"
                                            className="w-full bg-[#0F0529] border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-purple-500 transition-all text-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="bg-[#1E1B3A]/50 border border-white/5 rounded-3xl p-8 space-y-6">
                        <div className="flex items-center space-x-2 mb-2">
                            <User size={20} className="text-purple-400" />
                            <h2 className="text-lg font-semibold">Basic Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Display Name</label>
                                <input
                                    type="text"
                                    name="displayName"
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    maxLength="25"
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.displayName?.length || 0}/25 characters
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-400 mb-2 block">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="4"
                                maxLength="500"
                                className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                placeholder="Describe yourself..."
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.bio?.length || 0}/500 characters
                            </p>
                        </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="bg-[#1E1B3A]/50 border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-purple-500/10 rounded-xl">
                                <Shield size={20} className="text-purple-400" />
                            </div>
                            <h2 className="text-lg font-bold tracking-tight">Privacy &amp; Safety</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1 block mb-3">Profile Visibility</label>
                                <select
                                    name="privacy.profileVisibility"
                                    value={formData.privacy.profileVisibility}
                                    onChange={handleChange}
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-all text-sm appearance-none cursor-pointer hover:border-purple-500/50"
                                >
                                    <option value="public">Public (Everyone can see)</option>
                                    <option value="followers">Followers Only</option>
                                    <option value="private">Private (Only you)</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1 block mb-3">Message Privacy</label>
                                <select
                                    name="privacy.messagePrivacy"
                                    value={formData.privacy.messagePrivacy}
                                    onChange={handleChange}
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-all text-sm appearance-none cursor-pointer hover:border-purple-500/50"
                                >
                                    <option value="everyone">Allow DMs from Everyone</option>
                                    <option value="followers">Followers Only</option>
                                    <option value="none">Disable DMs</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[#0F0529] rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group cursor-pointer" onClick={() => handleChange({ target: { name: 'privacy.showOnlineStatus', type: 'checkbox', checked: !formData.privacy.showOnlineStatus }})}>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-200">Show Online Status</span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Let others see when you're active</span>
                                </div>
                                <div className={`w-12 h-6 rounded-full transition-all relative ${formData.privacy.showOnlineStatus ? 'bg-purple-600' : 'bg-gray-700'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-lg ${formData.privacy.showOnlineStatus ? 'right-1' : 'left-1'}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditProfilePage;