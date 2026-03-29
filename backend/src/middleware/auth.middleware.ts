import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

const authMiddleware = (roles: string[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { id: string; email: string; role: string }

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access forbidden' })
      }

      req.user = decoded
      next()
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' })
    }
  }
}

export default authMiddleware