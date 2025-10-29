"use client";

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, ContactShadows } from '@react-three/drei';
import { TreeOfLife3D } from './3d-tree-of-life';
import * as THREE from 'three';

// Ground plane with Hay Day-style grass texture
function Ground() {
  const groundRef = useRef<THREE.Mesh>(null);

  return (
    <>
      {/* Main isometric-style grass ground with texture */}
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[40, 40, 128, 128]} />
        <meshStandardMaterial
          color="#7CB342"
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      {/* Center circular grass plot for the tree - lighter and elevated */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial
          color="#8BC34A"
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Darker grass patches for depth - ring pattern */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
        <ringGeometry args={[5, 15, 64]} />
        <meshStandardMaterial
          color="#689F38"
          roughness={0.85}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Outer darker grass ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]}>
        <ringGeometry args={[15, 20, 64]} />
        <meshStandardMaterial
          color="#558B2F"
          roughness={0.9}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Soft contact shadows - Hay Day style */}
      <ContactShadows
        position={[0, -0.48, 0]}
        opacity={0.4}
        scale={35}
        blur={3}
        far={15}
        color="#33691E"
      />
    </>
  );
}

// Decorative flower beds in circular pattern around tree
function FlowerBeds() {
  const bedPositions: [number, number, number][] = [
    [7, -0.3, 0],
    [-7, -0.3, 0],
    [0, -0.3, 7],
    [0, -0.3, -7],
    [5, -0.3, 5],
    [-5, -0.3, 5],
    [5, -0.3, -5],
    [-5, -0.3, -5],
  ];

  return (
    <>
      {bedPositions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Flower bed base - tilled soil */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[1.2, 1.3, 0.3, 8]} />
            <meshStandardMaterial
              color="#8D6E63"
              roughness={0.9}
            />
          </mesh>

          {/* Flowers */}
          {Array.from({ length: 5 }).map((_, j) => {
            const angle = (j / 5) * Math.PI * 2;
            const radius = 0.6;
            const flowerColors = ["#F06292", "#FDD835", "#AB47BC", "#FF7043", "#42A5F5"];

            return (
              <group key={j} position={[
                Math.cos(angle) * radius,
                0.4,
                Math.sin(angle) * radius
              ]}>
                {/* Stem */}
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.4, 6]} />
                  <meshStandardMaterial color="#558B2F" />
                </mesh>
                {/* Flower bloom */}
                <mesh position={[0, 0.3, 0]}>
                  <sphereGeometry args={[0.15, 8, 8]} />
                  <meshStandardMaterial
                    color={flowerColors[j % flowerColors.length]}
                    roughness={0.4}
                    emissive={flowerColors[j % flowerColors.length]}
                    emissiveIntensity={0.2}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}
    </>
  );
}

// Garden stones/rocks in isometric style
function GardenRocks() {
  const rocks: { pos: [number, number, number]; scale: number; rotation: number }[] = [
    { pos: [-10, -0.3, -8], scale: 1.2, rotation: 0.5 },
    { pos: [10, -0.35, -9], scale: 0.9, rotation: 1.2 },
    { pos: [-11, -0.4, 9], scale: 1.5, rotation: 0.8 },
    { pos: [9, -0.3, 10], scale: 1, rotation: 1.5 },
    { pos: [-8, -0.35, -12], scale: 0.8, rotation: 0.3 },
    { pos: [11, -0.3, 8], scale: 1.1, rotation: 2 },
  ];

  return (
    <>
      {rocks.map((rock, i) => (
        <mesh
          key={i}
          position={rock.pos}
          scale={rock.scale}
          rotation={[0, rock.rotation, 0]}
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#607D8B"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
    </>
  );
}

// Decorative shrubs around perimeter
function Shrubs() {
  const shrubPositions: [number, number, number][] = [];

  // Create shrubs around outer perimeter
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
    const radius = 13 + Math.random() * 2;
    shrubPositions.push([
      Math.cos(angle) * radius,
      -0.2,
      Math.sin(angle) * radius
    ]);
  }

  return (
    <>
      {shrubPositions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Bush base */}
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.8, 8, 8]} />
            <meshStandardMaterial
              color="#558B2F"
              roughness={0.85}
            />
          </mesh>
          {/* Bush highlights */}
          <mesh position={[0.2, 0.5, 0.2]}>
            <sphereGeometry args={[0.4, 6, 6]} />
            <meshStandardMaterial
              color="#7CB342"
              roughness={0.8}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Small decorative mushrooms
function Mushrooms() {
  const mushroomPositions: [number, number, number][] = [
    [-3, -0.4, -3],
    [4, -0.4, -4],
    [-4, -0.4, 3],
    [3, -0.4, 4],
    [-6, -0.4, -2],
    [6, -0.4, 2],
  ];

  return (
    <>
      {mushroomPositions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Stem */}
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.1, 0.08, 0.3, 8]} />
            <meshStandardMaterial color="#F5F5DC" roughness={0.7} />
          </mesh>
          {/* Cap */}
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#D32F2F" : "#FF6F00"}
              roughness={0.5}
            />
          </mesh>
          {/* White spots on cap */}
          {i % 2 === 0 && (
            <>
              <mesh position={[0.1, 0.4, 0]}>
                <sphereGeometry args={[0.04, 6, 6]} />
                <meshStandardMaterial color="#FFFFFF" />
              </mesh>
              <mesh position={[-0.08, 0.38, 0.06]}>
                <sphereGeometry args={[0.03, 6, 6]} />
                <meshStandardMaterial color="#FFFFFF" />
              </mesh>
            </>
          )}
        </group>
      ))}
    </>
  );
}

