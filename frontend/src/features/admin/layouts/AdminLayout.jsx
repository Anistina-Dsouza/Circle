import { useState } from "react";
import "../admin.css";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-[#070010] text-white overflow-x-hidden">

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 lg:ml-64 transition-all duration-300 ease-in-out w-full">
        <AdminHeader onMenuClick={toggleSidebar} />
        <div className="p-4 sm:p-6 lg:p-10 w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </div>

    </div>
  );
}