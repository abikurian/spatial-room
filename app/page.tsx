"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Float, MeshWobbleMaterial, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

interface SpinningCubeProps {
  position: [number, number, number];
  index: number;
  activeNode: number | null;
  setActiveNode: (index: number) => void;
}

function SpinningCube({
  position,
  index,
  activeNode,
  setActiveNode,
}: SpinningCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  const isSelected = activeNode === index;

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh
        ref={meshRef}
        position={position}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          setTimeout(() => setActiveNode(index), 0);
        }}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <boxGeometry args={isSelected ? [2, 2, 2] : [1, 1, 1]} />
        <MeshWobbleMaterial
          color={isHovered || isSelected ? "#ec4899" : "#4f46e5"}
          speed={2}
          factor={isSelected ? 1 : 0}
        />
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-zinc-900 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg pointer-events-none">
            {isSelected ? "Active Node" : "System Core"}
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
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const NODE_POSITIONS: [number, number, number][] = [
    [-3, 0, 0],
    [0, 0, 0],
    [3, 0, 0],
  ];

  return (
    <main className="relative h-screen w-screen bg-zinc-950 overflow-hidden">
      <div className="absolute top-0 left-0 w-full p-8 z-10 pointer-events-none">
        <h1 className="text-3xl font-black text-white tracking-widest uppercase">
          System<span className="text-indigo-500">Core</span>
        </h1>
        <p className="text-zinc-400 font-mono text-sm mt-2">
          Spatial Navigation Protocol Active
        </p>
        <p className="text-pink-500 font-mono mt-4">
          Selected System: {activeNode !== null ? `Node-0${activeNode}` : 'None'}
        </p>
      </div>
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
        <OrbitControls
          minDistance={5}
          maxDistance={25}
          maxPolarAngle={Math.PI / 2 - 0.05}
          enablePan={false}
        />
        <Floor />
        <BackWall />
        {NODE_POSITIONS.map((pos, index) => (
          <SpinningCube
            key={index}
            position={pos}
            index={index}
            activeNode={activeNode}
            setActiveNode={setActiveNode}
          />
        ))}
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            mipmapBlur={true}
          />
        </EffectComposer>
      </Canvas>
    </main>
  );
}
