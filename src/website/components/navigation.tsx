import { Button } from "@/components/ui/button"

interface NavigationProps {
  currentView: 'album' | 'music'
  setCurrentView: (view: 'album' | 'music') => void
}

export function Navigation({ currentView, setCurrentView }: NavigationProps) {
  return (
    <nav className="flex gap-2">
      <Button 
        variant="secondary" 
        className={`${currentView === 'album' ? 'bg-[#8b95cf]' : 'bg-[#bec4e9]'} hover:bg-[#7a84be] text-white`}
        onClick={() => setCurrentView('album')}
      >
        Album
      </Button>
      <Button 
        variant="secondary" 
        className={`${currentView === 'music' ? 'bg-[#8b95cf]' : 'bg-[#bec4e9]'} hover:bg-[#7a84be] text-white`}
        onClick={() => setCurrentView('music')}
      >
        Music
      </Button>
    </nav>
  )
}

