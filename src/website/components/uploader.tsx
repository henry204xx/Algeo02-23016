'use client';

import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface UploaderProps {
  onFileUpload: (type: 'audios' | 'pictures' | 'mapper' | 'query', file: File) => void;
  uploadedFiles: {
    audios: File | null;
    pictures: File | null;
    mapper: File | null;
    query: File | null;
  };
  currentView: 'album' | 'music';
}

export function Uploader({ onFileUpload, uploadedFiles, currentView }: UploaderProps) {
  // Handle file input changes
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'audios' | 'pictures' | 'mapper' | 'query'
  ) => {
    const file = event.target.files?.[0];
    console.log(`File selected for ${type}:`, file);
    if (file) {
      onFileUpload(type, file);
    }
  };

  // Determine file inputs based on view
  const fileInputs = currentView === 'album'
    ? ['audios', 'pictures', 'mapper']
    : ['audios'];

  return (
    <Card className="bg-[#f0f2ff]">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          {currentView === 'album'
            ? 'Upload dataset, mapper, and query files here!'
            : 'Upload audios here!'}
        </h2>

        {/* Standard Upload Buttons */}
        <div className="space-y-3">
          {fileInputs.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="bg-[#e6e9ff] w-32"
                onClick={() => {
                  console.log(`Button clicked for ${type}`);
                  document.getElementById(`file-${type}`)?.click();
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} 
              </Button>

              {/* Display uploaded file name */}
              <span>
                {uploadedFiles[type as 'audios' | 'pictures' | 'mapper']
                  ? uploadedFiles[type as 'audios' | 'pictures' | 'mapper']?.name
                  : `${type}.file`}
              </span>

              {/* Hidden File Input */}
              <input
                id={`file-${type}`}
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange(e, type as 'audios' | 'pictures' | 'mapper')}
                accept={
                  type === 'audios'
                    ? '.wav,.zip,.midi' // Audios accept these file types
                    : type === 'mapper'
                    ? '.txt,.json' // Mapper files
                    : '.png,.jpg,.jpeg,.gif' // Picture files
                }
              />
            </div>
          ))}
        </div>

        {/* Query Upload Section - Styled Dashed Box */}
        <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-gray-500">Upload Query File</h3>

          <div className="mt-4">
            <Button
              variant="secondary"
              className="bg-[#e6e9ff] text-gray-700 hover:bg-[#d5d9ff]"
              onClick={() => document.getElementById('file-query-main')?.click()}
            >
              Upload Query
            </Button>

            {/* Hidden File Input */}
            <input
              id="file-query-main"
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                console.log('Query file selected:', file);
                if (file) {
                  onFileUpload('query', file);
                }
              }}
              accept=".wav,.zip,.midi" // Query file formats
            />
          </div>

          {/* Display uploaded query file name */}
          <div className="mt-2 text-gray-600">
            {uploadedFiles.query ? (
              <span>Uploaded File: {uploadedFiles.query.name}</span>
            ) : (
              <span>No query file uploaded yet</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
