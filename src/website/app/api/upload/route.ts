import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // Get file type from the client

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate the provided type
    const allowedTypes = ['audios', 'pictures', 'mapper', 'queryMusic', 'queryImage'];
    if (!allowedTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Define the directory to store the file
    const uploadDir = path.join(process.cwd(), 'uploads', type);

    // Ensure the folder exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save the file to the correct directory
    const filePath = path.join(uploadDir, file.name);
    const fileStream = fs.createWriteStream(filePath);

    // Write file chunks to disk
    const reader = file.stream().getReader();
    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (value) {
        fileStream.write(value);
      }
      done = readerDone;
    }

    fileStream.end();

    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        file: file.name,
        type,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
