import React from 'react';

const AuthHero = ({ title, description }) => {
    return (
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#3C096C] via-[#5A189A] to-[#7B2CBF] relative overflow-hidden flex-col justify-center px-16 text-white font-sans">
            {/* Background decorative circles */}
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] border border-white/10 rounded-full" />
            <div className="absolute bottom-[-20%] left-[10%] w-[500px] h-[500px] border border-white/10 rounded-full" />

            <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-12">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        {/* 3/4 Purple Circle Logo */}
                        <div className="w-7 h-7 bg-[#3C096C] rounded-full relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-white" />
                        </div>
                    </div>
                    <span className="text-3xl font-bold tracking-tight">Circle</span>
                </div>

                <h1 className="text-6xl font-extrabold leading-tight mb-8">
                    {title}
                </h1>

                <p className="text-xl text-white/80 max-w-md leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default AuthHero;
