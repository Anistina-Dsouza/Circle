import { LayoutDashboard, Users, Megaphone, BarChart, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="sidebar w-64 p-6 flex flex-col">

      <h2 className="text-2xl mb-10">Circle</h2>

      <nav className="space-y-4 flex-1">

        <Item icon={<LayoutDashboard/>} label="Dashboard" active/>
        <Item icon={<Users/>} label="Users"/>
        <Item icon={<Users/>} label="Communities"/>
        <Item icon={<Megaphone/>} label="Announcements"/>
        <Item icon={<BarChart/>} label="Reports"/>

      </nav>

      <Item icon={<LogOut/>} label="Logout"/>

    </aside>
  );
}

const Item = ({icon,label,active}) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-full cursor-pointer
  ${active?"bg-purple-600":"hover:bg-purple-800"}`}>
    {icon}{label}
  </div>
);