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
        // Pixxel8 Brand Colors
        pixxel: {
          orange: '#FF8C1A',
          'orange-light': '#FFB366',
          'orange-dark': '#E67A00',
          'orange-glow': 'rgba(255, 140, 26, 0.6)',
          black: '#0B0E14',
          charcoal: '#121826',
          surface: '#1A2032',
          'surface-light': '#242B3D',
          amber: '#FFB84D',
        },
        // Keep for backward compatibility, but map to Pixxel8 colors
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#FF8C1A', // Pixxel8 Orange
          600: '#E67A00',
          700: '#C66900',
          800: '#9A5200',
          900: '#7C4200',
          950: '#4A2700',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#FFB366',
          500: '#FF8C1A', // Pixxel8 Orange
          600: '#E67A00',
          700: '#C66900',
          800: '#9A5200',
          900: '#7C4200',
          950: '#4A2700',
        },
        success: '#10b981',
        warning: '#FF8C1A',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-out infinite',
        'orange-ripple': 'orangeRipple 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 140, 26, 0.4), 0 0 40px rgba(255, 140, 26, 0.2)',
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(255, 140, 26, 0.6), 0 0 60px rgba(255, 140, 26, 0.3)',
          },
        },
        orangeRipple: {
          '0%': { 
            transform: 'scale(0)',
            opacity: '0.6',
          },
          '100%': { 
            transform: 'scale(2)',
            opacity: '0',
          },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 140, 26, 0.5)',
        'glow-lg': '0 0 40px rgba(255, 140, 26, 0.6)',
        'glow-xl': '0 0 60px rgba(255, 140, 26, 0.7)',
        'inner-glow': 'inset 0 0 20px rgba(255, 140, 26, 0.3)',
        'orange-soft': '0 0 30px rgba(255, 140, 26, 0.4)',
        'orange-medium': '0 0 40px rgba(255, 140, 26, 0.5), 0 0 80px rgba(255, 140, 26, 0.3)',
        'orange-strong': '0 0 50px rgba(255, 140, 26, 0.7), 0 0 100px rgba(255, 140, 26, 0.4)',
      },
      borderRadius: {
        'pixel': '2px',
        'pixel-lg': '4px',
      },
    },
  },
  plugins: [],
}
