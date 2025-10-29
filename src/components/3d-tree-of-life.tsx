"use client";

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

interface TreeOfLifeProps {
  position?: [number, number, number];
  scale?: number;
}

export function TreeOfLife3D({ position = [0, 0, 0], scale = 1 }: TreeOfLifeProps) {
  const treeRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  // Gentle floating animation
  useFrame((state) => {
    if (treeRef.current) {
      treeRef.current.rotation.y += 0.002;
      treeRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const handleClick = () => {
    router.push('/rituals');
  };

  return (
    <group
      ref={treeRef}
      position={position}
      scale={scale}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Tree trunk */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
        <meshStandardMaterial
          color={hovered ? "#6B4423" : "#8B6F47"}
          roughness={0.8}
        />
      </mesh>

      {/* Main canopy - large sphere */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? "#7C3AED" : "#9333EA"}
          emissive={hovered ? "#7C3AED" : "#5B21B6"}
          emissiveIntensity={hovered ? 0.5 : 0.3}
          roughness={0.5}
        />
      </mesh>

      {/* Secondary canopy layers */}
      <mesh position={[0.8, 1.8, 0]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial
          color={hovered ? "#8B5CF6" : "#A78BFA"}
          emissive={hovered ? "#7C3AED" : "#6D28D9"}
          emissiveIntensity={hovered ? 0.4 : 0.2}
          roughness={0.6}
        />
      </mesh>

      <mesh position={[-0.8, 1.8, 0]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial
          color={hovered ? "#8B5CF6" : "#A78BFA"}
          emissive={hovered ? "#7C3AED" : "#6D28D9"}
          emissiveIntensity={hovered ? 0.4 : 0.2}
          roughness={0.6}
        />
      </mesh>

      <mesh position={[0, 1.5, 0.8]}>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshStandardMaterial
          color={hovered ? "#A78BFA" : "#C4B5FD"}
          emissive={hovered ? "#8B5CF6" : "#7C3AED"}
          emissiveIntensity={hovered ? 0.3 : 0.15}
          roughness={0.6}
        />
      </mesh>

      <mesh position={[0, 1.5, -0.8]}>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshStandardMaterial
          color={hovered ? "#A78BFA" : "#C4B5FD"}
          emissive={hovered ? "#8B5CF6" : "#7C3AED"}
          emissiveIntensity={hovered ? 0.3 : 0.15}
          roughness={0.6}
        />
      </mesh>

      {/* Glowing particles around tree */}
      {hovered && (
        <>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 2.5;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  2 + Math.sin(i * 0.5) * 0.5,
                  Math.sin(angle) * radius,
                ]}
              >
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial
                  color="#FCD34D"
                  emissive="#FCD34D"
                  emissiveIntensity={1}
                />
              </mesh>
            );
          })}
        </>
      )}

      {/* Glow effect when hovered */}
      {hovered && (
        <pointLight
          position={[0, 2, 0]}
          color="#A78BFA"
          intensity={3}
          distance={8}
        />
      )}
    </group>
  );
}
