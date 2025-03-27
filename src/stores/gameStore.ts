import { create } from 'zustand'

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
    name: 'Level 1',
    description: 'Match the screws by type and color',
    maxScore: 1000,
    screws: [
      {
        id: 'screw1',
        type: 'phillips',
        color: 'red',
        position: [-1, 0, 0],
        rotation: [0, 0, 0],
        isUnscrewed: false,
        screwProgress: 0
      },
      {
        id: 'screw2',
        type: 'flathead',
        color: 'blue',
        position: [1, 0, 0],
        rotation: [0, 0, 0],
        isUnscrewed: false,
        screwProgress: 0
      }
    ],
    screwHolders: [
      {
        id: 'holder1',
        type: 'phillips',
        color: 'red',
        matched: false
      },
      {
        id: 'holder2',
        type: 'flathead',
        color: 'blue',
        matched: false
      }
    ]
  }
]

export const useStore = create<GameState>((set: any, get: any) => ({
  currentLevel: 1,
  levels,
  screws: levels[0].screws,
  screwHolders: levels[0].screwHolders,
  selectedPiece: null,
  screwProgress: 0,
  isLevelComplete: false,
  score: 0,
  highScores: {},

  setSelectedPiece: (piece: Screw | null) => set({ selectedPiece: piece }),

  unscrewScrew: (id: string) =>
    set((state: GameState) => {
      return {
        screws: state.screws.map((screw: Screw) =>
          screw.id === id
            ? { ...screw, isUnscrewed: true }
            : screw
        )
      }
    }),

  updateScrewProgress: (id: string, progress: number) =>
    set((state: GameState) => ({
      screws: state.screws.map((screw: Screw) =>
        screw.id === id
          ? { ...screw, screwProgress: progress }
          : screw
      ),
      screwProgress: progress
    })),

  matchScrew: (holderId: string) =>
    set((state: GameState) => {
      const holder = state.screwHolders.find((h: ScrewHolder) => h.id === holderId)
      if (!holder) return state

      const selectedPiece = state.selectedPiece
      if (!selectedPiece) return state

      const isMatch = holder.type === selectedPiece.type && holder.color === selectedPiece.color

      return {
        screwHolders: state.screwHolders.map((h: ScrewHolder) =>
          h.id === holderId
            ? { ...h, matched: isMatch }
            : h
        ),
        screws: state.screws.map((s: Screw) =>
          s.id === selectedPiece.id
            ? { ...s, isUnscrewed: false }
            : s
        ),
        selectedPiece: null,
        isLevelComplete: isMatch && state.screwHolders.every((h: ScrewHolder) => h.matched || h.id === holderId)
      }
    }),

  loadLevel: (levelId: number) => {
    const level = levels.find((l: Level) => l.id === levelId)
    if (level) {
      set({
        currentLevel: levelId,
        screws: level.screws,
        screwHolders: level.screwHolders,
        selectedPiece: null,
        screwProgress: 0,
        isLevelComplete: false
      })
    }
  },

  nextLevel: () => {
    const { currentLevel } = get()
    const nextLevelId = currentLevel + 1
    const level = levels.find((l: Level) => l.id === nextLevelId)
    if (level) {
      set({
        currentLevel: nextLevelId,
        screws: level.screws,
        screwHolders: level.screwHolders,
        selectedPiece: null,
        screwProgress: 0,
        isLevelComplete: false
      })
    }
  },

  resetLevel: () => {
    const { currentLevel } = get()
    const level = levels.find((l: Level) => l.id === currentLevel)
    if (level) {
      set({
        screws: level.screws,
        screwHolders: level.screwHolders,
        selectedPiece: null,
        screwProgress: 0,
        isLevelComplete: false
      })
    }
  },

  calculateScore: () => {
    const { currentLevel, levels } = get()
    const level = levels.find((l: Level) => l.id === currentLevel)
    if (level) {
      set((state: GameState) => ({
        score: state.score + level.maxScore,
        highScores: {
          ...state.highScores,
          [currentLevel]: Math.max(state.highScores[currentLevel] || 0, level.maxScore)
        }
      }))
    }
  }
})) 