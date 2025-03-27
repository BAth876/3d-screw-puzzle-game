class SoundManager {
  private static instance: SoundManager
  private sounds: { [key: string]: HTMLAudioElement } = {}
  private isMuted: boolean = false

  private constructor() {
    // Initialize sounds
    this.sounds = {
      unscrew: new Audio('/sounds/unscrew.mp3'),
      match: new Audio('/sounds/match.mp3'),
      levelComplete: new Audio('/sounds/level-complete.mp3')
    }

    // Set volume and other properties
    Object.values(this.sounds).forEach(sound => {
      sound.volume = 0.3
    })
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  public play(soundName: keyof typeof this.sounds): void {
    if (this.isMuted) return
    const sound = this.sounds[soundName]
    if (sound) {
      sound.currentTime = 0
      sound.play().catch(error => console.log('Sound play failed:', error))
    }
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted
  }

  public isSoundMuted(): boolean {
    return this.isMuted
  }
}

export const soundManager = SoundManager.getInstance() 