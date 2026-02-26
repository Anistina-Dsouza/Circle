import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Save, Shield, Palette, User } from 'lucide-react';
import FeedNavbar from '../feed/components/FeedNavbar';
import axios from 'axios';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        displayName: '',
        username: '',
        bio: '',
        profilePic: '',
        preferences: {
            theme: 'dark'
        },
        privacy: {
            profileVisibility: 'public'
        }
    });

    useEffect(() => {
        const loadUserData = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                setFormData({
                    displayName: user.displayName || '',
                    username: user.username || '',
                    bio: user.bio || '',
                    profilePic: user.profilePic || '',
                    preferences: user.preferences || { theme: 'dark' },
                    privacy: user.privacy || { profileVisibility: 'public' }
                });
            }
        };
        loadUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [section, field] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await axios.put('http://localhost:5000/api/users/profile', formData);
            if (response.data.success) {
                // Update local storage
                localStorage.setItem('user', JSON.stringify(response.data.user));
                alert('Profile updated successfully!');
                navigate(`/profile/${response.data.user.username}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.error || 'Failed to update profile');
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
                                type="text"
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
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Username (cannot be changed)</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    readOnly
                                    className="w-full bg-[#0F0529]/50 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-400 mb-2 block">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="4"
                                className="w-full bg-[#0F0529] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                placeholder="Describe yourself..."
                            ></textarea>
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
                                    <option value="dark">Dark Theme</option>
                                    <option value="light">Light Theme</option>
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
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditProfilePage;
