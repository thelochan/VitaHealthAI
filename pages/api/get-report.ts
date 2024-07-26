// pages/api/get-report.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'user-data.json')

function calculateScore(data: any) {
  let score = 0
  let totalFactors = 0

  if (data.exercise) {
    const exerciseScore = data.exercise.reduce((acc: number, curr: any) => acc + curr.duration, 0) / data.exercise.length
    score += Math.min(exerciseScore / 60, 1) // Max score for 60 minutes average exercise
    totalFactors++
  }

  if (data.diet) {
    const calorieScore = data.diet.reduce((acc: number, curr: any) => acc + curr.calories, 0) / data.diet.length
    score += Math.min(calorieScore / 2000, 1) // Assuming 2000 calories as a benchmark
    totalFactors++
  }

  if (data.sleep) {
    const sleepScore = data.sleep.reduce((acc: number, curr: any) => acc + curr.duration, 0) / data.sleep.length
    score += Math.min(sleepScore / 8, 1) // Assuming 8 hours as ideal sleep
    totalFactors++
  }

  if (data.cognitive) {
    const cognitiveScore = data.cognitive.reduce((acc: number, curr: any) => acc + curr.duration, 0) / data.cognitive.length
    score += Math.min(cognitiveScore / 30, 1) // Assuming 30 minutes of cognitive activity as benchmark
    totalFactors++
  }

  return totalFactors > 0 ? (score / totalFactors) * 100 : 0
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      if (!fs.existsSync(dataFile)) {
        return res.status(404).json({ error: 'No data found' })
      }

      const fileContents = fs.readFileSync(dataFile, 'utf8')
      const data = JSON.parse(fileContents)

      const score = calculateScore(data)

      const report = {
        score,
        summary: `Your overall health score is ${score.toFixed(2)} out of 100.`,
        details: {
          exercise: data.exercise ? `You've logged ${data.exercise.length} exercise sessions.` : 'No exercise data logged.',
          diet: data.diet ? `You've recorded ${data.diet.length} meals.` : 'No diet data logged.',
          sleep: data.sleep ? `You've logged ${data.sleep.length} sleep records.` : 'No sleep data logged.',
          cognitive: data.cognitive ? `You've completed ${data.cognitive.length} cognitive activities.` : 'No cognitive data logged.'
        }
      }

      res.status(200).json(report)
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate report' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}