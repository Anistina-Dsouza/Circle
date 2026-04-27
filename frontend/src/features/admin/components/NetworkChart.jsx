import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

export default function NetworkChart({ registrationTrends = [], hourlyTrends = [], isDetailed = false }) {
  const [timeline, setTimeline] = useState(isDetailed ? "Live View" : "Live View");
  
  // Date formatting helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes(":")) return dateStr; // Already formatted as hour
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    } catch (e) {
      return dateStr;
    }
  };

  // Determine active dataset based on timeline
  const rawData = timeline === "Live View" ? hourlyTrends : registrationTrends;
  
  const chartData = rawData.map(item => ({
    day: timeline === "Live View" ? item._id : formatDate(item._id),
    value: item.count
  }));

  const maxVal = Math.max(...chartData.map(d => d.value), 5);
  const [active, setActive] = useState(null);

  // Set default active on change
  useEffect(() => {
    setActive(chartData[chartData.length - 1]?.day);
  }, [timeline, chartData.length]);

  // SVG Helpers
  const getX = (index) => (index / (chartData.length - 1)) * 100;
  const getY = (value) => 100 - (value / maxVal) * 100;

  // SVG Path Helper for Sharp Linear Path (Real-time Pulse)
  const getLinearPath = () => {
    if (chartData.length < 2) return "";
    return chartData.reduce((acc, point, i) => {
      const x = getX(i);
      const y = getY(point.value);
      return i === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, "");
  };

  const linePath = getLinearPath();
  const latestNodeCount = chartData[chartData.length - 1]?.value || 0;
  const activeIndex = chartData.findIndex(d => d.day === active);
  const activeData = chartData[activeIndex];


  return (
    <div className={`${isDetailed ? '' : 'mt-12 rounded-[24px] sm:rounded-[32px] bg-[#1A0C3F]/50 backdrop-blur-xl border border-white/10 shadow-2xl'} relative transition-all duration-500 hover:border-purple-500/20`}>
      {/* Standardized Header */}
      {!isDetailed && (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 sm:px-8 py-5 sm:py-7 border-b border-white/5 gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
           <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
             <Activity size={20} className="animate-pulse sm:w-6 sm:h-6" />
           </div>
           <div>
             <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">System Resonance</h2>
             <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest font-black">Live Pulse Audit</p>
           </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-8 w-full md:w-auto justify-between md:justify-end">
            {/* Live Counter Badge */}
            <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#0F0529]/60 border border-white/5 shadow-2xl">
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-md" />
                    <div className="relative w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-purple-500 animate-pulse" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm sm:text-[16px] font-black text-white tabular-nums leading-none">
                        {latestNodeCount}
                    </span>
                    <span className="text-[7px] sm:text-[8px] font-black text-purple-400/40 uppercase tracking-widest mt-1">
                        Active Nodes
                    </span>
                </div>
            </div>

            <div className="flex p-1 bg-white/5 rounded-xl sm:rounded-2xl border border-white/5 backdrop-blur-xl">
            {["Live View", "7 Days"].map((t) => (
                <button 
                key={t}
                onClick={() => setTimeline(t)}
                className={`px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${timeline === t ? "bg-purple-600 text-white shadow-xl" : "text-white/30 hover:text-white"}`}>
                {t}
                </button>
            ))}
            </div>
        </div>
      </div>
      )}

      <div className={`${isDetailed ? 'pt-6' : 'pt-16 sm:pt-24'} pb-10 px-6 sm:px-10`}>
        <div className="relative h-[280px] sm:h-[340px]">
            {/* High-Contrast Y-Axis Grid */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-4 sm:pr-8">
            {[100, 50, 0].map((percent) => (
                <div key={percent} className="flex items-center gap-4 sm:gap-8 w-full group/grid">
                <span className="text-[10px] sm:text-[12px] font-black text-white/20 w-8 sm:w-10 text-right tabular-nums">
                    {Math.round((percent / 100) * maxVal)}
                </span>
                <div className={`flex-1 h-px ${percent === 0 ? 'bg-white/10' : 'bg-white/[0.03]'} group-first/grid:bg-purple-500/20`} />
                </div>
            ))}
            </div>

            {/* Chart Content Area */}
            <div className="absolute inset-0 left-12 sm:left-16 px-2 sm:px-6">
            
            {timeline === "Live View" ? (
                <div className="relative w-full h-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                    <linearGradient id="livePulseArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A855F7" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
                    </linearGradient>
                    </defs>
                    
                    {/* Area Fill */}
                    <path
                        d={`${linePath} L 100,100 L 0,100 Z`}
                        fill="url(#livePulseArea)"
                        className="transition-all duration-1000 ease-in-out"
                    />
                    {/* Linear Vector Line */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke="#A855F7"
                        strokeWidth="0.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-[0_0_8px_rgba(168,85,247,0.2)] transition-all duration-1000"
                    />
                </svg>

                {/* Precise Micro-Nodes */}
                {chartData.map((d, i) => (
                    <div 
                        key={i}
                        onClick={() => setActive(d.day)}
                        className={`absolute w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 z-20
                            ${active === d.day ? 'bg-white scale-150 shadow-[0_0_10px_white]' : 'bg-purple-500 hover:bg-white hover:scale-125'}
                        `}
                        style={{ left: `${getX(i)}%`, top: `${getY(d.value)}%` }}
                    />
                ))}
                
                {/* Premium Tactical Tag (Line View) */}
                {active && activeData && (
                    <div 
                    className="absolute bg-[#0F0529]/95 backdrop-blur-xl text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl text-[9px] sm:text-[10px] font-black pointer-events-none z-30 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center gap-1.5 border border-purple-500/30 whitespace-nowrap"
                    style={{ 
                        left: `${getX(activeIndex)}%`, 
                        top: `${getY(activeData.value)}%`,
                        transform: 'translate(-50%, -140%)'
                    }}
                    >
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-[8px] text-green-400 uppercase tracking-tighter">
                            <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                            <span>System Active</span>
                        </div>
                        <span className="uppercase tracking-widest text-xs sm:text-[13px] text-white tabular-nums">{activeData.value} Active Nodes</span>
                        <div className="text-[8px] sm:text-[9px] text-purple-400/60 uppercase tracking-[0.2em] border-t border-white/5 pt-1.5 w-full text-center font-black mt-1.5">
                            Temporal Pulse: {active}
                        </div>
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0F0529]/95 border-r border-b border-purple-500/30 rotate-45" />
                    </div>
                )}
                </div>
            ) : (
                /* Enhanced Bar View - Tactical Tags */
                <div className="flex items-end justify-between gap-2 sm:gap-6 h-full px-1 sm:px-4">
                {chartData.map((item, i) => (
                    <div
                    key={i}
                    onClick={() => setActive(item.day)}
                    className="flex flex-col items-center flex-1 h-full cursor-pointer group/bar-container"
                    >
                    <div className="relative w-full h-full flex items-end justify-center group/bar">
                        {/* Premium Tactical Tag for Bar chart */}
                        <div className={`absolute bg-[#0F0529]/95 backdrop-blur-2xl text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black pointer-events-none z-30 mb-10 bottom-full transition-all duration-500 flex flex-col items-center gap-1 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-purple-500/40 whitespace-nowrap ${active === item.day ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                <span className="uppercase tracking-wider text-[10px] sm:text-[12px]">{item.value} Nodes</span>
                            </div>
                            <span className="text-[7px] sm:text-[8px] text-purple-400/50 uppercase tracking-[0.3em] border-t border-white/5 pt-1 w-full text-center font-black">
                                {item.day}
                            </span>
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0F0529]/95 border-r border-b border-purple-500/40 rotate-45" />
                        </div>

                        {/* Micro-Dot Peak */}
                        <div 
                            className={`absolute w-1.5 h-1.5 rounded-full transition-all duration-500 z-20 mb-[-3px] border border-[#1A0C3F]
                                ${active === item.day ? "bg-white scale-125 shadow-[0_0_10px_white]" : "bg-purple-400/40 group-hover/bar:bg-purple-500"}`}
                            style={{ bottom: `${(item.value / maxVal) * 100}%` }}
                        />

                        <div className="absolute inset-x-0 bottom-0 top-0 w-full max-w-[28px] mx-auto bg-white/[0.01] rounded-t-xl border-x border-t border-white/[0.04] pointer-events-none" />

                        <div
                        className={`w-full max-w-[28px] rounded-t-xl transition-all duration-1000 relative z-10
                            ${active === item.day ? "bg-gradient-to-t from-indigo-600/40 via-purple-500/40 to-purple-400/40 shadow-[0_0_20px_rgba(168,85,247,0.1)]" : "bg-white/[0.04] group-hover/bar:bg-white/[0.08]"}
                        `}
                        style={{ height: `${(item.value / maxVal) * 100}%`, minHeight: item.value > 0 ? '4px' : '0px' }}
                        />
                    </div>
                    </div>
                ))}
                </div>
            )}
            </div>
        </div>

        {/* High-Visibility X-Axis */}
        <div className="flex mt-8 ml-12 sm:ml-16 px-2 sm:px-6 justify-between relative border-t border-white/10 pt-8 sm:pt-10">
            {chartData.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 sm:gap-4">
                {(timeline !== "Live View" || i % (isDetailed ? 8 : 6) === 0 || i === chartData.length - 1) ? (
                <>
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-700 ${active === item.day ? 'bg-purple-400 scale-150 shadow-[0_0_12px_rgba(168,85,247,0.6)]' : 'bg-white/10'}`} />
                    <span
                    className={`text-[9px] sm:text-[12px] font-black tracking-widest uppercase transition-all duration-500
                        ${active === item.day ? "text-white" : "text-white/40 group-hover:text-white/70"}`}
                    >
                    {item.day}
                    </span>
                </>
                ) : null}
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}