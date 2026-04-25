import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Layers, Megaphone, BarChart, LogOut } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className="
      hidden lg:flex
      fixed left-0 top-0
      h-screen w-64
      p-6
      flex-col
      bg-gradient-to-b from-[#10001d] to-[#06000c]
      border-r border-white/5
      z-30
      "
    >
      {/* Logo */}
      <h2 className="text-2xl font-semibold mb-10 tracking-tight text-white/90">Circle</h2>

      {/* Navigation (scrollable if long) */}
      <nav className="flex-1 space-y-4 overflow-y-auto pr-2">

        <Link to="/admin">
          <Item icon={<LayoutDashboard size={18} />} label="Dashboard" active={isActive("/admin")} />
        </Link>

        <Link to="/admin/users">
          <Item icon={<Users size={18} />} label="Users" active={isActive("/admin/users")} />
        </Link>

        <Link to="/admin/communities">
          <Item icon={<Layers size={18} />} label="Circles" active={isActive("/admin/communities")} />
        </Link>
        
        <Link to="/admin/announcements">
          <Item icon={<Megaphone size={18} />} label="Announcements" active={isActive("/admin/announcements")} />
        </Link>

        <Link to="/admin/reports">
          <Item icon={<BarChart size={18} />} label="Reports" active={isActive("/admin/reports")} />
        </Link>

      </nav>

      {/* Logout pinned bottom */}
      <div className="pt-6 border-t border-white/5">
        <Item icon={<LogOut size={18} />} label="Logout" danger onClick={handleLogout} />
      </div>

    </aside>
  );
}

const Item = ({ icon, label, active, danger, onClick }) => (
  <div
    onClick={onClick}
    className={`
    flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
    transition
    ${active
        ? "bg-purple-700/40 text-purple-300"
        : danger
          ? "hover:bg-red-900/20 text-gray-400 hover:text-red-400"
          : "hover:bg-purple-800/30 text-gray-400 hover:text-white"
      }
    `}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);