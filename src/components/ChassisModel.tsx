"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useConfigStore } from "@/store/configStore";

export default function ChassisModel() {
  // Retrieve configuration from Zustand store
  const {
    caseColorHex,
    coolingColorHex,
    ledMode,
    ledColor,
    insideStyle,
    gpu,
    ram,
    coolingType,
  } = useConfigStore();

  // Refs for rotating and animating components
  const fanUpperRef = useRef<THREE.Group>(null);
  const fanLowerRef = useRef<THREE.Group>(null);
  const gpuFan1Ref = useRef<THREE.Mesh>(null);
  const gpuFan2Ref = useRef<THREE.Mesh>(null);
  
  // Material refs for dynamic OIDC / RGB LED mode syncing
  const ledLightRef = useRef<THREE.PointLight>(null);
  const ramLedMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const fanLedMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const logoLedMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  // Inside materials based on insideStyle
  const getInsideMaterialProps = () => {
    switch (insideStyle) {
      case "matte-black":
        return { color: "#121212", metalness: 0.1, roughness: 0.8 };
      case "chrome-silver":
        return { color: "#e5e7eb", metalness: 0.95, roughness: 0.08, clearcoat: 1.0 };
      case "gold-cyberpunk":
        return { color: "#d97706", metalness: 0.9, roughness: 0.15, clearcoat: 0.8 };
      default:
        return { color: "#222222", metalness: 0.5, roughness: 0.5 };
    }
  };

  const insideProps = getInsideMaterialProps();

  // Animation and LED lighting effects loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Rotate Front Radiator Intake Fans (around X-axis since they face forward)
    const fanSpeed = coolingType === "Air" ? 8 : coolingType === "AIO" ? 12 : 16;
    if (fanUpperRef.current) {
      fanUpperRef.current.rotation.x += 0.01 * fanSpeed;
    }
    if (fanLowerRef.current) {
      fanLowerRef.current.rotation.x += 0.01 * fanSpeed;
    }

    // 2. Rotate GPU Fans (around Y-axis as GPU is mounted horizontally)
    const gpuFanSpeed = gpu === "RTX 5090" ? 18 : 12;
    if (gpuFan1Ref.current) {
      gpuFan1Ref.current.rotation.y += 0.01 * gpuFanSpeed;
    }
    if (gpuFan2Ref.current) {
      gpuFan2Ref.current.rotation.y += 0.01 * gpuFanSpeed;
    }

    // 3. Dynamic LED Lighting Mode Updates (updates values directly on WebGL thread)
    const currentRGB = new THREE.Color(ledColor);
    let intensity = 1.5;

    if (ledMode === "Off") {
      currentRGB.setHex(0x000000);
      intensity = 0;
    } else if (ledMode === "Breathe") {
      // Pulsing brightness
      const pulse = Math.sin(time * 3.5) * 0.4 + 0.6; // oscillates between 0.2 and 1.0
      intensity = 1.8 * pulse;
      currentRGB.multiplyScalar(pulse);
    } else if (ledMode === "Rainbow") {
      // Smooth color cycling via HSL
      const hue = (time * 0.15) % 1.0;
      currentRGB.setHSL(hue, 1.0, 0.5);
      intensity = 1.6;
    }

    // Apply color and intensity updates to internal light source
    if (ledLightRef.current) {
      ledLightRef.current.color.copy(currentRGB);
      ledLightRef.current.intensity = intensity;
    }

    // Apply color updates to glowing materials
    const emissiveRGB = currentRGB.clone().multiplyScalar(intensity * 0.8);
    if (ramLedMaterialRef.current) {
      ramLedMaterialRef.current.color.copy(emissiveRGB);
    }
    if (fanLedMaterialRef.current) {
      fanLedMaterialRef.current.color.copy(emissiveRGB);
    }
    if (logoLedMaterialRef.current) {
      logoLedMaterialRef.current.color.copy(emissiveRGB);
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* ================= LIGHTING SOURCE RENDER ================= */}
      {/* Custom PointLight inside the case casting subtle shadows */}
      <pointLight
        ref={ledLightRef}
        position={[0, 1.2, 0]}
        distance={6}
        decay={2.0}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />

      {/* ================= 1. CASE FRAME (OUTER STRUCTURE) ================= */}
      {/* Main outer metal paneling */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 4.4, 2.0]} />
        <meshStandardMaterial
          color={caseColorHex}
          metalness={0.8}
          roughness={0.15}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Internal cutout (chassis interior) */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.05, 4.2, 1.85]} />
        <meshPhysicalMaterial
          color={insideProps.color}
          metalness={insideProps.metalness}
          roughness={insideProps.roughness}
          clearcoat={insideProps.clearcoat ?? 0}
        />
      </mesh>

      {/* ================= 2. TRANSPARENT GLASS SIDE PANEL ================= */}
      {/* High-fidelity glass pane using meshPhysicalMaterial */}
      <mesh position={[0, 0, 0.95]} castShadow>
        <boxGeometry args={[2.9, 4.05, 0.05]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={0.05}
          metalness={0.05}
          transmission={0.95}
          thickness={0.8}
          ior={1.5}
          envMapIntensity={2.0}
        />
      </mesh>

      {/* Glass Panel screws */}
      {[-1.38, 1.38].map((x, idx) =>
        [-1.95, 1.95].map((y, idy) => (
          <mesh key={`screw-${idx}-${idy}`} position={[x, y, 0.99]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
            <meshStandardMaterial color="#444444" metalness={0.9} roughness={0.2} />
          </mesh>
        ))
      )}

      {/* ================= 3. MOTHERBOARD PANEL ================= */}
      <group position={[0, 0, -0.8]}>
        {/* PCB Board */}
        <mesh receiveShadow>
          <boxGeometry args={[2.3, 3.4, 0.08]} />
          <meshStandardMaterial color="#1c1d21" roughness={0.9} metalness={0.1} />
        </mesh>

        {/* CPU Socket & VRM Heatsinks */}
        <mesh position={[-0.4, 0.7, 0.1]} castShadow>
          <boxGeometry args={[0.6, 0.6, 0.15]} />
          <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[-0.4, 1.1, 0.1]} castShadow>
          <boxGeometry args={[0.8, 0.18, 0.25]} />
          <meshStandardMaterial color="#1a202c" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* PCIe Slots */}
        <mesh position={[0.2, -0.4, 0.08]} castShadow>
          <boxGeometry args={[1.5, 0.08, 0.1]} />
          <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.4} />
        </mesh>

        {/* ================= 4. RAM MODULES ================= */}
        {/* Render RAM Slots */}
        <group position={[0.2, 0.7, 0.08]}>
          {[0, 1, 2, 3].map((i) => {
            const hasStick = ram === "128GB" || (ram === "64GB" && i % 2 === 0) || (ram === "32GB" && i === 0);
            const xPos = -0.15 + i * 0.09;
            return (
              <group key={`ram-slot-${i}`} position={[xPos, 0, 0]}>
                {/* RAM Slot holder */}
                <mesh castShadow>
                  <boxGeometry args={[0.04, 0.9, 0.1]} />
                  <meshStandardMaterial color="#101010" roughness={0.7} />
                </mesh>
                {/* Glowing RAM Sticks (Reacts to OIDC LED Sync) */}
                {hasStick && (
                  <group position={[0, 0, 0.05]}>
                    <mesh castShadow>
                      <boxGeometry args={[0.02, 0.85, 0.15]} />
                      <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.2} />
                    </mesh>
                    {/* Glowing LED Strip on RAM */}
                    <mesh position={[0, 0, 0.08]}>
                      <boxGeometry args={[0.022, 0.8, 0.02]} />
                      <meshBasicMaterial ref={ramLedMaterialRef} color={ledColor} />
                    </mesh>
                  </group>
                )}
              </group>
            );
          })}
        </group>
      </group>

      {/* ================= 5. GRAPHICS CARD (GPU) ================= */}
      {/* Placed in PCIe slot area */}
      <group position={[0.1, -0.3, -0.4]}>
        {/* Main Shroud */}
        <mesh castShadow position={[0, 0, 0.25]}>
          <boxGeometry args={[2.0, 0.8, 0.5]} />
          <meshStandardMaterial color="#1e1b4b" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Backplate */}
        <mesh castShadow position={[0, 0.42, 0.25]}>
          <boxGeometry args={[2.02, 0.04, 0.52]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Premium RGB Logo on side of GPU */}
        <mesh position={[0, 0, 0.51]}>
          <boxGeometry args={[0.6, 0.2, 0.02]} />
          <meshBasicMaterial ref={logoLedMaterialRef} color={ledColor} />
        </mesh>

        {/* GPU Dual Fans */}
        <group position={[-0.45, 0, 0.51]}>
          <mesh ref={gpuFan1Ref} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.02, 12]} />
            <meshStandardMaterial color="#111111" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.03, 8]} />
            <meshStandardMaterial color="#bbbbbb" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        <group position={[0.45, 0, 0.51]}>
          <mesh ref={gpuFan2Ref} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.02, 12]} />
            <meshStandardMaterial color="#111111" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.03, 8]} />
            <meshStandardMaterial color="#bbbbbb" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ================= 6. LIQUID COOLING LOOP ================= */}
      {/* Renders liquid cooling block and pipes if Custom Loop/AIO is selected */}
      {coolingType !== "Air" && (
        <group>
          {/* CPU Water block on Motherboard */}
          <group position={[-0.4, 0.5, -0.6]}>
            {/* Block Base */}
            <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
              <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Block glowing ring */}
            <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.24, 0.24, 0.03, 32]} />
              <meshBasicMaterial ref={logoLedMaterialRef} color={ledColor} />
            </mesh>
          </group>

          {/* Hardline Tubing (Futuristic piping lines) */}
          {coolingType === "Custom Loop" && (
            <group>
              {/* Pipe 1: CPU block to top (Outward) */}
              <mesh position={[-0.4, 1.1, -0.5]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 1.2, 16]} />
                <meshPhysicalMaterial
                  color={coolingColorHex}
                  transparent
                  opacity={0.85}
                  roughness={0.1}
                  transmission={0.9}
                  thickness={0.2}
                />
              </mesh>
              <mesh position={[-0.4, 1.7, -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 1.8, 16]} />
                <meshPhysicalMaterial
                  color={coolingColorHex}
                  transparent
                  opacity={0.85}
                  roughness={0.1}
                  transmission={0.9}
                  thickness={0.2}
                />
              </mesh>

              {/* Pipe 2: CPU block to GPU block / Front Reservoir */}
              <mesh position={[-0.2, 0.5, -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
                <meshPhysicalMaterial
                  color={coolingColorHex}
                  transparent
                  opacity={0.85}
                  roughness={0.1}
                  transmission={0.9}
                  thickness={0.2}
                />
              </mesh>
              <mesh position={[0.0, 0.1, -0.5]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 0.8, 16]} />
                <meshPhysicalMaterial
                  color={coolingColorHex}
                  transparent
                  opacity={0.85}
                  roughness={0.1}
                  transmission={0.9}
                  thickness={0.2}
                />
              </mesh>
              <mesh position={[0.6, -0.3, -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 1.2, 16]} />
                <meshPhysicalMaterial
                  color={coolingColorHex}
                  transparent
                  opacity={0.85}
                  roughness={0.1}
                  transmission={0.9}
                  thickness={0.2}
                />
              </mesh>
              <mesh position={[1.2, 0.4, -0.5]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 1.4, 16]} />
                <meshPhysicalMaterial
                  color={coolingColorHex}
                  transparent
                  opacity={0.85}
                  roughness={0.1}
                  transmission={0.9}
                  thickness={0.2}
                />
              </mesh>
            </group>
          )}

          {/* Reservoir (Aesthetic Liquid Column) */}
          {coolingType === "Custom Loop" && (
            <group position={[1.2, 0.1, -0.2]}>
              {/* Res base & top */}
              <mesh position={[0, 0.8, 0]} castShadow>
                <cylinderGeometry args={[0.22, 0.22, 0.1, 24]} />
                <meshStandardMaterial color="#1f2937" metalness={0.8} />
              </mesh>
              <mesh position={[0, -0.8, 0]} castShadow>
                <cylinderGeometry args={[0.22, 0.22, 0.1, 24]} />
                <meshStandardMaterial color="#1f2937" metalness={0.8} />
              </mesh>
              {/* Reservoir Glass & Fluid */}
              <mesh castShadow>
                <cylinderGeometry args={[0.2, 0.2, 1.5, 24]} />
                <meshPhysicalMaterial
                  color={coolingColorHex}
                  transparent
                  opacity={0.7}
                  roughness={0.05}
                  transmission={0.85}
                  thickness={0.4}
                />
              </mesh>
            </group>
          )}
        </group>
      )}

      {/* ================= 7. FRONT INTEGRATED RGB FANS ================= */}
      {/* Render front ventilation structure */}
      <group position={[1.45, 0, 0]}>
        {/* Upper Fan */}
        <group position={[0, 0.8, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.15, 32]} />
            <meshStandardMaterial color="#111111" roughness={0.7} />
          </mesh>
          {/* Glowing fan frame ring (Reacts to OIDC LED Sync) */}
          <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.02, 32]} />
            <meshBasicMaterial ref={fanLedMaterialRef} color={ledColor} />
          </mesh>
          {/* Blades */}
          <group ref={fanUpperRef}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <mesh key={`blade-u-${i}`} rotation={[0, 0, (i * Math.PI) / 4]} position={[0, 0, 0]}>
                <boxGeometry args={[0.1, 0.45, 0.02]} />
                <meshStandardMaterial color="#2d3748" opacity={0.8} transparent roughness={0.5} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Lower Fan */}
        <group position={[0, -0.8, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.15, 32]} />
            <meshStandardMaterial color="#111111" roughness={0.7} />
          </mesh>
          {/* Glowing fan frame ring */}
          <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.02, 32]} />
            <meshBasicMaterial ref={fanLedMaterialRef} color={ledColor} />
          </mesh>
          {/* Blades */}
          <group ref={fanLowerRef}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <mesh key={`blade-l-${i}`} rotation={[0, 0, (i * Math.PI) / 4]} position={[0, 0, 0]}>
                <boxGeometry args={[0.1, 0.45, 0.02]} />
                <meshStandardMaterial color="#2d3748" opacity={0.8} transparent roughness={0.5} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}
