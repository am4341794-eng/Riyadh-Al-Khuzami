/**
 * Geometry factory for the morph sequence.
 *
 * Every silhouette on the page is generated from the same primitives so that
 * the truck, the abstract ribbons and the aircraft all live in one coordinate
 * space (1600 × 900) and can be handed to MorphSVGPlugin without any manual
 * point matching. Nothing here touches the DOM — it is pure data, identical on
 * the server and the client.
 */

import { SCENE_VIEWBOX } from "./constants";

type Point = { x: number; y: number };

const KAPPA = 0.5522847498307936;
const round = (n: number) => Math.round(n * 100) / 100;

/* ---------------------------------------------------------------- primitives */

/** Circle as a four-arc cubic path — morphable, unlike `<circle>`. */
export function circlePath(cx: number, cy: number, r: number): string {
  const k = r * KAPPA;
  return [
    `M ${round(cx)} ${round(cy - r)}`,
    `C ${round(cx + k)} ${round(cy - r)} ${round(cx + r)} ${round(cy - k)} ${round(cx + r)} ${round(cy)}`,
    `C ${round(cx + r)} ${round(cy + k)} ${round(cx + k)} ${round(cy + r)} ${round(cx)} ${round(cy + r)}`,
    `C ${round(cx - k)} ${round(cy + r)} ${round(cx - r)} ${round(cy + k)} ${round(cx - r)} ${round(cy)}`,
    `C ${round(cx - r)} ${round(cy - k)} ${round(cx - k)} ${round(cy - r)} ${round(cx)} ${round(cy - r)}`,
    "Z",
  ].join(" ");
}

/** Rounded rectangle path. */
export function roundRectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  r = 0,
): string {
  const radius = Math.min(r, w / 2, h / 2);
  const k = radius * (1 - KAPPA);
  return [
    `M ${round(x + radius)} ${round(y)}`,
    `L ${round(x + w - radius)} ${round(y)}`,
    `C ${round(x + w - k)} ${round(y)} ${round(x + w)} ${round(y + k)} ${round(x + w)} ${round(y + radius)}`,
    `L ${round(x + w)} ${round(y + h - radius)}`,
    `C ${round(x + w)} ${round(y + h - k)} ${round(x + w - k)} ${round(y + h)} ${round(x + w - radius)} ${round(y + h)}`,
    `L ${round(x + radius)} ${round(y + h)}`,
    `C ${round(x + k)} ${round(y + h)} ${round(x)} ${round(y + h - k)} ${round(x)} ${round(y + h - radius)}`,
    `L ${round(x)} ${round(y + radius)}`,
    `C ${round(x)} ${round(y + k)} ${round(x + k)} ${round(y)} ${round(x + radius)} ${round(y)}`,
    "Z",
  ].join(" ");
}

/**
 * Converts a point list into a smooth cubic path using Catmull-Rom → Bézier.
 * `close` appends the closing segment for filled shapes.
 */
