import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // Add logic to handle password reset
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col md:flex-row min-h-screen bg-white">
            {/* Back to Home Button */}
            <Link
                to="/"
                className="absolute top-6 left-6 z-50 flex items-center text-white/80 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Back to Home</span>
            </Link>

            {/* Left Panel - Branding */}
            <div className="w-full md:w-5/12 bg-gradient-to-br from-[#4f18a3] to-[#8b31ff] relative overflow-hidden p-12 text-white flex flex-col justify-center">
                {/* Abstract Shapes */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full"></div>
                <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/3 w-[400px] h-[400px] border border-white/10 rounded-full"></div>

                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <div className="w-5 h-5 bg-[#4f18a3] rounded-full"></div>
                        </div>
                        <span className="text-2xl font-bold">Circle</span>
                    </div>

                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Recover<br />Account.
                    </h1>

                    <p className="text-lg text-purple-100 max-w-md">
                        Don't worry, it happens to the best of us. Let's get you back in.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full md:w-7/12 overflow-y-auto bg-white p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                    {!submitted ? (
                        <>
                            <div className="mb-10">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                                <p className="text-purple-600">Enter your email to receive recovery instructions.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[#5b1da3] text-white font-bold rounded-xl shadow-lg hover:bg-[#4a1586] transition-all transform hover:-translate-y-0.5"
                                >
                                    Send Recovery Link
                                </button>
                            </form>

                            <p className="mt-8 text-center text-gray-600">
                                Remember your password?{' '}
                                <Link to="/login" className="text-[#5b1da3] font-bold hover:underline">
                                    Log in
                                </Link>
                            </p>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Check your email</h2>
                            <p className="text-gray-600 mb-8">
                                We've sent recovery instructions to <span className="font-bold text-gray-800">{email}</span>.
                            </p>
                            <Link to="/login" className="text-[#5b1da3] font-bold hover:underline">
                                Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
