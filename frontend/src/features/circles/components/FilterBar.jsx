import React from 'react';

const categories = [
    'All Categories',
    'Technology',
    'UI/UX Design',
    'Gaming',
    'Digital Art',
    'Web3',
    'Startups'
];

const FilterBar = ({ selectedCategory, onSelectCategory }) => {
    return (
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12 bg-white/2 backdrop-blur-xl p-3 rounded-[32px] border border-white/5 max-w-4xl mx-auto shadow-2xl">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 border ${
                        selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                        : 'text-white/60 hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default FilterBar;
