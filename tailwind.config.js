/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'accent-blue': 'var(--color-accent-blue)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
      },
      boxShadow: {
        'glow': '0 0 20px var(--color-blue-glow)',
        'glow-lg': '0 0 30px var(--color-blue-glow)',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'code-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.95' }
        },
        'dash': {
          '0%, 100%': { opacity: '0.3', transform: 'translateY(0px)' },
          '50%': { opacity: '0.8', transform: 'translateY(-2px)' }
        },
        'matrix-rain': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' }
        },
        'code-shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' }
        },
        'scan-line': {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' }
        },
        'terminal-boot': {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.95)',
            filter: 'brightness(0.5)'
          },
          '50%': { 
            opacity: '0.8', 
            transform: 'scale(1.02)',
            filter: 'brightness(1.2)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1)',
            filter: 'brightness(1)'
          }
        },
        'glitch': {
          '0%, 100%': { 
            transform: 'translate(0)',
            filter: 'hue-rotate(0deg)'
          },
          '10%': { 
            transform: 'translate(-2px, 2px)',
            filter: 'hue-rotate(90deg)'
          },
          '20%': { 
            transform: 'translate(-2px, -2px)',
            filter: 'hue-rotate(180deg)'
          },
          '30%': { 
            transform: 'translate(2px, 2px)',
            filter: 'hue-rotate(270deg)'
          },
          '40%': { 
            transform: 'translate(2px, -2px)',
            filter: 'hue-rotate(360deg)'
          }
        },
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        'code-pulse': 'code-pulse 1.5s ease-in-out infinite',
        'dash': 'dash 2s ease-in-out infinite',
        'matrix-rain': 'matrix-rain 3s linear infinite',
        'code-shimmer': 'code-shimmer 2s ease-in-out infinite',
        'scan-line': 'scan-line 0.8s ease-in-out',
        'terminal-boot': 'terminal-boot 0.8s ease-out forwards',
        'glitch': 'glitch 0.3s ease-in-out',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'slide-down': 'slide-down 0.5s ease-out forwards'
      }
    },
  },
  plugins: [],
}
