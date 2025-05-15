/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#16a34a",
          light: "#86efac",
          dark: "#166534",
        },
        secondary: "#2563eb",
        danger: "#dc2626",
        gray: {
          light: "#f9fafb",
          DEFAULT: "#d1d5db",
          dark: "#4b5563",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        serif: ["'Playfair Display'", "serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
