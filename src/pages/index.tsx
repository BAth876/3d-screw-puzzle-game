import { Game } from '../components/Game'
import { UI } from '../components/UI'

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-gray-900">
      <Game />
      <UI />
    </main>
  )
} 