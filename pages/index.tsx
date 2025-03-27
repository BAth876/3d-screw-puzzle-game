import React from 'react'
import { Game } from '../src/components/Game'

export default function Home() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
        <Game className="w-full h-full" />
      </div>
    </div>
  )
} 