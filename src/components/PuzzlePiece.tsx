import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Screw } from '../stores/gameStore'
import * as THREE from 'three'

interface PuzzlePieceProps {
  piece: Screw
  isSelected: boolean
  onSelect: () => void
  onProgress: (progress: number) => void
}

const screwColors: Record<string, string> = {
  red: '#ff0000',
  blue: '#0000ff',
  green: '#00ff00',
  yellow: '#ffff00'
}

const createScrewTypeTexture = (type: string, color: string) => {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  
  if (ctx) {
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 64, 64)
    ctx.fillStyle = 'white'
    ctx.font = '24px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      type === 'phillips' ? '✕' : type === 'flathead' ? '—' : '⬡',
      32,
      32
    )
  }
  
  return new THREE.CanvasTexture(canvas)
}

export function PuzzlePiece({ piece, isSelected, onSelect, onProgress }: PuzzlePieceProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const rotationRef = useRef(0)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  
  useEffect(() => {
    textureRef.current = createScrewTypeTexture(piece.type, screwColors[piece.color])
    return () => {
      if (textureRef.current) {
        textureRef.current.dispose()
      }
    }
  }, [piece.type, piece.color])
  
  useFrame((state, delta) => {
    if (isSelected && piece.screwProgress > 0) {
      rotationRef.current += delta * 2
      if (meshRef.current) {
        meshRef.current.rotation.z = rotationRef.current
      }
    }
  })

  return (
    <group
      position={piece.position}
      rotation={piece.rotation}
      scale={isSelected ? 1.2 : 1}
      onClick={onSelect}
      onPointerDown={onSelect}
    >
      <mesh
        ref={meshRef}
      >
        <cylinderGeometry args={[0.2, 0.2, 0.5, 32]} />
        <meshStandardMaterial 
          color={screwColors[piece.color]}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Screw head */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
        <meshStandardMaterial 
          color={screwColors[piece.color]}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Screw type indicator */}
      <mesh position={[0, 0.35, 0]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshBasicMaterial 
          map={textureRef.current}
          transparent
        />
      </mesh>
    </group>
  )
} 