'use client'

import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard'
import SubscriptionModal from '@/components/SubscriptionModal'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'

export const TIERS = {
  FREE: 'Free',
  BASIC: 'Basic',
  PREMIUM: 'Premium'
} as const;

export type TierType = typeof TIERS[keyof typeof TIERS];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number>(1); // Simulated user ID
  const [userTier, setUserTier] = useState<TierType>(TIERS.FREE);
  const [showSubscription, setShowSubscription] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);
  const handleOpenSubscription = () => setShowSubscription(true);
  const handleCloseSubscription = () => setShowSubscription(false);
  const handleUpgrade = (newTier: TierType) => {
    setUserTier(newTier);
    setShowSubscription(false);
    alert(`Upgraded to ${newTier} tier! (Simulated)`);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Card className="bg-gradient-to-br from-blue-800 to-purple-800 border border-purple-500">
          <CardHeader>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Welcome to VitaHealth AI</h1>
          </CardHeader>
          <CardContent>
            <p className="text-blue-200 mb-4">Your personal AI-powered health tracking assistant</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleLogin} className="w-full bg-purple-600 hover:bg-purple-700 text-white">Log In</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Dashboard 
        handleLogout={handleLogout}  // Changed from onLogout to handleLogout
        userTier={userTier}
        userId={userId}
        handleOpenSubscription={handleOpenSubscription}  // Changed from onOpenSubscription to handleOpenSubscription
      />
      {showSubscription && (
        <SubscriptionModal 
          onClose={handleCloseSubscription}
          currentTier={userTier}
          onUpgrade={handleUpgrade}
        />
      )}
    </div>
  );
}