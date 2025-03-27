import React from 'react'
import { useGameStore } from '../stores/gameStore'
import { soundManager } from '../utils/soundManager'

export function UI() {
  const { 
    currentLevel, 
    levels, 
    screws, 
    screwHolders, 
    selectedScrew, 
    resetLevel,
    nextLevel,
    score,
    highScores,
    calculateScore
  } = useGameStore()
  
  const currentLevelData = levels.find((l: Level) => l.id === currentLevel)
  const unscrewedCount = screws.filter((s: Screw) => s.isUnscrewed).length
  const totalScrews = screws.length
  
  const matchedHolders = screwHolders.filter(
    (holder: ScrewHolder) => holder.matchedScrews.length === holder.requiredScrews.length
  ).length
  const totalHolders = screwHolders.length

  // Calculate score when all holders are matched
  React.useEffect(() => {
    if (matchedHolders === totalHolders) {
      calculateScore()
    }
  }, [matchedHolders, totalHolders, calculateScore])

  return (
    <div className="absolute top-0 left-0 w-full p-4 text-white">
      <div className="flex justify-between items-center">
        <div className="text-xl">
          Level {currentLevel}: {currentLevelData?.name}
        </div>
        <div className="text-xl">
          Score: {score}
        </div>
        <div className="text-xl">
          High Score: {highScores[currentLevel] || 0}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => soundManager.toggleMute()}
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 transition-colors"
          >
            {soundManager.isSoundMuted() ? '🔇' : '🔊'}
          </button>
          <button
            onClick={resetLevel}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            Reset Level
          </button>
        </div>
      </div>
      
      <div className="mt-2 text-sm text-gray-300">
        {currentLevelData?.description}
      </div>
      
      {selectedScrew !== null && (
        <div className="mt-4 text-sm text-gray-300">
          Hold to unscrew piece {selectedScrew + 1}
        </div>
      )}
      
      {matchedHolders === totalHolders && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-black bg-opacity-75 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Level Complete!</h2>
          <p className="mb-2">Score: {score}</p>
          <p className="mb-2">High Score: {highScores[currentLevel] || 0}</p>
          <p className="mb-4">All screws matched correctly!</p>
          {currentLevel < levels.length ? (
            <button
              onClick={nextLevel}
              className="px-6 py-3 bg-green-500 rounded hover:bg-green-600 transition-colors"
            >
              Next Level
            </button>
          ) : (
            <div>
              <p className="mb-4">Congratulations! You've completed all levels!</p>
              <button
                onClick={() => resetLevel()}
                className="px-6 py-3 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 