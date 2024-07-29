// pages/api/auth/refresh-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import { verifyToken, generateAccessToken, JWT_REFRESH_SECRET } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token not found' });
    }

    try {
      const decoded = verifyToken(refreshToken, JWT_REFRESH_SECRET);
      
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      const accessToken = generateAccessToken(decoded.userId, decoded.email);

      res.setHeader('Set-Cookie', cookie.serialize('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 900, // 15 minutes
        path: '/'
      }));

      res.status(200).json({ message: 'Token refreshed successfully' });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}