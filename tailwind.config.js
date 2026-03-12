/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // Colors for map markers and categories
    "bg-blue-100",
    "bg-blue-500",
    "bg-blue-700",
    "text-blue-500",
    "text-blue-700",
    "bg-purple-100",
    "bg-purple-500",
    "bg-purple-700",
    "text-purple-500",
    "text-purple-700",
    "bg-green-100",
    "bg-green-500",
    "bg-green-700",
    "text-green-500",
    "text-green-700",
    "bg-yellow-100",
    "bg-yellow-500",
    "bg-yellow-700",
    "text-yellow-500",
    "text-yellow-700",
    "bg-red-100",
    "bg-red-500",
    "bg-red-700",
    "text-red-500",
    "text-red-700",
    "bg-gray-100",
    "bg-gray-500",
    "bg-gray-700",
    "text-gray-500",
    "text-gray-700",
  ],
  theme: {
    extend: {
      colors: {
        // DQ Brand Colors
        primary: {
          50: "#FFF4F2",
          100: "#FFE8E4",
          200: "#FFD1C9",
          300: "#FFB5A8",
          400: "#FF8D7A",
          500: "#FF6B4D", // Main brand color
          600: "#FF4D2B",
          700: "#E63D1A",
          800: "#C02F0F",
          900: "#8A2109",
          DEFAULT: "#FF6B4D",
        },
        secondary: {
          50: "#F0F2F9",
          100: "#E1E5F3",
          200: "#C3CBE7",
          300: "#9BA8D6",
          400: "#6B7DBF",
          500: "#4A5FA8",
          600: "#2E4580",
          700: "#1F2F5C",
          800: "#141F42",
          900: "#030F35", // Secondary brand color
          DEFAULT: "#030F35",
        },
        brand: {
          coral: "#FF6B4D",
          navy: "#030F35",
        },
        accent: {
          DEFAULT: "#FF6B4D",
          light: "#FF8D7A",
          dark: "#E63D1A",
        },
        // Complementary colors for variety
        teal: {
          DEFAULT: "#00D4C5",
          dark: "#00A89C",
          light: "#66E8DE",
        },
        purple: {
          DEFAULT: "#8B5CF6",
          dark: "#6D28D9",
          light: "#A78BFA",
        },
      },
      fontFamily: {
        'sans': ["DM Sans", "sans-serif"], // Default sans-serif for body text
        'serif': ["Plus Jakarta Sans", "sans-serif"], // Using Plus Jakarta Sans for headings
        'display': ["Plus Jakarta Sans", "sans-serif"], // For headlines
        'body': ["DM Sans", "sans-serif"], // For body text
      },
      zIndex: {
        400: 400,
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
