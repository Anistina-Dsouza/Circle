import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FeedNavbar from '../../feed/components/FeedNavbar';
import CircleHeader from '../components/CircleHeader';
import FilterBar from '../components/FilterBar';
import CircleCard from '../components/CircleCard';
import { Plus, AlertCircle } from 'lucide-react';

const CirclesPage = () => {
    const [circles, setCircles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [pagination, setPagination] = useState({ page: 1, hasMore: false });

    const baseUrl = import.meta.env.VITE_API_URL;

    const fetchCircles = useCallback(async (category = 'All Categories', pageNum = 1, shouldAppend = false) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (category !== 'All Categories') {
                params.append('category', category);
            }
            params.append('page', pageNum);
            params.append('limit', 12);

            const response = await axios.get(`${baseUrl}/api/circles?${params.toString()}`);

            if (response.data.success) {
                const newCircles = response.data.circles || [];
                setCircles(prev => shouldAppend ? [...prev, ...newCircles] : newCircles);
                setPagination({
                    page: response.data.pagination.page,
                    hasMore: response.data.pagination.hasMore
                });
            }
        } catch (err) {
            console.error('Error fetching circles:', err);
            setError(err.response?.data?.error || 'Failed to load circles');
        } finally {
            setLoading(false);
        }
    }, [baseUrl]);

    useEffect(() => {
        fetchCircles(selectedCategory, 1, false);
    }, [selectedCategory, fetchCircles]);

    const handleLoadMore = () => {
        if (pagination.hasMore && !loading) {
            fetchCircles(selectedCategory, pagination.page + 1, true);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans selection:bg-purple-500/30">
            <FeedNavbar activePage="Circles" />

            <main className="max-w-7xl mx-auto px-6 pb-20">
                <CircleHeader />

                <FilterBar
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />

                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight">Explore Circles</h2>
                    <Link
                        to="/circles/create"
                        className="flex items-center space-x-2 px-8 py-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-pink-500 font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-purple-900/40"
                    >
                        <Plus size={20} />
                        <span>Create Circle</span>
                    </Link>
                </div>

                {error && (
                    <div className="mb-10 p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center space-x-3 text-red-500">
                        <AlertCircle size={24} />
                        <span className="text-lg font-medium">{error}</span>
                    </div>
                )}

                {loading && circles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 font-medium">Loading circles...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {circles.map((circle) => (
                                <CircleCard key={circle._id || circle.id} circle={circle} />
                            ))}
                        </div>

                        {circles.length === 0 && !loading && (
                            <div className="text-center py-32 bg-[#1A1140]/30 border border-dashed border-white/10 rounded-[40px]">
                                <h3 className="text-2xl font-bold text-gray-400 mb-2">No circles found</h3>
                                <p className="text-gray-600">Try selecting a different category or create your own!</p>
                            </div>
                        )}

                        {pagination.hasMore && (
                            <div className="flex justify-center mt-20">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    className="px-10 py-4 rounded-2xl border border-white/5 text-gray-400 hover:text-white hover:border-purple-500/30 transition-all bg-white/5 backdrop-blur-md font-semibold text-lg disabled:opacity-50"
                                >
                                    {loading ? 'Loading...' : 'Load More Circles'}
                                </button>
                            </div>
                        )}
                    </>
                )}

                <footer className="mt-40 pt-20 border-t border-white/5 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-8 scale-110">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl">
                            <div className="w-6 h-6 bg-[#3C096C] rounded-full relative overflow-hidden">
                                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-white" />
                            </div>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Circle</span>
                    </div>
                    <p className="max-w-xl mx-auto text-gray-500 text-base leading-relaxed mb-10 px-4">
                        The world's first time-based social discovery engine. Find your circle, join the moment, and connect with creators worldwide.
                    </p>
                    <p className="text-gray-600 text-sm font-medium">
                        © 2026 Circle Social Inc. All rights reserved.
                    </p>
                </footer>
            </main>
        </div>
    );
};


export default CirclesPage;
