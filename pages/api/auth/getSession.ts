// lib/getSession.ts
import { NextApiRequest } from 'next'
import jwt from 'jsonwebtoken'

export async function getSession(req: NextApiRequest) {
  const token = req.cookies.token

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, username: string }
    return decoded
  } catch (error) {
    return null
  }
}