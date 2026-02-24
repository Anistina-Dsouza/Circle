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

import { avatar } from "../../../utils/avatar";

const users = [
  { name: "Julianne Doe", email: "julianne@circle.io", status: "Verified", joined: "2 mins ago" },
  { name: "Marcus King", email: "marcus.k@email.com", status: "Pending", joined: "14 mins ago" },
  { name: "Sarah Lee", email: "slee@web.dev", status: "Verified", joined: "28 mins ago" },
  { name: "Ben Turner", email: "bt@design.co", status: "Verified", joined: "1 hour ago" },
];

export default function LatestRegistrations() {
  return (
    <div className="card p-6">

      <div className="flex justify-between mb-6">
        <h2 className="text-lg">Latest Registrations</h2>
        <span className="text-purple-400 text-xs">VIEW ALL</span>
      </div>

      <div className="space-y-6">

        {users.map((u, i) => (
          <div key={i} className="flex justify-between items-center">

            {/* USER */}
            <div className="flex gap-4 items-center">

              <img
                src={avatar(u.name)}
                className="w-10 h-10 rounded-full"
              />

              <div>
                <p>{u.name}</p>
                <p className="text-gray-400 text-xs">{u.email}</p>
              </div>

            </div>

            {/* STATUS */}
            <span className={`px-3 py-1 rounded-full text-xs ${
              u.status === "Verified" ? "badge-green" : "badge-yellow"
            }`}>
              {u.status.toUpperCase()}
            </span>

            {/* TIME */}
            <span className="text-gray-400 text-sm">{u.joined}</span>

          </div>
        ))}

      </div>

    </div>
  );
}