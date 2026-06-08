import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          50: '#fdf6eb',
          100: '#f8ebd5',
          200: '#efd0a9',
          300: '#e4b573',
          400: '#d99b46',
          500: '#d4af37',
          600: '#b88f2c',
          700: '#8d7024',
          800: '#6d5620',
          900: '#4f3f17'
        },
        midnight: '#0f172a',
        cream: '#fef3c7',
        ink: {
          DEFAULT: '#12100c',
          800: '#1c1813',
          700: '#26201a'
        }
      },
      boxShadow: {
        soft: '0 20px 50px rgba(15, 23, 42, 0.12)',
        gold: '0 18px 40px rgba(212, 175, 55, 0.25)'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Playfair Display', 'ui-serif', 'Georgia', 'serif']
      }
    }
  },
  plugins: []
};

export default config;
