import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Save, Shield, Palette, User } from 'lucide-react';
import FeedNavbar from '../feed/components/FeedNavbar';
import axios from 'axios';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);
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

            // Prepare data for backend - match controller's expected fields
            const updateData = {
                displayName: formData.displayName || undefined,
                bio: formData.bio || undefined,
                profilePic: formData.profilePic || undefined,
                coverImage: formData.coverImage || undefined,
                preferences: {
                    theme: formData.preferences.theme,
                    language: formData.preferences.language
                },
                privacy: {
                    profileVisibility: formData.privacy.profileVisibility,
                    messagePrivacy: formData.privacy.messagePrivacy,
                    showOnlineStatus: formData.privacy.showOnlineStatus
                }
            };

            // Remove undefined values
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            });

            console.log('Sending update:', updateData);

            const response = await axios.put(
                `${baseUrl}/api/users/profile`,
                updateData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Update response:', response.data);

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
                    {/* Profile Picture Section */}
                    <div className="bg-[#1E1B3A]/50 border border-white/5 rounded-3xl p-8 flex flex-col items-center">
                        <div className="relative group cursor-pointer">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/30 group-hover:border-purple-500 transition-colors">
                                <img
                                    src={formData.profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                <Camera size={24} className="text-white" />
                            </div>
                        </div>
                        <div className="mt-6 w-full max-w-md">
                            <label className="text-sm font-medium text-gray-400 mb-2 block">Profile Picture URL</label>
                            <input
                                type="url"
                                name="profilePic"
                                value={formData.profilePic}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                            />
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

                    {/* Preferences & Privacy */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#1E1B3A]/50 border border-white/5 rounded-3xl p-8 space-y-6">
                            <div className="flex items-center space-x-2 mb-2">
                                <Palette size={20} className="text-purple-400" />
                                <h2 className="text-lg font-semibold">Preferences</h2>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Theme</label>
                                <select
                                    name="preferences.theme"
                                    value={formData.preferences.theme}
                                    onChange={handleChange}
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                                >
                                    <option value="dark">Dark</option>
                                    <option value="light">Light</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Language</label>
                                <select
                                    name="preferences.language"
                                    value={formData.preferences.language}
                                    onChange={handleChange}
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-[#1E1B3A]/50 border border-white/5 rounded-3xl p-8 space-y-6">
                            <div className="flex items-center space-x-2 mb-2">
                                <Shield size={20} className="text-purple-400" />
                                <h2 className="text-lg font-semibold">Privacy</h2>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Profile Visibility</label>
                                <select
                                    name="privacy.profileVisibility"
                                    value={formData.privacy.profileVisibility}
                                    onChange={handleChange}
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                                >
                                    <option value="public">Public</option>
                                    <option value="followers">Followers Only</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Message Privacy</label>
                                <select
                                    name="privacy.messagePrivacy"
                                    value={formData.privacy.messagePrivacy}
                                    onChange={handleChange}
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                                >
                                    <option value="everyone">Everyone</option>
                                    <option value="followers">Followers Only</option>
                                    <option value="none">No One</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-400">Show Online Status</label>
                                <input
                                    type="checkbox"
                                    name="privacy.showOnlineStatus"
                                    checked={formData.privacy.showOnlineStatus}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-white/10 bg-[#0F0529] text-purple-500 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditProfilePage;