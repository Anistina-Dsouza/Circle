// export default function CommunitiesTable(){

//     const communities=["Digital Arts","Rust Devs","Night Runners","Cinephiles"]
    
//     return(
//     <div className="card p-6">
    
//     <h2 className="mb-4">New Communities</h2>
    
//     {communities.map((c,i)=>(
//     <div key={i} className="py-3 border-b border-purple-800">{c}</div>
//     ))}
    
//     </div>
//     )
//     }

import { Palette, Terminal, Dumbbell, Film } from "lucide-react";

const communities = [
  { name: "Digital Arts", cat: "Creative", members: "1.2k", icon: <Palette /> },
  { name: "Rust Devs", cat: "Tech", members: "842", icon: <Terminal /> },
  { name: "Night Runners", cat: "Health", members: "3.5k", icon: <Dumbbell /> },
  { name: "Cinephiles", cat: "Hobbies", members: "2.1k", icon: <Film /> },
];

export default function CommunitiesTable() {
  return (
    <div className="card p-6">

      <div className="flex justify-between mb-6">
        <h2 className="text-lg">New Communities</h2>
        <span className="text-purple-400 text-xs">MANAGE</span>
      </div>

      <div className="space-y-6">

        {communities.map((c, i) => (
          <div key={i} className="flex justify-between items-center">

            {/* COMMUNITY */}
            <div className="flex gap-4 items-center">

              <div className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center">
                {c.icon}
              </div>

              <span>{c.name}</span>

            </div>

            <span className="text-gray-400">{c.cat}</span>
            <span>{c.members}</span>

          </div>
        ))}

      </div>

    </div>
  );
}