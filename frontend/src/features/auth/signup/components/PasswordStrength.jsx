import React from 'react';

const PasswordStrength = ({ password }) => {
    const getStrength = (pass) => {
        if (!pass) return { label: '', color: 'bg-white/10', width: '0%', text: 'text-white/40' };
        if (pass.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '33%', text: 'text-red-500' };
        if (pass.length < 10) return { label: 'Moderate', color: 'bg-yellow-500', width: '66%', text: 'text-yellow-500' };
        return { label: 'Strong', color: 'bg-green-500', width: '100%', text: 'text-green-500' };
    };

    const strength = getStrength(password);

    return (
        <div className="mt-2 text-xs">
            <div className="flex justify-between mb-1">
                <span className="text-white/60">Strength</span>
                <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                    className={`h-full ${strength.color} transition-all duration-300`}
                    style={{ width: strength.width }}
                />
            </div>
        </div>
    );
};

export default PasswordStrength;
