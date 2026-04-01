import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!email) {
            setError('Email is required');
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email is invalid');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validate()) {
            setLoading(true);
            try {
                const baseUrl = import.meta.env.VITE_API_URL || '';
                await axios.post(`${baseUrl}/api/auth/forgot-password`, { email });
                setSubmitted(true);
            } catch (err) {
                setError(err.response?.data?.message || 'Something went wrong. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (submitted) {
        return (
            <div className="w-full lg:w-1/2 bg-[#10002B] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 overflow-y-auto">
                <div className="max-w-md w-full mx-auto font-sans text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 text-brand-purple">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-white">Check your email</h2>
                    <p className="text-white/40 mb-8">
                        We've sent a secure password reset link to <span className="text-white font-semibold flex justify-center mt-2">{email}</span>
                    </p>
                    <Link to="/login" className="flex items-center justify-center space-x-2 text-brand-purple hover:text-brand-purple/80 font-bold transition-all">
                        <ArrowLeft size={18} />
                        <span>Back to Login</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full lg:w-1/2 bg-[#10002B] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 overflow-y-auto">
            <div className="max-w-md w-full mx-auto font-sans">
                <div className="mb-10">
                    <Link to="/login" className="inline-flex items-center space-x-2 text-white/40 hover:text-white mb-8 transition-all group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">Back to Login</span>
                    </Link>
                    <h2 className="text-4xl font-bold mb-2 text-white">Forgot Password</h2>
                    <p className="text-white/40">Enter your email and we'll send you a link to reset your password.</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-widest">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError('');
                            }}
                            className={`auth-input ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
                            placeholder="name@example.com"
                            disabled={loading}
                        />
                        {error && (
                            <div className="flex items-center mt-1 text-red-500 text-xs gap-1">
                                <AlertCircle size={12} />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    <button disabled={loading} type="submit" className="btn-primary mt-8 flex justify-center items-center">
                        {loading ? <Loader2 size={24} className="animate-spin" /> : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
