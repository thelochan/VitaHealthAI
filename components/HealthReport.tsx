'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TierType } from '@/app/page'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface HealthReportProps {
  userTier: TierType;
  userId: number;
}

interface UserData {
  exercises: any[];
  diets: any[];
  sleeps: any[];
  cognitives: any[];
}

const HealthReport: React.FC<HealthReportProps> = ({ userTier, userId }) => {
  const [report, setReport] = useState<UserData | null>(null)

  const generateReport = async () => {
    try {
      const response = await fetch(`/api/get-all-data?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setReport(data)
      } else {
        throw new Error('Failed to generate report')
      }
    } catch (error) {
      console.error('Error generating report:', error)
      setReport(null)
    }
  }

  const getChartData = () => {
    if (!report) return null

    const dates = report.exercises.map(e => new Date(e.date).toLocaleDateString())
    const exerciseDurations = report.exercises.map(e => e.duration)
    const sleepDurations = report.sleeps.map(s => s.duration)

    return {
      labels: dates,
      datasets: [
        {
          label: 'Exercise Duration (minutes)',
          data: exerciseDurations,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Sleep Duration (hours)',
          data: sleepDurations,
          borderColor: 'rgb(153, 102, 255)',
          tension: 0.1
        }
      ]
    }
  }

  const getExplanation = () => {
    if (!report) return null

    const avgExerciseDuration = report.exercises.reduce((sum, e) => sum + e.duration, 0) / report.exercises.length
    const avgSleepDuration = report.sleeps.reduce((sum, s) => sum + s.duration, 0) / report.sleeps.length
    const avgCalories = report.diets.reduce((sum, d) => sum + d.calories, 0) / report.diets.length
    const avgCognitiveActivity = report.cognitives.reduce((sum, c) => sum + c.duration, 0) / report.cognitives.length

    return (
      <div className="mt-4">
        <h3 className="text-xl font-bold">Health Analysis</h3>
        <p>Exercise: On average, you exercise for {avgExerciseDuration.toFixed(1)} minutes per session. Aim for at least 150 minutes of moderate activity per week.</p>
        <p>Sleep: Your average sleep duration is {avgSleepDuration.toFixed(1)} hours. Adults should aim for 7-9 hours of sleep per night.</p>
        <p>Diet: You consume an average of {avgCalories.toFixed(0)} calories per recorded meal. Remember, an average adult needs about 2000-2500 calories per day.</p>
        <p>Cognitive Activity: You spend an average of {avgCognitiveActivity.toFixed(1)} minutes on cognitive activities per session. Regular mental exercises can help maintain cognitive health.</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <Button onClick={generateReport} className="mb-4">Generate Health Report</Button>
      {report && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Your Health Report</h2>
          {getChartData() && <Line data={getChartData()!} />}
          {getExplanation()}
          <p className="mt-4">Your current tier: {userTier}</p>
        </div>
      )}
    </div>
  )
}

export default HealthReport