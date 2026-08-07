"use client";

import { SCENE_VIEWBOX } from "@/lib/constants";

const { width: W, height: H } = SCENE_VIEWBOX;
const FLOOR_Y = 700;

const WINDOWS = [120, 340, 560, 780, 1000, 1220, 1440];
const RIBS = Array.from({ length: 15 }, (_, i) => 60 + i * 108);
const RACK_UPRIGHTS = [980, 1230, 1480];
const RACK_BEAMS = [560, 424, 288];

/** Pallets resting on the racking, indexed so the timeline can stagger them. */
const RACK_PALLETS = [
  { x: 1000, y: 560, w: 190, tone: "#8c6d2a" },
  { x: 1250, y: 560, w: 190, tone: "#6d5a33" },
  { x: 1000, y: 424, w: 190, tone: "#6d5a33" },
  { x: 1250, y: 424, w: 190, tone: "#8c6d2a" },
  { x: 1250, y: 288, w: 190, tone: "#4d4535" },
];

/**
 * Warehouse interior, drawn as flat vector layers at different depths.
 *
 * Every element the timeline touches carries a `data-*` hook rather than a
 * class chain, so the illustration can be re-drawn or replaced with real
 * artwork without editing a line of animation code.
 */
export function WarehouseScene() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="size-full"
      role="img"
      aria-label="مستودع تُنقل فيه الحمولات بواسطة رافعة شوكية"
    >
      <defs>
        <linearGradient id="wh-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#161922" />
          <stop offset="100%" stopColor="#0b0c10" />
        </linearGradient>
        <linearGradient id="wh-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14161c" />
          <stop offset="100%" stopColor="#08090c" />
        </linearGradient>
        <linearGradient id="wh-shaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8ce85" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#e8ce85" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="wh-crate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d8b75c" />
          <stop offset="100%" stopColor="#95772f" />
        </linearGradient>
        <linearGradient id="wh-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3f49" />
          <stop offset="100%" stopColor="#22262e" />
        </linearGradient>
        <radialGradient id="wh-lamp" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="#f5e6c0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f5e6c0" stopOpacity="0" />
        </radialGradient>
        <filter id="wh-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* ------------------------------------------------------- far layer */}
      <g data-layer="far">
        <rect x="0" y="0" width={W} height={FLOOR_Y} fill="url(#wh-wall)" />

        {RIBS.map((x) => (
          <rect
            key={x}
            x={x}
            y={90}
            width="6"
            height={FLOOR_Y - 90}
            fill="#1e222b"
            opacity="0.75"
          />
        ))}

        {/* Clerestory windows */}
        {WINDOWS.map((x) => (
          <g key={x}>
            <rect x={x} y={132} width="118" height="84" rx="4" fill="#20293a" />
            <rect
              x={x}
              y={132}
              width="118"
              height="84"
              rx="4"
              fill="#9fd0ef"
              opacity="0.16"
              data-window
            />
          </g>
        ))}

        {/* Roof trusses */}
        <g stroke="#242832" strokeWidth="5" fill="none">
          <path d={`M 0 96 L ${W} 96`} />
          <path d={`M 0 60 L ${W} 60`} opacity="0.6" />
          {Array.from({ length: 16 }, (_, i) => i * 100).map((x) => (
            <path key={x} d={`M ${x} 96 L ${x + 50} 60 L ${x + 100} 96`} opacity="0.5" />
          ))}
        </g>
      </g>

      {/* --------------------------------------------------- light shafts */}
      <g data-layer="shafts">
        {WINDOWS.map((x, i) => (
          <polygon
            key={x}
            data-shaft
            data-index={i}
            points={`${x} 216 ${x + 118} 216 ${x + 250} ${FLOOR_Y} ${x - 40} ${FLOOR_Y}`}
            fill="url(#wh-shaft)"
            opacity="0"
          />
        ))}
      </g>

      {/* ---------------------------------------------------- pendant lamps */}
      <g data-layer="lamps">
        {[300, 700, 1100, 1500].map((x) => (
          <g key={x} data-lamp>
            <rect x={x - 2} y={96} width="4" height="70" fill="#2a2f38" />
            <ellipse cx={x} cy={176} rx="42" ry="14" fill="#2f3540" />
            <ellipse cx={x} cy={182} rx="30" ry="9" fill="#f5e6c0" opacity="0.55" />
            <ellipse cx={x} cy={250} rx="120" ry="110" fill="url(#wh-lamp)" opacity="0.5" />
          </g>
        ))}
      </g>

      {/* ---------------------------------------------------- overhead rail */}
      <g data-layer="crane">
        <rect x="0" y={104} width={W} height="16" rx="4" fill="#2b303a" />
        <g data-trolley>
          <rect x="-46" y={112} width="92" height="34" rx="6" fill="url(#wh-metal)" />
          <rect x="-4" y={146} width="8" height="120" fill="#3a3f49" />
          <rect x="-30" y={266} width="60" height="26" rx="4" fill="#4a5059" />
          <rect x="-22" y={292} width="44" height="10" rx="2" fill="#2b303a" />
        </g>
      </g>

      {/* --------------------------------------------------------- racking */}
      <g data-layer="rack">
        {RACK_UPRIGHTS.map((x) => (
          <g key={x}>
            <rect x={x} y={210} width="16" height={FLOOR_Y - 210} fill="url(#wh-metal)" />
            <rect x={x} y={210} width="16" height={FLOOR_Y - 210} fill="#c9a84c" opacity="0.16" />
          </g>
        ))}
        {RACK_BEAMS.map((y) => (
          <rect key={y} x={974} y={y} width={522} height="14" rx="3" fill="#4a515d" />
        ))}
        {RACK_PALLETS.map((pallet, i) => (
          <g key={`${pallet.x}-${pallet.y}`} data-rack-pallet data-index={i}>
            <rect
              x={pallet.x}
              y={pallet.y - 74}
              width={pallet.w}
              height="62"
              rx="3"
              fill={pallet.tone}
            />
            <rect
              x={pallet.x}
              y={pallet.y - 74}
              width={pallet.w}
              height="62"
              fill="#050506"
              opacity="0.12"
            />
            <rect
              x={pallet.x + pallet.w * 0.45}
              y={pallet.y - 74}
              width="10"
              height="62"
              fill="#c9a84c"
              opacity="0.4"
            />
            <rect x={pallet.x - 6} y={pallet.y - 12} width={pallet.w + 12} height="12" rx="2" fill="#4a4130" />
          </g>
        ))}
      </g>

      {/* ----------------------------------------------------------- floor */}
      <g data-layer="floor">
        <rect x="0" y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill="url(#wh-floor)" />
        <rect x="0" y={FLOOR_Y} width={W} height="3" fill="#c9a84c" opacity="0.22" />
        {/* Safety lane markings, receding toward the viewer */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            data-floor-line
            data-index={i}
            x={-200 + i * 420}
            y={FLOOR_Y + 30 + i * 26}
            width="260"
            height="5"
            rx="2"
            fill="#c9a84c"
            opacity={0.18 - i * 0.02}
          />
        ))}
      </g>

      {/* ------------------------------------------------------ dust motes */}
      <g data-layer="motes">
        {Array.from({ length: 26 }, (_, i) => {
          const x = ((i * 137) % 1560) + 20;
          const y = 200 + ((i * 83) % 460);
          const r = 1.5 + ((i * 7) % 5) * 0.6;
          return (
            <circle
              key={i}
              data-mote
              data-index={i}
              cx={x}
              cy={y}
              r={r}
              fill="#f5e6c0"
              opacity="0.3"
            />
          );
        })}
      </g>

      {/* --------------------------------------------------- cargo pallet */}
      <g data-cargo transform={`translate(300 ${FLOOR_Y})`}>
        <ellipse data-cargo-shadow cx="76" cy="6" rx="96" ry="12" fill="#050506" opacity="0.55" />
        {/* Crate stack */}
        <rect x="8" y="-116" width="140" height="92" rx="4" fill="url(#wh-crate)" />
        <rect x="8" y="-116" width="140" height="92" rx="4" fill="#050506" opacity="0.12" />
        <rect x="8" y="-78" width="140" height="8" fill="#5c4a1e" opacity="0.6" />
        <rect x="66" y="-116" width="10" height="92" fill="#5c4a1e" opacity="0.5" />
        <rect x="24" y="-180" width="108" height="64" rx="4" fill="#b9973f" />
        <rect x="24" y="-180" width="108" height="64" rx="4" fill="#050506" opacity="0.18" />
        <rect x="24" y="-152" width="108" height="6" fill="#5c4a1e" opacity="0.5" />
        {/* Pallet deck */}
        <rect x="0" y="-24" width="156" height="12" rx="2" fill="#6b5a3a" />
        <rect x="4" y="-12" width="20" height="12" fill="#544730" />
        <rect x="68" y="-12" width="20" height="12" fill="#544730" />
        <rect x="132" y="-12" width="20" height="12" fill="#544730" />
      </g>

      {/* -------------------------------------------------------- forklift */}
      <g data-forklift transform={`translate(1900 ${FLOOR_Y})`}>
        <ellipse data-forklift-shadow cx="40" cy="6" rx="150" ry="14" fill="#050506" opacity="0.6" />

        {/* Mast */}
        <rect x="-86" y="-286" width="16" height="252" rx="3" fill="url(#wh-metal)" />
        <rect x="-64" y="-286" width="12" height="252" rx="3" fill="#2b303a" />
        <rect x="-90" y="-296" width="44" height="14" rx="3" fill="#39404b" />

        {/* Chassis */}
        <path
          d="M -72 -118 L 96 -118 C 120 -118 138 -104 142 -84 L 150 -46 C 152 -36 144 -28 134 -28 L -60 -28 C -68 -28 -74 -34 -74 -42 Z"
          fill="#c9a84c"
        />
        <path
          d="M -72 -118 L 96 -118 C 120 -118 138 -104 142 -84 L 150 -46 C 152 -36 144 -28 134 -28 L -60 -28 C -68 -28 -74 -34 -74 -42 Z"
          fill="#050506"
          opacity="0.1"
        />
        <rect x="118" y="-104" width="40" height="66" rx="6" fill="#8c6d2a" />

        {/* Operator cage */}
        <rect x="-14" y="-260" width="10" height="146" rx="3" fill="#39404b" />
        <rect x="92" y="-260" width="10" height="146" rx="3" fill="#39404b" />
        <rect x="-22" y="-272" width="132" height="14" rx="4" fill="#39404b" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={-10 + i * 40} y="-268" width="30" height="5" rx="2" fill="#2b303a" />
        ))}

        {/* Seat + operator silhouette */}
        <rect x="46" y="-188" width="16" height="72" rx="4" fill="#2b303a" />
        <rect x="10" y="-128" width="56" height="12" rx="3" fill="#2b303a" />
        <g data-operator fill="#14161a">
          <circle cx="30" cy="-206" r="17" />
          <path d="M 12 -186 C 12 -196 48 -196 48 -186 L 50 -130 L 10 -130 Z" />
          <path d="M 12 -178 L -18 -156 L -12 -146 L 20 -164 Z" />
        </g>

        {/* Wheels — rotation is derived from travel distance in the timeline */}
        <g data-wheel data-wheel-front>
          <circle cx="-36" cy="-40" r="40" fill="#14161a" />
          <circle cx="-36" cy="-40" r="40" fill="none" stroke="#2b303a" strokeWidth="4" />
          <circle cx="-36" cy="-40" r="17" fill="#3a3f49" />
          {[0, 45, 90, 135].map((angle) => (
            <rect
              key={angle}
              x="-38"
              y="-72"
              width="4"
              height="64"
              fill="#2b303a"
              transform={`rotate(${angle} -36 -40)`}
            />
          ))}
        </g>
        <g data-wheel data-wheel-rear>
          <circle cx="112" cy="-32" r="32" fill="#14161a" />
          <circle cx="112" cy="-32" r="32" fill="none" stroke="#2b303a" strokeWidth="4" />
          <circle cx="112" cy="-32" r="13" fill="#3a3f49" />
          {[0, 60, 120].map((angle) => (
            <rect
              key={angle}
              x="110"
              y="-58"
              width="4"
              height="52"
              fill="#2b303a"
              transform={`rotate(${angle} 112 -32)`}
            />
          ))}
        </g>

        {/* Carriage + forks (translated vertically by the timeline) */}
        <g data-carriage>
          <rect x="-102" y="-116" width="22" height="110" rx="3" fill="#4a5059" />
          <rect x="-108" y="-110" width="32" height="11" rx="2" fill="#5a616c" />
          <rect x="-108" y="-36" width="32" height="11" rx="2" fill="#5a616c" />
          {/* Fork heel + blade */}
          <path d="M -100 -60 L -78 -60 L -78 -4 L -100 -4 Z" fill="#dcdfe4" />
          <path d="M -100 -22 L -78 -22 L -78 -4 L -252 -4 L -256 -14 L -100 -14 Z" fill="#dcdfe4" />
          <path d="M -100 -22 L -78 -22 L -78 -4 L -252 -4 L -256 -14 L -100 -14 Z" fill="#050506" opacity="0.18" />
        </g>

        {/* Warning beacon */}
        <circle data-beacon cx="44" cy="-282" r="9" fill="#f0a868" opacity="0.9" />
        <circle data-beacon-glow cx="44" cy="-282" r="26" fill="#f0a868" opacity="0.2" filter="url(#wh-soft)" />
      </g>

      {/* -------------------------------------------------- near foreground */}
      <g data-layer="near">
        <rect x="-40" y="120" width="70" height={FLOOR_Y - 60} fill="#0a0b0f" />
        <rect x={W - 30} y="120" width="80" height={FLOOR_Y - 60} fill="#0a0b0f" />
      </g>
    </svg>
  );
}
