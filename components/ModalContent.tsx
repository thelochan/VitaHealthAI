'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { TierType, TIERS } from '@/app/page';
import ExerciseTracker from './ExerciseTracker';
import DietTracker from './DietTracker';
import SleepTracker from './SleepTracker';
import CognitiveTracker from './CognitiveTracker';

interface ModalContentProps {
  title: string;
  onClose: () => void;
  userTier: TierType;
  userId: number;
}

const ModalContent: React.FC<ModalContentProps> = ({ title, onClose, userTier, userId }) => {
  const renderContent = () => {
    switch (title.toLowerCase()) {
      case 'ai exercise analysis':
        return <ExerciseTracker userId={userId} />;
      case 'smart diet insights':
        return <DietTracker userId={userId} />;
      case 'advanced sleep metrics':
        return <SleepTracker userId={userId} />;
      case 'cognitive health tracking':
        return <CognitiveTracker userId={userId} />;
      default:
        return <p className="text-blue-200">This is a placeholder for the {title} functionality.</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="bg-gradient-to-br from-blue-900 to-purple-900 text-white max-w-4xl w-full border border-purple-500 overflow-y-auto max-h-[90vh]">
        <CardHeader>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{title}</h2>
        </CardHeader>
        <CardContent>
          {renderContent()}
          <p className="text-blue-200 mt-2">Your current tier: {userTier}</p>
          {userTier !== TIERS.PREMIUM && (
            <p className="text-yellow-300 mt-2">Upgrade to Premium for advanced AI-powered analysis!</p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={onClose} className="w-full bg-purple-600 hover:bg-purple-700 text-white">Close</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ModalContent;