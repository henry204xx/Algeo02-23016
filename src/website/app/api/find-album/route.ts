import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function POST() {
  try {
    const scriptPath = path.join(process.cwd(), 'backend/pca/albumfinder.py');
    
    return new Promise((resolve) => {
      exec(`python ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing script: ${error.message}`);
          resolve(NextResponse.json({ error: 'Error executing script' }, { status: 500 }));
          return;
        }
        if (stderr) {
          console.error(`Script stderr: ${stderr}`);
          resolve(NextResponse.json({ error: 'Script error' }, { status: 500 }));
          return;
        }
        console.log(`Script stdout: ${stdout}`);
        const executionTimeMatch = stdout.match(/Execution time: (\d+\.\d+) seconds/);
        const executionTime = executionTimeMatch ? parseFloat(executionTimeMatch[1]) : null;
        resolve(NextResponse.json({ message: 'Album finder executed successfully', executionTime }, { status: 200 }));
      });
    });
  } catch (error) {
    console.error('Error executing album finder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}