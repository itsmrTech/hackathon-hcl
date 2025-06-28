import { Router, Request, Response, NextFunction } from 'express';
import { Security } from '../models/Security';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get available securities
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const securities = await Security.find({ isActive: true }).select('securityId securityName value');

    const formattedSecurities = securities.map(security => ({
      securityId: security.securityId,
      securityName: security.securityName,
      value: security.value,
    }));

    res.status(200).json({
      success: true,
      data: formattedSecurities,
    });
  } catch (error) {
    next(error);
  }
});

export default router; 