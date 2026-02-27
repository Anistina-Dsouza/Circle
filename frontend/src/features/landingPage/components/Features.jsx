import { Clock, Users, Video, MessageSquare } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Clock size={28} className="text-purple-400" />,
      title: "Time-Based Stories",
      desc: "Share moments that live in the now. Our unique feed prioritizes current presence over algorithm traps.",
    },
    {
      icon: <Users size={28} className="text-purple-400" />,
      title: "Community Channels",
      desc: "Deep-dive into niche topics with dedicated channels for every interest and sub-culture.",
    },
    {
      icon: <Video size={28} className="text-purple-400" />,
      title: "Zoom-Based Meetings",
      desc: "One-click video huddles. Bring your community face-to-face with seamless native integrations.",
    },
    {
      icon: <MessageSquare size={28} className="text-purple-400" />,
      title: "Private Messaging",
      desc: "Encrypted, fast, and personal. Build one-on-one relationships within your larger circles.",
    },
  ];

  return (
    <section className="py-24 px-6">

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Right Place, Right Time
        </h2>
        <p className="text-gray-400 text-lg">
          Everything you need to nurture your digital tribe.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">

        {features.map((feature, index) => (
          <div
            key={index}
            className="
              p-10 rounded-[32px]
              bg-[linear-gradient(180deg,#2b004f,#1a002d)]
              border border-white/5
              transition duration-300
              hover:-translate-y-1
              hover:border-purple-500/30
            "
          >
            <div className="mb-8">{feature.icon}</div>

            <h3 className="text-xl font-semibold mb-4">
              {feature.title}
            </h3>

            <p className="text-gray-400 leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}