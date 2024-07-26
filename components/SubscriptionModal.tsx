import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { TierType, TIERS } from '../app/tiers';  // Adjust the import path as needed

const TIER_FEATURES = {
  [TIERS.FREE]: [
    'Basic health tracking',
    'Daily wellness check',
    'Limited historical data (30 days)'
  ],
  [TIERS.BASIC]: [
    'All Free features',
    'Detailed insights and trends',
    'Personalized recommendations',
    '90 days of historical data'
  ],
  [TIERS.PREMIUM]: [
    'All Basic features',
    'Advanced AI-powered analysis',
    'Unlimited historical data',
    'Priority customer support',
    'Exclusive wellness content'
  ]
};

const TIER_PRICES = {
  [TIERS.FREE]: 'Free',
  [TIERS.BASIC]: '$9.99/month',
  [TIERS.PREMIUM]: '$19.99/month'
};

interface SubscriptionModalProps {
  onClose: () => void;
  currentTier: TierType;
  onUpgrade: (tier: TierType) => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose, currentTier, onUpgrade }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <Card className="bg-gradient-to-br from-blue-900 to-purple-900 text-white max-w-4xl w-full border border-purple-500">
      <CardHeader>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Subscription Plans</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(TIERS).map(tier => (
            <Card key={tier} className={`p-4 ${tier === currentTier ? 'bg-purple-700' : 'bg-purple-800'}`}>
              <CardHeader>
                <h3 className="text-xl font-semibold">{tier}</h3>
                <p className="text-2xl font-bold">{TIER_PRICES[tier]}</p>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  {TIER_FEATURES[tier].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {tier !== currentTier && (
                  <Button onClick={() => onUpgrade(tier)} className="w-full bg-blue-500 hover:bg-blue-600">
                    Upgrade
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onClose} className="w-full bg-purple-600 hover:bg-purple-700 text-white">Close</Button>
      </CardFooter>
    </Card>
  </div>
);

export default SubscriptionModal;