import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../shared/middleware/auth";
import { AuditAction } from "../../../models/AuditAction";
import { OrderDetail } from "../../../models/OrderDetail";
import axios from "axios";
import { Security } from "../../securities";

export class OrderController {
  static async placeOrder(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      /** TODO - Steps to implement:
       * 1. Save user action to database with timestamp
       * 2. Create new order record with "Submitted" status and unique order number
       * 3. Update user's account balance (add or subtract money)
       * 4. Send order to old system for processing (one at a time)
       * 5. Update order status based on result:
       *    - Success: change to "Executed" then "Completed"
       *    - Failure: change to "Failed"
       * 6. Handle errors:
       *    - If old system is down, catch error and return proper error message
       * 7. Log everything for debugging (user ID, order number, errors)
       * 8. Keep response time under 1 second (use queue if needed)
       * 9. Send back order number, status, and total cost
       */
      const { orderRefNo, fundName, transactionType, quantity } = req.body;
      const securityDetail = await Security.findOne({
        securityName: fundName,
      }).lean();

      if (!securityDetail) {
        return res.status(404).json({
          success: false,
          message: "Security detail not found",
        });
      }
      const auditAction = new AuditAction({
        userLoginDetail: req.user.id,
        userAction: "Place Order",
        startDateTime: new Date(),
        endDateTime: null,
      });
      await auditAction.save();

      const orderDetail = new OrderDetail({
        securityDetail: securityDetail._id,
        transactionType: transactionType,
        quantity: quantity,
        orderStatus: "PENDING",
        createdBy: req.user.id,
        createdOn: new Date(),
      });
      await orderDetail.save();
      const response = await axios.post("http://localhost:3001/order", {
        fundName,
        transactionType,
        quantity,
      });

      if (response.status === 200) {
        orderDetail.orderStatus = "COMPLETED";
        orderDetail.orderRefNo = response.data.orderRefNo;
        orderDetail.orderValue = response.data.unitPrice*quantity;
      
        await orderDetail.save();
      } else {
        orderDetail.orderStatus = "CANCELLED";
        await orderDetail.save();
      }
      


      return res.status(200).json({
        success: true,
        data: {
          orderRefNo: "ORD123456",
          status: "Submitted",
          orderValue: 1000,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // TODO: Implement order status logic
      res.status(200).json({
        success: true,
        data: {
          orderRefNo: req.params.orderRefNo,
          status: "Completed",
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
