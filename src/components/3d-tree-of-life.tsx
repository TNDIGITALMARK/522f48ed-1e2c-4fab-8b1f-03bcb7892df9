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
  const canopyRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  // Hay Day-style gentle floating and swaying animation
  useFrame((state) => {
    if (treeRef.current) {
      // Gentle rotation - tree slowly turns
      treeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;

      // Subtle floating motion
      treeRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
    }

    // Canopy sway animation - like wind blowing
    if (canopyRef.current) {
      canopyRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.05;
      canopyRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 0.4) * 0.02;
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
      {/* Root System - Natural organic roots extending downward */}
      <group position={[0, -0.5, 0]}>
        {/* Main central taproot */}
        <mesh castShadow>
          <cylinderGeometry args={[0.25, 0.15, 1.2, 8]} />
          <meshStandardMaterial
            color={hovered ? "#5D4129" : "#6B4423"}
            roughness={0.95}
            metalness={0}
          />
        </mesh>

        {/* Primary root branches - 3 major roots extending outward */}
        {/* Root 1 - Front right with curves */}
        <group position={[0.3, -0.3, 0.3]} rotation={[0, 0, -0.4]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.1, 1.0, 8]} />
            <meshStandardMaterial color="#6B4423" roughness={0.95} />
          </mesh>
          {/* Secondary branch */}
          <group position={[0.25, -0.4, 0]} rotation={[0, 0, -0.3]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.05, 0.7, 6]} />
              <meshStandardMaterial color="#7D5A3C" roughness={0.95} />
            </mesh>
          </group>
        </group>

        {/* Root 2 - Front left with curves */}
        <group position={[-0.3, -0.3, 0.3]} rotation={[0, 0, 0.4]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.1, 1.0, 8]} />
            <meshStandardMaterial color="#6B4423" roughness={0.95} />
          </mesh>
          {/* Secondary branch */}
          <group position={[-0.25, -0.4, 0]} rotation={[0, 0, 0.3]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.05, 0.7, 6]} />
              <meshStandardMaterial color="#7D5A3C" roughness={0.95} />
            </mesh>
          </group>
        </group>

        {/* Root 3 - Back with curves */}
        <group position={[0, -0.3, -0.3]} rotation={[0.4, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.1, 0.9, 8]} />
            <meshStandardMaterial color="#6B4423" roughness={0.95} />
          </mesh>
        </group>

        {/* Additional smaller root branches for naturalistic look */}
        {/* Small root 1 */}
        <group position={[0.2, -0.2, -0.2]} rotation={[0.3, 0.3, -0.3]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.04, 0.6, 6]} />
            <meshStandardMaterial color="#7D5A3C" roughness={0.95} />
          </mesh>
        </group>

        {/* Small root 2 */}
        <group position={[-0.2, -0.2, -0.2]} rotation={[0.3, -0.3, 0.3]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.04, 0.6, 6]} />
            <meshStandardMaterial color="#7D5A3C" roughness={0.95} />
          </mesh>
        </group>

        {/* Small root 3 - side detail */}
        <group position={[0.4, -0.1, 0]} rotation={[0, 0, -0.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.06, 0.03, 0.5, 6]} />
            <meshStandardMaterial color="#7D5A3C" roughness={0.95} />
          </mesh>
        </group>

        {/* Small root 4 - side detail */}
        <group position={[-0.4, -0.1, 0]} rotation={[0, 0, 0.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.06, 0.03, 0.5, 6]} />
            <meshStandardMaterial color="#7D5A3C" roughness={0.95} />
          </mesh>
        </group>

        {/* Tertiary thin roots for detail */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 0.35;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;

          return (
            <group
              key={`thin-root-${i}`}
              position={[x, -0.15, z]}
              rotation={[
                Math.sin(angle) * 0.4,
                angle,
                Math.cos(angle) * 0.5
              ]}
            >
              <mesh castShadow>
                <cylinderGeometry args={[0.04, 0.02, 0.5, 5]} />
                <meshStandardMaterial
                  color="#8D6E4F"
                  roughness={0.95}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Tree trunk - Hay Day style with texture depth */}
      <group position={[0, 0.8, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.35, 0.5, 2.5, 12]} />
          <meshStandardMaterial
            color={hovered ? "#6B4423" : "#7D5A3C"}
            roughness={0.9}
            metalness={0}
          />
        </mesh>

        {/* Bark texture highlights */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.36, 0.51, 2, 12]} />
          <meshStandardMaterial
            color="#5D4129"
            roughness={0.95}
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Tree knots/details */}
        <mesh position={[0.25, 0.5, 0]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#6B4423" roughness={0.9} />
        </mesh>
        <mesh position={[-0.2, -0.3, 0.2]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#6B4423" roughness={0.9} />
        </mesh>
      </group>

      {/* Canopy group with animation */}
      <group ref={canopyRef} position={[0, 2.5, 0]}>
        {/* Main central canopy - large purple sphere */}
        <mesh castShadow>
          <sphereGeometry args={[1.8, 24, 24]} />
          <meshStandardMaterial
            color={hovered ? "#7C3AED" : "#8B5CF6"}
            emissive={hovered ? "#7C3AED" : "#6D28D9"}
            emissiveIntensity={hovered ? 0.6 : 0.4}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>

        {/* Secondary canopy layers - create depth */}
        <mesh position={[1.2, -0.3, 0.2]} castShadow>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshStandardMaterial
            color={hovered ? "#8B5CF6" : "#A78BFA"}
            emissive={hovered ? "#7C3AED" : "#6D28D9"}
            emissiveIntensity={hovered ? 0.5 : 0.3}
            roughness={0.65}
            metalness={0.05}
          />
        </mesh>

        <mesh position={[-1.2, -0.3, -0.2]} castShadow>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshStandardMaterial
            color={hovered ? "#8B5CF6" : "#A78BFA"}
            emissive={hovered ? "#7C3AED" : "#6D28D9"}
            emissiveIntensity={hovered ? 0.5 : 0.3}
            roughness={0.65}
            metalness={0.05}
          />
        </mesh>

        <mesh position={[0, -0.2, 1.2]} castShadow>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color={hovered ? "#A78BFA" : "#C4B5FD"}
            emissive={hovered ? "#8B5CF6" : "#7C3AED"}
            emissiveIntensity={hovered ? 0.4 : 0.25}
            roughness={0.7}
          />
        </mesh>

        <mesh position={[0, -0.2, -1.2]} castShadow>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color={hovered ? "#A78BFA" : "#C4B5FD"}
            emissive={hovered ? "#8B5CF6" : "#7C3AED"}
            emissiveIntensity={hovered ? 0.4 : 0.25}
            roughness={0.7}
          />
        </mesh>

        {/* Smaller accent canopy pieces */}
        <mesh position={[0.8, 0.5, 0.8]} castShadow>
          <sphereGeometry args={[0.7, 12, 12]} />
          <meshStandardMaterial
            color={hovered ? "#C4B5FD" : "#DDD6FE"}
            emissive={hovered ? "#A78BFA" : "#8B5CF6"}
            emissiveIntensity={hovered ? 0.3 : 0.2}
            roughness={0.65}
          />
        </mesh>

        <mesh position={[-0.8, 0.5, -0.8]} castShadow>
          <sphereGeometry args={[0.7, 12, 12]} />
          <meshStandardMaterial
            color={hovered ? "#C4B5FD" : "#DDD6FE"}
            emissive={hovered ? "#A78BFA" : "#8B5CF6"}
            emissiveIntensity={hovered ? 0.3 : 0.2}
            roughness={0.65}
          />
        </mesh>

        <mesh position={[0.8, 0.5, -0.8]} castShadow>
          <sphereGeometry args={[0.6, 12, 12]} />
          <meshStandardMaterial
            color={hovered ? "#C4B5FD" : "#DDD6FE"}
            emissive={hovered ? "#A78BFA" : "#8B5CF6"}
            emissiveIntensity={hovered ? 0.3 : 0.2}
            roughness={0.65}
          />
        </mesh>

        <mesh position={[-0.8, 0.5, 0.8]} castShadow>
          <sphereGeometry args={[0.6, 12, 12]} />
          <meshStandardMaterial
            color={hovered ? "#C4B5FD" : "#DDD6FE"}
            emissive={hovered ? "#A78BFA" : "#8B5CF6"}
            emissiveIntensity={hovered ? 0.3 : 0.2}
            roughness={0.65}
          />
        </mesh>
      </group>

      {/* Magical glowing particles around tree - Hay Day sparkle effect */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const radius = 2.8;
        const height = 2.5 + Math.sin(i * 0.8) * 0.8;

        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius,
            ]}
          >
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial
              color="#FDE047"
              emissive="#FDE047"
              emissiveIntensity={hovered ? 1.5 : 1}
              transparent
              opacity={hovered ? 1 : 0.8}
            />
          </mesh>
        );
      })}

      {/* Magical fireflies/sparkles that float around when hovered */}
      {hovered && (
        <>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2 + Date.now() * 0.0005;
            const radius = 3.5;
            const height = 2 + Math.sin(Date.now() * 0.001 + i) * 1.5;

            return (
              <mesh
                key={`firefly-${i}`}
                position={[
                  Math.cos(angle) * radius,
                  height,
                  Math.sin(angle) * radius,
                ]}
              >
                <sphereGeometry args={[0.08, 6, 6]} />
                <meshStandardMaterial
                  color="#FCD34D"
                  emissive="#FCD34D"
                  emissiveIntensity={2}
                  transparent
                  opacity={0.9}
                />
              </mesh>
            );
          })}
        </>
      )}

      {/* Glow effect when hovered - magical aura */}
      {hovered && (
        <>
          <pointLight
            position={[0, 2.5, 0]}
            color="#A78BFA"
            intensity={4}
            distance={10}
          />
          <pointLight
            position={[0, 1.5, 0]}
            color="#FDE047"
            intensity={2}
            distance={6}
          />
        </>
      )}

      {/* Ground glow beneath tree */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial
          color={hovered ? "#E1BEE7" : "#F3E5F5"}
          emissive={hovered ? "#CE93D8" : "#BA68C8"}
          emissiveIntensity={hovered ? 0.4 : 0.2}
          transparent
          opacity={0.6}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}
