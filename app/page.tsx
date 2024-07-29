'use client'

import { useState, useEffect } from 'react'
import LoginForm from '@/components/LoginForm'
import Dashboard from '@/components/Dashboard'
import { TierType, TIERS } from './types'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [userTier, setUserTier] = useState<TierType>(TIERS.FREE)

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/auth/check-auth')
        if (response.ok) {
          const data = await response.json()
          setIsLoggedIn(true)
          setUserId(data.userId)
          // Fetch user tier here
        } else if (response.status === 401) {
          // Token expired, try to refresh
          const refreshResponse = await fetch('/api/auth/refresh-token', { method: 'POST' })
          if (refreshResponse.ok) {
            // Token refreshed successfully, retry auth check
            const retryResponse = await fetch('/api/auth/check-auth')
            if (retryResponse.ok) {
              const data = await retryResponse.json()
              setIsLoggedIn(true)
              setUserId(data.userId)
              // Fetch user tier here
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
      }
    }

    checkLoginStatus()
  }, [])

  const handleLogin = (newUserId: number) => {
    setIsLoggedIn(true)
    setUserId(newUserId)
    // You might want to fetch the user's tier here
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsLoggedIn(false)
      setUserId(null)
      setUserTier(TIERS.FREE)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleOpenSubscription = () => {
    // Implement subscription logic here
    console.log('Open subscription modal')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {isLoggedIn && userId ? (
        <Dashboard 
          handleLogout={handleLogout}
          userTier={userTier}
          userId={userId}
          handleOpenSubscription={handleOpenSubscription}
        />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Login to VitaHealth AI</h2>
            <LoginForm onLogin={handleLogin} />
          </div>
        </div>
      )}
    </div>
  )
}