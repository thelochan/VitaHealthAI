// components/Dashboard.tsx
'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import FeatureCard from './FeatureCard';
import ModalContent from './ModalContent';
import HealthReport from './HealthReport';
import { Activity, Brain, Utensils, Moon } from 'lucide-react';
import { TierType } from '@/app/tiers';

interface DashboardProps {
  onLogout: () => void;
  userTier: TierType;
  onOpenSubscription: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, userTier, onOpenSubscription }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalName: string) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">VitaHealth AI</h1>
        <div className="flex space-x-4">
          <Button onClick={onOpenSubscription} className="bg-yellow-500 hover:bg-yellow-600 text-white">
            Manage Subscription
          </Button>
          <Button onClick={onLogout} className="bg-purple-600 hover:bg-purple-700 text-white">Log Out</Button>
        </div>
      </header>
      <main className="flex flex-col space-y-4 max-w-md mx-auto w-full">
        <FeatureCard title="AI Exercise Analysis" icon={Activity} onClick={() => openModal('AI Exercise Analysis')} />
        <FeatureCard title="Smart Diet Insights" icon={Utensils} onClick={() => openModal('Smart Diet Insights')} />
        <FeatureCard title="Advanced Sleep Metrics" icon={Moon} onClick={() => openModal('Advanced Sleep Metrics')} />
        <FeatureCard title="Cognitive Health Tracking" icon={Brain} onClick={() => openModal('Cognitive Health Tracking')} isPremium={true} />
      </main>
      <div className="mt-8">
        <HealthReport />
      </div>
      {activeModal && (
        <ModalContent 
          title={activeModal}
          onClose={closeModal}
          userTier={userTier}
        />
      )}
    </div>
  );
};

export default Dashboard;