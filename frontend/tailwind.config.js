/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#5A189A",
        "brand-deep-midnight": "#10002B",
        "brand-dark-purple": "#240046",
        "brand-border": "#3C096C",
        "brand-glow": "#9D4EDD",
        "brand-high-contrast": "#F8F0FB",
        "brand-pale-lilac": "#EBC9FF",
        "brand-mid-purple": "#7B2CBF",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
    },
  },
  plugins: [],
};
