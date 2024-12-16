import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function POST() {
  try {
    // Get the correct path to the Python script
    const scriptPath = path.join(process.cwd(), 'backend/pca/albumfinder.py');
    
    exec(`python ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        return NextResponse.json({ error: 'Error executing script' }, { status: 500 });
      }
      if (stderr) {
        console.error(`Script stderr: ${stderr}`);
        return NextResponse.json({ error: 'Script error' }, { status: 500 });
      }
      console.log(`Script stdout: ${stdout}`);
    });

    return NextResponse.json({ message: 'Album finder executed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error executing album finder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
