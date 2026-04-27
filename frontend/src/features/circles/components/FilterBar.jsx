import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Filter } from 'lucide-react';

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
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="mb-12 max-w-4xl mx-auto flex flex-col items-center gap-4">
            {/* Desktop View: Horizontal List */}
            <div className="hidden md:flex flex-wrap items-center justify-center gap-3 bg-white/2 backdrop-blur-xl p-3 rounded-[32px] border border-white/5 shadow-2xl">
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

            {/* Mobile View: Premium Dropdown */}
            <div className="md:hidden relative w-full px-4" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between gap-3 px-6 py-4 rounded-[24px] bg-white/5 backdrop-blur-xl border border-white/10 text-sm font-bold text-white transition-all shadow-xl active:scale-[0.98] ${isOpen ? 'ring-2 ring-purple-500/50 border-purple-500/50' : ''}`}
                >
                    <div className="flex items-center gap-3">
                        <Filter size={18} className="text-purple-400" />
                        <span>{selectedCategory}</span>
                    </div>
                    <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-purple-400' : 'text-white/40'}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-4 right-4 mt-3 bg-[#1A1140]/95 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="p-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        onSelectCategory(category);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all mb-1 last:mb-0 ${
                                        selectedCategory === category 
                                        ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg' 
                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
