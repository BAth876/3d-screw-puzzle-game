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
  unscrewScrew: (index: string) => void
  updateScrewProgress: (index: string, progress: number) => void
  matchScrew: (holderId: string) => void
  loadLevel: (levelId: number) => void
  nextLevel: () => void
  resetLevel: () => void
  calculateScore: () => void
}

type GameStore = GameState

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
      { id: 0, type: 'phillips', color: 'red', isUnscrewed: false, screwProgress: 0, position: [-1, 0, 0], rotation: [0, 0, 0] },
      { id: 1, type: 'flathead', color: 'red', isUnscrewed: false, screwProgress: 0, position: [1, 0, 0], rotation: [0, 0, 0] },
      { id: 2, type: 'allen', color: 'red', isUnscrewed: false, screwProgress: 0, position: [0, 0, 0], rotation: [0, 0, 0] },
      { id: 3, type: 'phillips', color: 'blue', isUnscrewed: false, screwProgress: 0, position: [-1, 1, 0], rotation: [0, 0, 0] },
      { id: 4, type: 'flathead', color: 'blue', isUnscrewed: false, screwProgress: 0, position: [1, 1, 0], rotation: [0, 0, 0] },
      { id: 5, type: 'allen', color: 'blue', isUnscrewed: false, screwProgress: 0, position: [0, 1, 0], rotation: [0, 0, 0] }
    ],
    screwHolders: [
      {
        id: 0,
        position: [-2, 2, 0],
        requiredScrews: [
          { type: 'phillips', color: 'red' },
          { type: 'flathead', color: 'red' },
          { type: 'allen', color: 'red' }
        ],
        matchedScrews: []
      },
      {
        id: 1,
        position: [2, 2, 0],
        requiredScrews: [
          { type: 'phillips', color: 'blue' },
          { type: 'flathead', color: 'blue' },
          { type: 'allen', color: 'blue' }
        ],
        matchedScrews: []
      }
    ]
  },
  {
    id: 3,
    name: "Type Match",
    description: "Match screws by type to their holders",
    maxScore: 3000,
    screws: [
      { id: 0, type: 'phillips', color: 'red', isUnscrewed: false, screwProgress: 0, position: [-1, 0, 0], rotation: [0, 0, 0] },
      { id: 1, type: 'phillips', color: 'blue', isUnscrewed: false, screwProgress: 0, position: [1, 0, 0], rotation: [0, 0, 0] },
      { id: 2, type: 'phillips', color: 'green', isUnscrewed: false, screwProgress: 0, position: [0, 0, 0], rotation: [0, 0, 0] },
      { id: 3, type: 'flathead', color: 'red', isUnscrewed: false, screwProgress: 0, position: [-1, 1, 0], rotation: [0, 0, 0] },
      { id: 4, type: 'flathead', color: 'blue', isUnscrewed: false, screwProgress: 0, position: [1, 1, 0], rotation: [0, 0, 0] },
      { id: 5, type: 'flathead', color: 'green', isUnscrewed: false, screwProgress: 0, position: [0, 1, 0], rotation: [0, 0, 0] }
    ],
    screwHolders: [
      {
        id: 0,
        position: [-2, 2, 0],
        requiredScrews: [
          { type: 'phillips', color: 'red' },
          { type: 'phillips', color: 'blue' },
          { type: 'phillips', color: 'green' }
        ],
        matchedScrews: []
      },
      {
        id: 1,
        position: [2, 2, 0],
        requiredScrews: [
          { type: 'flathead', color: 'red' },
          { type: 'flathead', color: 'blue' },
          { type: 'flathead', color: 'green' }
        ],
        matchedScrews: []
      }
    ]
  },
  {
    id: 4,
    name: "Master Challenge",
    description: "Match both color and type in a complex pattern",
    maxScore: 4000,
    screws: [
      { id: 0, type: 'phillips', color: 'red', isUnscrewed: false, screwProgress: 0, position: [-1, 0, 0], rotation: [0, 0, 0] },
      { id: 1, type: 'flathead', color: 'blue', isUnscrewed: false, screwProgress: 0, position: [1, 0, 0], rotation: [0, 0, 0] },
      { id: 2, type: 'allen', color: 'green', isUnscrewed: false, screwProgress: 0, position: [0, 0, 0], rotation: [0, 0, 0] },
      { id: 3, type: 'phillips', color: 'yellow', isUnscrewed: false, screwProgress: 0, position: [-1, 1, 0], rotation: [0, 0, 0] },
      { id: 4, type: 'flathead', color: 'red', isUnscrewed: false, screwProgress: 0, position: [1, 1, 0], rotation: [0, 0, 0] },
      { id: 5, type: 'allen', color: 'blue', isUnscrewed: false, screwProgress: 0, position: [0, 1, 0], rotation: [0, 0, 0] }
    ],
    screwHolders: [
      {
        id: 0,
        position: [-2, 2, 0],
        requiredScrews: [
          { type: 'phillips', color: 'red' },
          { type: 'flathead', color: 'blue' },
          { type: 'allen', color: 'green' }
        ],
        matchedScrews: []
      },
      {
        id: 1,
        position: [2, 2, 0],
        requiredScrews: [
          { type: 'phillips', color: 'yellow' },
          { type: 'flathead', color: 'red' },
          { type: 'allen', color: 'blue' }
        ],
        matchedScrews: []
      }
    ]
  }
]

