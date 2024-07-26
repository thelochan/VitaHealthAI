// components/HealthReport.tsx
'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ReportDetails {
  [key: string]: string;
}

interface Report {
  summary: string;
  details: ReportDetails;
  score: number;
}

const HealthReport: React.FC = () => {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchReport = async () => {
    setLoading(true)
    try {
      const response = await axios.get<Report>('/api/get-report')
      setReport(response.data)
    } catch (error) {
      console.error('Failed to fetch health report', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Health Report</h2>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading your health report...</p>
        ) : report ? (
          <>
            <p className="text-xl font-semibold mb-4">{report.summary}</p>
            <ul className="space-y-2">
              {Object.entries(report.details).map(([key, value]) => (
                <li key={key} className="bg-purple-100 p-2 rounded">
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Click the button below to generate your health report.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={fetchReport} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          {loading ? 'Generating Report...' : 'Generate Health Report'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default HealthReport