import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { PuzzlePiece } from './PuzzlePiece'
import { ScrewHolder } from './ScrewHolder'
import { UI } from './UI'
import { useStore } from '../stores/gameStore'

interface GameProps {
  className?: string
  style?: React.CSSProperties
}

export function Game({ className = '', style = {} }: GameProps) {
  const { 
    screws, 
    screwHolders,
    selectedPiece,
    setSelectedPiece,
    updateScrewProgress
  } = useStore()

  return (
    <div className={`relative w-full h-full ${className}`} style={style}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Screw holders */}
        {screwHolders.map((holder) => (
          <ScrewHolder
            key={holder.id}
            holder={holder}
          />
        ))}
        
        {/* Puzzle pieces */}
        {screws.map((piece) => (
          <PuzzlePiece
            key={piece.id}
            piece={piece}
            isSelected={selectedPiece?.id === piece.id}
            onSelect={() => setSelectedPiece(piece)}
            onProgress={(progress) => updateScrewProgress(piece.id, progress)}
          />
        ))}
      </Canvas>
      <UI />
    </div>
  )
} 