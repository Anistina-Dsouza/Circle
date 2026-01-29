import { useEffect, useState } from "react";

export default function Hero() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * -60;
      const y = (e.clientY / window.innerHeight - 0.5) * -60;
      setPos({ x, y });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#0F0826] flex items-center justify-center">
      
      {/* soft background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#7C3AED]/25 blur-[160px]" />
        <div className="absolute bottom-[-250px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#A78BFA]/20 blur-[160px]" />
      </div>

      {/* CENTER CONTENT */}
      <div className="relative text-center max-w-3xl px-6">
        <h1 className="text-[64px] leading-[1.05] font-extrabold tracking-[-0.025em] text-white">
          Find your people.
          <span className="block text-[#C4B5FD]">Build your Circle.</span>
        </h1>

        <p className="mt-6 text-lg text-[#EDE9FE]/80">
          A social platform designed for meaningful communities,
          real conversations, and zero noise.
        </p>

        <div className="mt-10 flex justify-center gap-6">
          <button className="px-8 py-4 bg-[#6D28D9] hover:bg-[#5B21B6] transition rounded-xl font-semibold">
            Join Circle
          </button>
        </div>
      </div>

      {/* FLOATING AVATAR CIRCLES */}
      {avatars.map((a, i) => (
        <div
          key={i}
          className="absolute rounded-full shadow-xl border border-white/20 overflow-hidden"
          style={{
            width: a.size,
            height: a.size,
            top: a.top,
            left: a.left,
            transform: `translate(${pos.x * a.depth}px, ${pos.y * a.depth}px)`,
            animation: `float ${a.float}s ease-in-out infinite`,
          }}
        >
          <img
            src={a.src}
            alt="user"
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* floating animation */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-14px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>
    </section>
  );
}

/* Avatar positions around center */
const avatars = [
  { src: "https://i.pravatar.cc/100?img=11", size: 72, top: "15%", left: "35%", depth: 0.6, float: 7 },
  { src: "https://i.pravatar.cc/100?img=32", size: 64, top: "22%", left: "55%", depth: 0.8, float: 6 },
  { src: "https://i.pravatar.cc/100?img=45", size: 80, top: "40%", left: "20%", depth: 0.7, float: 8 },
  { src: "https://i.pravatar.cc/100?img=21", size: 68, top: "38%", left: "72%", depth: 0.9, float: 7 },
  { src: "https://i.pravatar.cc/100?img=18", size: 60, top: "58%", left: "30%", depth: 1, float: 6 },
  { src: "https://i.pravatar.cc/100?img=52", size: 74, top: "60%", left: "58%", depth: 0.8, float: 9 },
];
