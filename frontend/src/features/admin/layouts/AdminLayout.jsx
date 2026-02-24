import "../admin.css";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#070010] text-white">

      <Sidebar />

      <div className="flex-1">
        <AdminHeader />
        <div className="p-10">{children}</div>
      </div>

    </div>
  );
}