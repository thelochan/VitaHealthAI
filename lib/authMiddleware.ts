// lib/authMiddleware.ts

import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

// Extend the NextApiRequest type to include the user property
interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: number;
    email: string;
  }
}

export function authMiddleware(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const token = req.cookies.token
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, email: string }
      req.user = decoded

      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }
}