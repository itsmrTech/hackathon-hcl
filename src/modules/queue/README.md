# Queue Service

This module provides a BullMQ-based queue service for processing orders asynchronously.

## Features

- **BullMQ Integration**: Uses BullMQ for reliable job queue management
- **Redis Backend**: Redis-based queue storage with persistence
- **Priority Processing**: BUY orders have higher priority than SELL orders
- **Retry Logic**: Automatic retry with exponential backoff
- **Job Monitoring**: Track job progress and status
- **Error Handling**: Comprehensive error handling and logging

## Setup

### 1. Install Dependencies

The required dependencies are already installed:
- `bullmq`: Job queue library
- `ioredis`: Redis client

### 2. Environment Variables

Add the following environment variables to your `.env` file:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password  # Optional
```

### 3. Initialize Queue Service

Initialize the queue service when your application starts:

```typescript
import { QueueService } from './modules/queue';

// Initialize the queue service
await QueueService.initialize();
```

## Usage

### Adding Orders to Queue

```typescript
import { QueueService } from './modules/queue';
import { OrderDetail } from '../models/OrderDetail';

// Create an order
const order = new OrderDetail({
  securityDetail: 'security-id',
  orderRefNo: 'ORD-001',
  orderStatus: 'PENDING',
  transactionType: 'BUY',
  orderValue: 1000,
  createdBy: 'user-id'
});

// Add to queue
const job = await QueueService.addOrderToQueue(order);
console.log(`Job created with ID: ${job.id}`);
```

### Monitoring Queue Status

```typescript
const status = await QueueService.getQueueStatus();
console.log('Queue status:', status);
// Output: { waiting: 5, active: 2, completed: 10, failed: 1 }
```

### Graceful Shutdown

```typescript
// Close the queue service when shutting down
await QueueService.close();
```

## Configuration

### Queue Options

The queue is configured with the following default options:

- **Attempts**: 3 retry attempts
- **Backoff**: Exponential backoff starting at 2 seconds
- **Concurrency**: 5 concurrent workers
- **Priority**: BUY orders (priority 1) > SELL orders (priority 2)
- **Cleanup**: Keep last 100 completed jobs, 50 failed jobs

### Worker Events

The service automatically logs:
- Job completion events
- Job failure events with error details

## Error Handling

The service includes comprehensive error handling:

1. **Connection Errors**: Redis connection failures are handled gracefully
2. **Job Failures**: Failed jobs are retried with exponential backoff
3. **Third-party API Errors**: Simulated API failures are caught and logged
4. **Queue Errors**: Queue initialization and operation errors are handled

## Testing

The service includes a simulated third-party API call with:
- 2-second delay to simulate real API calls
- 90% success rate for testing error scenarios
- Detailed logging for debugging

## Integration with Main Application

To integrate with your main application, add the initialization to your startup sequence:

```typescript
// In your main index.ts or app startup
import { QueueService } from './modules/queue';

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Initialize queue service
    await QueueService.initialize();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}; 