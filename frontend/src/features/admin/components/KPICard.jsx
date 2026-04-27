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
    Users: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Circles: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    Active: "bg-green-500/10 text-green-400 border-green-500/20",
    Flagged: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <div
      className="
      relative overflow-hidden
      p-5 sm:p-7 rounded-[24px] sm:rounded-[32px]
      bg-[#1A0C3F]/50 backdrop-blur-xl
      border border-white/10
      shadow-2xl
      transition-all duration-500 ease-out
      hover:-translate-y-1
      hover:border-purple-500/30
      group
      "
    >
      {/* Background Glow */}
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-500/5 blur-[40px] group-hover:bg-purple-500/10 transition-all duration-700" />

      {/* Badge */}
      {badge && (
        <div className="absolute right-5 top-5 text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-white/40 px-3 py-1 rounded-full group-hover:border-purple-500/20 group-hover:text-purple-300 transition-all">
            {badge}
        </div>
      )}

      {/* Icon */}
      <div
        className={`
        w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6
        border transition-transform duration-500 group-hover:scale-110
        ${colors[label]}
        `}
      >
        {icons[label] || <Layers size={18} />}
      </div>

      <div className="space-y-1">
        {/* Value */}
        <h2 className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tight">
            {value}
        </h2>

        {/* Label */}
        <p className="text-[10px] sm:text-xs font-black text-white/30 uppercase tracking-[0.2em] group-hover:text-white/50 transition-colors">
            {label}
        </p>
      </div>

    </div>
  );
}