export default function PaintTransition() {
  return (
    <div className="home-paint-transition-layer" aria-hidden="true">
      <svg
        className="paint-transition-svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="paintCoatPrimary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="48%" stopColor="#F5D0FE" />
            <stop offset="100%" stopColor="#FBCFE8" />
          </linearGradient>

          <linearGradient id="paintCoatSecondary" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5BC0F8" />
            <stop offset="52%" stopColor="#E9D5FF" />
            <stop offset="100%" stopColor="#F9A8D4" />
          </linearGradient>

          <linearGradient id="paintCoatPearl" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="50%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#FCE7F3" />
          </linearGradient>

          <linearGradient id="protagonistHandle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#020617" />
            <stop offset="50%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="protagonistFerrule" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
        </defs>

        <path
          className="gsap-transition-band band-top"
          d="M -220 170 C 260 40, 680 310, 1140 150 C 1360 75, 1520 210, 1680 140"
          fill="none"
          stroke="url(#paintCoatPrimary)"
          strokeWidth="440"
          strokeLinecap="round"
        />

        <path
          className="gsap-transition-band band-mid"
          d="M 1680 460 C 1220 610, 760 310, 320 480 C 80 570, -100 410, -240 490"
          fill="none"
          stroke="url(#paintCoatSecondary)"
          strokeWidth="470"
          strokeLinecap="round"
        />

        <path
          className="gsap-transition-band band-bottom"
          d="M -220 760 C 310 620, 790 880, 1240 720 C 1440 650, 1580 780, 1680 710"
          fill="none"
          stroke="url(#paintCoatPearl)"
          strokeWidth="450"
          strokeLinecap="round"
        />

        <path
          className="gsap-transition-gloss-line"
          d="M -180 450 C 340 260, 880 640, 1620 420"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="16"
          strokeLinecap="round"
          opacity="0.85"
        />

        <g className="gsap-protagonist-brush" transform="translate(-260, 420) rotate(-24)">
          <path
            d="M 28 -220 L 68 -220 L 58 0 L 38 0 Z"
            fill="url(#protagonistHandle)"
            stroke="#5BC0F8"
            strokeWidth="2.5"
          />
          <rect
            x="35"
            y="0"
            width="26"
            height="36"
            rx="4"
            fill="url(#protagonistFerrule)"
          />
          <path
            d="M 33 36 L 63 36 L 74 108 C 74 126, 22 126, 22 108 Z"
            fill="#0F172A"
          />
          <path
            d="M 24 88 C 24 142, 72 142, 72 88 C 76 132, 62 168, 48 182 C 34 168, 20 132, 24 88 Z"
            fill="url(#paintCoatSecondary)"
          />
          <path
            d="M 38 98 C 36 124, 42 148, 48 164"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.9"
          />
        </g>
      </svg>
    </div>
  );
}
