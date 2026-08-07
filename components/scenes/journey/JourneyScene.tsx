"use client";

import { SCENE_VIEWBOX } from "@/lib/constants";
import { MORPH_PARTS, TRUCK } from "@/lib/shapes";

const { width: W, height: H } = SCENE_VIEWBOX;
const HORIZON = 620;
const ROAD_Y = TRUCK.groundY;
/** Fits the 1600-unit-wide artwork comfortably inside the frame. */
const VEHICLE_SCALE = 0.6;

/** Soft cumulus built from overlapping ellipses — cheap and scales cleanly. */
function Cloud({ id, puffs }: { id: string; puffs: Array<[number, number, number]> }) {
  return (
    <g data-cloud data-cloud-id={id}>
      {puffs.map(([cx, cy, r], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.62} />
      ))}
    </g>
  );
}

const CLOUD_SHAPES: Record<string, Array<[number, number, number]>> = {
  a: [
    [0, 0, 92],
    [92, 16, 68],
    [-88, 20, 60],
    [34, -42, 62],
    [-34, -30, 50],
  ],
  b: [
    [0, 0, 66],
    [70, 12, 48],
    [-66, 14, 44],
    [24, -32, 44],
  ],
  c: [
    [0, 0, 120],
    [124, 22, 84],
    [-118, 26, 76],
    [44, -56, 80],
    [-46, -44, 62],
  ],
};

/** Cloud instances: id, x, y, scale, depth (0 = far, 1 = near). */
const CLOUDS: Array<{
  key: string;
  shape: keyof typeof CLOUD_SHAPES;
  x: number;
  y: number;
  scale: number;
  depth: number;
}> = [
  { key: "c1", shape: "b", x: 180, y: 130, scale: 0.42, depth: 0.1 },
  { key: "c2", shape: "a", x: 720, y: 96, scale: 0.36, depth: 0.14 },
  { key: "c3", shape: "b", x: 1240, y: 160, scale: 0.4, depth: 0.18 },
  { key: "c4", shape: "c", x: 1560, y: 110, scale: 0.34, depth: 0.12 },
  { key: "c5", shape: "a", x: 380, y: 268, scale: 0.62, depth: 0.3 },
  { key: "c6", shape: "b", x: 1020, y: 300, scale: 0.55, depth: 0.34 },
  { key: "c7", shape: "c", x: 1480, y: 360, scale: 0.6, depth: 0.4 },
  { key: "c8", shape: "a", x: 120, y: 420, scale: 0.78, depth: 0.55 },
  { key: "c9", shape: "b", x: 860, y: 520, scale: 0.85, depth: 0.62 },
  { key: "c10", shape: "c", x: 1620, y: 560, scale: 0.9, depth: 0.7 },
  { key: "c11", shape: "a", x: 420, y: 680, scale: 1.15, depth: 0.86 },
  { key: "c12", shape: "c", x: 1240, y: 780, scale: 1.35, depth: 0.96 },
  { key: "c13", shape: "b", x: -60, y: 830, scale: 1.4, depth: 1 },
];

/**
 * The journey stage.
 *
 * One SVG carries the truck, the abstract ribbons and the aircraft, because
 * they are literally the same six paths at three points in a single tween.
 * Everything else — sky, dunes, road, clouds — is a backdrop layer that is
 * cross-faded around them, which is what removes the cut from the transition.
 */
