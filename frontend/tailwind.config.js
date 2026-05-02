/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8f7",
          100: "#d6efec",
          500: "#1f8a82",
          700: "#16615b",
          900: "#0c3532"
        },
        accent: "#f4a259"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(12, 53, 50, 0.18)"
      }
    }
  },
  plugins: []
};
