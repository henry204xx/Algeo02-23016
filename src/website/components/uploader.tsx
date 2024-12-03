'use client'

import { Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface UploaderProps {
  onFileUpload: (type: 'audios' | 'pictures' | 'mapper', file: File) => void
  uploadedFiles: {
    audios: File | null
    pictures: File | null
    mapper: File | null
  }
  currentView: 'album' | 'music' // Add currentView prop
}

export function Uploader({ onFileUpload, uploadedFiles, currentView }: UploaderProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'audios' | 'pictures' | 'mapper') => {
    const file = event.target.files?.[0]
    if (file) {
      onFileUpload(type, file)
    }
  }

  const handleUpload = () => {
    const audioInput = document.getElementById('file-audios') as HTMLInputElement
    if (currentView === 'album') {
      // For album view, trigger all relevant file inputs
      const pictureInput = document.getElementById('file-pictures') as HTMLInputElement
      const mapperInput = document.getElementById('file-mapper') as HTMLInputElement

      if (!uploadedFiles.audios) audioInput?.click()
      if (!uploadedFiles.pictures) pictureInput?.click()
      if (!uploadedFiles.mapper) mapperInput?.click()
    } else {
      // For music view, only trigger audio file input
      audioInput?.click()
    }
  }

  // Determine allowed upload types based on the current view
  const allowedUploads = currentView === 'album' ? ['audios', 'pictures', 'mapper'] : ['audios']

  return (
    <Card className="bg-[#f0f2ff]">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          {currentView === 'album' ? 'Upload dataset and mapper here!' : 'Upload audios here!'}
        </h2>
        <div className="space-y-3">
          {allowedUploads.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="bg-[#e6e9ff] w-24"
                onClick={() => document.getElementById(`file-${type}`)?.click()}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
              <span>{uploadedFiles[type as 'audios' | 'pictures' | 'mapper'] ? uploadedFiles[type as 'audios' | 'pictures' | 'mapper']?.name : `${type}.file`}</span>
              <input
                id={`file-${type}`}
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange(e, type as 'audios' | 'pictures' | 'mapper')}
                accept={
                  type === 'mapper'
                    ? '.txt,.json' // Accept only .txt or .json
                    : type === 'audios'
                    ? '.wav,.zip,.midi' // Accept .wav, .zip, and .midi
                    : '.png,.jpg,.jpeg,.gif' // Accept typical picture formats
                }
              />
            </div>
          ))}
        </div>
        <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <Button
            className="mt-4 bg-[#e6e9ff] text-gray-700 hover:bg-[#d5d9ff]"
            onClick={handleUpload}
            disabled={
              currentView === 'album'
                ? !uploadedFiles.audios || !uploadedFiles.pictures || !uploadedFiles.mapper
                : !uploadedFiles.audios
            }
          >
            Upload
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