export function JourneyScene() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="size-full"
      role="img"
      aria-label="شاحنة نقل تتحول إلى خطوط ملوّنة ثم إلى طائرة تحلّق بين السحب"
    >
      <defs>
        <linearGradient id="jr-sky-desert" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1018" />
          <stop offset="46%" stopColor="#2a2233" />
          <stop offset="78%" stopColor="#7c4a3a" />
          <stop offset="100%" stopColor="#c98b4b" />
        </linearGradient>

        <linearGradient id="jr-sky-abstract" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#120b1f" />
          <stop offset="50%" stopColor="#241640" />
          <stop offset="100%" stopColor="#0b1524" />
        </linearGradient>

        {/* The sky whose stops are tweened directly during the flight. */}
        <linearGradient id="jr-sky-air" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f2140" data-sky-stop="0" />
          <stop offset="55%" stopColor="#2f6ea8" data-sky-stop="1" />
          <stop offset="100%" stopColor="#8fc4e8" data-sky-stop="2" />
        </linearGradient>

        <radialGradient id="jr-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#e8a05a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#e8a05a" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="jr-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#25252b" />
          <stop offset="100%" stopColor="#101014" />
        </linearGradient>

        <linearGradient id="jr-dune-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b4a35" />
          <stop offset="100%" stopColor="#3a2a22" />
        </linearGradient>

        <linearGradient id="jr-dune-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d2c22" />
          <stop offset="100%" stopColor="#1b1512" />
        </linearGradient>

        <filter id="jr-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id="jr-soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* ============================================================= skies */}
      <rect data-sky="desert" x="0" y="0" width={W} height={H} fill="url(#jr-sky-desert)" />
      <rect
        data-sky="abstract"
        x="0"
        y="0"
        width={W}
        height={H}
        fill="url(#jr-sky-abstract)"
        opacity="0"
      />
      <rect
        data-sky="air"
        x="0"
        y="0"
        width={W}
        height={H}
        fill="url(#jr-sky-air)"
        opacity="0"
      />

      {/* Low sun — the key light for the truck chapter */}
      <g data-sun>
        <circle cx={1180} cy={HORIZON - 40} r="260" fill="url(#jr-sun)" />
        <circle cx={1180} cy={HORIZON - 40} r="62" fill="#ffcf94" opacity="0.9" />
      </g>

      {/* ============================================================ desert */}
      <g data-desert>
        <path
          data-dune="far"
          d={`M -100 ${HORIZON} C 180 ${HORIZON - 74} 420 ${HORIZON - 18} 700 ${HORIZON - 52}
              C 980 ${HORIZON - 86} 1240 ${HORIZON - 8} 1700 ${HORIZON - 46}
              L 1700 ${H} L -100 ${H} Z`}
          fill="url(#jr-dune-far)"
          opacity="0.85"
        />
        <path
          data-dune="near"
          d={`M -100 ${HORIZON + 44} C 240 ${HORIZON - 4} 520 ${HORIZON + 66} 860 ${HORIZON + 24}
              C 1180 ${HORIZON - 16} 1420 ${HORIZON + 58} 1700 ${HORIZON + 20}
              L 1700 ${H} L -100 ${H} Z`}
          fill="url(#jr-dune-near)"
        />
        {/* Distant pylons — motion reference for the drive */}
        <g data-pylons fill="#1d1a1c">
          {[80, 430, 780, 1130, 1480].map((x) => (
            <g key={x}>
              <rect x={x} y={HORIZON - 118} width="7" height="118" />
              <rect x={x - 32} y={HORIZON - 112} width="71" height="6" />
              <rect x={x - 24} y={HORIZON - 86} width="55" height="5" />
            </g>
          ))}
        </g>
      </g>

      {/* ============================================================== road */}
      <g data-road-group>
        <rect x="0" y={ROAD_Y} width={W} height={H - ROAD_Y} fill="url(#jr-road)" />
        <rect x="0" y={ROAD_Y} width={W} height="4" fill="#c9a84c" opacity="0.25" />
        <g data-road-dashes fill="#e8ce85" opacity="0.55">
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={i * 160} y={ROAD_Y + 96} width="86" height="8" rx="4" />
          ))}
        </g>
        <g data-road-dashes-near fill="#e8ce85" opacity="0.3">
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={i * 230} y={ROAD_Y + 168} width="128" height="12" rx="6" />
          ))}
        </g>
      </g>

      {/* ============================================================ clouds */}
      <g data-cloud-layer opacity="0">
        {CLOUDS.map((cloud) => (
          <g
            key={cloud.key}
            data-cloud-wrap
            data-depth={cloud.depth}
            transform={`translate(${cloud.x} ${cloud.y}) scale(${cloud.scale})`}
            fill="#f3f7fb"
            opacity={0.32 + cloud.depth * 0.5}
          >
            <Cloud id={cloud.key} puffs={CLOUD_SHAPES[cloud.shape]} />
          </g>
        ))}
      </g>

      {/* ====================================================== the vehicle */}
      {/* Outer group is animated (unscaled units); inner group only fits the
          artwork to the frame, so travel distances stay physically honest. */}
      <g data-vehicle>
        <g
          data-vehicle-fit
          transform={`translate(${W / 2} ${ROAD_Y}) scale(${VEHICLE_SCALE}) translate(${-W / 2} ${-ROAD_Y})`}
        >
        {/* Contact shadow, tied to the truck chapter only */}
        <ellipse
          data-vehicle-shadow
          cx="820"
          cy={ROAD_Y + 8}
          rx="470"
          ry="22"
          fill="#050506"
          opacity="0.55"
        />

        {/* Head/tail light wash on the road */}
        <ellipse
          data-headlight
          cx="220"
          cy={ROAD_Y + 30}
          rx="260"
          ry="46"
          fill="#ffd9a0"
          opacity="0"
          filter="url(#jr-soft)"
        />

        {/* Blurred twin of the six shapes. It sits *under* the crisp paths so
            it reads as light spilling out, never as a smeared duplicate. */}
        <g data-ribbon-bloom opacity="0">
          {MORPH_PARTS.map((part) => (
            <path
              key={`bloom-${part.id}`}
              data-bloom={part.id}
              d={part.stages.ribbon}
              fill={part.fill.ribbon}
              opacity="0.5"
              filter="url(#jr-glow)"
            />
          ))}
        </g>

        {/* The six paths that live through all three stages */}
        <g data-morph-group>
          {MORPH_PARTS.map((part) => (
            <path
              key={part.id}
              data-morph={part.id}
              d={part.stages.truck}
              fill={part.fill.truck}
              opacity={part.opacity.truck}
            />
          ))}
        </g>

        {/* Detail parts that dissolve just before the morph begins */}
        <g data-truck-extras>
          <path d={TRUCK.extras.door} fill="#050506" opacity="0.16" />
          <path d={TRUCK.extras.grille} fill="#8c6d2a" opacity="0.7" />
          <path d={TRUCK.extras.window} fill="#9fd0ef" opacity="0.32" />
          <path d={TRUCK.extras.bumper} fill="#3a3d44" />
          <path d={TRUCK.extras.tank} fill="#4a4d55" />
          <path d={TRUCK.extras.secondRearWheel} fill="#14161a" />
          <path d={TRUCK.extras.rearHub2} fill="#3a3d44" />
          <path d={TRUCK.extras.frontHub} fill="#3a3d44" />
          <path d={TRUCK.extras.rearHub} fill="#3a3d44" />
          <circle data-lamp-glow cx="322" cy="470" r="30" fill="#ffd9a0" opacity="0.5" filter="url(#jr-soft)" />
          <path d={TRUCK.extras.lamp} fill="#ffe9c4" />
        </g>

        {/* Aircraft detailing — the mirror of the truck's extras. It fades in
            after the morph settles, which is what turns a silhouette into a
            recognisable aeroplane without adding a shape to the morph. */}
        <g data-plane-extras opacity="0">
          {/* Cabin windows */}
          {Array.from({ length: 17 }, (_, i) => (
            <rect
              key={i}
              x={612 + i * 26}
              y={424 + i * 0.4}
              width="11"
              height="11"
              rx="3"
              fill="#5d646e"
              opacity="0.75"
            />
          ))}
          {/* Cockpit glazing */}
          <path
            d="M 452 452 C 470 434 502 422 540 416 L 548 438 C 512 444 482 454 466 466 Z"
            fill="#2b3440"
          />
          {/* Door outlines */}
          <rect x="596" y="410" width="12" height="40" rx="4" fill="#c3c7cd" opacity="0.5" />
          <rect x="1064" y="400" width="12" height="40" rx="4" fill="#c3c7cd" opacity="0.5" />
          {/* Engine intake */}
          <ellipse cx="782" cy="515" rx="12" ry="26" fill="#2b3440" />
          <ellipse cx="786" cy="515" rx="6" ry="18" fill="#8f96a1" opacity="0.7" />
          {/* Livery stripe */}
          <path
            d="M 470 470 C 620 452 900 444 1150 438 L 1152 452 C 900 458 620 466 476 484 Z"
            fill="#c9a84c"
            opacity="0.85"
          />
          {/* Wing tip fence */}
          <path d="M 1160 566 L 1196 540 L 1206 552 L 1176 578 Z" fill="#e8ce85" />
        </g>
        </g>
      </g>

      {/* Foreground haze that sells depth over the whole chapter */}
      <rect
        data-haze
        x="0"
        y={HORIZON - 60}
        width={W}
        height={H - HORIZON + 60}
        fill="#c98b4b"
        opacity="0.06"
      />

      {/* Speed streaks during the morph — drawn last so they read as motion blur */}
      <g data-streaks opacity="0">
        {Array.from({ length: 18 }, (_, i) => (
          <rect
            key={i}
            data-streak
            data-index={i}
            x={-400 + ((i * 211) % 2000)}
            y={180 + ((i * 97) % 520)}
            width={140 + ((i * 53) % 320)}
            height={2 + (i % 3)}
            rx="2"
            fill={
              ["#c9a84c", "#f0a868", "#ef6d85", "#7c6bf5", "#3fbfd4", "#7ee0a8"][i % 6]
            }
            opacity="0.38"
          />
        ))}
      </g>
    </svg>
  );
}
