import { Palette, Terminal, Dumbbell, Film, Settings } from "lucide-react";

const communities = [
  { name: "Digital Arts", cat: "Creative", members: "1.2k", icon: <Palette size={16} /> },
  { name: "Rust Devs", cat: "Tech", members: "842", icon: <Terminal size={16} /> },
  { name: "Night Runners", cat: "Health", members: "3.5k", icon: <Dumbbell size={16} /> },
  { name: "Cinephiles", cat: "Hobbies", members: "2.1k", icon: <Film size={16} /> },
];

export default function CommunitiesTable() {
  return (
    <div className="p-6 rounded-[28px] bg-[radial-gradient(circle_at_top,#2a004a,#13001f)] border border-white/5 overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">New Communities</h2>
        <span className="text-purple-400 text-xs tracking-widest">MANAGE</span>
      </div>

      {/* Column Headings */}
      <div className="flex text-xs uppercase tracking-widest text-gray-500 pb-4 border-b border-white/5">
        <div className="w-[45%]">Community</div>
        <div className="w-[20%]">Category</div>
        <div className="w-[20%]">Members</div>
        <div className="w-[15%] text-right">Action</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">

        {communities.map((c, i) => (
          <div
            key={i}
            className="flex items-center py-4 hover:bg-purple-900/20 transition"
          >

            {/* Community */}
            <div className="w-[45%] flex gap-4 items-center">
              <div className="w-10 h-10 bg-purple-800/60 rounded-full flex items-center justify-center text-purple-300">
                {c.icon}
              </div>
              <span className="text-sm">{c.name}</span>
            </div>

            {/* Category */}
            <div className="w-[20%]">
              <span className="text-xs px-3 py-1 rounded-full bg-purple-900/40 text-purple-300">
                {c.cat}
              </span>
            </div>

            {/* Members */}
            <div className="w-[20%]">
              <span className="text-xs px-3 py-1 rounded-full bg-purple-700/20 text-purple-200">
                {c.members}
              </span>
            </div>

            {/* Action */}
            <div className="w-[15%] flex justify-end">
              <button className="p-2 rounded-full hover:bg-purple-800/40 transition">
                <Settings size={16} />
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}