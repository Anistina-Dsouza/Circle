import { useEffect, useRef, useState } from "react";

function CountUp({ value }) {
  const [count, setCount] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      let start = 0;
      const end = value;
      const duration = 800;
      const stepTime = 16;
      const increment = end / (duration / stepTime);

      const interval = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(interval);
        } else {
          setCount(Math.floor(start));
        }
      }, stepTime);

      observer.disconnect();
    });

    observer.observe(ref.current);
  }, [value]);

  return <span ref={ref}>{count.toLocaleString()}+</span>;
}

export default function Stats() {
  return (
    <section className="px-10 mt-24 grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-4xl">
      <div>
        <h3 className="text-3xl font-bold text-[#C77DFF]">
          <CountUp value={500000} />
        </h3>
        <p className="text-[#E0AAFF]">Active Users</p>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-[#C77DFF]">
          <CountUp value={10000} />
        </h3>
        <p className="text-[#E0AAFF]">Communities</p>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-[#C77DFF]">
          <CountUp value={1000000} />
        </h3>
        <p className="text-[#E0AAFF]">Stories Shared</p>
      </div>
    </section>
  );
}
