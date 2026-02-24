
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
    <div className="mt-10 p-10 rounded-[28px] bg-[#140021] border border-white/5">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-lg font-semibold">Network Interactions</h2>
          <p className="text-sm text-gray-400">
            Real-time engagement across platform nodes
          </p>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-full bg-purple-800/40 text-sm text-purple-300">
            Live View
          </button>
          <button className="px-4 py-2 rounded-full bg-purple-900/30 text-sm text-gray-400">
            7 Days
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-8 h-[200px]">

        {data.map((item, i) => (
          <div
            key={i}
            onClick={() => setActive(item.day)}
            className="flex flex-col items-center flex-1 cursor-pointer"
          >
            <div className="relative w-full h-full flex justify-center">

              {/* Background Track */}
              <div className="absolute bottom-0 w-22 h-full bg-white/5 rounded-full" />

              {/* Foreground Bar */}
              <div
                className={`absolute bottom-0 w-22 rounded-full transition-all duration-500
                  ${
                    active === item.day
                      ? "bg-purple-400"
                      : "bg-purple-600/70 hover:bg-purple-500/80"
                  }
                `}
                style={{ height: `${item.value * 2}px` }}
              />

            </div>

            {/* Day Label */}
            <span
              className={`mt-5 text-xs tracking-widest transition
                ${
                  active === item.day
                    ? "text-purple-400"
                    : "text-gray-500"
                }`}
            >
              {item.day}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
}