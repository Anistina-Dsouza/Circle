// export default function KPICard({ icon, value, label, badge }) {
//     return (
//       <div className="card glow p-6 relative overflow-hidden">
  
//         <div className="absolute right-4 top-4 text-xs bg-purple-900 px-3 py-1 rounded-full">
//           {badge}
//         </div>
  
//         <div className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center mb-4">
//           {icon}
//         </div>
  
//         <h2 className="text-3xl font-bold">{value}</h2>
//         <p className="text-gray-400 text-sm">{label}</p>
  
//       </div>
//     );
//   }

import {
    Users,
    Layers,
    TrendingUp,
    AlertTriangle
  } from "lucide-react";
  
  export default function KPICard({ value, label, badge }) {
  
    const icons = {
      "Users": <Users />,
      "Communities": <Layers />,
      "Active": <TrendingUp />,
      "Flagged": <AlertTriangle />,
    };
  
    const colors = {
      "Users": "bg-purple-800 text-purple-300",
      "Communities": "bg-indigo-800 text-indigo-300",
      "Active": "bg-green-800 text-green-300",
      "Flagged": "bg-red-800 text-red-300",
    };
  
    return (
      <div className="card glow p-6 relative overflow-hidden">
  
        {/* Badge */}
        <div className="absolute right-4 top-4 text-xs bg-purple-900 px-3 py-1 rounded-full">
          {badge}
        </div>
  
        {/* Icon */}
        <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-4 ${colors[label]}`}>
          {icons[label]}
        </div>
  
        {/* Value */}
        <h2 className="text-3xl font-bold">{value}</h2>
  
        {/* Label */}
        <p className="text-gray-400 text-sm">{label}</p>
  
      </div>
    );
  }