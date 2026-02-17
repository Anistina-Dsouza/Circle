import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '', variant = 'primary', disabled = false }) => {
    const baseStyles = "w-full font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:transform-none disabled:active:scale-100";

    const variants = {
        primary: "bg-primary hover:bg-[#7B2CBF] text-white shadow-primary/30",
        secondary: "bg-brand-border hover:bg-brand-mid-purple text-brand-pale-lilac border border-brand-border",
        outline: "bg-transparent border-2 border-brand-border text-brand-pale-lilac hover:border-brand-glow hover:text-white"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
