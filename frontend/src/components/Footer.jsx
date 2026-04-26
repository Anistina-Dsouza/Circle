import { Link } from "react-router-dom";

export default function Footer() {
  const userStr = localStorage.getItem('user');
  let user = null;
  try {
    user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) {
    user = null;
  }

  const profileLink = user?.username ? `/profile/${user.username}` : "/login";
  const settingsLink = user ? "/profile/edit" : "/login";
  const messagesLink = user ? "/messages" : "/login";
  const notificationsLink = user ? "/notifications" : "/login";

  return (
    <footer className="bg-[#0b0015] text-white">

      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-16">

          {/* Brand */}
          <div className="flex flex-col gap-6">

          {/* Logo Row */}
          <div className="flex items-center gap-3">
            {/* <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute w-full h-full rounded-full border-2 border-purple-500" />
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
            </div>

            <h3 className="text-2xl font-semibold text-white">
              Circle
            </h3> */}

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
          </div>

          {/* Paragraph */}
          <p className="text-gray-400 leading-relaxed max-w-sm">
            The modern platform for community-led growth. Build, engage,
            and monetize your tribe.
          </p>

          </div>

          {/* Platform */}
          <div>
            <h4 className="uppercase text-sm tracking-widest text-gray-500 mb-6 font-bold">
              Explore
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/circles" className="hover:text-purple-400 transition">All Communities</Link></li>
              <li><Link to="/circles/create" className="hover:text-purple-400 transition">Create a Circle</Link></li>
              <li><Link to="/signup" className="hover:text-purple-400 transition">Get Started</Link></li>
              <li><Link to="/login" className="hover:text-purple-400 transition">Sign In</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="uppercase text-sm tracking-widest text-gray-500 mb-6 font-bold">
              Account
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to={profileLink} className="hover:text-purple-400 transition">My Profile</Link></li>
              <li><Link to={messagesLink} className="hover:text-purple-400 transition">Messages</Link></li>
              <li><Link to={settingsLink} className="hover:text-purple-400 transition">Settings</Link></li>
              <li><Link to={notificationsLink} className="hover:text-purple-400 transition">Notifications</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="uppercase text-sm tracking-widest text-gray-500 mb-6 font-bold">
              Legal
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/privacy" className="hover:text-purple-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-purple-400 transition">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-purple-400 transition">Cookie Policy</Link></li>
              <li><Link to="/contact" className="hover:text-purple-400 transition">Contact Us</Link></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">

          <p>© 2026 Circle Inc. All rights reserved.</p>

          <div className="flex gap-8 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-purple-400 transition">Privacy</Link>
            <Link to="/terms" className="hover:text-purple-400 transition">Terms</Link>
            <Link to="/cookies" className="hover:text-purple-400 transition">Cookies</Link>
          </div>

        </div>

      </div>
    </footer>
  );
}