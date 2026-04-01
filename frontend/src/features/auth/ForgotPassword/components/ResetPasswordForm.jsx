import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const ResetPasswordForm = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const validate = () => {
        if (!password) {
            setError('Password is required'); 
            return false;
        } else if (password.length < 8) {
            setError('Password must be at least 8 characters'); 
            return false;
        } else if (password !== confirm) {
            setError('Passwords do not match'); 
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
                await axios.post(`${baseUrl}/api/auth/reset-password/${token}`, { password });
                setSuccess(true);
            } catch (err) {
                setError(err.response?.data?.message || 'Invalid or expired token. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (success) {
        return (
            <div className="w-full lg:w-1/2 bg-[#10002B] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 overflow-y-auto">
                <div className="max-w-md w-full mx-auto font-sans text-center">
                    <div className="w-20 h-20 bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20 text-green-400">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-white">Password Reset!</h2>
                    <p className="text-white/40 mb-8">
                        Your password has been successfully updated. You can now log into your account with your new credentials.
                    </p>
                    <button onClick={() => navigate('/login')} className="btn-primary flex justify-center w-full">
                        Login Now
                    </button>
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
                    <h2 className="text-4xl font-bold mb-2 text-white">New Password</h2>
                    <p className="text-white/40">Enter a secure new password for your account.</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); if(error) setError(''); }}
                                className={`auth-input ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest">Confirm Password</label>
                            <input
                                type="password"
                                value={confirm}
                                onChange={(e) => { setConfirm(e.target.value); if(error) setError(''); }}
                                className={`auth-input ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="flex flex-col mt-2 text-red-500 text-xs">
                                <div className="flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button disabled={loading} type="submit" className="btn-primary mt-8 flex justify-center items-center w-full">
                        {loading ? <Loader2 size={24} className="animate-spin" /> : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
