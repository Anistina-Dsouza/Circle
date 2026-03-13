import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, Settings } from "lucide-react";

export default function Navbar({ isLoggedIn = false, user = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload(); // Refresh to update navbar state
  };

  return (
    <nav
      className="sticky top-0 z-50 flex justify-between items-center
                 px-6 md:px-10 py-5
                 bg-[#120B2F]/80 backdrop-blur-lg
                 border-b border-white/10"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-3 z-50">
        <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <div className="w-5 h-5 md:w-6 md:h-6 bg-[#3C096C] rounded-full relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-white" />
          </div>
        </div>
        <span className="text-xl md:text-2xl font-bold tracking-tight text-[#EDE9FE]">
          Circle
        </span>
      </Link>

      {/* Desktop Actions */}
      <div className="hidden md:flex gap-8 items-center text-sm text-[#E0D7FF]">
        {isLoggedIn ? (
          <>
            <Link to="/feed" className="opacity-70 hover:opacity-100 transition font-medium">
              Feed
            </Link>
            <Link to="/circles" className="opacity-70 hover:opacity-100 transition font-medium">
              Circles
            </Link>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src={user?.profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}
                  alt={user?.username}
                  className="w-8 h-8 rounded-full border-2 border-purple-500/30 object-cover"
                />
                <span className="font-medium text-white">{user?.displayName || user?.username}</span>
              </button>

              {/* Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1E1B3A] border border-white/10 rounded-xl shadow-xl py-2">
                  <Link
                    to={`/profile/${user?.username}`}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-white/5 transition"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <User size={16} className="text-purple-400" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-white/5 transition"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <Settings size={16} className="text-purple-400" />
                    <span>Settings</span>
                  </Link>
                  <hr className="border-white/10 my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-white/5 transition w-full text-left text-red-400"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="opacity-70 hover:opacity-100 transition font-medium">
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 rounded-full
                         bg-[#7C3AED]/80 text-white
                         font-semibold
                         hover:bg-[#6D28D9]
                         transition shadow-sm"
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden z-50 text-[#EDE9FE]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#120B2F] flex flex-col items-center justify-center space-y-8 z-40 md:hidden">
          {isLoggedIn ? (
            <>
              <div className="flex flex-col items-center space-y-4 mb-4">
                <img
                  src={user?.profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}
                  alt={user?.username}
                  className="w-20 h-20 rounded-full border-4 border-purple-500/30 object-cover"
                />
                <span className="text-xl font-bold text-white">{user?.displayName || user?.username}</span>
                <span className="text-sm text-gray-400">@{user?.username}</span>
              </div>
              <Link
                to="/feed"
                className="text-2xl font-medium text-[#E0D7FF]"
                onClick={() => setIsOpen(false)}
              >
                Feed
              </Link>
              <Link
                to="/circles"
                className="text-2xl font-medium text-[#E0D7FF]"
                onClick={() => setIsOpen(false)}
              >
                Circles
              </Link>
              <Link
                to={`/profile/${user?.username}`}
                className="text-2xl font-medium text-[#E0D7FF]"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="text-2xl font-medium text-[#E0D7FF]"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="px-10 py-4 rounded-full
                           bg-red-500/20 text-red-400
                           text-xl font-bold
                           border border-red-500/30"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-2xl font-medium text-[#E0D7FF]"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-10 py-4 rounded-full
                           bg-[#7C3AED] text-white
                           text-xl font-bold
                           shadow-lg shadow-purple-500/20"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}