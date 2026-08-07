import * as THREE from "three";
import { seededRandom } from "./utils";

/** Converts geographic coordinates to a point on a sphere of `radius`. */
export function latLonToVector3(
  lat: number,
  lon: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/**
 * Evenly distributed points on a sphere (Fibonacci lattice).
 * Far more uniform than lat/lon sampling, which clumps at the poles.
 */
export function fibonacciSpherePositions(
  count: number,
  radius: number,
): Float32Array {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * ringRadius * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * ringRadius * radius;
  }

  return positions;
}

/** Random per-point attributes so dots twinkle at different rates. */
export function randomSeeds(count: number, seed = 1337): Float32Array {
  const random = seededRandom(seed);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) seeds[i] = random();
  return seeds;
}

/** Particles suspended in a shell around the globe — the depth field. */
export function shellParticles(
  count: number,
  innerRadius: number,
  outerRadius: number,
  seed = 90210,
): { positions: Float32Array; scales: Float32Array } {
  const random = seededRandom(seed);
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const u = random() * 2 - 1;
    const theta = random() * Math.PI * 2;
    const r = innerRadius + (outerRadius - innerRadius) * Math.cbrt(random());
    const planar = Math.sqrt(Math.max(0, 1 - u * u));
    positions[i * 3] = Math.cos(theta) * planar * r;
    positions[i * 3 + 1] = u * r * 0.72; // flattened: reads as a disc of dust
    positions[i * 3 + 2] = Math.sin(theta) * planar * r;
    scales[i] = 0.35 + random() * 0.9;
  }

  return { positions, scales };
}

export interface RouteCity {
  label: string;
  lat: number;
  lon: number;
}

export const HOME_CITY: RouteCity = { label: "الرياض", lat: 24.71, lon: 46.68 };

/** Destinations that mirror the company's real reach and partnerships. */
export const ROUTE_CITIES: RouteCity[] = [
  { label: "القاهرة", lat: 30.04, lon: 31.24 },
  { label: "دبي", lat: 25.2, lon: 55.27 },
  { label: "إسطنبول", lat: 41.01, lon: 28.98 },
  { label: "فرانكفورت", lat: 50.11, lon: 8.68 },
  { label: "مومباي", lat: 19.08, lon: 72.88 },
  { label: "جدة", lat: 21.49, lon: 39.19 },
  { label: "الدمام", lat: 26.43, lon: 50.1 },
  { label: "سنغافورة", lat: 1.35, lon: 103.82 },
];

/**
 * Great-circle-ish arc between two coordinates, lifted off the surface so it
 * reads as a flight path rather than a line drawn on the globe.
 */
export function routeCurve(
  from: RouteCity,
  to: RouteCity,
  radius: number,
): THREE.QuadraticBezierCurve3 {
  const start = latLonToVector3(from.lat, from.lon, radius);
  const end = latLonToVector3(to.lat, to.lon, radius);
  const angle = start.angleTo(end);
  // Longer hops arc higher — matches how a viewer expects distance to look.
  const lift = 1 + angle * 0.42;
  const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(radius * lift);
  return new THREE.QuadraticBezierCurve3(start, mid, end);
}

export const GLOBE_RADIUS = 1.55;
