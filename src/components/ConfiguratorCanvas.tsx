"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import React, { Suspense } from "react";
import ChassisModel from "./ChassisModel";
import { useConfigStore } from "@/store/configStore";

export default function ConfiguratorCanvas() {
  // Bind autoRotate from state
  const autoRotate = useConfigStore((state) => state.autoRotate);

  return (
    <div className="w-full h-full relative select-none">
      {/* Three.js Fiber Canvas Container */}
      <Canvas
        shadows
        camera={{ position: [5.2, 2.8, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        className="w-full h-full bg-zinc-950"
      >
        {/* Canvas background color matching tailwind dark theme */}
        <color attach="background" args={["#09090b"]} />

        {/* Global ambient light for base visibility */}
        <ambientLight intensity={0.15} />

        {/* Main studio key light casting clean shadow maps */}
        <directionalLight
          position={[6, 12, 6]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0002}
        />

        {/* Rim light for metal highlighting */}
        <directionalLight
          position={[-6, 4, -6]}
          intensity={0.7}
          color="#06b6d4" // cyber cyan tint
        />

        {/* Fill light underneath for shadow details */}
        <directionalLight
          position={[0, -6, 0]}
          intensity={0.4}
          color="#4f46e5" // deep indigo tint
        />

        <Suspense fallback={null}>
          {/* Main 3D PC Case model */}
          <ChassisModel />

          {/* Dynamic ground contact shadows under the case */}
          <ContactShadows
            position={[0, -2.42, 0]}
            opacity={0.65}
            scale={7.5}
            blur={2.0}
            far={4.0}
          />
        </Suspense>

        {/* 3D Camera Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          autoRotate={autoRotate}
          autoRotateSpeed={0.7}
          minDistance={4.2}
          maxDistance={8.5}
          maxPolarAngle={Math.PI / 2 + 0.15} // Restrict panning below floor
          target={[0, 0.0, 0]}
        />
      </Canvas>

      {/* R3F Control Hint Info Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none select-none z-10 font-mono text-[10px] text-zinc-500 bg-zinc-950/50 backdrop-blur-md py-1.5 px-3 rounded-full border border-zinc-800/60 uppercase tracking-wider">
        [Render: WebGL 2.0 // Drag to Rotate // Scroll to Zoom]
      </div>
    </div>
  );
}
