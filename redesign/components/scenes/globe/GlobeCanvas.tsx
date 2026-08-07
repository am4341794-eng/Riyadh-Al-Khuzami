"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { heroScene } from "@/lib/sceneState";
import { GLOBE_RADIUS } from "@/lib/globeGeometry";
import { GlobeDots } from "./GlobeDots";
import { GlobeArcs } from "./GlobeArcs";
import { GlobeAtmosphere } from "./GlobeAtmosphere";
import { DustField } from "./DustField";

/** Hands the renderer's `invalidate` to the GSAP side of the app. */
function FrameBridge() {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    heroScene.invalidate = invalidate;
    invalidate();
    return () => {
      heroScene.invalidate = null;
    };
  }, [invalidate]);
  return null;
}

/**
 * Camera and globe transform.
 *
 * Values are assigned, not lerped: the transform is a pure function of scroll
 * progress, so the motion stops the instant the scroll does — exactly the
 * behaviour the brief asks for. All smoothing comes from Lenis upstream.
 */
function GlobeRig({ quality }: { quality: "high" | "low" }) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const size = useThree((state) => state.size);

  // Portrait viewports need extra distance or the globe fills the frame and
  // crowds the headline.
  const aspect = size.width / Math.max(1, size.height);
  const fitDistance = aspect < 1 ? 1 + (1 - aspect) * 0.85 : 1;

  useFrame(() => {
    const { progress: p, intro, pointerX, pointerY } = heroScene;
    const group = groupRef.current;

    if (group) {
      // A little over a third of a turn across the whole hero.
      group.rotation.y = -0.6 + intro * 0.35 + p * 2.35;
      group.rotation.x = 0.22 - p * 0.3 + pointerY * 0.06;
      group.rotation.z = 0.08 * (1 - intro);
      const scale = 0.86 + intro * 0.14 + p * 0.12;
      group.scale.setScalar(scale);
      group.position.y = -p * 0.42;
    }

    // Camera-like dolly: pushes in, then drops below the horizon line.
    camera.position.set(
      pointerX * 0.3,
      0.05 + pointerY * -0.2 + p * 1.0,
      (8.6 - (1 - intro) * 1.1 - p * 4.1) * fitDistance,
    );
    camera.lookAt(0, p * 0.25, 0);
    camera.updateProjectionMatrix();
  });

  return (
    <group ref={groupRef}>
      <GlobeAtmosphere />
      <GlobeDots count={quality === "high" ? 3600 : 1500} />
      <GlobeArcs />
      <DustField count={quality === "high" ? 900 : 320} />
      {/* Faint ecliptic ring, sized off the globe so it scales with it. */}
      <mesh rotation={[Math.PI / 2.1, 0, 0.3]}>
        <ringGeometry args={[GLOBE_RADIUS * 1.62, GLOBE_RADIUS * 1.635, 128]} />
        <meshBasicMaterial
          color="#c9a84c"
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

interface GlobeCanvasProps {
  quality?: "high" | "low";
  className?: string;
}

/**
 * WebGL layer for the hero.
 *
 * `frameloop="demand"` means not a single frame is rendered unless something
 * asked for one — the scroll scrub, the intro tween or a pointer move. On an
 * idle page the GPU is completely quiet.
 */
export default function GlobeCanvas({
  quality = "high",
  className,
}: GlobeCanvasProps) {
  return (
    <Canvas
      className={className}
      frameloop="demand"
      dpr={quality === "high" ? [1, 2] : [1, 1.5]}
      gl={{
        antialias: quality === "high",
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      camera={{ fov: 42, near: 0.1, far: 60, position: [0, 0, 9.7] }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <FrameBridge />
      <GlobeRig quality={quality} />
    </Canvas>
  );
}
