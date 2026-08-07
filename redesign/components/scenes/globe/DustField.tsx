"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { shellParticles } from "@/lib/globeGeometry";
import { heroScene } from "@/lib/sceneState";

const vertexShader = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uProgress;
  uniform float uIntro;
  attribute float aScale;
  varying float vDepth;
  varying float vScale;

  void main() {
    // Particles drift outward and downward as the camera pushes in, which
    // reads as the viewer flying through the field.
    vec3 pos = position;
    pos *= 1.0 + uProgress * 0.55;
    pos.y -= uProgress * 0.35;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vDepth = clamp((-mvPos.z - 1.5) / 7.0, 0.0, 1.0);
    vScale = aScale;

    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = uSize * aScale * uPixelRatio * uIntro * (1.0 / max(0.001, -mvPos.z));
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vDepth;
  varying float vScale;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    // Soft-edged sprite; nearer particles are brighter and larger.
    float mask = smoothstep(0.5, 0.0, d);
    float depthFade = 1.0 - vDepth * 0.75;
    gl_FragColor = vec4(uColor, mask * uOpacity * depthFade * (0.35 + vScale * 0.65));
  }
`;

interface DustFieldProps {
  count?: number;
}

/** Floating particulate that surrounds the globe and provides the depth cue. */
export function DustField({ count = 900 }: DustFieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const { positions, scales } = shellParticles(count, 2.1, 6.4);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.computeBoundingSphere();
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uSize: { value: 26 },
      uPixelRatio: { value: 1 },
      uProgress: { value: 0 },
      uIntro: { value: 0 },
      uOpacity: { value: 0.55 },
      uColor: { value: new THREE.Color("#e8ce85") },
    }),
    [],
  );

  useFrame(({ gl }) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uPixelRatio.value = gl.getPixelRatio();
    material.uniforms.uProgress.value = heroScene.progress;
    material.uniforms.uIntro.value = heroScene.intro;
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
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
