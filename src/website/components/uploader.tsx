'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

interface UploadedFilesState {
  audios: File | null;
  pictures: File | null;
  mapper: File | null;
  queryMusic: File | null;
  queryImage: File | null;
}

interface UploaderProps {
  onFileUpload: (type: 'audios' | 'pictures' | 'mapper' | 'queryMusic' | 'queryImage', file: File) => void;
  uploadedFiles: UploadedFilesState;
  currentView: 'album' | 'music';
}

export function Uploader({ onFileUpload, uploadedFiles, currentView }: UploaderProps) {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'audios' | 'pictures' | 'mapper' | 'queryMusic' | 'queryImage'
  ) => {
    const file = event.target.files?.[0];
    console.log(`File selected for ${type}:`, file);

    if (file) {
      // Create FormData to send to API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type); // Explicitly pass file type to the server

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
        onFileUpload(type, file);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const fileInputs =
    currentView === 'album'
      ? ['audios', 'pictures', 'mapper', 'queryImage']
      : ['audios', 'queryMusic'];

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
                    : type === 'queryMusic'
                    ? '.wav,.zip,.mid,.mp3'
                    : type === 'queryImage'
                    ? '.png,.jpg,.jpeg,.gif'
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
