import React from 'react';

const categories = [
    { name: 'All Categories', icon: '✨' },
    { name: 'Technology', icon: '💻' },
    { name: 'UI/UX Design', icon: '🎨' },
    { name: 'Gaming', icon: '🎮' },
    { name: 'Digital Art', icon: '🖼️' },
    { name: 'Web3', icon: '⛓️' },
    { name: 'Startups', icon: '🚀' }
];

const FilterBar = ({ selectedCategory, onSelectCategory }) => {
    return (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
                <button
                    key={cat.name}
                    onClick={() => onSelectCategory(cat.name)}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${
                        selectedCategory === cat.name
                        ? 'bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-xl shadow-purple-900/40 border-purple-500/50 scale-105'
                        : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white border-white/5 active:scale-95'
                    }`}
                >
                    <span className="text-sm">{cat.icon}</span>
                    {cat.name}
                </button>
            ))}
        </div>
    );
};

export default FilterBar;
