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
        <div className="flex items-center gap-2 mb-12 bg-white/2 backdrop-blur-xl p-2 rounded-[24px] border border-white/5 max-w-4xl mx-auto overflow-x-auto no-scrollbar scroll-smooth">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className={`px-6 py-3 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${
                        selectedCategory === category
                        ? 'bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/20'
                        : 'text-gray-500 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default FilterBar;
