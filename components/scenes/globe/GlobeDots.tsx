"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  GLOBE_RADIUS,
  fibonacciSpherePositions,
  randomSeeds,
} from "@/lib/globeGeometry";
import { heroScene } from "@/lib/sceneState";

const vertexShader = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uIntro;
  attribute float aSeed;
  varying float vFade;

  void main() {
    // Entrance: dots converge onto the sphere from a scattered shell.
    float scatter = 1.0 + (1.0 - uIntro) * (0.6 + aSeed * 2.4);
    vec3 pos = position * scatter;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vec4 mvPos = viewMatrix * worldPos;

    // Facing test gives real depth: dots on the far hemisphere recede.
    vec3 worldNormal = normalize(mat3(modelMatrix) * normalize(position));
    vec3 viewDir = normalize(cameraPosition - worldPos.xyz);
    vFade = smoothstep(-0.25, 0.6, dot(worldNormal, viewDir));

    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = uSize * uPixelRatio * (1.0 / max(0.001, -mvPos.z));
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorCore;
  uniform vec3 uColorEdge;
  uniform float uOpacity;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float mask = smoothstep(0.5, 0.06, d);
    vec3 color = mix(uColorEdge, uColorCore, vFade);
    gl_FragColor = vec4(color, mask * uOpacity * (0.16 + vFade * 0.84));
  }
`;

interface GlobeDotsProps {
  count?: number;
}

/** The dot-matrix shell that gives the globe its surface. */
export function GlobeDots({ count = 3600 }: GlobeDotsProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(fibonacciSpherePositions(count, GLOBE_RADIUS), 3),
    );
    geo.setAttribute("aSeed", new THREE.BufferAttribute(randomSeeds(count), 1));
    geo.computeBoundingSphere();
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uSize: { value: 13 },
      uPixelRatio: { value: 1 },
      uIntro: { value: 0 },
      uOpacity: { value: 1 },
      uColorCore: { value: new THREE.Color("#f5e6c0") },
      uColorEdge: { value: new THREE.Color("#8c6d2a") },
    }),
    [],
  );

  useFrame(({ gl }) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uPixelRatio.value = gl.getPixelRatio();
    material.uniforms.uIntro.value = heroScene.intro;
    // Dots dim slightly as the camera pushes in so the headline stays legible.
    material.uniforms.uOpacity.value = 1 - heroScene.progress * 0.35;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
