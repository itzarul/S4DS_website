import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Decal, useTexture, Float } from '@react-three/drei';
import * as THREE from 'three';

function CoinLogo() {
  const groupRef = useRef();
  
  // Load the transparent logo PNG
  const logoTexture = useTexture('/logo.png');
  logoTexture.colorSpace = THREE.SRGBColorSpace;
  logoTexture.minFilter = THREE.LinearMipMapLinearFilter;
  logoTexture.magFilter = THREE.LinearFilter;
  logoTexture.anisotropy = 16;

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3; // Very smooth, slow spin
    }
  });

  // 150 ultra-tight layers creates a flawless solid 3D geometry illusion, 
  // and works perfectly with an Orthographic camera to eliminate perspective distortion
  const layers = Array.from({ length: 150 });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.5}>
      <group ref={groupRef}>
        {layers.map((_, i) => (
          <mesh key={i} position={[0, 0, (i - 75) * 0.001]} castShadow receiveShadow>
            <planeGeometry args={[7, 7]} />
            <meshPhysicalMaterial
              map={logoTexture}
              transparent={true}
              alphaTest={0.5} // Crisp cut-off creates hard edges like solid metal
              metalness={0.8}
              roughness={0.1}
              clearcoat={1.0} // Gives it a highly polished automotive/chrome finish
              clearcoatRoughness={0.1}
              envMapIntensity={3}
              side={THREE.DoubleSide}
              depthWrite={true}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export default function ThreeDLogo({ className = "w-full h-full absolute inset-0 z-0 opacity-40 pointer-events-none flex items-center justify-center" }) {
  return (
    <div className={className}>
      <Canvas orthographic camera={{ position: [0, 0, 10], zoom: 60 }} gl={{ antialias: true, alpha: true }} style={{ width: '100vw', height: '100vh' }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={3.5} />
        <directionalLight position={[-10, -10, 5]} intensity={2.5} color="#3585f6" />
        
        <CoinLogo />
        
        {/* Environment map gives it the incredibly realistic metallic chrome reflections */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
