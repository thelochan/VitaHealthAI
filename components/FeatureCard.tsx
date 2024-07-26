import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
  isPremium?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon: Icon, onClick, isPremium = false }) => (
  <Card className={`bg-gradient-to-br ${isPremium ? 'from-indigo-800 to-purple-800' : 'from-blue-800 to-purple-800'} text-white shadow-lg border ${isPremium ? 'border-yellow-500' : 'border-purple-500'} hover:shadow-xl transition-all duration-300`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <h3 className="text-xl font-semibold text-blue-300">{title}</h3>
      <Icon className="h-6 w-6 text-blue-300" />
    </CardHeader>
    <CardContent>
      <p className="text-sm text-blue-200">
        {isPremium ? "Access advanced AI-powered insights and personalized recommendations." : "Track and analyze your data with smart insights."}
      </p>
    </CardContent>
    <CardFooter>
      <Button onClick={onClick} className={`w-full ${isPremium ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
        Open Tracker
      </Button>
    </CardFooter>
    {isPremium && <Badge className="absolute top-2 right-2 bg-yellow-500 text-xs">Premium</Badge>}
  </Card>
);

export default FeatureCard;