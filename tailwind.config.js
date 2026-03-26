/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      colors: {
        cream: "#F7F7F2",
        stone: {
          DEFAULT: "#1A1A1A",
          light: "#3A3A3A",
          muted: "#6B6B6B",
        },
        terracotta: {
          DEFAULT: "#C75B3F",
          light: "#D4705A",
          dark: "#A44A32",
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        gulf: {
          primary: "#C75B3F",
          secondary: "#D4A574",
          accent: "#D4705A",
          neutral: "#1A1A1A",
          "base-100": "#F7F7F2",
          "base-200": "#FFFFFF",
          "base-300": "#E5E5E0",
          info: "#3B82F6",
          success: "#16A34A",
          warning: "#D4A574",
          error: "#EF4444",
        },
      },
    ],
  },
};
