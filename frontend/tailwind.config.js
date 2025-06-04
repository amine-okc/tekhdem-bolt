
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    fontFamily: {
      // Add Quicksand as the default font
      sans: ['Ubuntu', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif', "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
    },
    extend: {
      animation: {
        'fade-in-down': 'fadeInDown 0.3s ease-out',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      colors: {
        // Previous color configuration remains the same
        primary: {
          100: '#FFF3CC',
          200: '#FFE680',
          300: '#FFA500',
          400: '#E69500',
          500: '#CC8400',
          600: '#B37300',
          700: '#994D00',
          800: '#803300',
          900: '#661A00',
        },
        secondary: {
          100: '#F9F9F9',
          200: '#F3F4F6',
          300: '#D1D5DB',
          400: '#B1B8C3',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#252F3D',
          900: '#1F2937',
        },
        background: {
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#121212',
        },
        'dark-primary': {
          100: '#FFE080',
          200: '#FFC740',
          300: '#FFA500',
          400: '#E69500',
          500: '#CC8400',
          600: '#B37300',
          700: '#994D00',
        },
        'dark-secondary': {
          100: '#2C3E50',
          200: '#34495E',
          300: '#415A6B',
          400: '#4B5563',
          500: '#6B7280',
          600: '#818C99',
          700: '#A3B1BF',
        },
        'dark-background': {
          100: '#2C3E50',
          200: '#121212',
          300: '#0D0D0D',
          400: '#0A0A0A',
          500: '#121212',
        },
      },
    },
  },
}