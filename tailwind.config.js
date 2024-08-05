/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          100: "#EFEFEF",
          200: "#5B5B63",
          300: "#27272A",
          400: "#222327",
          500: "#16171B",
          600: "#111114",
          700: "#0A0A0A",
        },
        red: {
          500: "#CF4B32",
        },
      },
    },
  },
  plugins: [],
};
