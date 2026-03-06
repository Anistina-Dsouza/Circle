export default function CTASection() {
    return (
      <section className="py-28 px-6">
  
        <div
          className="
          max-w-6xl mx-auto
          rounded-[48px]
          bg-gradient-to-r
          from-[#7b2cbf]
          via-[#9d4edd]
          to-[#c77dff]
          p-16 md:p-24
          text-center
          "
        >
          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Ready to Build Your Circle?
          </h2>
  
          {/* Subtitle */}
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Join 100,000+ creators building meaningful spaces for their
            communities today.
          </p>
  
          {/* Button */}
          <button
            className="
            bg-white text-purple-700
            px-10 py-4
            rounded-full
            font-semibold
            text-lg
            transition
            hover:bg-gray-100
            "
          >
            Get Started Free
          </button>
  
        </div>
  
      </section>
    );
  }