"use client";

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, ContactShadows } from '@react-three/drei';
import { TreeOfLife3D } from './3d-tree-of-life';
import * as THREE from 'three';

// Ground plane with grass texture - Clash of Clans style
function Ground() {
  const groundRef = useRef<THREE.Mesh>(null);

  return (
    <>
      {/* Main grass ground */}
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[30, 30, 64, 64]} />
        <meshStandardMaterial
          color="#8BC34A"
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Darker grass patches for depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
        <circleGeometry args={[12, 64]} />
        <meshStandardMaterial
          color="#7CB342"
          roughness={0.85}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Soft contact shadows */}
      <ContactShadows
        position={[0, -0.48, 0]}
        opacity={0.5}
        scale={25}
        blur={2.5}
        far={12}
        color="#558B2F"
      />
    </>
  );
}

// Decorative plants around the garden
function GardenPlants() {
  const positions: [number, number, number][] = [
    [-8, 0, -6],
    [-6, 0, 8],
    [7, 0, -7],
    [8, 0, 6],
    [-4, 0, -8],
    [5, 0, 8],
    [-9, 0, 2],
    [9, 0, -2],
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Simple flower/plant */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.6, 6]} />
            <meshStandardMaterial color="#558B2F" />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#F06292" : i % 3 === 1 ? "#FDD835" : "#AB47BC"}
              roughness={0.5}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Garden stones/rocks for decoration
function GardenRocks() {
  const rocks: { pos: [number, number, number]; scale: number }[] = [
    { pos: [-5, -0.3, -4], scale: 0.8 },
    { pos: [6, -0.35, -3], scale: 0.6 },
    { pos: [-7, -0.4, 5], scale: 1 },
    { pos: [4, -0.3, 7], scale: 0.7 },
  ];

  return (
    <>
      {rocks.map((rock, i) => (
        <mesh key={i} position={rock.pos} scale={rock.scale}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#78909C"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
    </>
  );
}

// Wooden fence around garden perimeter
function GardenFence() {
  const fencePosts: [number, number, number][] = [];

  // Create fence posts around perimeter
  for (let i = -10; i <= 10; i += 2) {
    fencePosts.push([i, 0, -10]);
    fencePosts.push([i, 0, 10]);
  }
  for (let i = -10; i <= 10; i += 2) {
    fencePosts.push([-10, 0, i]);
    fencePosts.push([10, 0, i]);
  }

  return (
    <>
      {fencePosts.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.2, 1.5, 0.2]} />
          <meshStandardMaterial color="#8D6E63" roughness={0.8} />
        </mesh>
      ))}
    </>
  );
}

// Small building/structure (optional decoration)
function GardenStructure() {
  return (
    <group position={[-7, 0, -7]}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#D7CCC8" roughness={0.7} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[1.5, 1, 4]} />
        <meshStandardMaterial color="#BF360C" roughness={0.8} />
      </mesh>
    </group>
  );
}

interface Garden3DSceneProps {
  className?: string;
}

export function Garden3DScene({ className }: Garden3DSceneProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: 'clamp(400px, 60vh, 600px)',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        touchAction: 'none'
      }}
    >
      <Canvas
        shadows
        camera={{ position: [12, 8, 12], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Enhanced Clash of Clans-style lighting */}
          <ambientLight intensity={0.6} />

          {/* Main sun light */}
          <directionalLight
            position={[15, 20, 10]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[4096, 4096]}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            color="#FFF8DC"
          />

          {/* Fill lights for soft shadows */}
          <pointLight position={[-15, 8, -15]} intensity={0.4} color="#87CEEB" />
          <pointLight position={[15, 8, 15]} intensity={0.3} color="#FFE4B5" />

          {/* Special highlight on Tree of Life */}
          <spotLight
            position={[0, 15, 0]}
            angle={0.3}
            penumbra={0.5}
            intensity={0.8}
            color="#DDA0DD"
            target-position={[0, 0, 0]}
          />

          {/* Sky and environment */}
          <Sky
            distance={450000}
            sunPosition={[10, 5, 5]}
            inclination={0.6}
            azimuth={0.25}
          />
          <Environment preset="sunset" />

          {/* Garden elements */}
          <Ground />

          {/* Central Tree of Life - the star of the show */}
          <TreeOfLife3D position={[0, 0, 0]} scale={1.5} />

          {/* Surrounding decorations */}
          <GardenPlants />
          <GardenRocks />
          <GardenFence />
          <GardenStructure />

          {/* Camera controls - optimized for mobile */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={25}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 6}
            target={[0, 1, 0]}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.8}
            zoomSpeed={0.8}
            panSpeed={0.8}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
