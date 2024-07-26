// components/DietTracker.tsx
'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes: string;
}

const DietTracker: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [simpleMeal, setSimpleMeal] = useState('');
  const [detailedMeal, setDetailedMeal] = useState<Meal>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    notes: ''
  });

  const saveMeal = async (meal: Meal) => {
    try {
      await axios.post('/api/save-data', {
        type: 'diet',
        data: meal
      });
      // Optionally, show a success message
    } catch (error) {
      console.error('Failed to save meal data', error);
      // Optionally, show an error message
    }
  };

  const addSimpleMeal = () => {
    if (simpleMeal.trim() !== '') {
      const newMeal = { name: simpleMeal, calories: 0, protein: 0, carbs: 0, fat: 0, notes: '' };
      setMeals([...meals, newMeal]);
      saveMeal(newMeal);
      setSimpleMeal('');
    }
  };

  const addDetailedMeal = () => {
    if (detailedMeal.name !== '') {
      setMeals([...meals, detailedMeal]);
      saveMeal(detailedMeal);
      setDetailedMeal({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0, notes: '' });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Diet Tracker</h2>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="simple">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simple">Quick Add</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Add</TabsTrigger>
          </TabsList>
          <TabsContent value="simple">
            <div className="flex mb-4">
              <Input
                type="text"
                placeholder="Enter meal (e.g., 'Grilled chicken salad')"
                value={simpleMeal}
                onChange={(e) => setSimpleMeal(e.target.value)}
                className="flex-grow mr-2"
              />
              <Button onClick={addSimpleMeal}>Add</Button>
            </div>
          </TabsContent>
          <TabsContent value="detailed">
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Meal Name"
                value={detailedMeal.name}
                onChange={(e) => setDetailedMeal({...detailedMeal, name: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Calories"
                value={detailedMeal.calories}
                onChange={(e) => setDetailedMeal({...detailedMeal, calories: Number(e.target.value)})}
              />
              <Input
                type="number"
                placeholder="Protein (g)"
                value={detailedMeal.protein}
                onChange={(e) => setDetailedMeal({...detailedMeal, protein: Number(e.target.value)})}
              />
              <Input
                type="number"
                placeholder="Carbs (g)"
                value={detailedMeal.carbs}
                onChange={(e) => setDetailedMeal({...detailedMeal, carbs: Number(e.target.value)})}
              />
              <Input
                type="number"
                placeholder="Fat (g)"
                value={detailedMeal.fat}
                onChange={(e) => setDetailedMeal({...detailedMeal, fat: Number(e.target.value)})}
              />
              <Textarea
                placeholder="Additional notes"
                value={detailedMeal.notes}
                onChange={(e) => setDetailedMeal({...detailedMeal, notes: e.target.value})}
              />
              <Button onClick={addDetailedMeal} className="w-full">Add Detailed Meal</Button>
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Meal Log</h3>
          <ul className="space-y-2">
            {meals.map((meal, index) => (
              <li key={index} className="bg-green-100 p-2 rounded">
                <strong>{meal.name}</strong>
                {meal.calories > 0 && <p>Calories: {meal.calories}, Protein: {meal.protein}g, Carbs: {meal.carbs}g, Fat: {meal.fat}g</p>}
                {meal.notes && <p className="text-sm mt-1">{meal.notes}</p>}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DietTracker;