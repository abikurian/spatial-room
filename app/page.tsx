"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Float, MeshWobbleMaterial, Sparkles } from "@react-three/drei";

function SpinningCube({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh
        ref={meshRef}
        position={position}
        castShadow
        onClick={() => setIsClicked(!isClicked)}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <boxGeometry args={isClicked ? [2, 2, 2] : [1, 1, 1]} />
        <MeshWobbleMaterial
          color={isHovered ? "#ec4899" : "#4f46e5"}
          speed={2}
          factor={isClicked ? 1 : 0}
        />
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-zinc-900 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg pointer-events-none">
            {isClicked ? "Active Node" : "System Core"}
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#18181b" />
      <gridHelper args={[50, 50, '#4f46e5', '#27272a']} position={[0, 0.01, 0]} />
    </mesh>
  );
}

function BackWall() {
  return (
    <mesh position={[0, 8, -25]} receiveShadow>
      <planeGeometry args={[50, 20]} />
      <meshStandardMaterial color="#18181b" />
    </mesh>
  );
}

export default function Home() {
  const NODE_POSITIONS: [number, number, number][] = [
    [-3, 0, 0],
    [0, 0, 0],
    [3, 0, 0],
  ];

  return (
    <main className="h-screen w-screen bg-zinc-950">
      <Canvas shadows>
        <fog attach="fog" args={['#09090b', 10, 40]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        <Sparkles
          count={200}
          scale={15}
          size={2}
          speed={0.4}
          opacity={0.3}
          color="#4f46e5"
        />
        <OrbitControls />
        <Floor />
        <BackWall />
        {NODE_POSITIONS.map((pos, index) => (
          <SpinningCube key={index} position={pos} />
        ))}
      </Canvas>
    </main>
  );
}
