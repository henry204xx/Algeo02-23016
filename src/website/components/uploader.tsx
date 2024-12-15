'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

interface UploadedFilesState {
  audios: File | null;
  pictures: File | null;
  mapper: File | null;
  query: File | null;
}

export function Uploader() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesState>({
    audios: null,
    pictures: null,
    mapper: null,
    query: null,
  });
  const [currentView, setCurrentView] = useState<'album' | 'music'>('album');

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'audios' | 'pictures' | 'mapper' | 'query'
  ) => {
    const file = event.target.files?.[0];
    console.log(`File selected for ${type}:`, file);

    if (file) {
      // Create FormData to send to API
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('File upload error:', errorData.error);
          alert(`Error: ${errorData.error}`);
          return;
        }

        const result = await response.json();
        console.log('File upload success:', result);

        // Update state to show the uploaded file
        setUploadedFiles((prev) => ({
          ...prev,
          [type]: file,
        }));
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const fileInputs =
    currentView === 'album'
      ? ['audios', 'pictures', 'mapper', 'query']
      : ['audios', 'query'];

  return (
    <Card className="bg-[#f0f2ff]">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          {currentView === 'album'
            ? 'Upload dataset, mapper, and query files here!'
            : 'Upload audios and query files here!'}
        </h2>

        <div className="space-y-3">
          {fileInputs.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="bg-[#e6e9ff] w-32"
                onClick={() => {
                  document.getElementById(`file-${type}`)?.click();
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>

              <span>
                {uploadedFiles[type as keyof UploadedFilesState]?.name || `${type}.file`}
              </span>

              <input
                id={`file-${type}`}
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange(e, type as keyof UploadedFilesState)}
                accept={
                  type === 'audios'
                    ? '.wav,.zip,.mid'
                    : type === 'mapper'
                    ? '.txt,.json'
                    : type === 'query'
                    ? '.wav,.zip,.mid,.mp3'
                    : '.png,.jpg,.jpeg,.gif,.zip'
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
