import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Globe, Lock, Shield, Image as ImageIcon } from 'lucide-react';
import FeedNavbar from '../../feed/components/FeedNavbar';

const CreateCirclePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Technology',
        visibility: 'public',
        icon: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder for API call
        console.log('Creating Circle:', formData);
        alert('Circle created successfully! (Mock)');
        navigate('/circles');
    };

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans">
            <FeedNavbar activePage="Circles" />

            <main className="max-w-3xl mx-auto px-6 py-12">
                <div className="flex items-center space-x-4 mb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 hover:bg-white/5 rounded-full transition-all border border-white/5 hover:border-purple-500/30"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Create a New Circle</h1>
                        <p className="text-gray-400">Set the stage for your new circle.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-[#1A1140]/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl">
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-2 ml-1">Circle Name</label>
                            <input
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
                            <label className="block text-sm font-semibold text-gray-400 mb-2 ml-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="What is this circle about?"
                                rows="4"
                                className="w-full bg-[#0F0529] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-lg resize-none"
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-[#1A1140]/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl">
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2 ml-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-[#0F0529] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-all text-lg appearance-none cursor-pointer"
                                >
                                    <option>Technology</option>
                                    <option>UI/UX Design</option>
                                    <option>Gaming</option>
                                    <option>Digital Art</option>
                                    <option>Web3</option>
                                    <option>Startups</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-[#1A1140]/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl">
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

                    {/* Icon URL */}
                    <div className="bg-[#1A1140]/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl">
                        <label className="block text-sm font-semibold text-gray-400 mb-4 ml-1">Circle Icon URL</label>
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 rounded-2xl bg-[#0F0529] border border-dashed border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                {formData.icon ? (
                                    <img src={formData.icon} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                ) : (
                                    <ImageIcon size={32} className="text-gray-600" />
                                )}
                            </div>
                            <input
                                type="text"
                                name="icon"
                                value={formData.icon}
                                onChange={handleChange}
                                placeholder="Paste an image URL for the circle icon..."
                                className="w-full bg-[#0F0529] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-all font-medium"
                            />
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
