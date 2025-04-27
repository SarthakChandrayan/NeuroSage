'use client'

import { useEffect, useRef } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { PerspectiveCamera, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

// Extend Three.js with necessary components
extend({ PerspectiveCamera })

function Page({ position, rotation, texture }: any) {
  return (
    <mesh 
      castShadow 
      receiveShadow
      position={position} 
      rotation={rotation}
    >
      <planeGeometry args={[3.5, 4.5]} />
      <meshPhysicalMaterial
        map={texture}
        transparent
        opacity={0.95}
        clearcoat={0.3}
        clearcoatRoughness={0.3}
        roughness={0.4}
        metalness={0.1}
        envMapIntensity={1.5}
      />
    </mesh>
  )
}

function PDFModel() {
  const { scene } = useThree()
  const [texture] = useTexture(['/dashboard-preview.jpg'])
  const modelRef = useRef<THREE.Group>(null)
  
  useEffect(() => {
    if (!modelRef.current) return
    
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1,
      defaults: { duration: 3, ease: 'power2.inOut' }
    })
    
    // Initial state
    gsap.set(modelRef.current.rotation, { y: 0, x: 0, z: 0 })
    
    // Sequence of rotations
    tl.to(modelRef.current.rotation, {
      y: Math.PI * 0.03,
      x: Math.PI * -0.02,
      duration: 2.5
    })
    .to(modelRef.current.rotation, {
      y: Math.PI * -0.03,
      x: Math.PI * 0.02,
      duration: 2.5
    })
    .to(modelRef.current.rotation, {
      z: Math.PI * 0.01,
      duration: 1.5
    }, "-=1")
    .to(modelRef.current.rotation, {
      y: 0,
      x: 0,
      z: 0,
      duration: 2.5
    })
    
    // Continuous subtle floating movement
    gsap.to(modelRef.current.position, {
      y: '+=0.15',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })
    
    return () => {
      tl.kill()
    }
  }, [])
  
  return (
    <group ref={modelRef} position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
      <Page position={[0, 0, 0]} rotation={[0, 0, 0]} texture={texture} />
    </group>
  )
}

export default function PDFPreview3D() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.5], fov: 40 }}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    >
      <color attach="background" args={['transparent']} />
      <ambientLight intensity={0.8} />
      <directionalLight
        castShadow
        position={[2.5, 8, 5]}
        intensity={1.5}
        shadow-mapSize={1024}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10]} />
      </directionalLight>
      <PDFModel />
    </Canvas>
  )
} 