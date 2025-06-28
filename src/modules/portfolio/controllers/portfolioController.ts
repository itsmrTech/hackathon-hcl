// import { Response, NextFunction } from 'express';
// import { AuthRequest } from '../../../shared/middleware/auth';

// export class PortfolioController {
//   static async getSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
//     try {
//       // TODO: Implement portfolio summary logic
//       res.status(200).json({
//         success: true,
//         data: {
//           accountRunningBalance: 10000,
//           summaries: [
//             {
//               orderDate: '2024-01-01',
//               orderRefNo: 'ORD123456',
//               fundName: 'Sample Fund',
//               transactionType: 'Buy',
//               credit: 0,
//               debit: 1000,
//               runningBalance: 9000,
//             },
//           ],
//         },
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// } 

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Portfolio, { IPortfolio } from '../models/portfolio';

export const createPortfolioEntry = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const portfolioData: Partial<IPortfolio> = req.body;

    const portfolio = new Portfolio(portfolioData);
    const saved = await portfolio.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating portfolio entry' });
  }
};

export const getAllPortfolios = async (_req: Request, res: Response): Promise<void> => {
  try {
    const portfolios = await Portfolio.find().sort({ createdAt: -1 });
    res.status(200).json(portfolios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving portfolios' });
  }
};
