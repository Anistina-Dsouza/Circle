import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const AdminRoute = ({ children }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const verifyAdmin = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsChecking(false);
                return;
            }

            try {
                const baseUrl = import.meta.env.VITE_API_URL || '';
                const response = await axios.get(`${baseUrl}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success && response.data.user.role === 'admin') {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error('Admin verification failed:', error);
            } finally {
                setIsChecking(false);
            }
        };

        verifyAdmin();
    }, []);

    if (isChecking) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#10002B]">
                <div className="flex flex-col items-center text-white">
                    <Loader2 size={40} className="animate-spin mb-4 text-purple-500" />
                    <p className="text-sm font-semibold tracking-wider uppercase text-purple-300">Verifying Access...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        // If they are not admin, check if they have a token to decide where to send them
        const token = localStorage.getItem('token');
        return <Navigate to={token ? "/feed" : "/login"} replace />;
    }

    return children;
};

export default AdminRoute;
