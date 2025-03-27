import { create } from 'zustand'
import { soundManager } from '../utils/soundManager'

export interface Screw {
  id: string
  type: 'phillips' | 'flathead' | 'allen'
  color: 'red' | 'blue' | 'green' | 'yellow'
  position: [number, number, number]
  rotation: [number, number, number]
  isUnscrewed: boolean
  screwProgress: number
}

export interface ScrewHolder {
  id: string
  type: 'phillips' | 'flathead' | 'allen'
  color: 'red' | 'blue' | 'green' | 'yellow'
  matched: boolean
}

export interface Level {
  id: number
  name: string
  description: string
  screws: Screw[]
  screwHolders: ScrewHolder[]
  maxScore: number
}

interface GameState {
  currentLevel: number
  levels: Level[]
  screws: Screw[]
  screwHolders: ScrewHolder[]
  selectedPiece: Screw | null
  screwProgress: number
  isLevelComplete: boolean
  score: number
  highScores: { [key: number]: number }
  setSelectedPiece: (piece: Screw | null) => void
  unscrewScrew: (id: string) => void
  updateScrewProgress: (id: string, progress: number) => void
  matchScrew: (holderId: string) => void
  loadLevel: (levelId: number) => void
  nextLevel: () => void
  resetLevel: () => void
  calculateScore: () => void
}

