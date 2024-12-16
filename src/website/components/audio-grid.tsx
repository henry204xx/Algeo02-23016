import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
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
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Function to fetch audio files
  const fetchAudioFiles = async () => {
    try {
      const response = await fetch('/api/audio') // Fetch from route
      const data = await response.json()
      setAudioFiles(data) // Update state with new audio files
    } catch (error) {
      console.error('Error fetching audio files:', error)
    }
  }

  // Polling: Fetch audio files periodically
  useEffect(() => {
    fetchAudioFiles() // Fetch initially
    const interval = setInterval(fetchAudioFiles, 1000) // Poll every 5 seconds

    return () => clearInterval(interval) // Cleanup the interval on unmount
  }, []) // Empty dependency array means it runs only once

  // Filter files based on search term
  const filteredFiles = audioFiles.filter(file =>
    file.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination logic
  const pageCount = Math.ceil(filteredFiles.length / itemsPerPage)
  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Render null if not in the 'album' view
  if (currentView !== 'album') {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Grid of Audio Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedFiles.map((fileUrl, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gray-200 aspect-square" />
              <div className="bg-[#080c2c] p-3 flex items-center gap-2">
                <span className="text-white">
                  {decodeURIComponent(fileUrl.split('/').pop() || '')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {pageCount > 1 && (
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
      )}
    </div>
  )
}
