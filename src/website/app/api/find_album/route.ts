import { exec } from 'child_process';  // Import the exec function from child_process
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      exec('python src/website/backend/pca/albumfinder.py', (error, stdout, stderr) => {
        if (error) {
          console.error('Error running find_album:', error);
          res.status(500).json({ message: 'Internal Server Error' });
          return;
        }
        try {
          // Assuming the Python script returns JSON
          const result = JSON.parse(stdout);
          res.status(200).json({ message: 'Album found!', result: result });
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          res.status(500).json({ message: 'Error parsing JSON' });
        }
      });
    } catch (error) {
      console.error('Error running find_album:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    // Handle unsupported methods (only POST is allowed)
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}