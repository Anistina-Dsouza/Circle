// export default function LatestRegistrations() {

//     const users=[
//     {n:"Julianne Doe",s:"Verified"},
//     {n:"Marcus King",s:"Pending"},
//     {n:"Sarah Lee",s:"Verified"},
//     {n:"Ben Turner",s:"Verified"}
//     ];
    
//     return(
//     <div className="card p-6">
    
//     <h2 className="mb-4">Latest Registrations</h2>
    
//     <table className="w-full text-sm">
    
//     <tbody>
//     {users.map((u,i)=>(
//     <tr key={i} className="border-b border-purple-800">
    
//     <td className="py-3">{u.n}</td>
    
//     <td>
//     <span className={u.s==="Verified"?"badge-green px-3 py-1 rounded-full":"badge-yellow px-3 py-1 rounded-full"}>
//     {u.s}
//     </span>
//     </td>
    
//     </tr>
//     ))}
//     </tbody>
    
//     </table>
    
//     </div>
//     )
//     }

// import { avatar } from "../../../utils/avatar";

// const users = [
//   { name: "Julianne Doe", email: "julianne@circle.io", status: "Verified", joined: "2 mins ago" },
//   { name: "Marcus King", email: "marcus.k@email.com", status: "Pending", joined: "14 mins ago" },
//   { name: "Sarah Lee", email: "slee@web.dev", status: "Verified", joined: "28 mins ago" },
//   { name: "Ben Turner", email: "bt@design.co", status: "Verified", joined: "1 hour ago" },
// ];

// export default function LatestRegistrations() {
//   return (
//     <div className="card p-6">

//       <div className="flex justify-between mb-6">
//         <h2 className="text-lg">Latest Registrations</h2>
//         <span className="text-purple-400 text-xs">VIEW ALL</span>
//       </div>

//       <div className="space-y-6">

//         {users.map((u, i) => (
//           <div key={i} className="flex justify-between items-center">

//             {/* USER */}
//             <div className="flex gap-4 items-center">

//               <img
//                 src={avatar(u.name)}
//                 className="w-10 h-10 rounded-full"
//               />

//               <div>
//                 <p>{u.name}</p>
//                 <p className="text-gray-400 text-xs">{u.email}</p>
//               </div>

//             </div>

//             {/* STATUS */}
//             <span className={`px-3 py-1 rounded-full text-xs ${
//               u.status === "Verified" ? "badge-green" : "badge-yellow"
//             }`}>
//               {u.status.toUpperCase()}
//             </span>

//             {/* TIME */}
//             <span className="text-gray-400 text-sm">{u.joined}</span>

//           </div>
//         ))}

//       </div>

//     </div>
//   );
// }

import { Link } from "react-router-dom";
import { avatar } from "../../../utils/avatar";
import { Eye } from "lucide-react";

const users = [
  { name: "Julianne Doe", email: "julianne@circle.io", status: "Verified", joined: "2 mins ago" },
  { name: "Marcus King", email: "marcus.k@email.com", status: "Pending", joined: "14 mins ago" },
  { name: "Sarah Lee", email: "slee@web.dev", status: "Verified", joined: "28 mins ago" },
  { name: "Ben Turner", email: "bt@design.co", status: "Verified", joined: "1 hour ago" },
];

export default function LatestRegistrations() {
  return (
    <div className="rounded-[28px] bg-[radial-gradient(circle_at_top,#2a004a,#13001f)] border border-white/5 overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-white/5">
        <h2 className="text-lg font-semibold">Latest Registrations</h2>
        <Link to="/admin/users" className="text-purple-400 text-xs tracking-widest hover:text-purple-300 transition">VIEW ALL</Link>
      </div>

      {/* Column Headings */}
      <div className="flex px-8 py-4 text-xs uppercase tracking-widest text-gray-400 border-b border-white/5">
        <div className="w-[45%]">User</div>
        <div className="w-[20%]">Status</div>
        <div className="w-[20%]">Joined</div>
        <div className="w-[15%] text-right">Action</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">

        {users.map((u, i) => (
          <div key={i} className="flex items-center px-8 py-5 hover:bg-purple-900/20 transition">

            {/* USER */}
            <div className="w-[45%] flex items-center gap-4">
              <img
                src={avatar(u.name)}
                className="w-11 h-11 rounded-full ring-2 ring-purple-700/40"
              />

              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-gray-400">{u.email}</p>
              </div>
            </div>

            {/* STATUS */}
            <div className="w-[20%]">
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-semibold
                ${u.status === "Verified"
                  ? "bg-[#123c2a] text-green-400"
                  : "bg-[#3a2f00] text-yellow-400"
                }`}
              >
                {u.status.toUpperCase()}
              </span>
            </div>

            {/* JOINED */}
            <div className="w-[20%] text-gray-400 text-sm">
              {u.joined}
            </div>

            {/* ACTION */}
            <div className="w-[15%] flex justify-end">
              <button className="p-2 rounded-full hover:bg-purple-800/40 transition">
                <Eye size={16} />
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}