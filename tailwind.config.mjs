/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts,md,mdx}"],
  theme: {
    extend: {
      colors: {
        majella: {
          green: "#1b3b22",
          lightgreen: "#edf2ee",
          red: "#b81d1d",
          stone: "#f4f3f0",
          darkstone: "#3a3836",
          wood: "#c29a6b",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
        display: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
        handwriting: ["Caveat", '"Comic Sans MS"', "cursive"],
      },
      boxShadow: {
        soft: "0 18px 60px -28px rgba(27, 59, 34, 0.35)",
      },
    },
  },
  plugins: [],
};
