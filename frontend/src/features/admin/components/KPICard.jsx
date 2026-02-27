import {
  Users,
  Layers,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

export default function KPICard({ value, label, badge }) {

  const icons = {
    Users: <Users size={18} />,
    Circles: <Layers size={18} />,
    Active: <TrendingUp size={18} />,
    Flagged: <AlertTriangle size={18} />,
  };

  const colors = {
    Users: "bg-purple-800/60 text-purple-300",
    Circles: "bg-indigo-800/60 text-indigo-300",
    Active: "bg-green-800/60 text-green-300",
    Flagged: "bg-red-800/60 text-red-300",
  };

  return (
    <div
      className="
      relative overflow-hidden
      p-6 rounded-[28px]
      bg-[radial-gradient(circle_at_top,#2a004a,#13001f)]
      border border-white/5

      transition-all duration-300 ease-out
      hover:-translate-y-[2px]
      hover:border-purple-500/30
      hover:bg-[radial-gradient(circle_at_top,#320060,#160026)]
      "
    >

      {/* Badge */}
      <div className="absolute right-4 top-4 text-xs bg-purple-900/60 px-3 py-1 rounded-full">
        {badge}
      </div>

      {/* Icon */}
      <div
        className={`
        w-11 h-11 rounded-full flex items-center justify-center mb-4
        ${colors[label]}
        `}
      >
        {icons[label]}
      </div>

      {/* Value */}
      <h2 className="text-3xl font-semibold tracking-tight">{value}</h2>

      {/* Label */}
      <p className="text-gray-400 text-sm mt-1">{label}</p>

    </div>
  );
}