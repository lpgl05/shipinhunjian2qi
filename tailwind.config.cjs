/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#111827',      // gray-900
        'bg-secondary': '#1F2937',    // gray-800
        'surface': '#374151',         // gray-700
        'text-primary': '#F9FAFB',    // gray-50
        'text-secondary': '#9CA3AF',  // gray-400
        'border-color': '#4B5563',    // gray-600
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'primary-accent': 'linear-gradient(to right, #3B82F6, #8B5CF6)',
      },
    },
  },
  plugins: [],
}

