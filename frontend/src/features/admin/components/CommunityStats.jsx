import { TrendingUp, Users, AlertTriangle } from "lucide-react";

export default function CommunityStats({ newCircles = 0, engagement = '0', reportedItems = 0 }) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10">
  
        <StatCard
          title="New Circles Today"
          value={`+${newCircles}`}
          icon={<TrendingUp size={20} />}
          color="text-green-400"
          bgColor="bg-green-500/10"
          borderColor="border-green-500/20"
        />
  
        <StatCard
          title="Engagement Depth"
          value={engagement}
          subtitle="Avg Members/Circle"
          icon={<Users size={20} />}
          color="text-purple-400"
          bgColor="bg-purple-500/10"
          borderColor="border-purple-500/20"
        />
  
        <StatCard
          title="Risk Telemetry"
          value={reportedItems}
          subtitle="Pending Review"
          icon={<AlertTriangle size={20} />}
          color="text-red-400"
          bgColor="bg-red-500/10"
          borderColor="border-red-500/20"
          danger
        />
  
      </div>
    );
  }
  
  function StatCard({ title, value, icon, subtitle, color, bgColor, borderColor, danger }) {
    return (
      <div className={`
        relative overflow-hidden
        p-6 sm:p-8 rounded-[24px] sm:rounded-[32px]
        bg-[#1A0C3F]/50 backdrop-blur-xl
        border ${borderColor || 'border-white/10'}
        shadow-2xl
        transition-all duration-500 ease-out
        hover:-translate-y-1
        group
      `}>
        {/* Background Glow */}
        <div className={`absolute -right-8 -top-8 w-24 h-24 blur-[40px] opacity-10 group-hover:opacity-20 transition-all duration-700 ${color?.replace('text-', 'bg-')}`} />
  
        <div className="flex items-center gap-4 mb-5 sm:mb-6">
            <div className={`p-2.5 rounded-xl border ${bgColor} ${borderColor} ${color}`}>
                {icon}
            </div>
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white/50 transition-colors">
                {title}
            </p>
        </div>
  
        <div className="flex items-baseline gap-3">
          <span className={`text-3xl sm:text-4xl font-black tabular-nums tracking-tight ${danger ? "text-red-400" : "text-white"}`}>
            {value}
          </span>
  
          {subtitle && (
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
              {subtitle}
            </span>
          )}
        </div>
  
      </div>
    );
  }