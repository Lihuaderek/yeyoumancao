/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vermilion: {
          DEFAULT: '#B22222',
          light: '#C83838',
          dark: '#8B1818',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          light: '#2D2D2D',
          muted: '#5A5A5A',
        },
        rice: {
          DEFAULT: '#F5F0E6',
          light: '#FAF7F0',
          dark: '#EAE1D2',
        },
        gold: {
          DEFAULT: '#C9A96E',
          light: '#DCC393',
          dark: '#A88647',
        }
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Songti SC"', 'SimSun', 'STSong', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
