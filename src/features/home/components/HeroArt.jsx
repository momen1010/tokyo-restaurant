// Original cinematic poster art (neon tubes, slashes, abstract plate). No characters, masks or third-party art.
// Replace with your own photo/artwork later by swapping this component's output for an <img>.
export default function HeroArt({ variant = 0 }) {
    return (
      <svg viewBox="0 0 600 520" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="bg" cx="55%" cy="45%" r="75%"><stop offset="0" stopColor="#7A0013" /><stop offset="1" stopColor="#000" /></radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        <rect width="600" height="520" fill="url(#bg)" />
        {/* neon tubes */}
        <g>
          <rect x="40" y="30" width="8" height="460" rx="4" fill="#E10A2B" filter="url(#glow)" opacity=".9" />
          <rect x="40" y="30" width="8" height="460" rx="4" fill="#FF4560" />
          <rect x="90" y="70" width="5" height="380" rx="3" fill="#B0001C" opacity=".8" />
        </g>
        {/* slashes */}
        <g transform="skewX(-18)" opacity=".85">
          <rect x="420" y="-20" width="70" height="580" fill="#B0001C" />
          <rect x="505" y="-20" width="8" height="580" fill="#fff" opacity=".25" />
        </g>
        {/* abstract plate: rotates a little per slide */}
        <g transform="translate(300 270)" style={{ transition: 'transform .8s ease' }}>
          <g style={{ transform: `rotate(${variant * 40}deg)`, transition: 'transform .8s ease' }}>
            <circle r="170" fill="#0b0b0b" stroke="#E10A2B" strokeWidth="3" />
            <circle r="170" fill="none" stroke="#E10A2B" strokeWidth="10" filter="url(#glow)" opacity=".6" />
            <circle r="130" fill="#161616" stroke="#343434" strokeWidth="2" />
            <circle r="90" fill="none" stroke="#B0001C" strokeWidth="2" strokeDasharray="6 10" />
            <path d="M-60 40 C-30 -50, 30 -50, 60 40 C30 70, -30 70, -60 40Z" fill="#7A0013" stroke="#E10A2B" strokeWidth="2" />
            <path d="M-20 -10 L10 -40 L25 -5Z" fill="#F5F5F5" opacity=".85" />
          </g>
        </g>
        {/* steam */}
        <g fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="3" strokeLinecap="round">
          <path d="M270 80 C255 55, 285 40, 270 15" /><path d="M310 90 C295 62, 325 48, 310 20" /><path d="M350 80 C335 55, 365 40, 350 15" />
        </g>
      </svg>
    )
  }