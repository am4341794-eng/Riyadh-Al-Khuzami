"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  GLOBE_RADIUS,
  HOME_CITY,
  ROUTE_CITIES,
  latLonToVector3,
  routeCurve,
} from "@/lib/globeGeometry";
import { heroScene } from "@/lib/sceneState";
import { clamp } from "@/lib/utils";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uProgress;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    // Everything past the travelling head is not drawn yet.
    if (vUv.x > uProgress) discard;

    float head = smoothstep(uProgress - 0.07, uProgress, vUv.x);
    float trail = smoothstep(uProgress - 0.6, uProgress, vUv.x);
    float tailIn = smoothstep(0.0, 0.1, vUv.x);

    vec3 color = mix(uColor, vec3(1.0), head * 0.9);
    float alpha = uOpacity * tailIn * (0.22 + trail * 0.78);
    gl_FragColor = vec4(color, alpha);
  }
`;

const ARC_COLORS = ["#c9a84c", "#e8ce85", "#f0a868", "#3fbfd4"];

/**
 * Flight paths radiating from Riyadh.
 * Each arc is a tube whose fragments are revealed along its own UV, so the
 * "drawing" is a single uniform update rather than geometry rebuilds.
 */
export function GlobeArcs() {
  const materialsRef = useRef<Array<THREE.ShaderMaterial | null>>([]);

  const arcs = useMemo(
    () =>
      ROUTE_CITIES.map((city, index) => {
        const curve = routeCurve(HOME_CITY, city, GLOBE_RADIUS);
        return {
          id: city.label,
          geometry: new THREE.TubeGeometry(curve, 110, 0.0095, 6, false),
          endpoint: latLonToVector3(city.lat, city.lon, GLOBE_RADIUS * 1.005),
          color: ARC_COLORS[index % ARC_COLORS.length],
          // Staggered so routes fan out rather than firing in unison.
          offset: (index / ROUTE_CITIES.length) * 0.45,
          speed: 1.5 + (index % 3) * 0.35,
        };
      }),
    [],
  );

  const home = useMemo(
    () => latLonToVector3(HOME_CITY.lat, HOME_CITY.lon, GLOBE_RADIUS * 1.005),
    [],
  );

  const uniformsList = useMemo(
    () =>
      arcs.map((arc) => ({
        uProgress: { value: 0 },
        uOpacity: { value: 1 },
        uColor: { value: new THREE.Color(arc.color) },
      })),
    [arcs],
  );

  useFrame(() => {
    const p = heroScene.progress;
    const intro = heroScene.intro;
    arcs.forEach((arc, index) => {
      const uniforms = uniformsList[index];
      // Routes begin drawing during the intro and complete through the scroll.
      const local = clamp((intro * 0.35 + p * arc.speed - arc.offset) / 0.9);
      uniforms.uProgress.value = local;
      uniforms.uOpacity.value = intro * (1 - p * 0.2);
    });
  });

  return (
    <group>
      {arcs.map((arc, index) => (
        <mesh key={arc.id} geometry={arc.geometry} frustumCulled={false}>
          <shaderMaterial
            ref={(instance) => {
              materialsRef.current[index] = instance;
            }}
            uniforms={uniformsList[index]}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Destination pins */}
      {arcs.map((arc) => (
        <mesh key={`${arc.id}-pin`} position={arc.endpoint}>
          <sphereGeometry args={[0.016, 10, 10]} />
          <meshBasicMaterial color={arc.color} transparent opacity={0.9} />
        </mesh>
      ))}

      {/* Home marker — Riyadh */}
      <mesh position={home}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color="#f5e6c0" />
      </mesh>
      <mesh position={home}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial
          color="#c9a84c"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
