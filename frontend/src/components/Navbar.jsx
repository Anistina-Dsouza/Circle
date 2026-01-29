import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-6">
      <Link to="/" className="text-2xl font-bold text-[#C77DFF]">
        Circle
      </Link>

      <div className="hidden md:flex gap-8 text-[#E0AAFF]">
        <span className="cursor-not-allowed opacity-60">Login</span>
        <span className="cursor-not-allowed opacity-60">Register</span>
      </div>
    </nav>
  );
}
