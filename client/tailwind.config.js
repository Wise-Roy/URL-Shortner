/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#09090B",
        card: "#16171A",
        neon: "#46F2A0",
        border: "rgba(255,255,255,0.07)",
      },
      fontFamily: {
        sans: ["Satoshi", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        btn: "8px",
      },
      boxShadow: {
        neon: "0 0 20px rgba(70, 242, 160, 0.3)",
        "neon-sm": "0 0 10px rgba(70, 242, 160, 0.2)",
      },
    },
  },
  plugins: [],
};
