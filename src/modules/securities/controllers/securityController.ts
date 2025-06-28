import { Request, Response, NextFunction } from 'express';

export class SecurityController {
  static async getSecurities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // TODO: Implement securities fetching logic
      res.status(200).json({
        success: true,
        data: [
          {
            securityId: 1,
            securityName: 'Fund A',
            value: 100,
          },
          {
            securityId: 2,
            securityName: 'Fund B',
            value: 200,
          },
        ],
      });
    } catch (error) {
      next(error);
    }
  }
} 