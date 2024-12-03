import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filename } = req.query
  if (!filename || typeof filename !== 'string' || filename.trim() === '') {
    res.status(400).end('Invalid filename')
    return
  }

  const filePath = path.join(process.cwd(), 'public', 'audio', filename as string)

  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath)
    res.writeHead(200, {
      'Content-Type': 'audio/wav',
      'Content-Length': stat.size
    })
    const readStream = fs.createReadStream(filePath)
    readStream.on('open', () => {
      readStream.pipe(res)
    })

    readStream.on('error', (err) => {
      res.status(500).end(err.message)
    })
    readStream.pipe(res)
  } else {
    res.status(404).end('File not found')
  }
}

