// pages/api/save-data.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'user-data.json')

type DataType = 'exercise' | 'diet' | 'sleep' | 'cognitive';

interface SaveDataRequest extends NextApiRequest {
  body: {
    type: DataType;
    data: any;
  }
}

export default function handler(req: SaveDataRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { type, data } = req.body
      
      let existingData: Record<DataType, any[]> = {
        exercise: [],
        diet: [],
        sleep: [],
        cognitive: []
      }

      if (fs.existsSync(dataFile)) {
        const fileContents = fs.readFileSync(dataFile, 'utf8')
        existingData = JSON.parse(fileContents)
      }

      existingData[type].push(data)

      fs.writeFileSync(dataFile, JSON.stringify(existingData, null, 2))

      res.status(200).json({ message: 'Data saved successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to save data' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}