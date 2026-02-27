export default function HowItWorks() {
    const steps = [
      {
        number: "1",
        title: "Create or Join",
        desc: "Find communities that align with your passions or start your own in minutes.",
      },
      {
        number: "2",
        title: "Share and Chat",
        desc: "Engage with members through threaded discussions, stories, and real-time messaging.",
      },
      {
        number: "3",
        title: "Collaborate",
        desc: "Move beyond chat with live video workshops, events, and collaborative projects.",
      },
    ];
  
    return (
      <section className="py-24 px-6">
  
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            How Circle Works
          </h2>
        </div>
  
        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
  
          {steps.map((step, index) => (
            <div
              key={index}
              className="
                p-12 rounded-[32px]
                bg-[linear-gradient(180deg,#2b004f,#1a002d)]
                border border-white/5
                text-center
                transition duration-300
                hover:-translate-y-1
                hover:border-purple-500/30
              "
            >
              {/* Number Circle */}
              <div className="flex justify-center mb-8">
                <div className="
                  w-20 h-20
                  rounded-full
                  flex items-center justify-center
                  text-2xl font-semibold
                  bg-purple-700/40
                  border-4 border-purple-400/40
                ">
                  {step.number}
                </div>
              </div>
  
              {/* Title */}
              <h3 className="text-xl font-semibold mb-4">
                {step.title}
              </h3>
  
              {/* Description */}
              <p className="text-gray-400 leading-relaxed">
                {step.desc}
              </p>
  
            </div>
          ))}
  
        </div>
  
      </section>
    );
  }