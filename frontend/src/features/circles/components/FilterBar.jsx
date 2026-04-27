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
        <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                        ? 'bg-[#7C3AED] text-white shadow-lg shadow-purple-500/20'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default FilterBar;
