import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
        </div>
      )}
    </nav>
  );
}
