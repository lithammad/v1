import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Core() {
  const group = useRef();

  useFrame((state, delta) => {
    group.current.rotation.y += delta * 0.15;
    group.current.rotation.x += delta * 0.05;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial
          color="#6366f1"
          wireframe
          transparent
          opacity={0.55}
          emissive="#6366f1"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.9, 3]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.9}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}

function Rings() {
  const group = useRef();

  useFrame((state, delta) => {
    group.current.rotation.z += delta * 0.2;
  });

  const rings = useMemo(
    () => [
      { radius: 2.6, color: '#10b981' },
      { radius: 3.3, color: '#6366f1' },
      { radius: 4.0, color: '#8b5cf6' },
    ],
    [],
  );

  return (
    <group ref={group}>
      {rings.map((ring) => (
        <mesh key={ring.radius} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[ring.radius, 0.008, 8, 128]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function StarField() {
  const count = 900;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#a5b4fc"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 55 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={40} color="#6366f1" />
      <pointLight position={[-5, -3, 2]} intensity={30} color="#8b5cf6" />
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
        <Core />
      </Float>
      <Rings />
      <StarField />
      <Sparkles count={120} scale={9} size={2.2} speed={0.35} color="#a5b4fc" opacity={0.6} />
    </Canvas>
  );
}
