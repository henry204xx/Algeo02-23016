// app/api/audio/route.ts
import fs from 'fs'
import path from 'path'

export async function GET() {
  const audioDirectory = path.join(process.cwd(), 'backend/uploads/audios')

  
  try {
    const files = fs.readdirSync(audioDirectory)
    
    // Filter audio files (mp3, wav, midi, etc.)
    const audioFiles = files.filter(file =>
      file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.midi') || file.endsWith('.mid')
    )
    
    return new Response(JSON.stringify(audioFiles), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    console.error('Error reading audio files:', error)
    return new Response(JSON.stringify({ error: 'Unable to read audio files' }), {
      status: 500,
    })
  }
}
