import React from 'react';

const ToggleSwitch = ({ enabled, setEnabled, label, description }) => {
    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-200">{label}</span>
                {description && <span className="text-[11px] text-gray-500 font-medium">{description}</span>}
            </div>
            <button
                onClick={() => setEnabled(!enabled)}
                className={`
                    relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-[#0F0529]
                    ${enabled ? 'bg-purple-600' : 'bg-white/10'}
                `}
            >
                <span className="sr-only">Toggle {label}</span>
                <span
                    aria-hidden="true"
                    className={`
                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                        transition duration-200 ease-in-out
                        ${enabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                />
            </button>
        </div>
    );
};

export default ToggleSwitch;
