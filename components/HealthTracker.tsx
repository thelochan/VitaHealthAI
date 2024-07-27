import React, { useState } from 'react'

interface HealthTrackerProps {
  userId: number
}

const TEST_USER_ID = 1;

const HealthTracker: React.FC<HealthTrackerProps> = ({ userId }) => {
  const [type, setType] = useState('exercise')
  const [data, setData] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/save-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, type, data: JSON.parse(data) })
    })
    if (response.ok) {
      alert('Data saved successfully')
      setData('')
    } else {
      alert('Failed to save data')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="exercise">Exercise</option>
        <option value="diet">Diet</option>
        <option value="sleep">Sleep</option>
        <option value="cognitive">Cognitive</option>
      </select>
      <textarea
        value={data}
        onChange={(e) => setData(e.target.value)}
        placeholder="Enter JSON data"
        required
      />
      <button type="submit">Save Data</button>
    </form>
  )
}

export default HealthTracker