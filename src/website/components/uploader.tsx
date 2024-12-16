'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';

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
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [queryImageUrl, setQueryImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const requiredFields = currentView === 'album'
      ? ['audios', 'pictures', 'mapper', 'queryImage']
      : ['audios', 'queryMusic'];

    const allFilled = requiredFields.every(field => uploadedFiles[field as keyof UploadedFilesState] !== null);
    setAllFieldsFilled(allFilled);
  }, [uploadedFiles, currentView]);

  useEffect(() => {
    if (uploadedFiles.queryImage) {
      const url = URL.createObjectURL(uploadedFiles.queryImage);
      setQueryImageUrl(url);

      // Clean up the URL object when the component unmounts or the file changes
      return () => URL.revokeObjectURL(url);
    }
  }, [uploadedFiles.queryImage]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'audios' | 'pictures' | 'mapper' | 'queryMusic' | 'queryImage'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('File upload error:', errorData);
          alert(`Error: ${errorData.error}`);
          return;
        }

        onFileUpload(type, file);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('An error occurred during file upload.');
      }
    }
  };

  const handleFindAlbum = async () => {
    if (!allFieldsFilled) return;

    try {
      if (currentView === 'album') {
        console.log('Calling find_album API...');
        const findAlbumResponse = await fetch('/api/find-album', {
          method: 'POST',
        });

        if (!findAlbumResponse.ok) {
          console.error('Error calling find_album API:', await findAlbumResponse.json());
          alert('Error: Unable to execute find_album.');
        } else {
          const responseData = await findAlbumResponse.json();
          console.log('find_album API called successfully');
          setExecutionTime(responseData.executionTime);
        }
      } else if (currentView === 'music') {
        console.log('Calling find_music API...');
        const findMusicResponse = await fetch('/api/find-music', {
          method: 'POST',
        });

        if (!findMusicResponse.ok) {
          console.error('Error calling find_music API:', await findMusicResponse.json());
          alert('Error: Unable to execute find_music.');
        } else {
          console.log('find_music API called successfully');
          alert('find_music executed successfully!');
        }
      }
    } catch (error) {
      console.error('Error executing API:', error);
      alert('An unexpected error occurred.');
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
                onClick={() => document.getElementById(`file-${type}`)?.click()}
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

        <Button
          variant="default"
          className={`mt-4 ${!allFieldsFilled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleFindAlbum}
          disabled={!allFieldsFilled}
        >
          Execute
        </Button>

        {executionTime !== null && (
          <div className="mt-4">
            <p>Execution time: {executionTime} seconds</p>
          </div>
        )}

        {currentView === 'album' && queryImageUrl && (
          <div className="mt-4">
            <p>Query Image:</p>
            <img src={queryImageUrl} alt="Query Image" className="mt-2 max-w-full h-auto" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}