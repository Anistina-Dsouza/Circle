// import { Search } from "lucide-react";

// export default function AdminHeader() {
//   return (
//     <div className="h-20 flex justify-between items-center px-10 border-b border-purple-800">

//       <div>
//         <h1 className="text-xl font-semibold">Admin Overview</h1>
//         <p className="text-sm text-gray-400">Welcome back, Admin.</p>
//       </div>

//       <div className="flex gap-4 items-center">

//         <div className="relative">
//           <input className="bg-purple-900/40 px-6 py-2 rounded-full text-sm outline-none" placeholder="Search data..." />
//           <Search className="absolute right-3 top-2.5 w-4 text-purple-400"/>
//         </div>

//         <img
//             src="https://api.dicebear.com/7.x/initials/svg?seed=Admin"
//             className="w-9 h-9 rounded-full"
//             />

//       </div>

//     </div>
//   );
// }

import { Search, Menu } from "lucide-react";

export default function AdminHeader({ onMenuClick }) {
  return (
    <div
      className="
      h-20
      flex justify-between items-center
      px-4 sm:px-10
      bg-[radial-gradient(circle_at_top,#2a004a,#13001f)]
      backdrop-blur-md
      sticky top-0 z-20
      border-b border-white/5
      "
    >
      {/* Left Side: Menu + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu size={24} className="text-purple-400" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
            Admin Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 hidden xs:block">
            Welcome back, Admin.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex gap-4 items-center">

        {/* Search */}
        <div className="relative hidden md:block">
          <input
            className="
            bg-purple-900/40
            px-6 py-2
            rounded-full
            text-sm
            outline-none
            placeholder:text-gray-500
            focus:ring-2 focus:ring-purple-600/40
            transition
            w-48 md:w-64
            "
            placeholder="Search data..."
          />

          <Search className="absolute right-4 top-2.5 w-4 text-purple-400" />
        </div>

        {/* Avatar */}
        <img
          src="https://api.dicebear.com/7.x/initials/svg?seed=Admin"
          className="
          w-8 h-8 sm:w-9 sm:h-9 rounded-full
          ring-2 ring-purple-700/40
          transition
          "
        />

      </div>
    </div>
  );
}