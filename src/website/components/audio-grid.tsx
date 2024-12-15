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
  const [audioFiles, setAudioFiles] = useState<string[]>([]) // API response: list of URLs
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Fetch audio files from API on load
  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        const response = await fetch('/api/audio') // Replace with your API endpoint
        const data = await response.json() // Assume it returns an array of audio file URLs
        setAudioFiles(data)
      } catch (error) {
        console.error('Error fetching audio files:', error)
      }
    }

    fetchAudioFiles()
  }, [])

  // Filter and paginate files
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
      {/* Pagination */}
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
    </div>
  )
}
