// pages/api/auth/check-auth.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../../lib/auth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number, email: string }
      res.status(200).json({ userId: decoded.userId })
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}