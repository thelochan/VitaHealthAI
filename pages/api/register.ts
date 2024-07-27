import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' })
      }

      const user = await prisma.user.create({
        data: {
          username,
          password, // Note: In a real app, you should hash the password
        },
      })

      res.status(201).json({ message: 'User created successfully', userId: user.id })
    } catch (error: any) {
      console.error('Registration error:', error)
      res.status(500).json({ error: 'Failed to register user', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}