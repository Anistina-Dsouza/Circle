import { Users } from "lucide-react";

const communities = [
  {
    name: "Creative Minds NYC",
    host: "Julian Richards",
    members: "8.4k",
    privacy: "Public",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
  },
  {
    name: "Retro Gamer Lounge",
    host: "Sarah Chen",
    members: "12.2k",
    privacy: "Public",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420"
  },
  {
    name: "Dev Inner Circle",
    host: "Marcus Thorne",
    members: "420",
    privacy: "Private",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    name: "Night Owls",
    host: "Elena Rodriguez",
    members: "3.1k",
    privacy: "Public",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    name: "Plant Parents Elite",
    host: "David Kim",
    members: "95",
    privacy: "Private",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
  }
];

export default function CommunityTable() {
  return (
    <div className="bg-[#240046] rounded-[32px] overflow-hidden border border-purple-900/40">

      {/* Table Header */}
      <div className="grid grid-cols-5 px-10 py-6 text-sm uppercase tracking-widest text-purple-300 border-b border-purple-900/40">
        <span>Community Name</span>
        <span>Host Name</span>
        <span>Members</span>
        <span>Privacy Type</span>
        <span className="text-right">Actions</span>
      </div>

      {/* Rows */}
      {communities.map((c, i) => (
        <div
          key={i}
          className="grid grid-cols-5 items-center px-10 py-6 border-b border-purple-900/30 hover:bg-purple-900/20 transition"
        >
          {/* Name */}
          <div className="flex items-center gap-4">
            <img
              src={c.image}
              alt=""
              className="w-12 h-12 rounded-xl object-cover"
            />
            <span className="font-semibold">{c.name}</span>
          </div>

          {/* Host */}
          <span className="text-purple-300">{c.host}</span>

          {/* Members */}
          <div className="flex items-center gap-2 text-purple-200">
            <Users size={16}/>
            {c.members}
          </div>

          {/* Privacy */}
          <span
            className={`px-4 py-1 rounded-full text-xs font-semibold w-fit ${
              c.privacy === "Public"
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
            }`}
          >
            {c.privacy.toUpperCase()}
          </span>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button className="bg-purple-500 px-5 py-2 rounded-full text-sm hover:bg-purple-400 transition">
              View
            </button>
            <button className="bg-purple-800 px-5 py-2 rounded-full text-sm hover:bg-red-900/40 transition">
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Pagination */}
      {/* <div className="flex justify-between items-center px-10 py-6">

        <span className="text-purple-300 text-sm">
          Showing 1 to 5 of 1,248 communities
        </span>

        <div className="flex gap-3">
          {[1,2,3].map((p) => (
            <button
              key={p}
              className={`w-10 h-10 rounded-full ${
                p === 1
                  ? "bg-purple-500 text-white"
                  : "bg-purple-900/40 hover:bg-purple-600"
              }`}
            >
              {p}
            </button>
          ))}
          <button className="w-10 h-10 rounded-full bg-purple-900/40 hover:bg-purple-600">
            250
          </button>
        </div>

      </div> */}
      
      <div className="flex justify-between items-center px-10 py-6">

        {/* Left Text */}
        <span className="text-purple-300 text-sm">
          Showing <span className="text-white font-semibold">1 to 5</span> of{" "}
          <span className="text-white font-semibold">1,248</span> communities
        </span>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-3">

          {/* Previous */}
          <button className="w-11 h-11 flex items-center justify-center rounded-full
            bg-purple-900/40 text-purple-300 hover:bg-purple-600 hover:text-white transition">
            ‹
          </button>

          {/* Active Page */}
          <button className="w-11 h-11 flex items-center justify-center rounded-full
            bg-gradient-to-r from-purple-500 to-purple-600
            text-white font-medium shadow-md shadow-purple-900/40">
            1
          </button>

          {/* Other Pages */}
          <button className="w-11 h-11 flex items-center justify-center rounded-full
            bg-purple-900/40 text-purple-300 hover:bg-purple-600 hover:text-white transition">
            2
          </button>

          <button className="w-11 h-11 flex items-center justify-center rounded-full
            bg-purple-900/40 text-purple-300 hover:bg-purple-600 hover:text-white transition">
            3
          </button>

          {/* Ellipsis */}
          <span className="px-2 text-purple-400 text-sm">...</span>

          {/* Last Page */}
          <button className="w-11 h-11 flex items-center justify-center rounded-full
            bg-purple-900/40 text-purple-300 hover:bg-purple-600 hover:text-white transition">
            250
          </button>

          {/* Next */}
          <button className="w-11 h-11 flex items-center justify-center rounded-full
            bg-purple-900/40 text-purple-300 hover:bg-purple-600 hover:text-white transition">
            ›
          </button>

        </div>
      </div>
    </div>
  );
}