import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import { PuzzlePiece } from './PuzzlePiece'
import { ScrewHolder } from './ScrewHolder'
import { useGameStore } from '../stores/gameStore'

export function Game() {
  const { 
    screws, 
    screwHolders, 
    selectedScrew, 
    setSelectedScrew, 
    matchScrew 
  } = useGameStore()

  return (
    <div className="w-full h-screen">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          {/* Screw holders */}
          {screwHolders.map((holder) => (
            <ScrewHolder
              key={holder.id}
              holder={holder}
              onScrewMatch={(screwId) => matchScrew(screwId, holder.id)}
            />
          ))}
          
          {/* Screws */}
          {screws.map((screw, index) => (
            <PuzzlePiece
              key={index}
              piece={screw}
              isSelected={selectedScrew === index}
              onSelect={() => setSelectedScrew(index)}
            />
          ))}
          
          {/* Controls */}
          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={10}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  )
} 