import { Link } from "react-router-dom";

export default function Footer() {
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
            <h4 className="uppercase text-sm tracking-widest text-gray-500 mb-6">
              Platform
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li className="hover:text-purple-400 cursor-pointer transition">Features</li>
              <li className="hover:text-purple-400 cursor-pointer transition">Communities</li>
              <li className="hover:text-purple-400 cursor-pointer transition">Mobile App</li>
              <li className="hover:text-purple-400 cursor-pointer transition">Integrations</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="uppercase text-sm tracking-widest text-gray-500 mb-6">
              Company
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li className="hover:text-purple-400 cursor-pointer transition">About Us</li>
              <li className="hover:text-purple-400 cursor-pointer transition">Careers</li>
              <li className="hover:text-purple-400 cursor-pointer transition">Privacy Policy</li>
              <li className="hover:text-purple-400 cursor-pointer transition">Terms of Service</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="uppercase text-sm tracking-widest text-gray-500 mb-6">
              Support
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li className="hover:text-purple-400 cursor-pointer transition">Help Center</li>
              <li className="hover:text-purple-400 cursor-pointer transition">Community</li>
              <li className="hover:text-purple-400 cursor-pointer transition">Contact Support</li>
              <li className="hover:text-purple-400 cursor-pointer transition">API Status</li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">

          <p>© 2026 Circle Inc. All rights reserved.</p>

          <div className="flex gap-8 mt-4 md:mt-0">
            <span className="hover:text-purple-400 cursor-pointer transition">Privacy</span>
            <span className="hover:text-purple-400 cursor-pointer transition">Terms</span>
            <span className="hover:text-purple-400 cursor-pointer transition">Cookies</span>
          </div>

        </div>

      </div>
    </footer>
  );
}