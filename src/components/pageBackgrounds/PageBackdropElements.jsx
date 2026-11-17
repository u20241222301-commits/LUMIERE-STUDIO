const SKY = "#5BC0F8";
const LILAC = "#C084FC";
const ROSE = "#F472B6";
const PEARL = "#E0F2FE";
const BUTTER = "#FDE68A";
const OBSIDIAN = "#0F172A";

function Bottle({ color, rot = 0 }) {
  return (
    <svg viewBox="0 0 60 104" style={{ transform: `rotate(${rot}deg)` }}>
      <ellipse cx="30" cy="100" rx="22" ry="3" fill="rgba(15,23,42,0.12)" />
      <rect x="21" y="2" width="18" height="28" rx="5" fill={OBSIDIAN} stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="1" />
      <rect x="6" y="28" width="48" height="70" rx="16" fill={color} fillOpacity="0.88" stroke="#FFFFFF" strokeWidth="2" />
      <rect x="12" y="38" width="36" height="50" rx="10" fill="#FFFFFF" fillOpacity="0.22" />
      <path d="M15 40 L15 82" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

function Brush({ color, rot = 0 }) {
  return (
    <svg viewBox="0 0 40 144" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M14 2 L26 2 L24 82 L16 82 Z" fill={OBSIDIAN} stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1" />
      <path d="M18 8 L18 74" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <rect x="14" y="82" width="12" height="20" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
      <path d="M14 102 L26 102 L29 126 C29 136 11 136 11 126 Z" fill="#1E293B" />
      <path d="M12 118 C12 138 28 138 28 118 C30 132 25 142 20 144 C15 142 10 132 12 118 Z" fill={color} />
      <circle cx="17" cy="128" r="2" fill="#FFFFFF" opacity="0.85" />
    </svg>
  );
}

function Palette({ colors }) {
  return (
    <svg viewBox="0 0 120 92">
      <ellipse cx="60" cy="86" rx="48" ry="4" fill="rgba(15,23,42,0.1)" />
      <path
        d="M14 52 C6 22 40 6 70 8 C104 10 118 36 106 62 C96 82 66 84 48 76 C34 70 38 58 28 56 Z"
        fill="#FFFFFF"
        fillOpacity="0.92"
        stroke={colors[0]}
        strokeWidth="2"
      />
      <circle cx="34" cy="64" r="7" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
      <ellipse cx="38" cy="32" rx="9" ry="7" fill={colors[0]} />
      <ellipse cx="62" cy="24" rx="9" ry="7" fill={colors[1]} />
      <ellipse cx="86" cy="32" rx="9" ry="7" fill={colors[2]} />
      <ellipse cx="94" cy="56" rx="8" ry="6" fill={colors[3]} />
      <ellipse cx="68" cy="64" rx="9" ry="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
      <circle cx="35" cy="29" r="2" fill="#FFFFFF" opacity="0.9" />
      <circle cx="59" cy="21" r="2" fill="#FFFFFF" opacity="0.9" />
      <circle cx="83" cy="29" r="2" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

function NailTip({ color, color2, rot = 0 }) {
  return (
    <svg viewBox="0 0 40 78" style={{ transform: `rotate(${rot}deg)` }}>
      <rect x="18" y="48" width="4" height="28" rx="2" fill="#CBD5E1" />
      <path
        d="M20 2 C31 2 35 22 33 40 C32 50 27 54 20 54 C13 54 8 50 7 40 C5 22 9 2 20 2 Z"
        fill={color}
        stroke="#FFFFFF"
        strokeWidth="1.6"
      />
      <path d="M9 14 C12 6 28 6 31 14 C29 20 11 20 9 14 Z" fill={color2} fillOpacity="0.55" />
      <path d="M13 18 C13 28 14 36 16 42" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

function Swatches({ colors }) {
  return (
    <svg viewBox="0 0 80 104">
      <g transform="translate(40 96)">
        {colors.map((c, i) => (
          <g key={c} transform={`rotate(${-24 + i * 16})`}>
            <rect x="-10" y="-84" width="20" height="84" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <rect x="-8" y="-82" width="16" height="56" rx="3" fill={c} />
            <rect x="-6" y="-78" width="3" height="40" rx="1.5" fill="#FFFFFF" opacity="0.55" />
          </g>
        ))}
        <circle cx="0" cy="0" r="4" fill="#94A3B8" />
      </g>
    </svg>
  );
}

function Agenda({ color }) {
  return (
    <svg viewBox="0 0 84 96">
      <ellipse cx="42" cy="92" rx="30" ry="3" fill="rgba(15,23,42,0.1)" />
      <rect x="6" y="8" width="72" height="80" rx="12" fill="#FFFFFF" fillOpacity="0.92" stroke={color} strokeWidth="2" />
      <path d="M6 30 L6 20 C6 13 11 8 18 8 L66 8 C73 8 78 13 78 20 L78 30 Z" fill={color} fillOpacity="0.85" />
      <circle cx="24" cy="8" r="3.5" fill={OBSIDIAN} />
      <circle cx="60" cy="8" r="3.5" fill={OBSIDIAN} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <circle key={`${r}-${c}`} cx={24 + c * 18} cy={44 + r * 14} r="3" fill="#CBD5E1" />
        ))
      )}
      <circle cx="42" cy="58" r="8" fill={color} />
      <path d="M38 58 L41 61 L47 55" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function Drop({ color }) {
  return (
    <svg viewBox="0 0 30 40">
      <path d="M15 2 C24 14 27 22 27 27 C27 34 21 38 15 38 C9 38 3 34 3 27 C3 22 6 14 15 2 Z" fill={color} fillOpacity="0.88" stroke="#FFFFFF" strokeWidth="1.4" />
      <circle cx="10" cy="25" r="3" fill="#FFFFFF" opacity="0.85" />
    </svg>
  );
}

function renderIcono(it) {
  switch (it.kind) {
    case "bottle":
      return <Bottle color={it.color} rot={it.rot} />;
    case "brush":
      return <Brush color={it.color} rot={it.rot} />;
    case "palette":
      return <Palette colors={it.colors} />;
    case "tip":
      return <NailTip color={it.color} color2={it.color2} rot={it.rot} />;
    case "swatches":
      return <Swatches colors={it.colors} />;
    case "agenda":
      return <Agenda color={it.color} />;
    case "drop":
      return <Drop color={it.color} />;
    default:
      return null;
  }
}

export function ItemDecorativo({ it }) {
  const estilo = {
    ...it.pos,
    width: `clamp(${Math.round(it.w * 0.6)}px, ${(it.w / 14.4).toFixed(2)}vw, ${it.w}px)`,
  };
  return (
    <div
      className={`pbg-item ${it.mobile ? "" : "pbg-desktop-only"}`}
      style={estilo}
      data-op={it.op}
      data-amp={it.amp}
      data-dur={it.dur}
      data-wob={it.wob ?? 2}
    >
      <div className="pbg-float">{renderIcono(it)}</div>
    </div>
  );
}

export function Destello({ pos, color, mobile = false }) {
  return (
    <span
      className={`pbg-glint ${mobile ? "" : "pbg-desktop-only"}`}
      style={{ ...pos, color }}
    >
      ✦
    </span>
  );
}

export const ESCENAS = {
  reservas: {
    items: [
      { id: "r1", kind: "bottle", color: SKY, rot: -6, pos: { top: "24%", left: "1.2%" }, w: 74, amp: 8, dur: 9, op: 0.6, mobile: true },
      { id: "r2", kind: "brush", color: ROSE, rot: 38, pos: { bottom: "10%", left: "3%" }, w: 34, amp: 6, dur: 11, op: 0.55 },
      { id: "r3", kind: "swatches", colors: [SKY, LILAC, ROSE, PEARL], pos: { top: "20%", right: "1.5%" }, w: 66, amp: 7, dur: 10, op: 0.6, mobile: true },
      { id: "r4", kind: "bottle", color: LILAC, rot: 7, pos: { bottom: "12%", right: "2.5%" }, w: 58, amp: 7, dur: 12, op: 0.55 },
      { id: "r5", kind: "drop", color: SKY, pos: { top: "52%", left: "8%" }, w: 18, amp: 10, dur: 7, op: 0.65 },
      { id: "r6", kind: "drop", color: ROSE, pos: { top: "50%", right: "7.5%" }, w: 20, amp: 10, dur: 8, op: 0.65 },
    ],
    destellos: [
      { pos: { top: "18%", left: "7%" }, color: SKY, mobile: true },
      { pos: { top: "40%", right: "5%" }, color: ROSE },
      { pos: { bottom: "22%", left: "9%" }, color: LILAC },
    ],
  },
  "consultar-cita": {
    items: [
      { id: "c1", kind: "agenda", color: SKY, pos: { top: "22%", right: "1.8%" }, w: 78, amp: 7, dur: 10, op: 0.62, mobile: true },
      { id: "c2", kind: "bottle", color: LILAC, rot: -5, pos: { top: "20%", left: "1.5%" }, w: 62, amp: 8, dur: 11, op: 0.58, mobile: true },
      { id: "c3", kind: "swatches", colors: [ROSE, SKY, LILAC, PEARL], pos: { bottom: "14%", left: "2.5%" }, w: 60, amp: 6, dur: 13, op: 0.55 },
      { id: "c4", kind: "brush", color: SKY, rot: -36, pos: { bottom: "8%", right: "3.5%" }, w: 32, amp: 6, dur: 12, op: 0.55 },
      { id: "c5", kind: "tip", color: ROSE, color2: PEARL, rot: 10, pos: { top: "58%", right: "8%" }, w: 28, amp: 8, dur: 9, op: 0.55 },
      { id: "c6", kind: "drop", color: LILAC, pos: { top: "48%", left: "8%" }, w: 18, amp: 10, dur: 8, op: 0.62 },
    ],
    destellos: [
      { pos: { top: "16%", right: "8%" }, color: SKY, mobile: true },
      { pos: { top: "44%", left: "6%" }, color: LILAC },
      { pos: { bottom: "18%", right: "10%" }, color: ROSE },
    ],
  },
  servicios: {
    items: [
      { id: "s1", kind: "tip", color: SKY, color2: "#FFFFFF", rot: -14, pos: { top: "16%", left: "1.5%" }, w: 34, amp: 8, dur: 9, op: 0.62, mobile: true },
      { id: "s2", kind: "tip", color: ROSE, color2: PEARL, rot: 8, pos: { top: "29%", left: "5%" }, w: 32, amp: 7, dur: 11, op: 0.6 },
      { id: "s3", kind: "tip", color: LILAC, color2: PEARL, rot: -6, pos: { top: "44%", left: "2%" }, w: 36, amp: 8, dur: 12, op: 0.6 },
      { id: "s4", kind: "palette", colors: [SKY, LILAC, ROSE, BUTTER], pos: { top: "15%", right: "1.5%" }, w: 112, amp: 7, dur: 13, op: 0.6, mobile: true },
      { id: "s5", kind: "bottle", color: ROSE, rot: 6, pos: { top: "42%", right: "2.5%" }, w: 62, amp: 8, dur: 10, op: 0.6, mobile: true },
      { id: "s6", kind: "bottle", color: SKY, rot: -8, pos: { bottom: "10%", left: "2.5%" }, w: 58, amp: 7, dur: 12, op: 0.58 },
      { id: "s7", kind: "brush", color: LILAC, rot: 34, pos: { bottom: "7%", right: "4%" }, w: 34, amp: 6, dur: 14, op: 0.55 },
      { id: "s8", kind: "tip", color: BUTTER, color2: ROSE, rot: 12, pos: { top: "64%", right: "9%" }, w: 28, amp: 8, dur: 10, op: 0.55 },
      { id: "s9", kind: "drop", color: SKY, pos: { top: "60%", left: "7.5%" }, w: 18, amp: 10, dur: 8, op: 0.62 },
    ],
    destellos: [
      { pos: { top: "12%", left: "8%" }, color: SKY, mobile: true },
      { pos: { top: "36%", right: "6%" }, color: ROSE },
      { pos: { bottom: "24%", left: "10%" }, color: LILAC },
      { pos: { bottom: "16%", right: "11%" }, color: SKY },
    ],
  },
  "sobre-nosotros": {
    items: [
      { id: "n1", kind: "bottle", color: BUTTER, rot: -6, pos: { top: "20%", left: "1.5%" }, w: 66, amp: 8, dur: 10, op: 0.62, mobile: true },
      { id: "n2", kind: "palette", colors: [ROSE, BUTTER, LILAC, SKY], pos: { top: "16%", right: "1.5%" }, w: 106, amp: 7, dur: 13, op: 0.6, mobile: true },
      { id: "n3", kind: "brush", color: ROSE, rot: 30, pos: { bottom: "9%", left: "3%" }, w: 32, amp: 5, dur: 12, op: 0.55 },
      { id: "n4", kind: "brush", color: LILAC, rot: 52, pos: { bottom: "9%", left: "6.5%" }, w: 30, amp: 5, dur: 14, op: 0.5 },
      { id: "n5", kind: "swatches", colors: [ROSE, BUTTER, LILAC, PEARL], pos: { bottom: "12%", right: "2.5%" }, w: 62, amp: 6, dur: 11, op: 0.55 },
      { id: "n6", kind: "tip", color: ROSE, color2: BUTTER, rot: -8, pos: { top: "52%", left: "3.5%" }, w: 30, amp: 8, dur: 9, op: 0.55 },
      { id: "n7", kind: "bottle", color: ROSE, rot: 8, pos: { top: "46%", right: "3%" }, w: 56, amp: 7, dur: 12, op: 0.56 },
      { id: "n8", kind: "drop", color: BUTTER, pos: { top: "38%", left: "7%" }, w: 18, amp: 10, dur: 8, op: 0.65 },
    ],
    destellos: [
      { pos: { top: "14%", left: "9%" }, color: ROSE, mobile: true },
      { pos: { top: "40%", right: "7%" }, color: BUTTER },
      { pos: { bottom: "20%", left: "11%" }, color: LILAC },
    ],
  },
};
