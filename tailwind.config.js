/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#050509',
          900: '#08080f',
          850: '#0b0b16',
          800: '#0f0f1c',
          750: '#131322',
          700: '#1a1a2b',
          600: '#232338',
          500: '#2f2f49',
        },
        brand: {
          DEFAULT: '#8b5cf6',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
        },
        azure: {
          DEFAULT: '#3b82f6',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 12px 40px -20px rgba(0, 0, 0, 0.75)',
        'glow-sm': '0 0 24px -6px rgba(139, 92, 246, 0.55)',
        glow: '0 0 48px -12px rgba(139, 92, 246, 0.55)',
        'glow-blue': '0 0 48px -12px rgba(59, 130, 246, 0.5)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 48%, #3b82f6 100%)',
        'brand-gradient-soft':
          'linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(59,130,246,0.12) 100%)',
        'radial-glow':
          'radial-gradient(circle at 50% -10%, rgba(139,92,246,0.18), transparent 60%)',
      },
      backgroundSize: {
        '200': '200% 200%',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.8)', opacity: '0' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
        floaty: 'floaty 5s ease-in-out infinite',
        shimmer: 'shimmer 1.8s infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
      },
    },
  },
  plugins: [],
};
