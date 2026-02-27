// import { LayoutDashboard, Users, Megaphone, BarChart, LogOut } from "lucide-react";

// export default function Sidebar() {
//   return (
//     <aside className="sidebar w-64 p-6 flex flex-col">

//       <h2 className="text-2xl mb-10">Circle</h2>

//       <nav className="space-y-4 flex-1">

//         <Item icon={<LayoutDashboard/>} label="Dashboard" active/>
//         <Item icon={<Users/>} label="Users"/>
//         <Item icon={<Users/>} label="Communities"/>
//         <Item icon={<Megaphone/>} label="Announcements"/>
//         <Item icon={<BarChart/>} label="Reports"/>

//       </nav>

//       <Item icon={<LogOut/>} label="Logout"/>

//     </aside>
//   );
// }

// const Item = ({icon,label,active}) => (
//   <div className={`flex items-center gap-3 px-4 py-3 rounded-full cursor-pointer
//   ${active?"bg-purple-600":"hover:bg-purple-800"}`}>
//     {icon}{label}
//   </div>
// );

import { Link } from "react-router-dom";
import { LayoutDashboard, Users, Megaphone, BarChart, LogOut } from "lucide-react";

export default function Sidebar() {
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
      <h2 className="text-2xl font-semibold mb-10">Circle</h2>

      {/* Navigation (scrollable if long) */}
      <nav className="flex-1 space-y-4 overflow-y-auto pr-2">

        <Item icon={<LayoutDashboard size={18} />} label="Dashboard" active />
        <Link to="/admin/users">
          <Item icon={<Users size={18} />} label="Users" />
        </Link>
        <Item icon={<Users size={18} />} label="Communities" />
        <Item icon={<Megaphone size={18} />} label="Announcements" />
        <Item icon={<BarChart size={18} />} label="Reports" />

      </nav>

      {/* Logout pinned bottom */}
      <div className="pt-6 border-t border-white/5">
        <Item icon={<LogOut size={18} />} label="Logout" danger />
      </div>

    </aside>
  );
}

const Item = ({ icon, label, active, danger }) => (
  <div
    className={`
    flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
    transition
    ${
      active
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