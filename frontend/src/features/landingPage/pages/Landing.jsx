import React from 'react';
import Navbar from "../../../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../../../components/Footer";
import HowItWorks from "../components/HowItWorks";
import TrendingCommunities from "../components/TrendingCommunities";
import CTASection from "../components/CTASection";

export default function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#10002B] via-[#240046] to-[#3C096C] text-white">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <TrendingCommunities />
            <CTASection />
            <Footer />
        </div>
    );
}
