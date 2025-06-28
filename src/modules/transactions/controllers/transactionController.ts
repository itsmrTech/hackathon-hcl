import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { OrderDetail } from '../../../models/OrderDetail';
import { AssetDetail } from '../../../models/Assetdetails';
import { AuditAction } from '../../../models/AuditAction';

export class TransactionController {
  static async getTransactionHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log('👉 Received request for transaction history');
    console.log('🔍 Incoming query:', req.query);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('❌ Validation failed:', errors.array());
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const {
      orderRefNo,
      securityName,
      transactionType,
      orderStatus,
      fromDate,
      toDate,
      page = '1',
      limit = '10',
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    console.log('📄 Pagination values => Page:', pageNum, 'Limit:', limitNum);

    if (
      !orderRefNo &&
      !securityName &&
      !transactionType &&
      !orderStatus &&
      !fromDate &&
      !toDate
    ) {
      console.error('❌ No search filters provided');
      res.status(400).json({
        success: false,
        message: 'At least one search filter must be provided.',
      });
      return;
    }

    try {
      console.log("welcome")
      const query: any = {};
      if (orderRefNo) query.orderRefNo = orderRefNo;
      if (transactionType) query.transactionType = transactionType;
      if (orderStatus) query.orderStatus = orderStatus;
      if (fromDate || toDate) {
        query.orderDate = {};
        if (fromDate) query.orderDate.$gte = new Date(fromDate as string);
        if (toDate) query.orderDate.$lte = new Date(toDate as string);
      }

      console.log('🧮 Final MongoDB query:', query);

      const skip = (pageNum - 1) * limitNum;

      const [transactions, total] = await Promise.all([
        OrderDetail.find(query)
          .populate({ path: 'assetDetail', model: 'AssetDetail' })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        OrderDetail.countDocuments(query),
      ]);

      console.log('📦 Fetched transactions:', transactions);
      console.log(`📊 Total records: ${total}, Total Pages: ${Math.ceil(total / limitNum)}`);

      const audit = new AuditAction({
        action: 'TRANSACTION_HISTORY_VIEW',
        user: (req as any).user?.id,
        details: req.query,
        timestamp: new Date(),
      });

      await audit.save();
      console.log('📝 Audit log saved:', audit);

      res.status(200).json({
        success: true,
        data: {
          transactions,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
          },
        },
      });
    } catch (err) {
      console.error('🔥 Error in getTransactionHistory:', err);
      next(err);
    }
  }
}
