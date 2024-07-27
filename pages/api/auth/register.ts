import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' })
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { username } })
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' })
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create the user
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword
        }
      })

      res.status(201).json({ message: 'User created successfully', userId: user.id })
    } catch (error) {
      console.error('Registration error:', error)
      res.status(500).json({ error: 'Failed to register user' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}