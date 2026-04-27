import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, Settings, Home, Compass, Zap, BookOpen, TrendingUp, Users } from "lucide-react";

export default function Navbar({ isLoggedIn = false, user = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload(); 
  };

  const NavItem = ({ icon: Icon, label, to, href, active, isMobile = false }) => {
    const activeClass = "bg-[#7C3AED] text-white shadow-lg shadow-purple-500/20";
    const inactiveClass = "text-gray-400 hover:text-white hover:bg-white/5";

    const content = (
      <>
        <Icon size={20} />
        <span className="font-semibold text-[15px]">{label}</span>
      </>
    );

    const mobileClasses = `flex items-center space-x-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-all w-full ${active ? activeClass : inactiveClass}`;
    
    const desktopClasses = `flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-all ${active ? "text-white" : "text-gray-400 hover:text-white"}`;

    const classes = isMobile ? mobileClasses : desktopClasses;

    if (href) {
      return (
        <a href={href} onClick={() => isMobile && setIsOpen(false)} className={classes}>
          {content}
        </a>
      );
    }

    return (
      <Link to={to} onClick={() => isMobile && setIsOpen(false)} className={classes}>
        {content}
      </Link>
    );
  };


  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center
                 px-6 md:px-12 py-4
                 bg-[#0F0529]/70 backdrop-blur-2xl
                 border-b border-white/5 transition-all duration-300"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-3 z-50">
        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg">
          <div className="w-5 h-5 bg-[#3C096C] rounded-full relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-white" />
          </div>
        </div>
        <span className="text-xl font-black tracking-tight text-white">
          Circle
        </span>
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex items-center space-x-8">
        {!isLoggedIn && (
          <>
            <a href="/#features" className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">Features</a>
            <a href="/#how-it-works" className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">How it Works</a>
            <a href="/#trending" className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">Trending</a>
          </>
        )}
        {isLoggedIn && (
          <>
            <Link to="/feed" className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">Feed</Link>
            <Link to="/circles" className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">Circles</Link>
          </>
        )}
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex gap-6 items-center">
        {isLoggedIn ? (
          /* Profile Dropdown (Modernized) */
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-all active:scale-95"
            >
              <img
                src={user?.profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}
                alt={user?.username}
                className="w-7 h-7 rounded-full border border-purple-500/30 object-cover"
              />
              <span className="text-xs font-black text-white uppercase tracking-wider">{user?.displayName || user?.username}</span>
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-[#1A1140]/95 border border-white/10 rounded-2xl shadow-2xl py-3 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 z-[110]">
                <div className="px-5 py-2 mb-1">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Account Settings</p>
                </div>
                <Link
                  to={`/profile/${user?.username}`}
                  className="flex items-center space-x-3 px-5 py-3 hover:bg-white/5 transition group"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <User size={16} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider">My Profile</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center space-x-3 px-5 py-3 hover:bg-white/5 transition group"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:rotate-45 transition-transform">
                    <Settings size={16} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider">Settings</span>
                </Link>
                <div className="h-px bg-white/5 my-2 mx-5" />
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-5 py-3 hover:bg-red-500/10 transition w-full text-left text-red-400 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 group-hover:-translate-x-1 transition-transform">
                    <LogOut size={16} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider">Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-xs font-black text-white/60 hover:text-white uppercase tracking-widest transition-colors">
              Login
            </Link>
            <Link
              to="/signup"
              className="px-8 py-3 rounded-full bg-white text-[#0F0529] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-100 transition-all shadow-lg active:scale-95"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden z-50 p-2 bg-white/5 rounded-xl border border-white/10 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Menu (Matches Post-Login Style exactly) */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0F0529]/95 backdrop-blur-2xl border-b border-white/5 py-4 px-4 flex flex-col space-y-1 animate-in slide-in-from-top-2 duration-300">
            {!isLoggedIn ? (
              <>
                <NavItem icon={Zap} label="Features" href="/#features" isMobile />
                <NavItem icon={BookOpen} label="How it Works" href="/#how-it-works" isMobile />
                <NavItem icon={TrendingUp} label="Trending" href="/#trending" isMobile />
                
                <div className="pt-6 mt-2 border-t border-white/5 flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-3.5 text-center text-[15px] font-bold text-white border border-white/10 rounded-2xl hover:bg-white/5 transition-colors">Login</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full py-3.5 text-center text-[15px] font-bold text-white bg-[#7C3AED] rounded-2xl hover:bg-purple-600 transition-colors shadow-lg shadow-purple-500/20">Get Started</Link>
                </div>
              </>
            ) : (
              <>
                <NavItem icon={Home} label="Feed" to="/feed" isMobile />
                <NavItem icon={Users} label="Circles" to="/circles" isMobile />
                <NavItem icon={User} label="Profile" to={`/profile/${user?.username}`} isMobile />
                <NavItem icon={Settings} label="Settings" to="/settings" isMobile />
                
                <div className="pt-6 mt-4 border-t border-white/5">
                  <div className="flex items-center justify-between px-2">
                    <Link
                        to={`/profile/${user?.username}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3"
                    >
                        <img
                            src={user?.profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}
                            alt={user?.username}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-[15px] font-bold text-white">{user?.displayName || user?.username}</p>
                        </div>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-10 h-10 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-all"
                    >
                        <LogOut size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
        </div>
      )}
    </nav>
  );
}