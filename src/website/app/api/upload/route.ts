import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Function to determine the file type (audios, pictures, mapper, or query)
    const getFileType = (file: File): 'audios' | 'pictures' | 'mapper' | 'query' | null => {
      const audioExtensions = ['.wav', '.zip', '.mid'];
      const pictureExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.zip'];
      const mapperExtensions = ['.txt', '.json'];
      const queryExtensions = ['.wav', '.zip', '.mid'];

      const extname = path.extname(file.name).toLowerCase();

      if (audioExtensions.includes(extname)) {
        return 'audios';
      } else if (pictureExtensions.includes(extname)) {
        return 'pictures';
      } else if (mapperExtensions.includes(extname)) {
        return 'mapper';
      } else if (queryExtensions.includes(extname)) {
        return 'query';
      }
      return null;
    };

    const fileType = getFileType(file);

    if (!fileType) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Define the directory based on file type
    const uploadDir = path.join(process.cwd(), 'uploads', fileType);

    // Ensure the folder exists by removing the existing one (if any) and then recreating it
    if (fs.existsSync(uploadDir)) {
      fs.rmSync(uploadDir, { recursive: true, force: true }); // Remove the existing folder
    }

    // Recreate the directory
    fs.mkdirSync(uploadDir, { recursive: true });

    // Save the file into the designated folder
    const filePath = path.join(uploadDir, file.name);
    const fileStream = fs.createWriteStream(filePath);

    const reader = file.stream().getReader();
    let done = false;
    let chunk;
    while (!done) {
      ({ done, value: chunk } = await reader.read());
      if (chunk) {
        fileStream.write(chunk);
      }
    }

    fileStream.end();

    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        file: file.name,
        type: fileType,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
