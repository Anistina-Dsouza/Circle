import { Search } from "lucide-react";

export default function AdminHeader() {
  return (
    <div className="h-20 flex justify-between items-center px-10 border-b border-purple-800">

      <div>
        <h1 className="text-xl font-semibold">Admin Overview</h1>
        <p className="text-sm text-gray-400">Welcome back, Admin.</p>
      </div>

      <div className="flex gap-4 items-center">

        <div className="relative">
          <input className="bg-purple-900/40 px-6 py-2 rounded-full text-sm outline-none" placeholder="Search data..." />
          <Search className="absolute right-3 top-2.5 w-4 text-purple-400"/>
        </div>

        <img
            src="https://api.dicebear.com/7.x/initials/svg?seed=Admin"
            className="w-9 h-9 rounded-full"
            />

      </div>

    </div>
  );
}