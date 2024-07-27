import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body

      const user = await prisma.user.findUnique({ where: { username } })
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid credentials' })
      }

      res.status(200).json({ message: 'Login successful', userId: user.id })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ error: 'Failed to login' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}