// components/CognitiveTracker.tsx
'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CognitiveActivity {
  type: string;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  notes: string;
}

const CognitiveTracker: React.FC = () => {
  const [activities, setActivities] = useState<CognitiveActivity[]>([]);
  const [simpleActivity, setSimpleActivity] = useState('');
  const [detailedActivity, setDetailedActivity] = useState<CognitiveActivity>({
    type: '',
    duration: 0,
    difficulty: 'Medium',
    notes: ''
  });

  const saveActivity = async (activity: CognitiveActivity) => {
    try {
      await axios.post('/api/save-data', {
        type: 'cognitive',
        data: activity
      });
      // Optionally, show a success message
    } catch (error) {
      console.error('Failed to save cognitive activity data', error);
      // Optionally, show an error message
    }
  };

  const addSimpleActivity = () => {
    if (simpleActivity.trim() !== '') {
      const newActivity = { type: simpleActivity, duration: 30, difficulty: 'Medium' as const, notes: '' };
      setActivities([...activities, newActivity]);
      saveActivity(newActivity);
      setSimpleActivity('');
    }
  };

  const addDetailedActivity = () => {
    if (detailedActivity.type !== '') {
      setActivities([...activities, detailedActivity]);
      saveActivity(detailedActivity);
      setDetailedActivity({ type: '', duration: 0, difficulty: 'Medium', notes: '' });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Cognitive Health Tracker</h2>
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
                placeholder="Enter activity (e.g., 'Solved crossword puzzle')"
                value={simpleActivity}
                onChange={(e) => setSimpleActivity(e.target.value)}
                className="flex-grow mr-2"
              />
              <Button onClick={addSimpleActivity}>Add</Button>
            </div>
          </TabsContent>
          <TabsContent value="detailed">
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Activity Type"
                value={detailedActivity.type}
                onChange={(e) => setDetailedActivity({...detailedActivity, type: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Duration (minutes)"
                value={detailedActivity.duration}
                onChange={(e) => setDetailedActivity({...detailedActivity, duration: Number(e.target.value)})}
              />
              <select
                value={detailedActivity.difficulty}
                onChange={(e) => setDetailedActivity({...detailedActivity, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard'})}
                className="w-full p-2 border rounded"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <Textarea
                placeholder="Additional notes"
                value={detailedActivity.notes}
                onChange={(e) => setDetailedActivity({...detailedActivity, notes: e.target.value})}
              />
              <Button onClick={addDetailedActivity} className="w-full">Add Detailed Activity</Button>
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Cognitive Activity Log</h3>
          <ul className="space-y-2">
            {activities.map((activity, index) => (
              <li key={index} className="bg-purple-100 p-2 rounded">
                <strong>{activity.type}</strong> - {activity.duration} minutes, Difficulty: {activity.difficulty}
                {activity.notes && <p className="text-sm mt-1">{activity.notes}</p>}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CognitiveTracker;