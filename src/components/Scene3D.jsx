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
          color="#116466"
          wireframe
          transparent
          opacity={0.65}
          emissive="#116466"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.9, 3]} />
        <meshStandardMaterial
          color="#FFCB9A"
          emissive="#D9B08C"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.7}
        />
      </mesh>
    </group>
  );
}

function Rings() {
  const group = useRef();

  useFrame((state, delta) => {
    group.current.rotation.z += delta * 0.18;
  });

  const rings = useMemo(
    () => [
      { radius: 2.6, color: '#D9B08C' },
      { radius: 3.3, color: '#FFCB9A' },
      { radius: 4.0, color: '#D1E8E2' },
    ],
    [],
  );

  return (
    <group ref={group}>
      {rings.map((ring) => (
        <mesh key={ring.radius} rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[ring.radius, 0.009, 8, 128]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function StarField() {
  const count = 800;
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
        size={0.022}
        color="#D1E8E2"
        transparent
        opacity={0.75}
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
      <ambientLight intensity={0.75} />
      <pointLight position={[5, 5, 5]} intensity={35} color="#FFCB9A" />
      <pointLight position={[-5, -3, 2]} intensity={25} color="#116466" />
      <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1.1}>
        <Core />
      </Float>
      <Rings />
      <StarField />
      <Sparkles count={100} scale={9} size={2.5} speed={0.3} color="#FFCB9A" opacity={0.65} />
    </Canvas>
  );
}
