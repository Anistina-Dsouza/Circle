import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FeedNavbar from '../../feed/components/FeedNavbar';
import CircleHeader from '../components/CircleHeader';
import FilterBar from '../components/FilterBar';
import CircleCard from '../components/CircleCard';
import { Plus } from 'lucide-react';

const mockCircles = [
    {
        id: 1,
        name: "Tech Pioneers",
        description: "Discussing the future of AI and space exploration with leading experts.",
        icon: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
        members: "24.8k",
        schedule: "8PM",
        status: "Live Now",
        category: "Technology"
    },
    {
        id: 2,
        name: "Minimalist Design",
        description: "A hub for designers focusing on clean aesthetics and functional UI components.",
        icon: "https://cdn-icons-png.flaticon.com/512/3850/3850285.png",
        members: "12.2k",
        schedule: "Weekly",
        status: "",
        category: "UI/UX Design"
    },
    {
        id: 3,
        name: "Game Dev Central",
        description: "From Indie to AAA. Share your shaders, code, and level designs.",
        icon: "https://cdn-icons-png.flaticon.com/512/681/681392.png",
        members: "38.5k",
        schedule: "24/7",
        status: "Active",
        category: "Gaming"
    },
    {
        id: 4,
        name: "Sonic Waves",
        description: "Deep dives into analog synthesis and modern digital production techniques.",
        icon: "https://cdn-icons-png.flaticon.com/512/3081/3081120.png",
        members: "8.9k",
        schedule: "Thu 7PM",
        status: "",
        category: "Digital Art"
    },
    {
        id: 5,
        name: "React Universe",
        description: "Exploring the ecosystem of React, Next.js, and server components.",
        icon: "https://cdn-icons-png.flaticon.com/512/919/919851.png",
        members: "15.4k",
        schedule: "Daily",
        status: "",
        category: "Technology"
    },
    {
        id: 6,
        name: "Esports Elite",
        description: "The competitive scene for global shooters and strategy titles.",
        icon: "https://cdn-icons-png.flaticon.com/512/2164/2164327.png",
        members: "42.1k",
        schedule: "Live TV",
        status: "",
        category: "Gaming"
    }
];

const CirclesPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('All Categories');

    const filteredCircles = selectedCategory === 'All Categories'
        ? mockCircles
        : mockCircles.filter(c => c.category === selectedCategory);

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
                        className="flex items-center space-x-2 px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-purple-900/40"
                    >
                        <Plus size={20} />
                        <span>Create Circle</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCircles.map((circle) => (
                        <CircleCard key={circle.id} circle={circle} />
                    ))}
                </div>

                <div className="flex justify-center mt-20">
                    <button className="px-10 py-4 rounded-2xl border border-white/5 text-gray-400 hover:text-white hover:border-purple-500/30 transition-all bg-white/5 backdrop-blur-md font-semibold text-lg">
                        Load More Circles
                    </button>
                </div>

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
