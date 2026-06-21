import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useCurrentFrame, Easing, AbsoluteFill, interpolate } from 'remotion';
import * as THREE from 'three';

const EarthSphere: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} rotation={[0.1, 0.5, 0]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshPhongMaterial
        color={0x1e90ff}
        emissive={0x0a2f51}
        shininess={5}
      />
    </mesh>
  );
};

const Scene6Content: React.FC<{ canvasOpacity: number }> = ({ canvasOpacity }) => {
  const frame = useCurrentFrame();
  const totalFrames = 300;
  const progress = frame / totalFrames;

  // Reverse zoom: start tight (ocean), end far (orbital)
  const easedProgress = Easing.bezier(0.25, 0.46, 0.45, 0.94)(progress);
  const cameraDistance = THREE.MathUtils.lerp(0.5, 8, easedProgress);
  const cameraHeight = THREE.MathUtils.lerp(0, 3, easedProgress);

  useFrame((state) => {
    state.camera.position.set(0, cameraHeight, cameraDistance);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <EarthSphere />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color={0xffffff} />
      <ambientLight intensity={0.3} />
    </>
  );
};

const MapOverlay: React.FC<{ opacity: number }> = ({ opacity }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `rgba(0, 0, 0, ${1 - opacity})`,
        opacity,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1a3a52 0%, #0d1f2d 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 2D world map representation */}
        <svg width="800" height="600" viewBox="0 0 1200 800">
          {/* Simplified world continents */}
          <rect x="0" y="0" width="1200" height="800" fill="#0a1a2d" />

          {/* Point Nemo marker */}
          <circle cx="600" cy="400" r="15" fill="none" stroke="#ff00ff" strokeWidth="3" />
          <circle
            cx="600"
            cy="400"
            r="10"
            fill="#ff00ff"
            opacity={Math.sin((new Date().getTime() / 200) % Math.PI) * 0.5 + 0.5}
          />

          {/* Text label */}
          <text
            x="600"
            y="450"
            textAnchor="middle"
            fontSize="28"
            fill="#ffff00"
            fontWeight="bold"
          >
            Point Nemo
          </text>
        </svg>

        {/* Card text */}
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '48px',
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
            background: 'rgba(0,0,0,0.7)',
            padding: '30px 60px',
            borderRadius: '8px',
            maxWidth: '600px',
          }}
        >
          Closer to space than to land.
        </div>
      </div>
    </div>
  );
};

export const Closer: React.FC = () => {
  const frame = useCurrentFrame();
  const totalFrames = 300;
  const progress = frame / totalFrames;

  // Crossfade: 3D sphere fades out, 2D map fades in
  const canvasOpacity = Math.max(1 - progress, 0);
  const mapOpacity = Math.min(progress, 1);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
      }}
    >
      <div style={{ opacity: canvasOpacity, width: '100%', height: '100%' }}>
        <Canvas camera={{ position: [0, 3, 8], fov: 45 }}>
          <color attach="background" args={['#000']} />
          <Scene6Content canvasOpacity={canvasOpacity} />
        </Canvas>
      </div>
      <MapOverlay opacity={mapOpacity} />
    </AbsoluteFill>
  );
};
