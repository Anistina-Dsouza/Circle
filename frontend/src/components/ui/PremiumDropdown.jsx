import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const PremiumDropdown = ({ value, onChange, options, icon: Icon, placeholder = "Select option" }) => {
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

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    return (
        <div className={`relative ${isOpen ? 'z-[999]' : 'z-10'}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all shadow-lg min-w-[160px] justify-between group ${isOpen ? 'ring-2 ring-purple-500/50 border-purple-500/50' : ''}`}
            >
                <div className="flex items-center gap-3">
                    {Icon && <Icon size={16} className={isOpen ? 'text-purple-400' : 'text-white/20'} />}
                    <span>{selectedOption?.label || placeholder}</span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-purple-400' : 'text-white/20'}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-3 w-full min-w-[200px] bg-[#1A1140]/95 border border-white/10 rounded-2xl shadow-2xl z-[999] overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 space-y-1">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${value === opt.value ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg scale-[1.02]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PremiumDropdown;
