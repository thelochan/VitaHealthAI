'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type SleepQuality = 'Poor' | 'Fair' | 'Good' | 'Excellent';

interface SleepRecord {
  date: string;
  duration: number;
  quality: SleepQuality;
  notes: string;
}

const SleepTracker: React.FC = () => {
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [simpleSleep, setSimpleSleep] = useState('');
  const [detailedSleep, setDetailedSleep] = useState<SleepRecord>({
    date: new Date().toISOString().split('T')[0],
    duration: 0,
    quality: 'Good',
    notes: ''
  });

  const saveSleep = async (sleep: SleepRecord) => {
    try {
      await axios.post('/api/save-data', {
        type: 'sleep',
        data: sleep
      });
      // Optionally, show a success message
    } catch (error) {
      console.error('Failed to save sleep data', error);
      // Optionally, show an error message
    }
  };

  const addSimpleSleep = () => {
    if (simpleSleep.trim() !== '') {
      const newSleep: SleepRecord = { 
        date: new Date().toISOString().split('T')[0], 
        duration: Number(simpleSleep), 
        quality: 'Good', 
        notes: '' 
      };
      setSleepRecords([...sleepRecords, newSleep]);
      saveSleep(newSleep);
      setSimpleSleep('');
    }
  };

  const addDetailedSleep = () => {
    if (detailedSleep.duration > 0) {
      setSleepRecords([...sleepRecords, detailedSleep]);
      saveSleep(detailedSleep);
      setDetailedSleep({ date: new Date().toISOString().split('T')[0], duration: 0, quality: 'Good', notes: '' });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Sleep Tracker</h2>
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
                type="number"
                placeholder="Sleep duration (hours)"
                value={simpleSleep}
                onChange={(e) => setSimpleSleep(e.target.value)}
                className="flex-grow mr-2"
              />
              <Button onClick={addSimpleSleep}>Add</Button>
            </div>
          </TabsContent>
          <TabsContent value="detailed">
            <div className="space-y-4">
              <Input
                type="date"
                value={detailedSleep.date}
                onChange={(e) => setDetailedSleep({...detailedSleep, date: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Sleep duration (hours)"
                value={detailedSleep.duration}
                onChange={(e) => setDetailedSleep({...detailedSleep, duration: Number(e.target.value)})}
              />
              <select
                value={detailedSleep.quality}
                onChange={(e) => setDetailedSleep({...detailedSleep, quality: e.target.value as 'Poor' | 'Fair' | 'Good' | 'Excellent'})}
                className="w-full p-2 border rounded"
              >
                <option value="Poor">Poor</option>
                <option value="Fair">Fair</option>
                <option value="Good">Good</option>
                <option value="Excellent">Excellent</option>
              </select>
              <Textarea
                placeholder="Additional notes"
                value={detailedSleep.notes}
                onChange={(e) => setDetailedSleep({...detailedSleep, notes: e.target.value})}
              />
              <Button onClick={addDetailedSleep} className="w-full">Add Detailed Sleep Record</Button>
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Sleep Log</h3>
          <ul className="space-y-2">
            {sleepRecords.map((record, index) => (
              <li key={index} className="bg-blue-100 p-2 rounded">
                <strong>{record.date}</strong> - {record.duration} hours, Quality: {record.quality}
                {record.notes && <p className="text-sm mt-1">{record.notes}</p>}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepTracker;