/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1D2653",
          light: "#2A3570",
          dark: "#151B3D",
        },
        gold: {
          DEFAULT: "#FFC343",
          light: "#FFD166",
          dark: "#E5A832",
        },
        offwhite: "#F4F4F6",
        lightgray: "#D1D5D9",
      },
      boxShadow: {
        soft: "0 20px 60px rgba(29, 38, 83, 0.12)",
      },
      borderRadius: {
        xl2: "1.5rem",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        gulf: {
          primary: "#1D2653",
          secondary: "#FFC343",
          accent: "#FFC343",
          neutral: "#1D2653",
          "base-100": "#F4F4F6",
          "base-200": "#FFFFFF",
          "base-300": "#D1D5D9",
          info: "#3B82F6",
          success: "#16A34A",
          warning: "#FFC343",
          error: "#EF4444",
        },
      },
    ],
  },
};
