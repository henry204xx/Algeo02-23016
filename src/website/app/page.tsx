'use client';

import { useState, useEffect } from 'react';
import { Uploader } from '@/components/uploader';
import { SearchBar } from '@/components/search-bar';
import { AudioGrid } from '@/components/audio-grid';
import { Navigation } from '@/components/navigation';

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<{
    audios: File | null;
    pictures: File | null;
    mapper: File | null;
    queryMusic: File | null;
    queryImage: File | null;
  }>({
    audios: null,
    pictures: null,
    mapper: null,
    queryMusic: null,
    queryImage: null,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<'album' | 'music'>('album');

  const handleFileUpload = (
    type: 'audios' | 'pictures' | 'mapper' | 'queryMusic' | 'queryImage',
    file: File
  ) => {
    setUploadedFiles(prev => ({ ...prev, [type]: file }));
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <header className="bg-[#080c2c] p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-white text-2xl font-bold">Melody Matcher</h1>
          <Navigation currentView={currentView} setCurrentView={setCurrentView} />
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          <Uploader
            onFileUpload={handleFileUpload}
            uploadedFiles={uploadedFiles}
            currentView={currentView}
          />
          <div className="space-y-6">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <AudioGrid searchTerm={searchTerm} currentView={currentView} />
          </div>
        </div>
      </main>
    </div>
  );
}