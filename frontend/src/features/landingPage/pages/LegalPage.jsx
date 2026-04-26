import React from 'react';
import { Link } from 'react-router-dom';
import FeedNavbar from '../../feed/components/FeedNavbar';
import Footer from '../../../components/Footer';

const LegalPage = ({ type }) => {
    
    const getContent = () => {
        switch(type) {
            case 'privacy':
                return {
                    title: 'Privacy Policy',
                    content: (
                        <div className="space-y-6 text-gray-300">
                            <p>Last updated: April 2026</p>
                            <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
                            <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.</p>
                            
                            <h2 className="text-xl font-bold text-white mt-8 mb-4">2. How We Use Information</h2>
                            <p>We may use the information we collect about you to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide, maintain, and improve our Services.</li>
                                <li>Perform internal operations, including, for example, to prevent fraud and abuse of our Services.</li>
                                <li>Send or facilitate communications between you and a Circle Host.</li>
                                <li>Send you communications we think will be of interest to you.</li>
                            </ul>

                            <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Sharing of Information</h2>
                            <p>We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows:</p>
                            <p>With Circle Hosts and Community members to enable them to provide the Services you request.</p>
                        </div>
                    )
                };
            case 'terms':
                return {
                    title: 'Terms of Service',
                    content: (
                        <div className="space-y-6 text-gray-300">
                            <p>Last updated: April 2026</p>
                            <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
                            <p>By accessing or using the Circle platform, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>
                            
                            <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Community Guidelines</h2>
                            <p>Users must respect all members of their Circles. Harassment, hate speech, spam, and illegal content are strictly prohibited and will result in immediate account termination.</p>
                            
                            <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Content Ownership</h2>
                            <p>You retain all rights to the content you post in Circles, but you grant us a license to use, store, and display that content to provide the Service.</p>

                            <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Moderation</h2>
                            <p>Circle Hosts have the right to moderate their communities, including removing members or content that violates their specific community rules.</p>
                        </div>
                    )
                };
            case 'cookies':
                return {
                    title: 'Cookie Policy',
                    content: (
                        <div className="space-y-6 text-gray-300">
                            <p>Last updated: April 2026</p>
                            <h2 className="text-xl font-bold text-white mt-8 mb-4">1. What are Cookies</h2>
                            <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>
                            
                            <h2 className="text-xl font-bold text-white mt-8 mb-4">2. How We Use Cookies</h2>
                            <p>We use cookies to maintain your session, remember your preferences, and understand how you interact with Circle. This helps us improve your experience.</p>
                            
                            <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Managing Cookies</h2>
                            <p>Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit www.aboutcookies.org.</p>
                        </div>
                    )
                };
            case 'contact':
                return {
                    title: 'Contact Us',
                    content: (
                        <div className="space-y-6 text-gray-300">
                            <p>We'd love to hear from you. Please reach out to us using any of the methods below:</p>
                            
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mt-8">
                                <h3 className="font-bold text-white mb-2">Email Support</h3>
                                <p className="mb-4">support@circle.app</p>
                                
                                <h3 className="font-bold text-white mb-2">Business Inquiries</h3>
                                <p className="mb-4">partners@circle.app</p>
                                
                                <h3 className="font-bold text-white mb-2">Office</h3>
                                <p>123 Community Drive<br/>San Francisco, CA 94105<br/>United States</p>
                            </div>
                        </div>
                    )
                };
            default:
                return { title: 'Legal', content: <p>Information not found.</p> };
        }
    };

    const { title, content } = getContent();
    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <div className="min-h-screen bg-[#0F0529] font-sans flex flex-col">
            {isLoggedIn && <FeedNavbar />}
            
            <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-20">
                {!isLoggedIn && (
                    <Link to="/" className="inline-flex items-center text-violet-400 hover:text-violet-300 mb-10 font-bold transition-colors">
                        ← Back to Home
                    </Link>
                )}
                
                <h1 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tight">{title}</h1>
                
                <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold">
                    {content}
                </div>
            </main>

            {/* In a real app we'd just put the normal footer, but it has recursive links. We can still use it though, Footer itself handles links! */}
            <Footer />
        </div>
    );
};

export default LegalPage;
