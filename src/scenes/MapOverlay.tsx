import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';
import { useCurrentFrame, Easing } from 'remotion';
import * as THREE from 'three';

// Convert lat/long to 3D xyz on a sphere
const latLongToXYZ = (lat: number, lon: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ] as [number, number, number];
};

// Key locations
const DUCIE_ISLAND = latLongToXYZ(-24.6728, -124.7868, 2);
const MOTU_NUI = latLongToXYZ(-27.1127, -109.3497, 2);
const MAHER_ISLAND = latLongToXYZ(-48.877, 166.2847, 2);
const POINT_NEMO = latLongToXYZ(-48.8771, 123.3923, 2);

const Globe: React.FC = () => {
  return (
    <mesh rotation={[0, 0, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhongMaterial color={0x1e90ff} emissive={0x0a2f51} />
    </mesh>
  );
};

const Pin: React.FC<{ position: [number, number, number]; label: string }> = ({
  position,
  label,
}) => {
  return (
    <group position={position}>
      <mesh>
        <coneGeometry args={[0.1, 0.4, 8]} />
        <meshStandardMaterial color={0xff6b6b} emissive={0xff0000} />
      </mesh>
      <Text position={[0, 0.5, 0]} fontSize={0.2} color={0xffffff}>
        {label}
      </Text>
    </group>
  );
};

const AnimatedLine: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  progress: number;
  label: string;
}> = ({ start, end, progress, label }) => {
  const linePoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 20;
    for (let i = 0; i <= segments * progress; i++) {
      const t = i / segments;
      const p = new THREE.Vector3().lerpVectors(
        new THREE.Vector3(...start),
        new THREE.Vector3(...end),
        t
      );
      points.push(p);
    }
    return points;
  }, [progress, start, end]);

  const midPoint = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ] as [number, number, number];

  return (
    <group>
      {linePoints.length > 1 && (
        <Line
          points={linePoints}
          color={0x00ff00}
          lineWidth={2}
          dashed
          dashScale={0.5}
        />
      )}
      {progress > 0 && (
        <Text position={midPoint} fontSize={0.15} color={0xffff00}>
          {label}
        </Text>
      )}
    </group>
  );
};

const Scene2Content: React.FC = () => {
  const frame = useCurrentFrame();
  const totalFrames = 300;
  const progress = Math.min(frame / totalFrames, 1);

  return (
    <>
      <Globe />
      <Pin position={DUCIE_ISLAND} label="Ducie" />
      <Pin position={MOTU_NUI} label="Motu Nui" />
      <Pin position={MAHER_ISLAND} label="Maher" />
      <AnimatedLine
        start={DUCIE_ISLAND}
        end={POINT_NEMO}
        progress={progress}
        label="2,688 km"
      />
      <AnimatedLine
        start={MOTU_NUI}
        end={POINT_NEMO}
        progress={Math.max(progress - 0.15, 0)}
        label="2,688 km"
      />
      <AnimatedLine
        start={MAHER_ISLAND}
        end={POINT_NEMO}
        progress={Math.max(progress - 0.3, 0)}
        label="2,688 km"
      />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <ambientLight intensity={0.4} />
    </>
  );
};

export const MapOverlay: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <color attach="background" args={['#000']} />
      <Scene2Content />
    </Canvas>
  );
};
