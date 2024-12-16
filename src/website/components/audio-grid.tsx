import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from "@/components/ui/pagination";

interface AudioGridProps {
  searchTerm: string;
  currentView: 'album' | 'music';
}

export function AudioGrid({ searchTerm, currentView }: AudioGridProps) {
  const [audioFiles, setAudioFiles] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [pollingActive, setPollingActive] = useState(true); // Control polling state

  // fetch audio files
  const fetchAudioFiles = async () => {
    try {
      const apiEndpoint = currentView === 'album' ? '/api/audio' : '/api/audio2';
      const response = await fetch(apiEndpoint);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        // Sort filename (tinggi ke rendah)
        const sortedData = data.sort((a: string, b: string) => {
          const fileNameA = decodeURIComponent(a.split('/').pop() || '');
          const fileNameB = decodeURIComponent(b.split('/').pop() || '');

          // Ekstrak numeric value
          const numA = parseInt(fileNameA.match(/\d+/)?.[0] || '0');
          const numB = parseInt(fileNameB.match(/\d+/)?.[0] || '0');

          return numB - numA; // Sort
        });
        setAudioFiles(sortedData);
      } else {
        setAudioFiles([]);
      }
      setPollingActive(true); // Always keep polling
    } catch (error) {
      console.error('Error fetching audio files:', error);
      setPollingActive(false); // Stop polling on error
    }
  };

  
  useEffect(() => {
    fetchAudioFiles();
    let interval: NodeJS.Timeout;

    if (pollingActive) {
      interval = setInterval(fetchAudioFiles, 10000); // fetch per 10 detik
    }

    return () => clearInterval(interval); // Cleanup
  }, [pollingActive, currentView]); 

  // Filter files 
  const filteredFiles = audioFiles.filter(file =>
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const pageCount = Math.ceil(filteredFiles.length / itemsPerPage);
  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Message kalau tidak ada data */}
      {audioFiles.length === 0 && (
        <div className="text-center text-gray-500">
          No audio files available.
        </div>
      )}

      {/*  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedFiles.map((fileUrl, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gray-200 aspect-square" />
              <div className="bg-[#080c2c] p-3 flex items-center gap-2">
                <span className="text-white">
                  {(() => {
                    try {
                      // deconding filename dengan %
                      const decodedFileName = decodeURIComponent(fileUrl.split('/').pop() || '');
                      return decodedFileName;
                    } catch (e) {
                      console.error('Error decoding URI component:', e);
                      return fileUrl.split('/').pop() || ''; 
                    }
                  })()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
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
  );
}
