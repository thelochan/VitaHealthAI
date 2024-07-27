import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { userId } = req.query

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'User ID is required' })
      }

      const exercises = await prisma.exercise.findMany({
        where: { userId: Number(userId) },
        orderBy: { date: 'desc' },
        take: 7 // Last 7 entries
      })

      let totalMinutes = exercises.reduce((sum, ex) => sum + ex.duration, 0)
      let averageIntensity = exercises.reduce((sum, ex) => {
        switch (ex.intensity) {
          case 'Low': return sum + 1;
          case 'Medium': return sum + 2;
          case 'High': return sum + 3;
          default: return sum;
        }
      }, 0) / exercises.length

      let score = (totalMinutes / (150 * 2)) * 100 // 150 minutes per week is recommended
      score = Math.min(score, 100) // Cap at 100

      let report = `In the past week, you exercised for a total of ${totalMinutes} minutes. `
      report += `Your average intensity was ${averageIntensity.toFixed(1)} out of 3. `
      report += `Your exercise score is ${score.toFixed(1)} out of 100. `

      if (score < 50) {
        report += "You should aim to exercise more frequently or for longer durations."
      } else if (score < 80) {
        report += "You're doing well, but there's room for improvement."
      } else {
        report += "Excellent job! You're meeting or exceeding exercise recommendations."
      }

      res.status(200).json({ report })
    } catch (error) {
      console.error('Exercise report error:', error)
      res.status(500).json({ error: 'Failed to generate exercise report' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}