const levels: Level[] = [
  {
    id: 1,
    name: "Basic Training",
    description: "Learn the basics of unscrewing and matching screws",
    maxScore: 1000,
    screws: [
      { id: '0', type: 'phillips', color: 'red', position: [-1, 0, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 },
      { id: '1', type: 'flathead', color: 'blue', position: [1, 0, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 },
      { id: '2', type: 'allen', color: 'green', position: [0, 0, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 }
    ],
    screwHolders: [
      { id: '0', type: 'phillips', color: 'red', matched: false },
      { id: '1', type: 'flathead', color: 'blue', matched: false },
      { id: '2', type: 'allen', color: 'green', matched: false }
    ]
  },
  {
    id: 2,
    name: "Color Match",
    description: "Match screws by color to their holders",
    maxScore: 2000,
    screws: [
      { id: '0', type: 'phillips', color: 'red', position: [-1, 0, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 },
      { id: '1', type: 'flathead', color: 'red', position: [1, 0, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 },
      { id: '2', type: 'allen', color: 'red', position: [0, 0, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 },
      { id: '3', type: 'phillips', color: 'blue', position: [-1, 1, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 },
      { id: '4', type: 'flathead', color: 'blue', position: [1, 1, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 },
      { id: '5', type: 'allen', color: 'blue', position: [0, 1, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 }
    ],
    screwHolders: [
      { id: '0', type: 'phillips', color: 'red', matched: false },
      { id: '1', type: 'flathead', color: 'red', matched: false },
      { id: '2', type: 'allen', color: 'red', matched: false },
      { id: '3', type: 'phillips', color: 'blue', matched: false },
      { id: '4', type: 'flathead', color: 'blue', matched: false },
      { id: '5', type: 'allen', color: 'blue', matched: false }
    ]
  },
  {
    id: 3,
    name: "Type Match",
    description: "Match screws by type to their holders",
    maxScore: 3000,
    screws: [
      { id: '0', type: 'phillips', color: 'red', position: [-1, 0, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 },
      { id: '1', type: 'phillips', color: 'blue', position: [1, 0, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 },
      { id: '2', type: 'phillips', color: 'green', position: [0, 0, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 },
      { id: '3', type: 'flathead', color: 'red', position: [-1, 1, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 },
      { id: '4', type: 'flathead', color: 'blue', position: [1, 1, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 },
      { id: '5', type: 'flathead', color: 'green', position: [0, 1, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 }
    ],
    screwHolders: [
      { id: '0', type: 'phillips', color: 'red', matched: false },
      { id: '1', type: 'phillips', color: 'blue', matched: false },
      { id: '2', type: 'phillips', color: 'green', matched: false },
      { id: '3', type: 'flathead', color: 'red', matched: false },
      { id: '4', type: 'flathead', color: 'blue', matched: false },
      { id: '5', type: 'flathead', color: 'green', matched: false }
    ]
  },
  {
    id: 4,
    name: "Master Challenge",
    description: "Match both color and type in a complex pattern",
    maxScore: 4000,
    screws: [
      { id: '0', type: 'phillips', color: 'red', position: [-1, 0, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 },
      { id: '1', type: 'flathead', color: 'blue', position: [1, 0, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 },
      { id: '2', type: 'allen', color: 'green', position: [0, 0, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 },
      { id: '3', type: 'phillips', color: 'yellow', position: [-1, 1, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 },
      { id: '4', type: 'flathead', color: 'red', position: [1, 1, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 },
      { id: '5', type: 'allen', color: 'blue', position: [0, 1, 0], rotation: [0, 0, 0], isUnscrewed: false, screwProgress: 0 }
    ],
    screwHolders: [
      { id: '0', type: 'phillips', color: 'red', matched: false },
      { id: '1', type: 'flathead', color: 'blue', matched: false },
      { id: '2', type: 'allen', color: 'green', matched: false },
      { id: '3', type: 'phillips', color: 'yellow', matched: false },
      { id: '4', type: 'flathead', color: 'red', matched: false },
      { id: '5', type: 'allen', color: 'blue', matched: false }
    ]
  }
]

export const useStore = create<GameState>((set) => ({
  currentLevel: 1,
  levels,
  screws: levels[0].screws,
  screwHolders: levels[0].screwHolders,
  selectedPiece: null,
  screwProgress: 0,
  isLevelComplete: false,
  score: 0,
  highScores: {},
  
  setSelectedPiece: (piece) => set({ selectedPiece: piece }),
  
  unscrewScrew: (id) => 
    set((state) => {
      soundManager.play('unscrew')
      return {
        screws: state.screws.map((screw) => 
          screw.id === id 
            ? { ...screw, isUnscrewed: true, screwProgress: 1 }
            : screw
        )
      }
    }),
    
  updateScrewProgress: (id, progress) =>
    set((state) => ({
      screws: state.screws.map((screw) =>
        screw.id === id
          ? { ...screw, screwProgress: progress }
          : screw
      )
    })),
    
  matchScrew: (holderId) =>
    set((state) => {
      const holder = state.screwHolders.find((h) => h.id === holderId)
      if (!holder) return state
      
      soundManager.play('match')
      return {
        screwHolders: state.screwHolders.map((h) =>
          h.id === holderId
            ? { ...h, matched: true }
            : h
        ),
        isLevelComplete: state.screwHolders.every(h => h.matched)
      }
    }),
    
  loadLevel: (levelId) =>
    set((state) => {
      const level = state.levels.find((l) => l.id === levelId)
      if (!level) return state
      
      return {
        currentLevel: levelId,
        screws: level.screws,
        screwHolders: level.screwHolders,
        selectedPiece: null,
        screwProgress: 0,
        isLevelComplete: false,
        score: 0
      }
    }),
    
  nextLevel: () =>
    set((state) => {
      const nextLevel = state.levels.find((l) => l.id === state.currentLevel + 1)
      if (!nextLevel) return state
      
      soundManager.play('levelComplete')
      return {
        currentLevel: nextLevel.id,
        screws: nextLevel.screws,
        screwHolders: nextLevel.screwHolders,
        selectedPiece: null,
        screwProgress: 0,
        isLevelComplete: false,
        score: 0
      }
    }),
    
  resetLevel: () =>
    set((state) => {
      const currentLevel = state.levels.find((l) => l.id === state.currentLevel)
      if (!currentLevel) return state
      
      return {
        screws: currentLevel.screws,
        screwHolders: currentLevel.screwHolders,
        selectedPiece: null,
        screwProgress: 0,
        isLevelComplete: false,
        score: 0
      }
    }),

  calculateScore: () =>
    set((state) => {
      const currentLevel = state.levels.find((l) => l.id === state.currentLevel)
      if (!currentLevel) return state

      const matchedHolders = state.screwHolders.filter((h) => h.matched).length
      const totalHolders = state.screwHolders.length

      if (matchedHolders === totalHolders) {
        const newScore = currentLevel.maxScore
        const currentHighScore = state.highScores[currentLevel.id] || 0
        
        return {
          score: newScore,
          highScores: {
            ...state.highScores,
            [currentLevel.id]: Math.max(newScore, currentHighScore)
          }
        }
      }

      return state
    })
})) 