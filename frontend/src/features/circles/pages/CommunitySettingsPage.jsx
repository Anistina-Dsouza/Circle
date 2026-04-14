import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    Settings, ArrowLeft, Shield, Sparkles, 
    Lock, Save, AlertTriangle, Image as ImageIcon,
    Check, Loader2, Camera, UploadCloud
} from 'lucide-react';

import FeedNavbar from '../../feed/components/FeedNavbar';
import SettingsSection from '../components/settings/SettingsSection';
import ToggleSwitch from '../components/settings/ToggleSwitch';

const CommunitySettingsPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [circle, setCircle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const baseUrl = import.meta.env.VITE_API_URL;

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'public',
        coverImage: '',
        profileImage: '', // Simulated field
        settings: {
            allowMemberPosts: true,
            allowMemberInvites: true
        }
    });

    useEffect(() => {
        const fetchCircle = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${baseUrl}/api/circles/${slug}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                
                if (res.data.success) {
                    const c = res.data.circle;
                    setCircle(c);
                    setFormData({
                        name: c.name,
                        description: c.description || '',
                        type: c.type || 'public',
                        coverImage: c.coverImage || '',
                        profileImage: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop', // Default mock
                        settings: {
                            allowMemberPosts: c.settings?.allowMemberPosts ?? true,
                            allowMemberInvites: c.settings?.allowMemberInvites ?? true
                        }
                    });
                }
            } catch (err) {
                console.error('Failed to fetch circle settings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCircle();
    }, [slug, baseUrl]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            // Sending allowMemberPosts and allowMemberInvites to existing settings field
            const res = await axios.put(`${baseUrl}/api/circles/${circle._id}`, {
                description: formData.description,
                coverImage: formData.coverImage,
                settings: formData.settings
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteCircle = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`${baseUrl}/api/circles/${circle._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                navigate('/circles');
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete circle');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F0529] flex items-center justify-center">
                <Loader2 className="animate-spin text-purple-500" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans flex flex-col selection:bg-purple-500/30">
            <FeedNavbar activePage="Circles" />
            
            <div className="max-w-[1000px] w-full mx-auto px-6 py-10 pb-32">
                
                {/* Breadcrumbs & Header */}
                <div className="mb-12">
                    <Link 
                        to={`/circles/${slug}/manage`} 
                        className="inline-flex items-center gap-2 text-purple-400 font-bold text-xs tracking-wide hover:text-purple-300 transition-colors mb-4 group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Host Dashboard
                    </Link>
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-purple-600/10 border border-purple-500/20 rounded-[28px] text-purple-500 shadow-xl shadow-purple-900/20">
                            <Settings size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight">Community Settings</h1>
                            <p className="text-gray-500 font-bold text-xs tracking-widest mt-1">Global Configuration Hub</p>
                        </div>
                    </div>
                </div>

                {/* 1. Community Media Section */}
                <SettingsSection 
                    title="Community Media" 
                    description="Customize the visual appearance of your circle."
                    icon={ImageIcon}
                >
                    <div className="space-y-8">
                        {/* Banner Upload */}
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-3 ml-1 tracking-widest">Circle Banner</label>
                            <div className="relative group/banner aspect-[3/1] rounded-3xl overflow-hidden border border-white/10 bg-[#1A1140]/40">
                                <img 
                                    src={formData.coverImage || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop'} 
                                    alt="Banner" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/banner:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all active:scale-90">
                                        <Camera size={20} />
                                    </button>
                                    <button className="p-3 bg-purple-600/80 backdrop-blur-md rounded-full text-white hover:bg-purple-600 transition-all active:scale-90 shadow-xl shadow-purple-900/40">
                                        <UploadCloud size={20} />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5">
                                    <p className="text-[9px] font-bold text-gray-300">Optimal: 1500 × 500 px</p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Pic Upload */}
                        <div className="flex items-center gap-8">
                            <div className="relative group/avatar">
                                <div className="w-24 h-24 rounded-[32px] overflow-hidden border-2 border-purple-500/30 bg-[#1A1140]/60 p-1 group-hover/avatar:border-purple-500 transition-all">
                                    <img 
                                        src={formData.profileImage} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover rounded-[28px]"
                                    />
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-2.5 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-900/40 border border-[#0F0529] hover:scale-110 transition-transform active:scale-95">
                                    <Camera size={14} />
                                </button>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-white mb-1">Community Icon</h4>
                                <p className="text-xs text-gray-500 leading-relaxed mb-3">This icon appears in the sidebar and chat list. Recommended: Square high-res image.</p>
                                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-gray-400 hover:text-white hover:border-white/20 transition-all">
                                    Remove Icon
                                </button>
                            </div>
                        </div>
                    </div>
                </SettingsSection>

                {/* 2. General Branding Section */}
                <SettingsSection 
                    title="General Information" 
                    description="Set the core identity of your community."
                    icon={Sparkles}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-2 ml-1 tracking-widest">Circle Name</label>
                            <input 
                                type="text" 
                                value={formData.name}
                                disabled
                                className="auth-input opacity-50 cursor-not-allowed" 
                                title="Name changes are currently restricted"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-2 ml-1 tracking-widest">Community Description</label>
                            <textarea 
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="auth-input focus:ring-purple-500/50 py-4" 
                                placeholder="What is this space about?"
                            ></textarea>
                        </div>
                    </div>
                </SettingsSection>

                {/* 3. Privacy & Member Permissions */}
                <SettingsSection 
                    title="Privacy & Permissions" 
                    description="Configure community visibility and member rights."
                    icon={Shield}
                    badge={{ 
                        text: formData.type === 'private' ? 'Private' : 'Public', 
                        style: formData.type === 'private' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20' 
                    }}
                >
                    <div className="space-y-4">
                        <ToggleSwitch 
                            enabled={formData.settings.allowMemberPosts} 
                            setEnabled={(val) => setFormData({
                                ...formData, 
                                settings: { ...formData.settings, allowMemberPosts: val }
                            })}
                            label="Member Story Posting"
                            description="Allow all members to contribute stories to the circle's feed."
                        />
                        <div className="h-px bg-white/5 my-2" />
                        <ToggleSwitch 
                            enabled={formData.settings.allowMemberInvites} 
                            setEnabled={(val) => setFormData({
                                ...formData, 
                                settings: { ...formData.settings, allowMemberInvites: val }
                            })}
                            label="Member Invite Access"
                            description="Allow members to generate their own invitation links."
                        />
                        <div className="h-px bg-white/5 my-4" />
                        <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
                             <div className="flex gap-3">
                                <Lock size={16} className="text-purple-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-gray-300">Visibility Type: {formData.type.toUpperCase()}</p>
                                    <p className="text-[11px] text-gray-500 mt-1">Community type is permanent. If you need to switch between public and private, please archive this community and create a new one.</p>
                                </div>
                             </div>
                        </div>
                    </div>
                </SettingsSection>

                {/* 4. Danger Zone */}
                <div className="bg-red-500/5 border border-red-500/10 rounded-[32px] p-8 mt-12 mb-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-red-500/10 rounded-2xl text-red-400">
                            <AlertTriangle size={22} strokeWidth={2} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-red-400 tracking-tight">Danger Zone</h2>
                            <p className="text-sm text-red-500/60 font-medium">Irreversible actions for your community.</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-[#0F0529]/40 border border-red-500/20 rounded-2xl">
                        <div>
                            <h4 className="font-bold text-white tracking-tight">Delete Community</h4>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Permanently remove this circle, its members, and all associated content.</p>
                        </div>
                        <button 
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full sm:w-auto px-8 py-3 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-bold text-xs tracking-wide transition-all active:scale-95"
                        >
                            Delete Circle
                        </button>
                    </div>
                </div>

                {/* Persistent Save Bar */}
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[800px] px-6 z-40">
                    <div className="bg-[#1A1140]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex items-center justify-between shadow-2xl shadow-purple-900/40 animate-in slide-in-from-bottom-10 fade-in duration-500">
                        <div className="flex items-center gap-3 px-2">
                             {saveSuccess ? (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                        <Check size={18} strokeWidth={3} />
                                    </div>
                                    <p className="text-sm font-bold text-green-400">Configuration saved!</p>
                                </>
                             ) : (
                                <>
                                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                    <p className="text-xs font-bold text-gray-400 tracking-wide">Adjusting community protocol...</p>
                                </>
                             )}
                        </div>
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl text-white font-bold text-xs tracking-wide hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-[1.05] active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-xl shadow-purple-900/40"
                        >
                            {saving ? (
                                <Loader2Icon className="animate-spin" size={16} />
                            ) : (
                                <Save size={16} />
                            )}
                            {saving ? 'Syncing...' : 'Save Settings'}
                        </button>
                    </div>
                </div>

            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
                    <div className="absolute inset-0 bg-[#0F0529]/80 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
                    <div className="relative bg-[#1A1140] border border-red-500/30 rounded-[40px] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 bg-red-500/10 rounded-[32px] flex items-center justify-center text-red-500 mb-8 mx-auto border border-red-500/20">
                            <AlertTriangle size={36} />
                        </div>
                        <h2 className="text-2xl font-black text-center text-white mb-4 tracking-tight">Delete Community?</h2>
                        <p className="text-gray-400 text-center mb-10 text-sm leading-relaxed">
                            This action is permanent and cannot be undone. You will lose all members, chat history, and shared stories.
                        </p>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-4 bg-white/5 border border-white/5 rounded-2xl text-gray-400 font-bold text-xs tracking-wide hover:bg-white/10 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteCircle}
                                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold text-xs tracking-wide hover:bg-red-600 shadow-xl shadow-red-900/40 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                Yes, Delete Circle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper for the loader
const Loader2Icon = ({ className, size }) => (
    <svg 
        className={className} 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

export default CommunitySettingsPage;
