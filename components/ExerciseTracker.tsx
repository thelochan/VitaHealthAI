'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ExerciseTrackerProps {
  userId: number;
}
const TEST_USER_ID = 1;

const ExerciseTracker: React.FC<ExerciseTrackerProps> = ({ userId }) => {
  const [exercise, setExercise] = useState({ type: '', duration: '', intensity: 'Medium' })
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: TEST_USER_ID, 
          type: 'exercise', 
          data: {...exercise, duration: parseInt(exercise.duration)}
        })
      })
      if (response.ok) {
        const score = calculateScore({...exercise, duration: parseInt(exercise.duration)})
        setFeedback(`Exercise logged successfully! Your score: ${score}/100`)
        setExercise({ type: '', duration: '', intensity: 'Medium' })
      } else {
        setFeedback('Failed to save exercise data')
      }
    } catch (error) {
      console.error('Error saving exercise data:', error)
      setFeedback('An error occurred while saving exercise data')
    }
  }

  const calculateScore = (exercise: { duration: number; intensity: string }) => {
    let score = 0
    const intensityFactor = exercise.intensity === 'High' ? 2 : exercise.intensity === 'Medium' ? 1 : 0.5
    score = (exercise.duration * intensityFactor / 150) * 100
    return Math.min(Math.round(score), 100)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={exercise.type}
        onChange={(e) => setExercise({...exercise, type: e.target.value})}
        placeholder="Exercise Type (e.g., Running, Cycling)"
        required
        className="text-black"
      />
      <Input
        type="number"
        value={exercise.duration}
        onChange={(e) => setExercise({...exercise, duration: e.target.value})}
        placeholder="Duration (minutes)"
        required
        min="1"
        className="text-black"
      />
      <select
        value={exercise.intensity}
        onChange={(e) => setExercise({...exercise, intensity: e.target.value})}
        className="w-full p-2 border rounded text-black"
      >
        <option value="Low">Low Intensity</option>
        <option value="Medium">Medium Intensity</option>
        <option value="High">High Intensity</option>
      </select>
      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">Log Exercise</Button>
      {feedback && <p className="mt-2 text-center text-white">{feedback}</p>}
    </form>
  )
}

export default ExerciseTracker