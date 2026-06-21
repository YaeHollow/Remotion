import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';
import { useCurrentFrame, Easing, AbsoluteFill } from 'remotion';
import * as THREE from 'three';

const IslandIcon: React.FC<{ position: [number, number, number] }> = ({
  position,
}) => {
  return (
    <group position={position}>
      <mesh>
        <tetrahedronGeometry args={[0.3]} />
        <meshStandardMaterial
          color={0x90ee90}
          emissive={0x00aa00}
          flatShading
        />
      </mesh>
    </group>
  );
};

const TriangleFrame: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const frame = useCurrentFrame();
  const totalFrames = 450;

  // One rotation over 15 seconds = 450 frames
  const rotation = (frame / totalFrames) * Math.PI * 2;

  // Camera orbits slightly
  const cameraAngle = (frame / totalFrames) * Math.PI * 0.5;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation;
    }
    state.camera.position.x = Math.sin(cameraAngle) * 3;
    state.camera.position.z = Math.cos(cameraAngle) * 3 + 2;
    state.camera.lookAt(0, 0, 0);
  });

  // Triangle vertices (exploded view)
  const v1: [number, number, number] = [2, 1, 0];
  const v2: [number, number, number] = [-2, 1, 0];
  const v3: [number, number, number] = [0, -2, 0];
  const center: [number, number, number] = [0, 0, 0];

  return (
    <group ref={groupRef}>
      <IslandIcon position={v1} />
      <IslandIcon position={v2} />
      <IslandIcon position={v3} />

      {/* Glowing edges */}
      <Line
        points={[v1, v2]}
        color={0x00ff00}
        lineWidth={3}
      />
      <Line
        points={[v2, v3]}
        color={0x00ff00}
        lineWidth={3}
      />
      <Line
        points={[v3, v1]}
        color={0x00ff00}
        lineWidth={3}
      />

      {/* Center point */}
      <mesh position={center}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={0xffff00} emissive={0xffff00} />
      </mesh>
    </group>
  );
};

const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const frameThreshold = 200;
  const opacity = frame > frameThreshold ? Math.min((frame - frameThreshold) / 30, 1) : 0;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 32,
        color: '#fff',
        fontWeight: 'bold',
        opacity,
        transition: 'opacity 0.1s',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.5)',
        padding: '20px 40px',
        borderRadius: '8px',
      }}
    >
      Calculated in 1992 via GIS
    </div>
  );
};

export const TriangleDiagram: React.FC = () => {
  return (
    <>
      <AbsoluteFill>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <color attach="background" args={['#0a0a1a']} />
          <TriangleFrame />
          <directionalLight position={[5, 3, 5]} intensity={1.2} />
          <ambientLight intensity={0.5} />
        </Canvas>
      </AbsoluteFill>
      <TitleCard />
    </>
  );
};