export const useGameStore = create<GameStore>((set) => ({
  currentLevel: 1,
  levels,
  screws: levels[0].screws,
  screwHolders: levels[0].screwHolders,
  selectedScrew: null,
  score: 0,
  highScores: {},
  
  setSelectedScrew: (index: number | null) => set({ selectedScrew: index }),
  
  unscrewScrew: (index: number) => 
    set((state: GameState) => {
      soundManager.play('unscrew')
      return {
        screws: state.screws.map((screw: Screw, i: number) => 
          i === index 
            ? { ...screw, isUnscrewed: true, screwProgress: 1 }
            : screw
        )
      }
    }),
    
  updateScrewProgress: (index: number, progress: number) =>
    set((state: GameState) => ({
      screws: state.screws.map((screw: Screw, i: number) =>
        i === index
          ? { ...screw, screwProgress: progress }
          : screw
      )
    })),
    
  matchScrew: (screwId: number, holderId: number) =>
    set((state: GameState) => {
      const screw = state.screws.find((s: Screw) => s.id === screwId)
      const holder = state.screwHolders.find((h: ScrewHolder) => h.id === holderId)
      
      if (!screw || !holder) return state
      
      const requiredScrew = holder.requiredScrews.find(
        (req: { type: ScrewType; color: ScrewColor }) => 
          req.type === screw.type && req.color === screw.color
      )
      
      if (!requiredScrew) return state
      
      soundManager.play('match')
      return {
        screwHolders: state.screwHolders.map((h: ScrewHolder) =>
          h.id === holderId
            ? { ...h, matchedScrews: [...h.matchedScrews, screwId] }
            : h
        )
      }
    }),
    
  loadLevel: (levelId: number) =>
    set((state: GameState) => {
      const level = state.levels.find((l: Level) => l.id === levelId)
      if (!level) return state
      
      return {
        currentLevel: levelId,
        screws: level.screws,
        screwHolders: level.screwHolders,
        selectedScrew: null,
        score: 0
      }
    }),
    
  nextLevel: () =>
    set((state: GameState) => {
      const nextLevel = state.levels.find((l: Level) => l.id === state.currentLevel + 1)
      if (!nextLevel) return state
      
      soundManager.play('levelComplete')
      return {
        currentLevel: nextLevel.id,
        screws: nextLevel.screws,
        screwHolders: nextLevel.screwHolders,
        selectedScrew: null,
        score: 0
      }
    }),
    
  resetLevel: () =>
    set((state: GameState) => {
      const currentLevel = state.levels.find((l: Level) => l.id === state.currentLevel)
      if (!currentLevel) return state
      
      return {
        screws: currentLevel.screws,
        screwHolders: currentLevel.screwHolders,
        selectedScrew: null,
        score: 0
      }
    }),

  calculateScore: () =>
    set((state: GameState) => {
      const currentLevel = state.levels.find((l: Level) => l.id === state.currentLevel)
      if (!currentLevel) return state

      const matchedHolders = state.screwHolders.filter(
        (h: ScrewHolder) => h.matchedScrews.length === h.requiredScrews.length
      ).length
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