import React from 'react'
import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon: Icon, onClick }) => {
  return (
    <div className="bg-blue-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        <Icon className="text-blue-300 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <p className="text-blue-200 mb-4">Track and analyze your data with smart insights.</p>
      <Button onClick={onClick} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
        Open Tracker
      </Button>
    </div>
  )
}

export default FeatureCard