import React from 'react';

const ProgressBar = ({ stories, currentIndex, progress }) => {
    return (
        <div className="w-full flex gap-2 h-1.5 px-1">
            {stories.map((_, index) => (
                <div 
                    key={index} 
                    className="h-full flex-1 bg-purple-500/20 rounded-full overflow-hidden"
                >
                    <div 
                        className="h-full bg-purple-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        style={{ 
                            width: index < currentIndex 
                                ? '100%' 
                                : index === currentIndex 
                                    ? `${progress}%` 
                                    : '0%' 
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProgressBar;
