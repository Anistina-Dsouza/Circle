import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Check, ArrowLeft } from 'lucide-react';

function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [agreed, setAgreed] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateStrength = (pass) => {
        let strength = 0;
        if (pass.length > 5) strength += 20;
        if (pass.length > 8) strength += 20;
        if (/[A-Z]/.test(pass)) strength += 20;
        if (/[0-9]/.test(pass)) strength += 20;
        if (/[^A-Za-z0-9]/.test(pass)) strength += 20;
        return strength;
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
                        Reconnect with<br />what matters.
                    </h1>

                    <p className="text-lg text-purple-100 max-w-md">
                        Join the time-based social network built for meaningful connections and mindful digital spaces.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full md:w-7/12 overflow-y-auto bg-white p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Join the Circle</h2>
                        <p className="text-purple-600">Step away from the noise. Start your journey.</p>
                    </div>

                    <form className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                placeholder="Jane Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                placeholder="jane@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500 hover:text-purple-700"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* password strength visual */}
                            <div className="mt-3">
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs font-medium text-purple-700">Strength</span>
                                    <span className="text-xs font-medium text-purple-700">
                                        {calculateStrength(formData.password) < 40 ? 'Weak' : calculateStrength(formData.password) < 80 ? 'Moderate' : 'Strong'}
                                    </span>
                                </div>
                                <div className="w-full bg-purple-100 rounded-full h-1.5">
                                    <div
                                        className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${calculateStrength(formData.password)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="relative flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="w-5 h-5 border-gray-300 rounded text-purple-600 focus:ring-purple-500"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-medium text-gray-700">
                                        I agree to the <a href="#" className="text-gray-900 underline font-bold">Terms of Service</a> and <a href="#" className="text-gray-900 underline font-bold">Privacy Policy</a>.
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-[#5b1da3] text-white font-bold rounded-xl shadow-lg hover:bg-[#4a1586] transition-all transform hover:-translate-y-0.5"
                        >
                            Create Account
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#5b1da3] font-bold hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
