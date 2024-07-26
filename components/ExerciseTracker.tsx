// components/ExerciseTracker.tsx
'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Exercise {
  type: string;
  duration: number;
  intensity: 'Low' | 'Medium' | 'High';
  notes: string;
}

const ExerciseTracker: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [simpleExercise, setSimpleExercise] = useState('');
  const [detailedExercise, setDetailedExercise] = useState<Exercise>({
    type: '',
    duration: 0,
    intensity: 'Medium',
    notes: ''
  });

  const saveExercise = async (exercise: Exercise) => {
    try {
      await axios.post('/api/save-data', {
        type: 'exercise',
        data: exercise
      });
      // Optionally, show a success message
    } catch (error) {
      console.error('Failed to save exercise data', error);
      // Optionally, show an error message
    }
  };

  const addSimpleExercise = () => {
    if (simpleExercise.trim() !== '') {
      const newExercise = { type: simpleExercise, duration: 30, intensity: 'Medium' as const, notes: '' };
      setExercises([...exercises, newExercise]);
      saveExercise(newExercise);
      setSimpleExercise('');
    }
  };

  const addDetailedExercise = () => {
    if (detailedExercise.type !== '') {
      setExercises([...exercises, detailedExercise]);
      saveExercise(detailedExercise);
      setDetailedExercise({ type: '', duration: 0, intensity: 'Medium', notes: '' });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Exercise Tracker</h2>
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
                placeholder="Enter exercise (e.g., '30 min jogging')"
                value={simpleExercise}
                onChange={(e) => setSimpleExercise(e.target.value)}
                className="flex-grow mr-2"
              />
              <Button onClick={addSimpleExercise}>Add</Button>
            </div>
          </TabsContent>
          <TabsContent value="detailed">
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Exercise Type"
                value={detailedExercise.type}
                onChange={(e) => setDetailedExercise({...detailedExercise, type: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Duration (minutes)"
                value={detailedExercise.duration}
                onChange={(e) => setDetailedExercise({...detailedExercise, duration: Number(e.target.value)})}
              />
              <select
                value={detailedExercise.intensity}
                onChange={(e) => setDetailedExercise({...detailedExercise, intensity: e.target.value as 'Low' | 'Medium' | 'High'})}
                className="w-full p-2 border rounded"
              >
                <option value="Low">Low Intensity</option>
                <option value="Medium">Medium Intensity</option>
                <option value="High">High Intensity</option>
              </select>
              <Textarea
                placeholder="Additional notes"
                value={detailedExercise.notes}
                onChange={(e) => setDetailedExercise({...detailedExercise, notes: e.target.value})}
              />
              <Button onClick={addDetailedExercise} className="w-full">Add Detailed Exercise</Button>
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Exercise Log</h3>
          <ul className="space-y-2">
            {exercises.map((exercise, index) => (
              <li key={index} className="bg-purple-100 p-2 rounded">
                <strong>{exercise.type}</strong> - {exercise.duration} minutes, {exercise.intensity} intensity
                {exercise.notes && <p className="text-sm mt-1">{exercise.notes}</p>}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseTracker;