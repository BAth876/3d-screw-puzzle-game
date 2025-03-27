import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion-3d'
import { ScrewHolder as ScrewHolderType, ScrewType, ScrewColor } from '../stores/gameStore'

interface ScrewHolderProps {
  holder: ScrewHolderType
  onScrewMatch: (screwId: number) => void
}

const screwTypeIcons: Record<ScrewType, string> = {
  phillips: '✕',
  flathead: '—',
  allen: '⬡'
}

const screwColors: Record<ScrewColor, string> = {
  red: '#ff0000',
  blue: '#0000ff',
  green: '#00ff00',
  yellow: '#ffff00'
}

export function ScrewHolder({ holder, onScrewMatch }: ScrewHolderProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  return (
    <motion.group position={holder.position}>
      {/* Holder base */}
      <mesh>
        <boxGeometry args={[2, 0.2, 2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Screw slots */}
      {holder.requiredScrews.map((required, index) => {
        const isMatched = holder.matchedScrews.includes(index)
        const x = (index - 1) * 0.5 // Space screws evenly
        
        return (
          <motion.group key={index} position={[x, 0.1, 0]}>
            {/* Screw slot */}
            <mesh>
              <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
              <meshStandardMaterial 
                color={isMatched ? screwColors[required.color] : '#666666'}
                metalness={0.5}
                roughness={0.5}
              />
            </mesh>
            
            {/* Screw type indicator */}
            <mesh position={[0, 0.2, 0]}>
              <planeGeometry args={[0.3, 0.3]} />
              <meshBasicMaterial color={screwColors[required.color]}>
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
                      {screwTypeIcons[required.type]}
                    </text>
                  </canvas>
                </canvasTexture>
              </meshBasicMaterial>
            </mesh>
          </motion.group>
        )
      })}
    </motion.group>
  )
} 