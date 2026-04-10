import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, ArrowLeft } from 'lucide-react';
import FeedNavbar from '../../feed/components/FeedNavbar';

const ManageParticipantsPage = () => {
    const { slug } = useParams();

    return (
        <div className="min-h-screen bg-[#0F0529] text-white font-sans flex flex-col">
            <FeedNavbar activePage="Circles" />
            
            <div className="max-w-[1000px] w-full mx-auto px-6 py-10">
                <Link 
                    to={`/circles/${slug}/manage`} 
                    className="inline-flex items-center gap-2 text-violet-400 font-bold text-sm hover:text-violet-300 transition-colors mb-8 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-violet-600/20 border border-violet-500/30 rounded-2xl text-violet-400">
                        <Users size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black">Manage Participants</h1>
                        <p className="text-gray-400 font-medium">Add, remove, or change roles of community members.</p>
                    </div>
                </div>

                <div className="bg-[#1A0B3D]/50 border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Users size={40} className="text-gray-600" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Management Interface Coming Soon</h2>
                    <p className="text-gray-500 max-w-sm">We're currently building out the full participant management interface. Stay tuned!</p>
                </div>
            </div>
        </div>
    );
};

export default ManageParticipantsPage;
