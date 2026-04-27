import { Zap, Users, ShieldAlert, Sparkles } from "lucide-react";

export default function CommunityStats({ newCircles = 0, engagement = '0', reportedItems = 0 }) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
  
        <StatCard
          title="Growth Velocity"
          value={`+${newCircles}`}
          subtitle="New Clusters"
          icon={<Zap size={20} />}
          color="text-amber-400"
          border="border-amber-500/20"
          bg="bg-amber-500/5"
        />
  
        <StatCard
          title="Avg Node Density"
          value={engagement}
          subtitle="Nodes per Circle"
          icon={<Users size={20} />}
          color="text-indigo-400"
          border="border-indigo-500/20"
          bg="bg-indigo-500/5"
        />
  
        <StatCard
          title="Integrity Audit"
          value={reportedItems}
          subtitle="Pending Flags"
          icon={<ShieldAlert size={20} />}
          color="text-red-400"
          border="border-red-500/20"
          bg="bg-red-500/5"
          danger
        />
  
      </div>
    );
  }
  
  function StatCard({ title, value, subtitle, icon, color, border, bg, danger }) {
    return (
      <div className={`relative overflow-hidden p-8 sm:p-10 rounded-[32px] bg-[#1A0C3F]/50 backdrop-blur-xl border ${border} group transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl`}>
        {/* Glow */}
        <div className={`absolute -right-10 -top-10 w-32 h-32 ${bg} blur-[60px] group-hover:opacity-100 transition-opacity`} />
        
        <div className="flex flex-col gap-6 relative z-10">
            <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center border ${border} shadow-lg transition-transform duration-500 group-hover:scale-110`}>
                {icon}
            </div>

            <div className="space-y-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                    {title}
                </p>
                <div className="flex items-end gap-3">
                    <span className={`text-4xl sm:text-5xl font-black tabular-nums tracking-tighter ${danger ? "text-red-500" : "text-white"}`}>
                        {value}
                    </span>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1.5 whitespace-nowrap">
                        {subtitle}
                    </span>
                </div>
            </div>
        </div>

        <div className="absolute bottom-6 right-8">
            <Sparkles size={16} className="text-white/5 group-hover:text-white/20 transition-colors" />
        </div>
      </div>
    );
  }