/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050b18",
        panel: "#0a1628",
        lime: "#5cff8d",
        gold: "#ffdf6b",
        cyan: "#55d6ff",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "ui-sans-serif", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 35px rgba(92, 255, 141, 0.22)",
        gold: "0 0 40px rgba(255, 223, 107, 0.25)",
      },
    },
  },
  plugins: [],
};