// Hay Day style fence posts
function FencePosts() {
  const fencePosts: [number, number, number][] = [];

  // Create fence posts in a circular pattern far out
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
    const radius = 18;
    fencePosts.push([
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ]);
  }

  return (
    <>
      {fencePosts.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Post */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.15, 1.5, 0.15]} />
            <meshStandardMaterial
              color="#8D6E63"
              roughness={0.9}
            />
          </mesh>
          {/* Top cap */}
          <mesh position={[0, 1.3, 0]}>
            <coneGeometry args={[0.12, 0.2, 4]} />
            <meshStandardMaterial
              color="#6D4C41"
              roughness={0.85}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Small garden shed in Hay Day style
function GardenShed() {
  return (
    <group position={[-13, 0, -13]}>
      {/* Base/walls */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[3, 2, 2.5]} />
        <meshStandardMaterial
          color="#D7CCC8"
          roughness={0.8}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <coneGeometry args={[2.2, 1.2, 4]} />
        <meshStandardMaterial
          color="#BF360C"
          roughness={0.85}
        />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.5, 1.26]}>
        <boxGeometry args={[0.7, 1.2, 0.05]} />
        <meshStandardMaterial color="#795548" />
      </mesh>

      {/* Window */}
      <mesh position={[1, 1.2, 0]}>
        <boxGeometry args={[0.05, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#81D4FA"
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.5}
        />
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
        height: 'clamp(400px, 60vh, 700px)',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        touchAction: 'none',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.15)'
      }}
    >
      <Canvas
        shadows
        camera={{
          position: [18, 14, 18],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Hay Day-style bright ambient lighting */}
          <ambientLight intensity={0.7} />

          {/* Main sun light - warm and bright */}
          <directionalLight
            position={[20, 25, 15]}
            intensity={2}
            castShadow
            shadow-mapSize={[4096, 4096]}
            shadow-camera-far={60}
            shadow-camera-left={-25}
            shadow-camera-right={25}
            shadow-camera-top={25}
            shadow-camera-bottom={-25}
            shadow-bias={-0.0001}
            color="#FFF8E1"
          />

          {/* Fill lights for soft shadows and depth */}
          <pointLight position={[-20, 10, -20]} intensity={0.5} color="#B3E5FC" />
          <pointLight position={[20, 10, 20]} intensity={0.4} color="#FFECB3" />
          <hemisphereLight
            color="#87CEEB"
            groundColor="#558B2F"
            intensity={0.6}
          />

          {/* Special magical spotlight on the central tree */}
          <spotLight
            position={[0, 20, 0]}
            angle={0.4}
            penumbra={0.6}
            intensity={1.2}
            color="#E1BEE7"
            castShadow
          />

          {/* Beautiful sky */}
          <Sky
            distance={450000}
            sunPosition={[15, 8, 10]}
            inclination={0.5}
            azimuth={0.25}
            turbidity={2}
            rayleigh={0.5}
          />

          {/* Warm environment lighting */}
          <Environment preset="sunset" />

          {/* Garden ground - the foundation */}
          <Ground />

          {/* CENTRAL TREE OF LIFE - permanently in the middle of the grass */}
          <TreeOfLife3D position={[0, 0, 0]} scale={2} />

          {/* Decorative elements in circular arrangement */}
          <FlowerBeds />
          <Mushrooms />
          <Shrubs />
          <GardenRocks />
          <FencePosts />
          <GardenShed />

          {/* Camera controls - smooth Hay Day-style camera */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={8}
            maxDistance={35}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
            target={[0, 2, 0]}
            enableDamping={true}
            dampingFactor={0.08}
            rotateSpeed={0.6}
            zoomSpeed={0.7}
            panSpeed={0.5}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN
            }}
            mouseButtons={{
              LEFT: THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.PAN
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
