import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      className="flex justify-between items-center
                 px-10 py-5
                 bg-[#120B2F]/50 backdrop-blur-lg
                 border-b border-white/10"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <div className="w-5 h-5 bg-[#120B2F] rounded-full"></div>
        </div>
        <span className="text-2xl font-bold tracking-tight text-[#EDE9FE]">
          Circle
        </span>
      </Link>

      {/* Actions */}
      <div className="hidden md:flex gap-8 items-center text-sm text-[#E0D7FF]">
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
      </div>
    </nav>
  );
}
