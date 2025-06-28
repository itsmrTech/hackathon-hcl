import { QueueService } from './services/queueService';

export { QueueService };

// Example usage:
/*
import { QueueService } from './modules/queue';
import { OrderDetail } from '../models/OrderDetail';

// Initialize the queue service (call this when your app starts)
await QueueService.initialize();

// Add an order to the queue
const order = new OrderDetail({
  securityDetail: 'some-security-id',
  orderRefNo: 'ORD-001',
  orderStatus: 'PENDING',
  transactionType: 'BUY',
  orderValue: 1000,
  createdBy: 'user-id'
});

await QueueService.addOrderToQueue(order);

// Get queue status
const status = await QueueService.getQueueStatus();
console.log('Queue status:', status);

// Close the queue service when shutting down
await QueueService.close();
*/ 