import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
];

router.post('/login', validateLogin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid input data', details: errors.array() }
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    \    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(200).json({
      success: true,
      data: {
        sessionId: token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'Logged out',
    },
  });
});

export default router; 