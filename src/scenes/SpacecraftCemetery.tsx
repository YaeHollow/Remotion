import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useCurrentFrame, Easing } from 'remotion';
import * as THREE from 'three';

const SatelliteModel: React.FC = () => {
  return (
    <group>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[0.4, 0.2, 0.2]} />
        <meshStandardMaterial color={0x888888} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Solar panels */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.3]} />
        <meshStandardMaterial color={0x1a1aff} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.3]} />
        <meshStandardMaterial color={0x1a1aff} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0.2, 0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color={0xcccccc} />
      </mesh>
    </group>
  );
};

const ParticleTrail: React.FC<{ satelliteY: number }> = ({ satelliteY }) => {
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const y = satelliteY + (i / particleCount) * 0.5;
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 0.1 + (i / particleCount) * 0.3;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  return (
    <points>
      <primitive object={geometry} attach="geometry" />
      <pointsMaterial size={0.05} color={0xff6b6b} sizeAttenuation transparent />
    </points>
  );
};

const WireframeFloor: React.FC = () => {
  const positions = [];
  const size = 10;
  const spacing = 0.5;

  for (let x = -size; x <= size; x += spacing) {
    positions.push([x, -5, -size], [x, -5, size]);
  }
  for (let z = -size; z <= size; z += spacing) {
    positions.push([-size, -5, z], [size, -5, z]);
  }

  return (
    <mesh position={[0, -5, 0]}>
      <planeGeometry args={[size * 2, size * 2]} />
      <meshStandardMaterial color={0x003300} wireframe />
    </mesh>
  );
};

const Scene4Content: React.FC = () => {
  const frame = useCurrentFrame();
  const totalFrames = 450;
  const progress = frame / totalFrames;

  // Satellite falls from above
  const satelliteY = THREE.MathUtils.lerp(3, -4.5, progress);

  // Slight rotation during fall
  const rotation = progress * Math.PI * 0.5;

  return (
    <>
      <group position={[0, satelliteY, 0]} rotation={[rotation, rotation, 0]}>
        <SatelliteModel />
      </group>
      <ParticleTrail satelliteY={satelliteY} />
      <WireframeFloor />
      <fog attach="fog" args={['#000', 0.1, 15]} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <ambientLight intensity={0.3} />
    </>
  );
};

export const SpacecraftCemetery: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
      <color attach="background" args={['#000']} />
      <Scene4Content />
    </Canvas>
  );
};
