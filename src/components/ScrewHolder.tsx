import { useRef } from 'react'
import { useStore } from '../stores/gameStore'

interface ScrewHolderProps {
  holder: {
    id: string
    type: string
    color: string
    matched: boolean
  }
}

const screwTypeIcons: Record<string, string> = {
  phillips: '✕',
  flathead: '—',
  allen: '⬡'
}

const screwColors: Record<string, string> = {
  red: '#ff0000',
  blue: '#0000ff',
  green: '#00ff00',
  yellow: '#ffff00'
}

export function ScrewHolder({ holder }: ScrewHolderProps) {
  const { matchScrew } = useStore()
  const meshRef = useRef<THREE.Mesh>(null)

  const handleScrewMatch = () => {
    if (!holder.matched) {
      matchScrew(holder.id)
    }
  }

  return (
    <group position={[0, 2, 0]}>
      <mesh
        ref={meshRef}
        onClick={handleScrewMatch}
        onPointerDown={handleScrewMatch}
      >
        <boxGeometry args={[0.8, 0.2, 0.8]} />
        <meshStandardMaterial 
          color={holder.matched ? '#666666' : '#333333'}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      
      {/* Screw slots */}
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          position={[index * 0.3 - 0.3, 0.1, 0]}
          onClick={handleScrewMatch}
          onPointerDown={handleScrewMatch}
        >
          <cylinderGeometry args={[0.1, 0.1, 0.1, 32]} />
          <meshStandardMaterial 
            color={holder.matched ? screwColors[holder.color] : '#666666'}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      
      {/* Screw type indicator */}
      <mesh position={[0, 0.2, 0]}>
        <planeGeometry args={[0.6, 0.1]} />
        <meshBasicMaterial color={screwColors[holder.color]}>
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
                {screwTypeIcons[holder.type]}
              </text>
            </canvas>
          </canvasTexture>
        </meshBasicMaterial>
      </mesh>
    </group>
  )
} 