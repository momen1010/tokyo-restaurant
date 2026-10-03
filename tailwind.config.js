/** TOKYO design tokens. Logical utilities (ms-*, ps-*, text-start, border-s) keep RTL correct. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        black: '#0A0A0A',
        paper: '#F5F5F5',
        blood: {
          DEFAULT: '#E11D2E',
          deep: '#8B0F1F',
          bright: '#FF2D4A',
        },
        coal: {
          DEFAULT: '#141414',
          soft: '#1F1F1F',
          line: '#2E2E2E',
        },
      },
      fontFamily: {
        display: ['"Reem Kufi"', 'Tajawal', 'sans-serif'],
        body: ['"IBM Plex Sans Arabic"', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
      },
      boxShadow: {
        glow: '0 0 0 1px #E11D2E, 0 14px 40px -14px rgba(225,29,46,.6)',
        'red-glow': '0 0 30px rgba(225,29,46,.35)',
      },
      keyframes: {
        rise: {
          from: { opacity: 0, transform: 'translateY(18px)' },
          to: { opacity: 1, transform: 'none' },
        },
        fade: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        pop: {
          from: { opacity: 0, transform: 'scale(.96) translateY(8px)' },
          to: { opacity: 1, transform: 'none' },
        },
        slash: {
          from: { transform: 'scaleY(0)' },
          to: { transform: 'scaleY(1)' },
        },
        pulseRed: {
          '0%,100%': { boxShadow: '0 0 20px rgba(225,29,46,.2)' },
          '50%': { boxShadow: '0 0 40px rgba(225,29,46,.55)' },
        },
      },
      animation: {
        rise: 'rise .6s cubic-bezier(.2,.7,.2,1) both',
        fade: 'fade .4s ease both',
        pop: 'pop .22s ease-out both',
        slash: 'slash .7s cubic-bezier(.7,0,.2,1) both',
        'pulse-red': 'pulseRed 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}