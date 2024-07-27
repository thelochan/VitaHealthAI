import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { userId } = req.query

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' })
      }

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: {
          exercises: true,
          diets: true,
          sleeps: true,
          cognitives: true
        }
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.status(200).json(user)
    } catch (error) {
      console.error('Get all data error:', error)
      res.status(500).json({ error: 'Failed to get data' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}