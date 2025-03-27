import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion-3d'
import { Screw } from '../stores/gameStore'

interface PuzzlePieceProps {
  piece: Screw
  isSelected: boolean
  onSelect: () => void
}

const screwColors: Record<string, string> = {
  red: '#ff0000',
  blue: '#0000ff',
  green: '#00ff00',
  yellow: '#ffff00'
}

export function PuzzlePiece({ piece, isSelected, onSelect }: PuzzlePieceProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const rotationRef = useRef(0)
  
  useFrame((state, delta) => {
    if (isSelected && piece.screwProgress > 0) {
      rotationRef.current += delta * 2
      if (meshRef.current) {
        meshRef.current.rotation.z = rotationRef.current
      }
    }
  })

  return (
    <motion.group
      position={piece.position}
      rotation={piece.rotation}
      animate={{
        scale: isSelected ? 1.2 : 1,
        y: isSelected ? 0.2 : 0
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerDown={onSelect}
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
        <meshBasicMaterial color={screwColors[piece.color]}>
          <canvasTexture attach="map" args={[64, 64]}>
            <canvas>
              <text
                x="32"
                y="32"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="24"
              >
                {piece.type === 'phillips' ? '✕' : piece.type === 'flathead' ? '—' : '⬡'}
              </text>
            </canvas>
          </canvasTexture>
        </meshBasicMaterial>
      </mesh>
    </motion.group>
  )
} 