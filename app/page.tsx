"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function SpinningCube() {
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
    <mesh
      ref={meshRef}
      onClick={() => setIsClicked(!isClicked)}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <boxGeometry args={isClicked ? [2, 2, 2] : [1, 1, 1]} />
      <meshStandardMaterial color={isHovered ? "#ec4899" : "#4f46e5"} />
    </mesh>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#18181b" />
    </mesh>
  );
}

function BackWall() {
  return (
    <mesh position={[0, 8, -25]}>
      <planeGeometry args={[50, 20]} />
      <meshStandardMaterial color="#18181b" />
    </mesh>
  );
}

export default function Home() {
  return (
    <main className="h-screen w-screen bg-zinc-950">
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls />
        <Floor />
        <BackWall />
        <SpinningCube />
      </Canvas>
    </main>
  );
}
