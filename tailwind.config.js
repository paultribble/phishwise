/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'phish-navy': '#0a1628',
        'phish-blue': '#1e3a5f',
        'phish-accent': '#4a90e2',
      },
    },
  },
  plugins: [],
}