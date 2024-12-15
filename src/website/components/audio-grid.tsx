import { useState, useEffect, useRef } from 'react'
import { Play, Pause } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from "@/components/ui/pagination"

interface AudioGridProps {
  searchTerm: string
  currentView: 'album' | 'music'
}

export function AudioGrid({ searchTerm, currentView }: AudioGridProps) {
  const [audioFiles, setAudioFiles] = useState<string[]>([])
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)
  const itemsPerPage = 6

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        const response = await fetch('/api/audio') 
        const data = await response.json()
        setAudioFiles(data)
      } catch (error) {
        console.error('Error fetching audio files:', error)
      }
    }

    fetchAudioFiles()
  }, [])

  useEffect(() => {
    if (playingAudio && audioRef.current) {
      audioRef.current.play()
    } else if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [playingAudio])

  const togglePlay = (file: string) => {
    if (playingAudio === file) {
      setPlayingAudio(null)
    } else {
      setPlayingAudio(file)
    }
  }

  const filteredFiles = audioFiles.filter(file => 
    file.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pageCount = Math.ceil(filteredFiles.length / itemsPerPage)
  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedFiles.map((file, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gray-200 aspect-square" />
              <div className="bg-[#080c2c] p-3 flex items-center gap-2">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-white hover:text-white hover:bg-white/20"
                  onClick={() => togglePlay(file)}
                >
                  {playingAudio === file ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <span className="text-white">{file}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink 
                href="#" 
                onClick={() => setCurrentPage(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
              aria-disabled={currentPage === pageCount}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {playingAudio && <audio ref={audioRef} src={`/uploads/audios/${playingAudio}`} />}
    </div>
  )
}
