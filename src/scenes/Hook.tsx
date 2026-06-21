import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useCurrentFrame, Easing } from 'remotion';
import * as THREE from 'three';

const EarthSphere: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  const frame = useCurrentFrame();
  const fps = 30;
  const totalFrames = 150;
  const progress = frame / totalFrames;

  // Easing: fast at start, decelerate at end
  const easedProgress = Easing.bezier(0.25, 0.46, 0.45, 0.94)(progress);

  // Camera zoom: starts far (orbital), ends tight (ocean zoom)
  const cameraDistance = THREE.MathUtils.lerp(8, 0.5, easedProgress);
  const cameraHeight = THREE.MathUtils.lerp(3, 0, easedProgress);

  useFrame((state) => {
    state.camera.position.set(0, cameraHeight, cameraDistance);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <mesh ref={meshRef} rotation={[0.1, 0.5, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshPhongMaterial
          color={0x1e90ff}
          emissive={0x0a2f51}
          shininess={5}
          wireframe={false}
        />
      </mesh>
      <directionalLight position={[5, 3, 5]} intensity={1.5} color={0xffffff} />
      <ambientLight intensity={0.3} />
    </>
  );
};

export const Hook: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 3, 8], fov: 45 }}>
      <color attach="background" args={['#000']} />
      <EarthSphere />
    </Canvas>
  );
};
