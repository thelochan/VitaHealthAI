import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import FeatureCard from '@/components/FeatureCard'
import ModalContent from '@/components/ModalContent'
import HealthReport from '@/components/HealthReport'
import { Activity, Utensils, Moon } from 'lucide-react'
import { TierType } from '@/app/types'
import { Input } from '@/components/ui/input'

interface DashboardProps {
  handleLogout: () => void;
  userTier: TierType;
  userId: number;
  handleOpenSubscription: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ handleLogout, userTier, userId, handleOpenSubscription }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [age, setAge] = useState<number | ''>('');

  const openModal = (modalName: string) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <header className="flex justify-between items-center py-4 mb-8">
        <h1 className="text-4xl font-bold text-white">VitaHealth AI</h1>
        <div className="space-x-4">
          <Button onClick={handleOpenSubscription} className="bg-yellow-500 hover:bg-yellow-600 text-white">
            Manage Subscription
          </Button>
          <Button onClick={handleLogout} className="bg-purple-600 hover:bg-purple-700 text-white">Log Out</Button>
        </div>
      </header>
      <main>
        <div className="mb-6">
          
        </div>
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <FeatureCard title="AI Exercise Analysis" icon={Activity} onClick={() => openModal('AI Exercise Analysis')} />
          <FeatureCard title="Smart Diet Insights" icon={Utensils} onClick={() => openModal('Smart Diet Insights')} />
          <FeatureCard title="Advanced Sleep Metrics" icon={Moon} onClick={() => openModal('Advanced Sleep Metrics')} />
        </div>
        <HealthReport userTier={userTier} userId={userId} age={age} />
      </main>
      {activeModal && (
        <ModalContent 
          title={activeModal}
          onClose={closeModal}
          userTier={userTier}
          userId={userId}
        />
      )}
    </div>
  );
};

export default Dashboard