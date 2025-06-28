import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        accountBalance,
        createdAt,
        updatedAt,
      } = req.body;

      if (!email || !password || !firstName || !lastName || accountBalance === undefined) {
        void res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
      }

      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password, // 🚨 In production, hash this
        firstName,
        lastName,
        accountBalance,
        createdAt: createdAt || new Date(),
        updatedAt: updatedAt || new Date(),
      };

      const token = generateToken({ id: newUser.id, email: newUser.email });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        data: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          accountBalance: newUser.accountBalance,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;

      const mockUser = {
        id: 'user-id',
        username: 'john.doe',
        password: 'Password123',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      if (!username || !password) {
        void res.status(400).json({ success: false, message: 'Username and password are required.' });
        return;
      }

      if (username !== mockUser.username || password !== mockUser.password) {
        void res.status(401).json({ success: false, message: 'Invalid username or password.' });
        return;
      }

      const token = generateToken({ id: mockUser.id, email: mockUser.email });

      res.status(200).json({
        success: true,
        token,
        data: {
          id: mockUser.id,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
