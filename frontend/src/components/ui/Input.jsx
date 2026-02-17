import React from 'react';

const Input = ({ label, name, type = 'text', placeholder, value, onChange, error, className = '', icon }) => {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="text-brand-pale-lilac/60 text-xs font-bold uppercase tracking-widest pl-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <input
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`
                        w-full rounded-xl border-2 bg-[#0D011B] py-4 px-5 text-white outline-none transition-all duration-300
                        placeholder:text-white/20
                        ${error
                            ? 'border-red-500/50 focus:border-red-500'
                            : 'border-brand-border/30 focus:border-brand-glow focus:shadow-[0_0_15px_rgba(157,78,221,0.3)]'}
                    `}
                />
                {icon && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        {icon}
                    </div>
                )}
            </div>
            {error && <span className="text-red-500 text-xs font-medium pl-1">{error}</span>}
        </div>
    );
};

export default Input;
