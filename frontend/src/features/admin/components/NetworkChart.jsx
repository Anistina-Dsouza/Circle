
// export default function NetworkChart(){
//     const bars=[20,50,30,90,10,60,70,40]
    
//     return(
//     <div className="card p-8 mt-10">
    
//     <h2 className="mb-6">Network Interactions</h2>
    
//     <div className="flex gap-4 h-40 items-end">
//     {bars.map((b,i)=>(
//     <div key={i} className="bg-purple-500 rounded-full flex-1" style={{height:`${b}%`}}/>
//     ))}
//     </div>
    
//     </div>
//     )
//     }

import { useState } from "react";

export default function NetworkChart() {

  const data = [
    { day: "MON", value: 20 },
    { day: "TUE", value: 50 },
    { day: "WED", value: 90 },
    { day: "THU", value: 10 },
    { day: "FRI", value: 60 },
    { day: "SAT", value: 70 },
    { day: "SUN", value: 40 },
  ];

  const [active, setActive] = useState("WED");

  return (
    <div className="card p-10 mt-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-lg font-semibold">Network Interactions</h2>
          <p className="text-sm text-gray-400">
            Real-time engagement across platform nodes
          </p>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-full bg-purple-700 text-sm">
            Live View
          </button>
          <button className="px-4 py-2 rounded-full bg-purple-900 text-sm text-gray-400">
            7 Days
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-6 h-[220px]">

        {data.map((item, i) => (
          <div
            key={i}
            onClick={() => setActive(item.day)}
            className="flex flex-col items-center flex-1 cursor-pointer group"
          >

            <div className="relative w-full h-full flex justify-center">

              {/* Background shadow capsule */}
              <div className="absolute bottom-0 w-25 h-full bg-purple-900/40 rounded-full" />

              {/* Foreground bar (same style preserved) */}
              <div
                className={`absolute bottom-0 w-25 rounded-full transition-all duration-500
                  ${active === item.day
                    ? "bg-purple-400 shadow-lg shadow-purple-600"
                    : "bg-purple-500 group-hover:bg-purple-400"}
                `}
                style={{ height: `${item.value * 2}px` }}
              />

              {/* Tooltip */}
              <div className="absolute -top-8 opacity-0 group-hover:opacity-100 text-xs bg-purple-700 px-2 py-1 rounded-full transition">
                {item.value}
              </div>

            </div>

            {/* Day label */}
            <span className={`mt-4 text-xs tracking-widest ${
              active === item.day ? "text-purple-400" : "text-gray-500"
            }`}>
              {item.day}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}