/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Serene, eye-safe mindfulness palette
        breathe: {
          light: {
            bg: '#F4F7F6',
            card: '#FFFFFF',
            text: '#1E293B',
            muted: '#64748B',
            primary: '#0D9488', // Teal
            secondary: '#3B82F6', // Blue
            accent: '#8B5CF6', // Purple/Violet
            tint: '#CCFBF1',
          },
          dark: {
            bg: '#0F172A', // Slate 900
            card: '#1E293B', // Slate 800
            text: '#F8FAFC', // Slate 50
            muted: '#94A3B8', // Slate 400
            primary: '#14B8A6', // Teal 500
            secondary: '#60A5FA', // Blue 400
            accent: '#A78BFA', // Violet 400
            tint: '#115E59',
          },
          inhale: {
            light: '#2DD4BF', // Expanding teal
            dark: '#0D9488',
          },
          hold: {
            light: '#FBBF24', // Amber/Yellow
            dark: '#D97706',
          },
          exhale: {
            light: '#38BDF8', // Sky Blue
            dark: '#0284C7',
          }
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-up': 'scaleUp 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