export function smoothPath(points: Point[], close = false): string {
  if (points.length < 2) return "";
  const p = points;
  const last = p.length - 1;
  let d = `M ${round(p[0].x)} ${round(p[0].y)}`;

  for (let i = 0; i < last; i++) {
    const p0 = i === 0 ? (close ? p[last] : p[0]) : p[i - 1];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = i + 2 > last ? (close ? p[0] : p[last]) : p[i + 2];

    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${round(c1.x)} ${round(c1.y)} ${round(c2.x)} ${round(c2.y)} ${round(p2.x)} ${round(p2.y)}`;
  }

  return close ? `${d} Z` : d;
}

type RibbonOptions = {
  /** Vertical centre of the band. */
  y: number;
  /** Peak vertical displacement of the wave. */
  amplitude: number;
  /** Band thickness at its widest point. */
  thickness: number;
  /** Phase offset in radians — de-synchronises neighbouring ribbons. */
  phase?: number;
  /** Number of full sine cycles across the canvas. */
  waves?: number;
  xStart?: number;
  xEnd?: number;
  /** 0 = constant thickness, 1 = fully tapered to nothing at both ends. */
  taper?: number;
  /** Sample resolution of the centre line. */
  samples?: number;
};

/**
 * A flowing, filled ribbon. Rendered as a fill (not a stroke) so it can morph
 * directly into a solid silhouette without swapping paint properties mid-flight.
 */
export function ribbonPath({
  y,
  amplitude,
  thickness,
  phase = 0,
  waves = 1.6,
  xStart = -200,
  xEnd = SCENE_VIEWBOX.width + 200,
  taper = 0.75,
  samples = 22,
}: RibbonOptions): string {
  const top: Point[] = [];
  const bottom: Point[] = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = xStart + (xEnd - xStart) * t;
    const angle = phase + t * Math.PI * 2 * waves;
    const centreY = y + Math.sin(angle) * amplitude;
    // Envelope keeps the ribbon ends thin so they read as strokes fading out.
    const envelope = 1 - taper * (1 - Math.sin(Math.PI * t) ** 0.6);
    const half = (thickness / 2) * envelope;
    top.push({ x, y: centreY - half });
    bottom.push({ x, y: centreY + half });
  }

  const forwardEdge = smoothPath(top);
  const backEdge = smoothPath(bottom.reverse()).replace(/^M/, "L");
  return `${forwardEdge} ${backEdge} Z`;
}

/* ------------------------------------------------------------ stage geometry */

const GROUND_Y = 700;

/** Side elevation of a semi-trailer truck, nose pointing along the reading
 *  direction (right → left for RTL). */
export const TRUCK = {
  trailer: roundRectPath(668, 244, 664, 316, 16),
  cab:
    "M 316 560 L 316 436 C 316 404 330 374 356 352 " +
    "L 424 300 C 440 288 460 282 480 282 L 640 282 L 640 560 Z",
  chassis: roundRectPath(330, 560, 1002, 44, 10),
  frontWheel: circlePath(452, 638, 62),
  rearWheel: circlePath(1186, 638, 62),
  roof:
    "M 470 282 L 646 282 L 646 214 C 646 200 634 190 620 192 " +
    "L 512 210 C 488 214 470 236 470 260 Z",
  /** Decorative extras — faded out before the morph so nothing pops. */
  extras: {
    secondRearWheel: circlePath(1042, 638, 62),
    frontHub: circlePath(452, 638, 24),
    rearHub: circlePath(1186, 638, 24),
    rearHub2: circlePath(1042, 638, 24),
    window:
      "M 372 430 C 372 408 382 388 400 374 L 448 338 C 458 330 470 326 482 326 L 560 326 L 560 430 Z",
    door: roundRectPath(700, 280, 596, 244, 8),
    bumper: roundRectPath(292, 520, 44, 60, 10),
    lamp: circlePath(322, 470, 12),
    tank: roundRectPath(700, 604, 150, 46, 22),
    grille: roundRectPath(700, 300, 560, 6, 3),
  },
  groundY: GROUND_Y,
} as const;

/** Six colourful abstract ribbons — the connective tissue of the morph. */
export const RIBBONS = [
  ribbonPath({ y: 300, amplitude: 96, thickness: 26, phase: 0.2, waves: 1.4 }),
  ribbonPath({ y: 372, amplitude: 128, thickness: 34, phase: 1.1, waves: 1.15 }),
  ribbonPath({ y: 452, amplitude: 74, thickness: 20, phase: 2.4, waves: 1.8 }),
  ribbonPath({ y: 520, amplitude: 112, thickness: 30, phase: 3.3, waves: 1.3 }),
  ribbonPath({ y: 596, amplitude: 86, thickness: 24, phase: 4.2, waves: 1.6 }),
  ribbonPath({ y: 236, amplitude: 140, thickness: 16, phase: 5.1, waves: 1.05 }),
] as const;

/** Three-quarter side view of a wide-body aircraft, nose along the reading
 *  direction so the morph never has to flip the silhouette. */
export const PLANE = {
  fuselage:
    "M 402 470 C 442 424 548 398 668 392 L 1048 382 " +
    "C 1106 380 1146 392 1174 416 L 1266 486 L 1156 492 " +
    "C 1074 502 892 508 692 506 C 552 504 438 494 402 470 Z",
  wing:
    "M 716 460 C 800 458 902 468 984 486 L 1178 574 " +
    "C 1136 588 1058 582 994 562 L 754 494 Z",
  stabilizer:
    "M 1112 414 L 1236 410 L 1310 446 L 1206 452 Z",
  engine: roundRectPath(772, 486, 158, 58, 29),
  fin:
    "M 1142 390 L 1196 258 C 1204 238 1224 234 1234 254 L 1284 386 Z",
  contrail: ribbonPath({
    y: 448,
    amplitude: 10,
    thickness: 14,
    phase: 0,
    waves: 0.35,
    xStart: 1240,
    xEnd: 1900,
    taper: 0.95,
    samples: 10,
  }),
} as const;

export type MorphStageKey = "truck" | "ribbon" | "plane";

export type MorphPart = {
  id: string;
  /** Paint per stage — tweened alongside the shape so colour never jumps. */
  fill: Record<MorphStageKey, string>;
  opacity: Record<MorphStageKey, number>;
  stages: Record<MorphStageKey, string>;
};

/**
 * The six elements that survive the entire journey. Each one holds a shape for
 * every stage, so the transition is one continuous tween per element rather
 * than a cross-fade between three separate illustrations.
 */
export const MORPH_PARTS: MorphPart[] = [
  {
    id: "hull",
    stages: { truck: TRUCK.trailer, ribbon: RIBBONS[0], plane: PLANE.fuselage },
    fill: { truck: "#c9a84c", ribbon: "#f0a868", plane: "#f6f1e6" },
    opacity: { truck: 1, ribbon: 0.95, plane: 1 },
  },
  {
    id: "prow",
    stages: { truck: TRUCK.cab, ribbon: RIBBONS[1], plane: PLANE.wing },
    fill: { truck: "#e8ce85", ribbon: "#ef6d85", plane: "#c9a84c" },
    opacity: { truck: 1, ribbon: 0.95, plane: 1 },
  },
  {
    id: "spine",
    stages: { truck: TRUCK.chassis, ribbon: RIBBONS[2], plane: PLANE.stabilizer },
    fill: { truck: "#3a3d44", ribbon: "#7c6bf5", plane: "#e8ce85" },
    opacity: { truck: 1, ribbon: 0.95, plane: 1 },
  },
  {
    id: "front-rotor",
    stages: { truck: TRUCK.frontWheel, ribbon: RIBBONS[3], plane: PLANE.engine },
    fill: { truck: "#14161a", ribbon: "#3fbfd4", plane: "#5d646e" },
    opacity: { truck: 1, ribbon: 0.95, plane: 1 },
  },
  {
    id: "rear-rotor",
    stages: { truck: TRUCK.rearWheel, ribbon: RIBBONS[4], plane: PLANE.fin },
    fill: { truck: "#14161a", ribbon: "#7ee0a8", plane: "#c9a84c" },
    opacity: { truck: 1, ribbon: 0.95, plane: 1 },
  },
  {
    id: "crest",
    stages: { truck: TRUCK.roof, ribbon: RIBBONS[5], plane: PLANE.contrail },
    fill: { truck: "#8c6d2a", ribbon: "#c9a84c", plane: "#9fd0ef" },
    opacity: { truck: 1, ribbon: 0.9, plane: 0.7 },
  },
];
