import cron from 'node-cron';
import { OrderDetail } from '../../../models';
import { OrderService } from '../../order/services/orderService';

export class CronService {
  static initialize(): void {
    // Run every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      console.log('Checking for old pending orders...');
      
      try {
        // Find orders older than 10 minutes that are still pending
        const cutoffTime = new Date();
        cutoffTime.setMinutes(cutoffTime.getMinutes() - 10);
        
        const oldOrders = await OrderDetail.find({
          orderStatus: 'PENDING',
          createdOn: { $lt: cutoffTime }
        }).lean();
        
        console.log(`Found ${oldOrders.length} old pending orders`);
        
        // Cancel each old order
        if (oldOrders.length > 0) {
          const orderIds = oldOrders.map(order => order._id);
          
          await OrderDetail.updateMany(
            { _id: { $in: orderIds } },
            { 
              $set: { 
                orderStatus: 'CANCELLED',
                updatedOn: new Date()
              }
            }
          );
          
          console.log(`Cancelled orders: ${orderIds.join(', ')}`);
        }
        
        if (oldOrders.length > 0) {
          console.log(`Cancelled ${oldOrders.length} old pending orders`);
        }
      } catch (error) {
        console.error('Error in cron job:', error);
      }
    }, {
      timezone: 'UTC'
    });
    
    console.log('Cron job scheduled to run every 5 minutes');
  }
}
