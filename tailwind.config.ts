import type { Config } from "tailwindcss";
import { COLORS } from './src/lib/constants';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: COLORS,
      scale: {
        '102': '1.02',
      },
      animation: {
        'fadeIn': 'fadeIn 0.2s ease-in',
        'float': 'float 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0) rotate(0deg)',
            filter: 'brightness(1)'
          },
          '50%': { 
            transform: 'translateY(-10px) rotate(5deg)',
            filter: 'brightness(1.1)'
          }
        }
      },
    },
  },
  plugins: [],
};

export default config;