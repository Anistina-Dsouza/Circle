const features = [
    {
      title: "Time-Based Stories",
      desc: "Content that expires automatically to keep feeds relevant."
    },
    {
      title: "Organized Circles",
      desc: "Focused communities for study, work, and passions."
    },
    {
      title: "Real-Time Chat",
      desc: "Instant messaging without endless scrolling."
    }
  ];
  
  export default function Features() {
    return (
      <section className="px-10 mt-28 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#9D4EDD] transition"
          >
            <h4 className="text-xl font-semibold mb-3 text-[#C77DFF]">
              {f.title}
            </h4>
            <p className="text-[#E0AAFF]">{f.desc}</p>
          </div>
        ))}
      </section>
    );
  }
  