import React, { useState } from 'react';

const InterestSelector = () => {
    const interests = [
        'Technology', 'Mindfulness', 'Art', 'Productivity',
        'Community', 'Design'
    ];

    const [selected, setSelected] = useState([]);

    const toggleInterest = (interest) => {
        setSelected(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    return (
        <div className="space-y-3">
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest">
                What are you into?
            </label>
            <div className="flex flex-wrap gap-2">
                {interests.map(interest => (
                    <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${selected.includes(interest)
                                ? 'bg-brand-purple border-brand-purple text-white'
                                : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                            }`}
                    >
                        {interest}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default InterestSelector;
