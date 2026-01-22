/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.12)",
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
          primary: "#F5C542",
          secondary: "#0EA5E9",
          accent: "#10B981",
          neutral: "#0F172A",
          "base-100": "#FFFFFF",
          "base-200": "#F7F7FB",
          "base-300": "#E5E7EB",
          info: "#0EA5E9",
          success: "#16A34A",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
    ],
  },
};
