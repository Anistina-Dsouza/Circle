import React from 'react';
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Features from "../components/Features";
import Footer from "../components/Footer";

export default function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#10002B] via-[#240046] to-[#3C096C] text-white">
            <Navbar />
            <Hero />
            <Stats />
            <Features />
            <Footer />
        </div>
    );
}
