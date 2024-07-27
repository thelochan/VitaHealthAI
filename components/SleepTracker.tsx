'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SleepTrackerProps {
  userId: number;
}

const TEST_USER_ID = 1;

const SleepTracker: React.FC<SleepTrackerProps> = ({ userId }) => {
  const [sleep, setSleep] = useState({ duration: '', quality: 'Good' })
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: TEST_USER_ID, 
          type: 'sleep', 
          data: {...sleep, duration: parseFloat(sleep.duration)}
        })
      })
      if (response.ok) {
        const score = calculateScore({...sleep, duration: parseFloat(sleep.duration)})
        setFeedback(`Sleep logged successfully! Your score: ${score}/100`)
        setSleep({ duration: '', quality: 'Good' })
      } else {
        setFeedback('Failed to save sleep data')
      }
    } catch (error) {
      console.error('Error saving sleep data:', error)
      setFeedback('An error occurred while saving sleep data')
    }
  }

  const calculateScore = (sleep: { duration: number; quality: string }) => {
    let score = 0
    if (sleep.duration >= 7 && sleep.duration <= 9) {
      score += 70
    } else if (sleep.duration >= 6 && sleep.duration < 7) {
      score += 50
    } else if (sleep.duration > 9 && sleep.duration <= 10) {
      score += 50
    } else {
      score += 30
    }

    switch (sleep.quality) {
      case 'Excellent': score += 30; break;
      case 'Good': score += 20; break;
      case 'Fair': score += 10; break;
      default: score += 0;
    }

    return Math.min(score, 100)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        value={sleep.duration}
        onChange={(e) => setSleep({...sleep, duration: e.target.value})}
        placeholder="Sleep Duration (hours)"
        required
        min="0"
        step="0.5"
        className="text-black"
      />
      <select
        value={sleep.quality}
        onChange={(e) => setSleep({...sleep, quality: e.target.value})}
        className="w-full p-2 border rounded text-black"
      >
        <option value="Excellent">Excellent</option>
        <option value="Good">Good</option>
        <option value="Fair">Fair</option>
        <option value="Poor">Poor</option>
      </select>
      <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">Log Sleep</Button>
      {feedback && <p className="mt-2 text-center text-white">{feedback}</p>}
    </form>
  )
}

export default SleepTracker