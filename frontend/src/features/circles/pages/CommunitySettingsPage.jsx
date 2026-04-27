import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    Settings, ArrowLeft, Shield, Sparkles, 
    Lock, Save, AlertTriangle, Image as ImageIcon,
    Check, Loader2, Camera, UploadCloud, X, Link as LinkIcon
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

    // Media refs & states
    const profilePicInputRef = useRef(null);
    const coverImageInputRef = useRef(null);
    
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

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'public',
        coverImage: '',
        profilePic: '',
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
                        profilePic: c.profilePic || '',
                        settings: {
                            allowMemberPosts: c.settings?.allowMemberPosts ?? true,
                            allowMemberInvites: c.settings?.allowMemberInvites ?? true
                        }
                    });
                    setPreviews({
                        profilePic: c.profilePic || '',
                        coverImage: c.coverImage || ''
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

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            
            const submitData = new FormData();
            submitData.append('description', formData.description);
            submitData.append('settings', JSON.stringify(formData.settings));

            // Profile Pic
            if (uploadModes.profilePic === 'upload' && files.profilePic) {
                submitData.append('profilePic', files.profilePic);
            } else {
                submitData.append('profilePic', formData.profilePic);
            }

            // Cover Image
            if (uploadModes.coverImage === 'upload' && files.coverImage) {
                submitData.append('coverImage', files.coverImage);
            } else {
                submitData.append('coverImage', formData.coverImage);
            }

            const res = await axios.put(`${baseUrl}/api/circles/${circle._id}`, submitData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
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

    const ImageSection = ({ label, field, inputRef }) => (
        <div className="bg-[#1A1140]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">{label}</label>
                <div className="flex bg-[#0F0529] p-1 rounded-xl border border-white/5">
                    <button 
                        type="button"
                        onClick={() => setUploadModes(prev => ({ ...prev, [field]: 'upload' }))}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${uploadModes[field] === 'upload' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <Camera size={12} />
                        <span>Upload</span>
                    </button>
                    <button 
                        type="button"
                        onClick={() => setUploadModes(prev => ({ ...prev, [field]: 'link' }))}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${uploadModes[field] === 'link' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <LinkIcon size={12} />
                        <span>Link</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className={`relative ${field === 'profilePic' ? 'w-24 h-24' : 'w-full h-32'} bg-[#0F0529] rounded-2xl border border-dashed border-white/10 flex items-center justify-center overflow-hidden shrink-0 group`}>
                    {previews[field] ? (
                        <>
                            <img src={previews[field]} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setPreviews(prev => ({ ...prev, [field]: '' }));
                                        setFormData(prev => ({ ...prev, [field]: '' }));
                                        setFiles(prev => ({ ...prev, [field]: null }));
                                    }}
                                    className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-500 transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <ImageIcon size={field === 'profilePic' ? 24 : 32} className="text-gray-700" />
                    )}
                </div>

                <div className="flex-1 w-full">
                    {uploadModes[field] === 'upload' ? (
                        <div 
                            onClick={() => inputRef.current?.click()}
                            className="w-full h-24 border-2 border-dashed border-white/5 hover:border-purple-500/50 bg-[#0F0529] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group"
                        >
                            <UploadCloud size={20} className="text-gray-600 mb-2 group-hover:text-purple-400 transition-colors" />
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Click to Upload</p>
                            <input 
                                type="file" 
                                ref={inputRef} 
                                onChange={(e) => handleFileSelect(e, field)} 
                                className="hidden" 
                                accept="image/*"
                            />
                        </div>
                    ) : (
                        <input
                            type="text"
                            placeholder={`Paste ${label} URL...`}
                            value={formData[field]}
                            onChange={(e) => handleUrlChange(e.target.value, field)}
                            className="w-full bg-[#0F0529] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-all font-medium text-sm"
                        />
                    )}
                </div>
            </div>
        </div>
    );

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
                    <div className="space-y-6">
                        <ImageSection label="Circle Banner" field="coverImage" inputRef={coverImageInputRef} />
                        <ImageSection label="Community Icon" field="profilePic" inputRef={profilePicInputRef} />
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
                            <label className="block text-[10px] font-bold text-gray-400 mb-2 ml-1 tracking-widest uppercase">Circle Name</label>
                            <input 
                                type="text" 
                                value={formData.name}
                                disabled
                                className="auth-input opacity-50 cursor-not-allowed" 
                                title="Name changes are currently restricted"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-2 ml-1 tracking-widest uppercase">Community Description</label>
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
                                <Loader2 className="animate-spin" size={16} />
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

export default CommunitySettingsPage;

