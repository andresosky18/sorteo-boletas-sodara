/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lightPrimary: '#F4F7FE',
        brandLinear: "#868CFF",
        brand: {
          50: "#E9E3FF",
          100: "#C0B8FE",
          200: "#A195FD",
          300: "#8171FC",
          400: "#7551FF",
          500: "#422AFB",
          600: "#3311DB",
          700: "#2111A5",
          800: "#190793",
          900: "#11047A",
        },
        navy: {
          50: "#d0dcfb",
          100: "#aac0fe",
          200: "#a3b9f8",
          300: "#728fea",
          400: "#3652ba",
          500: "#1b3bbb",
          600: "#24388a",
          700: "#1B254B",
          800: "#111c44",
          900: "#0b1437",
        },
        shadow: {
          500: "rgba(112, 144, 176, 0.08)",
        },
      },
      boxShadow: {
        'horizon': '0px 18px 40px rgba(112, 144, 176, 0.12)',
        '3xl': "14px 17px 40px 4px",
      }
    },
  },
  plugins: [],
}
