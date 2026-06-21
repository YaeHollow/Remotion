import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useCurrentFrame } from 'remotion';
import * as THREE from 'three';

const OceanPlane: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const frame = useCurrentFrame();

  useFrame(() => {
    if (meshRef.current) {
      const geometry = meshRef.current.geometry as THREE.BufferGeometry;
      const positionAttribute = geometry.getAttribute('position');
      const positions = positionAttribute.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        const originalY = 0;

        // Simple sine wave using time
        const wave =
          Math.sin(x * 0.3 + frame * 0.02) *
          Math.cos(z * 0.3 + frame * 0.01) *
          0.1;
        positions[i + 1] = originalY + wave;
      }
      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[30, 30, 100, 100]} />
      <meshPhongMaterial
        color={0x0a3d62}
        emissive={0x052d3d}
        flatShading={false}
        wireframe={false}
      />
    </mesh>
  );
};

const Fish: React.FC<{ position: [number, number, number]; speed: number }> = ({
  position,
  speed,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const frame = useCurrentFrame();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x =
        position[0] + Math.sin(frame * speed * 0.01) * 2;
      groupRef.current.position.z =
        position[2] + frame * speed * 0.002;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Simple fish shape */}
      <mesh scale={0.3}>
        <boxGeometry args={[1, 0.3, 0.5]} />
        <meshStandardMaterial color={0x4a90e2} emissive={0x1a5fd9} />
      </mesh>
      {/* Tail */}
      <mesh position={[0.6, 0, 0]}>
        <tetrahedronGeometry args={[0.2]} />
        <meshStandardMaterial color={0x357abd} />
      </mesh>
    </group>
  );
};

const SparseParticles: React.FC = () => {
  const particleCount = 12;
  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let i = 0; i < particleCount; i++) {
      pos.push([
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 20,
      ]);
    }
    return pos;
  }, []);

  return (
    <>
      {positions.map((pos, idx) => (
        <Fish key={idx} position={pos} speed={0.3 + Math.random() * 0.3} />
      ))}
    </>
  );
};

const CameraController: React.FC = () => {
  const frame = useCurrentFrame();
  const totalFrames = 300;

  useFrame((state) => {
    const progress = frame / totalFrames;
    // Slow pan just above surface
    state.camera.position.x = Math.sin(progress * Math.PI * 2) * 3;
    state.camera.position.y = 0.5 + Math.sin(progress * Math.PI) * 0.3;
    state.camera.position.z = 5 - progress * 2;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
};

export const SparseOcean: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0.5, 5], fov: 60 }}>
      <color attach="background" args={['#0a1a2a']} />
      <OceanPlane />
      <SparseParticles />
      <CameraController />
      <fog attach="fog" args={['#0a1a2a', 5, 30]} />
      <ambientLight intensity={0.4} color={0x88ccff} />
      <directionalLight position={[10, 5, 5]} intensity={0.6} />
    </Canvas>
  );
};
