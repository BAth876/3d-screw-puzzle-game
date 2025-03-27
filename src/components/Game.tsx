import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { PuzzlePiece } from './PuzzlePiece'
import { ScrewHolder } from './ScrewHolder'
import { UI } from './UI'
import { useStore } from '../stores/gameStore'

export function Game() {
  const { 
    screws, 
    screwHolders,
    selectedPiece,
    setSelectedPiece,
    updateScrewProgress
  } = useStore()

  return (
    <div className="w-full h-screen">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Screw holders */}
        {screwHolders.map((holder, index) => (
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