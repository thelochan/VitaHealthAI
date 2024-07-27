import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userId, type, data } = req.body

      if (!userId || !type || !data) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) }
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      let result;

      switch (type) {
        case 'exercise':
          result = await prisma.exercise.create({
            data: {
              userId: user.id,
              type: data.type,
              duration: data.duration,
              intensity: data.intensity,
            }
          });
          break;
        case 'diet':
          result = await prisma.diet.create({
            data: {
              userId: user.id,
              type: data.type,
              calories: data.calories,
              protein: data.protein,
              carbs: data.carbs,
              fats: data.fats,
            }
          });
          break;
        case 'sleep':
          result = await prisma.sleep.create({
            data: {
              userId: user.id,
              duration: data.duration,
              quality: data.quality,
            }
          });
          break;
        case 'cognitive':
          result = await prisma.cognitive.create({
            data: {
              userId: user.id,
              type: data.type,
              duration: data.duration,
              difficulty: data.difficulty,
            }
          });
          break;
        default:
          return res.status(400).json({ error: 'Invalid data type' });
      }

      res.status(200).json({ message: 'Data saved successfully', data: result })
    } catch (error: any) {
      console.error('Save data error:', error)
      res.status(500).json({ error: 'Failed to save data', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}