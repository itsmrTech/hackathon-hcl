import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middleware/auth";
import { AuditAction } from "../../../models/AuditAction";
import { OrderDetail } from "../../../models/OrderDetail";
import { Security } from "../../securities";
import { QueueService } from "../../queue/services/queueService";
import { ILoggedInRequest } from "../../../shared/interface";

export class OrderController {
  static async placeOrder(
    req: ILoggedInRequest,
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

      // Calculate order value
      const orderValue = quantity * securityDetail.value;

      // Create audit action and order detail in parallel
      const [auditAction, orderDetail] = await Promise.all([
        new AuditAction({
          userLoginDetail: req.user.id,
          userAction: "Place Order",
          startDateTime: new Date(),
          endDateTime: null,
        }).save(),
        new OrderDetail({
          securityDetail: securityDetail._id,
          transactionType: transactionType,
          orderValue: orderValue,
          orderStatus: "PENDING",
          createdBy: req.user.id,
          createdOn: new Date(),
          quantity: quantity,
        }).save()
      ]);

      // Add order to queue for processing
      try {
        if(Date.now()-auditAction.startDateTime.getTime()>1000){
          auditAction.endDateTime = new Date();
          await auditAction.save();
          return res.status(500).json({
            success: false,
            message: "Failed to process order. Please try again later.",
          });
        }
        await QueueService.addOrderToQueue(orderDetail);
        
        // Update audit action end time
        auditAction.endDateTime = new Date();
        await auditAction.save();

        return res.status(200).json({
          success: true,
          data: {
            orderRefNo: orderDetail.orderRefNo || `ORD${orderDetail._id}`,
            status: "Submitted",
            orderValue: orderValue,
            message: "Order has been queued for processing"
          },
        });
      } catch (queueError) {
        console.error('Failed to add order to queue:', queueError);
        
        // Update order status and audit action end time in parallel
        await Promise.all([
          OrderDetail.findByIdAndUpdate(orderDetail._id, { orderStatus: "CANCELLED" }),
          AuditAction.findByIdAndUpdate(auditAction._id, { endDateTime: new Date() })
        ]);

        return res.status(500).json({
          success: false,
          message: "Failed to process order. Please try again later.",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async getOrderStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { orderRefNo } = req.params;
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }
      
      const order = await OrderDetail.findOne({ 
        orderRefNo: orderRefNo,
        createdBy: req.user.id 
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          orderRefNo: order.orderRefNo,
          status: order.orderStatus,
          orderValue: order.orderValue,
          transactionType: order.transactionType,
          createdOn: order.createdOn,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getQueueStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const status = await QueueService.getQueueStatus();
      
      return res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error) {
      next(error);
    }
  }
}
