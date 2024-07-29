'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { TierType } from '@/app/page'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Spinner } from '../components/ui/spinner'
import { Alert } from '../components/ui/alert'
import { useReactToPrint } from 'react-to-print'


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface HealthReportProps {
  userTier: TierType;
  userId: number;
}

interface UserData {
  exercises: any[];
  diets: any[];
  sleeps: any[];
}

const HealthReport: React.FC<HealthReportProps> = ({ userTier, userId }) => {
  const [report, setReport] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const reportRef = useRef(null)

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
  })

  const generateReport = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/get-all-data?userId=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to generate report')
      }
      const data = await response.json()
      setReport(data)
    } catch (error) {
      console.error('Error generating report:', error)
      setError('Failed to generate health report. Please try again later.')
      setReport(null)
    } finally {
      setLoading(false)
    }
  }

  const closeReport = () => {
    setReport(null)
    setError(null)
  }

  const getChartData = () => {
    if (!report) return null

    const dates = report.exercises.map(e => new Date(e.date).toLocaleDateString())
    const exerciseDurations = report.exercises.map(e => e.duration)
    const sleepDurations = report.sleeps.map(s => s.duration)
    const calorieIntakes = report.diets.map(d => d.calories)

    return {
      labels: dates,
      datasets: [
        {
          label: 'Exercise Duration (minutes)',
          data: exerciseDurations,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
          yAxisID: 'y'
        },
        {
          label: 'Sleep Duration (hours)',
          data: sleepDurations,
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          tension: 0.1,
          yAxisID: 'y1'
        },
        {
          label: 'Calorie Intake',
          data: calorieIntakes,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1,
          yAxisID: 'y2'
        }
      ]
    }
  }

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Health Metrics Over Time',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Exercise (minutes)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Sleep (hours)'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y2: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Calories'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  const getExplanation = () => {
    if (!report) return null

    const avgExerciseDuration = report.exercises.reduce((sum, e) => sum + e.duration, 0) / report.exercises.length
    const avgSleepDuration = report.sleeps.reduce((sum, s) => sum + s.duration, 0) / report.sleeps.length
    const avgCalories = report.diets.reduce((sum, d) => sum + d.calories, 0) / report.diets.length

    // Caloric burn analysis (simplified estimation)
    const avgCaloricBurn = avgExerciseDuration * 5 // Assuming 5 calories burned per minute of exercise

    return (
      <div className="mt-4 space-y-4">
        <h3 className="text-2xl font-bold">Health Analysis</h3>
        <div>
          <h4 className="text-xl font-semibold">Exercise</h4>
          <p>On average, you exercise for {avgExerciseDuration.toFixed(1)} minutes per session. Aim for at least 150 minutes of moderate activity per week.</p>
          <p>Estimated average caloric burn: {avgCaloricBurn.toFixed(0)} calories per exercise session.</p>
          {avgExerciseDuration < 30 && <p className="text-yellow-500">Consider increasing your exercise duration for better health benefits.</p>}
        </div>
        <div>
          <h4 className="text-xl font-semibold">Sleep</h4>
          <p>Your average sleep duration is {avgSleepDuration.toFixed(1)} hours. Adults should aim for 7-9 hours of sleep per night.</p>
          {avgSleepDuration < 7 && <p className="text-yellow-500">You might be sleep-deprived. Try to get more sleep for better overall health.</p>}
          {avgSleepDuration > 9 && <p className="text-yellow-500">You're sleeping more than average. While sleep is important, excessive sleep might indicate other health issues.</p>}
        </div>
        <div>
          <h4 className="text-xl font-semibold">Diet</h4>
          <p>You consume an average of {avgCalories.toFixed(0)} calories per recorded meal. Remember, an average adult needs about 2000-2500 calories per day.</p>
          {avgCalories > 800 && <p className="text-yellow-500">Your average meal seems high in calories. Consider balancing your diet with more low-calorie, nutrient-dense foods.</p>}
        </div>
        <div>
          <h4 className="text-xl font-semibold">Overall Health</h4>
          <p>Based on your data, here are some recommendations:</p>
          <ul className="list-disc list-inside">
            <li>Maintain a consistent exercise routine</li>
            <li>Aim for 7-9 hours of sleep each night</li>
            <li>Balance your calorie intake with your activity level</li>
            <li>Stay hydrated and include a variety of nutrients in your diet</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      {!report && (
        <Button 
          onClick={generateReport} 
          className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          Generate Health Report
        </Button>
      )}
      {loading && (
        <div className="flex justify-center items-center">
          <Spinner className="w-8 h-8 text-blue-500" />
          <span className="ml-2">Generating report...</span>
        </div>
      )}
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}
      {report && (
        <div ref={reportRef} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Your Health Report</h2>
            <div className="space-x-2">
              <Button onClick={handlePrint} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                Print PDF
              </Button>
              <Button onClick={closeReport} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                Close Report
              </Button>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            {getChartData() && <Line data={getChartData()!} options={chartOptions} />}
          </div>
          {getExplanation()}
          <p className="mt-4 text-sm text-gray-600">Your current tier: {userTier}</p>
        </div>
      )}
    </div>
  )
}

export default HealthReport