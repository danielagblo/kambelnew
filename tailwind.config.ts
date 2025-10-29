import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#33cc33',  // Main brand green
          600: '#22c55e',
          700: '#16a34a',
          800: '#15803d',
          900: '#166534',
          950: '#14532d',
        },
        secondary: {
          50: '#fffef0',
          100: '#fffacd',
          200: '#fff59d',
          300: '#fff176',
          400: '#ffed4e',
          500: '#ffff00',  // Brand yellow (star)
          600: '#fdd835',
          700: '#f9a825',
          800: '#f57f17',
          900: '#f57c00',
          950: '#e65100',
        },
        accent: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#0000cc',  // Brand blue (CONSULT)
          600: '#0000aa',
          700: '#000099',
          800: '#000077',
          900: '#000055',
          950: '#000033',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

