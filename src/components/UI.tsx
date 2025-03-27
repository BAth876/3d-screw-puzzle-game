import React from 'react'
import { useStore } from '../stores/gameStore'
import type { Level, Screw, ScrewHolder } from '../stores/gameStore'

export function UI() {
  const { 
    selectedPiece,
    screwProgress,
    resetLevel,
    isLevelComplete,
    screws,
    screwHolders,
    currentLevel,
    levels,
    score,
    highScores,
    calculateScore
  } = useStore()
  
  const currentLevelData = levels.find((l: Level) => l.id === currentLevel)
  const unscrewedCount = screws.filter((s: Screw) => s.isUnscrewed).length
  const totalScrews = screws.length
  
  const matchedHolders = screwHolders.filter((h: ScrewHolder) => h.matched).length
  const totalHolders = screwHolders.length

  // Calculate score when all holders are matched
  React.useEffect(() => {
    if (matchedHolders === totalHolders) {
      calculateScore()
    }
  }, [matchedHolders, totalHolders, calculateScore])

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
      {/* Progress overlay */}
      <div className="absolute top-4 left-4 bg-black/50 text-white p-4 rounded-lg">
        <div className="text-lg font-bold mb-2">Progress</div>
        <div>Matched Holders: {matchedHolders}/{totalHolders}</div>
      </div>

      {/* Screw progress */}
      {selectedPiece && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-black/50 text-white p-4 rounded-lg">
            <div className="text-lg font-bold mb-2">Unscrewing...</div>
            <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-200"
                style={{ width: `${screwProgress * 100}%` }}
              />
            </div>
            <div className="text-sm mt-2">{Math.round(screwProgress * 100)}%</div>
          </div>
        </div>
      )}

      {/* Level complete */}
      {isLevelComplete && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-black/50 text-white p-8 rounded-lg text-center">
            <div className="text-2xl font-bold mb-4">Level Complete!</div>
            <button
              onClick={resetLevel}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg pointer-events-auto"
            >
              Next Level
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white p-4 rounded-lg">
        <div className="text-lg font-bold mb-2">Instructions</div>
        <div>Hold to unscrew</div>
        <div>Match screws by type and color</div>
        <div>Complete all holders to win</div>
      </div>
    </div>
  )
} 