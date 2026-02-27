import { ArrowRight } from "lucide-react";

export default function TrendingCommunities() {
  const communities = [
    {
      title: "Design Ethics",
      members: "12.4k Members",
      online: "430 Online",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200",
    },
    {
      title: "Mindful Makers",
      members: "8.2k Members",
      online: "120 Online",
      image:
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200",
    },
    {
      title: "Modern JS",
      members: "25.1k Members",
      online: "1.2k Online",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200",
    },
  ];

  return (
    <section className="py-24 px-6">

      {/* Header */}
      <div className="flex justify-between items-end mb-16 max-w-7xl mx-auto">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            Trending Communities
          </h2>
          <p className="text-gray-400">
            Join thousands of others in these active spaces.
          </p>
        </div>

        <button className="hidden md:flex items-center gap-2 text-purple-400 hover:text-purple-300 transition">
          Explore All <ArrowRight size={18} />
        </button>
      </div>

      {/* Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">

        {communities.map((community, index) => (
          <div
            key={index}
            className="
              rounded-[32px]
              overflow-hidden
              bg-[linear-gradient(180deg,#2b004f,#1a002d)]
              border border-white/5
              transition duration-300
              hover:-translate-y-1
              hover:border-purple-500/30
            "
          >
            {/* Image */}
            <div className="relative h-56">
              <img
                src={community.image}
                alt={community.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b004f] to-transparent" />
            </div>

            {/* Content */}
            <div className="p-8">
              <h3 className="text-xl font-semibold mb-2">
                {community.title}
              </h3>

              <p className="text-gray-400 text-sm mb-6">
                {community.members} • {community.online}
              </p>

              <button className="
                w-full py-3 rounded-full
                bg-purple-600
                hover:bg-purple-500
                transition
                font-medium
              ">
                Join Community
              </button>
            </div>

          </div>
        ))}

      </div>

      {/* Mobile Explore Button */}
      <div className="mt-12 flex justify-center md:hidden">
        <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition">
          Explore All <ArrowRight size={18} />
        </button>
      </div>

    </section>
  );
}