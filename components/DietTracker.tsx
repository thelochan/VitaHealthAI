'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface DietTrackerProps {
  userId: number;
}

const TEST_USER_ID = 1;

const DietTracker: React.FC<DietTrackerProps> = ({ userId }) => {
  const [meal, setMeal] = useState({ type: 'Breakfast', calories: '', protein: '', carbs: '', fats: '' })
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: TEST_USER_ID, 
          type: 'diet', 
          data: {
            ...meal,
            calories: parseInt(meal.calories),
            protein: parseInt(meal.protein),
            carbs: parseInt(meal.carbs),
            fats: parseInt(meal.fats)
          }
        })
      })
      if (response.ok) {
        const score = calculateScore(meal)
        setFeedback(`Meal logged successfully! Your score: ${score}/100`)
        setMeal({ type: 'Breakfast', calories: '', protein: '', carbs: '', fats: '' })
      } else {
        setFeedback('Failed to save meal data')
      }
    } catch (error) {
      console.error('Error saving meal data:', error)
      setFeedback('An error occurred while saving meal data')
    }
  }

  const calculateScore = (meal: { calories: string; protein: string; carbs: string; fats: string }) => {
    const calories = parseInt(meal.calories)
    const protein = parseInt(meal.protein)
    const carbs = parseInt(meal.carbs)
    const fats = parseInt(meal.fats)
    
    let score = 0
    const totalNutrients = protein + carbs + fats
    if (totalNutrients > 0) {
      const proteinPercentage = (protein * 4 / calories) * 100
      const carbsPercentage = (carbs * 4 / calories) * 100
      const fatsPercentage = (fats * 9 / calories) * 100

      score += Math.min(proteinPercentage / 30 * 33, 33)
      score += Math.min(carbsPercentage / 40 * 34, 34)
      score += Math.min(fatsPercentage / 30 * 33, 33)
    }
    return Math.round(score)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        value={meal.type}
        onChange={(e) => setMeal({...meal, type: e.target.value})}
        className="w-full p-2 border rounded text-black"
      >
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Snack">Snack</option>
      </select>
      <Input
        type="number"
        value={meal.calories}
        onChange={(e) => setMeal({...meal, calories: e.target.value})}
        placeholder="Calories"
        required
        min="0"
        className="text-black"
      />
      <Input
        type="number"
        value={meal.protein}
        onChange={(e) => setMeal({...meal, protein: e.target.value})}
        placeholder="Protein (grams)"
        required
        min="0"
        className="text-black"
      />
      <Input
        type="number"
        value={meal.carbs}
        onChange={(e) => setMeal({...meal, carbs: e.target.value})}
        placeholder="Carbs (grams)"
        required
        min="0"
        className="text-black"
      />
      <Input
        type="number"
        value={meal.fats}
        onChange={(e) => setMeal({...meal, fats: e.target.value})}
        placeholder="Fats (grams)"
        required
        min="0"
        className="text-black"
      />
      <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">Log Meal</Button>
      {feedback && <p className="mt-2 text-center text-white">{feedback}</p>}
    </form>
  )
}

export default DietTracker