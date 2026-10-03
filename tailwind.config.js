/** TOKYO design tokens. Logical utilities (ms-*, ps-*, text-start, border-s) keep RTL correct. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        blood: { DEFAULT: '#B0001C', deep: '#7A0013', bright: '#E10A2B' },
        coal: { DEFAULT: '#161616', soft: '#232323', line: '#343434' },
        paper: '#F5F5F5',
      },
      fontFamily: {
        display: ['"Reem Kufi"', 'Tajawal', 'sans-serif'],
        body: ['"IBM Plex Sans Arabic"', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      boxShadow: { glow: '0 0 0 1px #B0001C, 0 14px 40px -14px rgba(225,10,43,.6)' },
      keyframes: {
        rise: { from: { opacity: 0, transform: 'translateY(18px)' }, to: { opacity: 1, transform: 'none' } },
        fade: { from: { opacity: 0 }, to: { opacity: 1 } },
        pop: { from: { opacity: 0, transform: 'scale(.96) translateY(8px)' }, to: { opacity: 1, transform: 'none' } },
        slash: { from: { transform: 'scaleY(0)' }, to: { transform: 'scaleY(1)' } },
      },
      animation: {
        rise: 'rise .6s cubic-bezier(.2,.7,.2,1) both',
        fade: 'fade .4s ease both',
        pop: 'pop .22s ease-out both',
        slash: 'slash .7s cubic-bezier(.7,0,.2,1) both',
      },
    },
  },
  plugins: [],
}
