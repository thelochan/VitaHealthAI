'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CognitiveTrackerProps {
  userId: number;
}

const TEST_USER_ID = 1;


const CognitiveTracker: React.FC<CognitiveTrackerProps> = ({ userId }) => {
  const [activity, setActivity] = useState({ type: '', duration: '', difficulty: 'Medium' })
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: TEST_USER_ID, 
          type: 'cognitive', 
          data: {...activity, duration: parseInt(activity.duration)}
        })
      })
      if (response.ok) {
        const score = calculateScore({...activity, duration: parseInt(activity.duration)})
        setFeedback(`Cognitive activity logged successfully! Your score: ${score}/100`)
        setActivity({ type: '', duration: '', difficulty: 'Medium' })
      } else {
        setFeedback('Failed to save cognitive activity data')
      }
    } catch (error) {
      console.error('Error saving cognitive activity data:', error)
      setFeedback('An error occurred while saving cognitive activity data')
    }
  }

  const calculateScore = (activity: { duration: number; difficulty: string }) => {
    let score = 0
    const durationFactor = Math.min(activity.duration / 30, 2) // 30 minutes as baseline
    const difficultyFactor = activity.difficulty === 'High' ? 1.5 : activity.difficulty === 'Medium' ? 1 : 0.75

    score = (durationFactor * difficultyFactor * 50)
    return Math.min(Math.round(score), 100)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={activity.type}
        onChange={(e) => setActivity({...activity, type: e.target.value})}
        placeholder="Activity Type (e.g., Reading, Puzzles)"
        required
        className="text-black"
      />
      <Input
        type="number"
        value={activity.duration}
        onChange={(e) => setActivity({...activity, duration: e.target.value})}
        placeholder="Duration (minutes)"
        required
        min="1"
        className="text-black"
      />
      <select
        value={activity.difficulty}
        onChange={(e) => setActivity({...activity, difficulty: e.target.value})}
        className="w-full p-2 border rounded text-black"
      >
        <option value="Low">Low Difficulty</option>
        <option value="Medium">Medium Difficulty</option>
        <option value="High">High Difficulty</option>
      </select>
      <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white">Log Cognitive Activity</Button>
      {feedback && <p className="mt-2 text-center text-white">{feedback}</p>}
    </form>
  )
}

export default CognitiveTracker