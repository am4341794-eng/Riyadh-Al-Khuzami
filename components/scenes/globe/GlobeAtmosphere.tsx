"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLOBE_RADIUS } from "@/lib/globeGeometry";
import { heroScene } from "@/lib/sceneState";

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uPower;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    // Limb glow: brightest where the surface turns away from the viewer,
    // zero dead-centre. abs() keeps it stable on a back-facing sphere, and the
    // clamp stops additive blending from blowing the whole disc out.
    float facing = abs(dot(normalize(vNormal), normalize(-vViewPosition)));
    float rim = pow(clamp(1.0 - facing, 0.0, 1.0), uPower);
    gl_FragColor = vec4(uColor, clamp(rim, 0.0, 1.0) * uOpacity);
  }
`;

/** Globe body, wireframe graticule and the outer atmospheric rim. */
export function GlobeAtmosphere() {
  const glowRef = useRef<THREE.ShaderMaterial>(null);
  const bodyRef = useRef<THREE.MeshBasicMaterial>(null);
  const gridRef = useRef<THREE.LineBasicMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#c9a84c") },
      uOpacity: { value: 0 },
      uPower: { value: 2.6 },
    }),
    [],
  );

  const graticule = useMemo(
    () =>
      new THREE.WireframeGeometry(
        new THREE.SphereGeometry(GLOBE_RADIUS * 1.001, 30, 18),
      ),
    [],
  );

  useFrame(() => {
    const intro = heroScene.intro;
    const p = heroScene.progress;
    if (glowRef.current) {
      glowRef.current.uniforms.uOpacity.value = intro * (0.5 + p * 0.28);
      glowRef.current.uniforms.uPower.value = 2.6 - p * 0.7;
    }
    if (bodyRef.current) bodyRef.current.opacity = intro * 0.92;
    if (gridRef.current) gridRef.current.opacity = intro * (0.05 - p * 0.032);
  });

  return (
    <group>
      {/* Opaque core occludes the far-side dots, which is what sells depth. */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 0.985, 48, 32]} />
        <meshBasicMaterial
          ref={bodyRef}
          color="#07080b"
          transparent
          opacity={0}
        />
      </mesh>

      <lineSegments geometry={graticule}>
        <lineBasicMaterial ref={gridRef} color="#c9a84c" transparent opacity={0} />
      </lineSegments>

      <mesh scale={1.09}>
        <sphereGeometry args={[GLOBE_RADIUS, 48, 32]} />
        <shaderMaterial
          ref={glowRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
