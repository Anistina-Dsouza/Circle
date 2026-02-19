import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const LoginForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Login attempt:', formData);
            navigate('/feed');
        }
    };

    return (
        <div className="w-full lg:w-1/2 bg-[#10002B] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 overflow-y-auto">
            <div className="max-w-md w-full mx-auto font-sans">
                <div className="mb-10">
                    <h2 className="text-4xl font-bold mb-2 text-white">Login</h2>
                    <p className="text-white/40">Enter your credentials to access your account.</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Google Login Button */}
                    <button
                        type="button"
                        className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-white/90 text-black font-semibold py-3 rounded-xl transition-all"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>Login in with Google</span>
                    </button>

                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink mx-4 text-white/20 text-sm uppercase tracking-widest font-bold">or</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-widest">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`auth-input ${errors.email ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
                            placeholder="name@example.com"
                        />
                        {errors.email && (
                            <div className="flex items-center mt-1 text-red-500 text-xs gap-1">
                                <AlertCircle size={12} />
                                <span>{errors.email}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest">Password</label>
                            <Link to="/forgot-password" size="sm" className="text-xs text-white/40 hover:text-white transition-colors uppercase font-bold tracking-widest">Forgot Password?</Link>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`auth-input ${errors.password ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <div className="flex items-center mt-1 text-red-500 text-xs gap-1">
                                <AlertCircle size={12} />
                                <span>{errors.password}</span>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn-primary mt-8">
                        Log In
                    </button>

                    <p className="text-center text-sm text-white/40 mt-8">
                        Don't have an account? <Link to="/signup" className="text-white hover:underline font-bold">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
