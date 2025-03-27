import React from 'react'
import dynamic from 'next/dynamic'

const Game = dynamic(() => import('../src/components/Game'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-gray-100">
      <div className="text-xl">Loading game...</div>
    </div>
  )
})

export default function Home() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
        <Game className="w-full h-full" />
      </div>
    </div>
  )
} 