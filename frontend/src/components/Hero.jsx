import { useEffect, useRef } from "react";

const AVATAR_COUNT = 60;
const AVATAR_SIZE = 80; // slightly smaller

// Better DiceBear avatars (clean & aesthetic)
const avatarUrl = (i) =>
  `https://api.dicebear.com/7.x/personas/svg?seed=user${i}&radius=50&backgroundColor=f1ecff,e9d5ff,ddd6fe`;

export default function Hero() {
  const ref = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * -100;
      const y = (e.clientY / window.innerHeight - 0.5) * -100;

      ref.current?.style.setProperty("--mx", `${x}px`);
      ref.current?.style.setProperty("--my", `${y}px`);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full h-[92vh] overflow-hidden
                 bg-gradient-to-b from-[#120B2F] to-[#1A1045]
                 flex items-center justify-center"
    >
      {/* lighter background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#7C3AED18,transparent_70%)]" />
      </div>

      {/* AVATAR FIELD */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: AVATAR_COUNT }).map((_, i) => (
          <Avatar key={i} index={i} />
        ))}
      </div>

      {/* CENTER SAFE ZONE */}
      <div className="relative z-20 text-center px-14 py-16
                      max-w-3xl rounded-3xl
                      bg-[#120B2F]/45 backdrop-blur-xl">
        <h1 className="text-[56px] leading-[1.05] font-extrabold tracking-[-0.03em] text-white">
          Find your people.
          <span className="block text-[#D6CCFF]">Build your Circle.</span>
        </h1>

        <p className="mt-6 text-lg text-[#EDE9FE]/75">
          A calm, flowing social space designed for meaningful communities.
        </p>

        <button className="mt-10 px-8 py-4 rounded-xl font-semibold
                           bg-[#7C3AED]/90 hover:bg-[#6D28D9]
                           transition shadow-md hover:shadow-lg">
          Join Circle
        </button>
      </div>

      {/* flow animation */}
      <style>
        {`
          @keyframes flow {
            0% { transform: translate(0,0); }
            50% { transform: translate(36px,-44px); }
            100% { transform: translate(0,0); }
          }
        `}
      </style>
    </section>
  );
}

function Avatar({ index }) {
  const zones = [
    { top: Math.random() * 20, left: Math.random() * 100 },
    { top: 80 + Math.random() * 20, left: Math.random() * 100 },
    { top: Math.random() * 100, left: Math.random() * 20 },
    { top: Math.random() * 100, left: 80 + Math.random() * 20 },
  ];

  const pos = zones[index % zones.length];
  const duration = 16 + Math.random() * 12;
  const delay = Math.random() * -18;
  const depth = 0.45 + Math.random() * 0.6;

  return (
    <div
      className="absolute rounded-full overflow-hidden
                 shadow-lg transition-all duration-300
                 hover:scale-125 hover:ring-2 hover:ring-white/60"
      style={{
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        top: `${pos.top}%`,
        left: `${pos.left}%`,
        animation: `flow ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        transform: `
          translate(
            calc(var(--mx, 0px) * ${depth}),
            calc(var(--my, 0px) * ${depth})
          )
        `,
        pointerEvents: "auto",
      }}
    >
      <img
        src={avatarUrl(index)}
        alt="avatar"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
