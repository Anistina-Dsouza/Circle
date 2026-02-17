import React from 'react';

const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-brand-dark-purple/50 backdrop-blur-xl border border-brand-border rounded-2xl p-8 shadow-2xl ${className}`}>
            {children}
        </div>
    );
};

export default Card;
