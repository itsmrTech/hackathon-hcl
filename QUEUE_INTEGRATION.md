# Queue Integration for Order Processing

## Overview

The order processing system now uses a Redis-based queue (BullMQ) to handle order processing asynchronously. This ensures that:

1. **Fast Response Times**: Orders are immediately queued and the API responds quickly
2. **Reliable Processing**: Failed orders are retried automatically
3. **Scalability**: Multiple workers can process orders concurrently
4. **Monitoring**: Queue status can be monitored in real-time

## Architecture

### Components

1. **QueueService** (`src/modules/queue/services/queueService.ts`)
   - Manages Redis connection
   - Handles order queue operations
   - Processes orders asynchronously
   - Updates order status in database

2. **OrderController** (`src/modules/order/controllers/orderController.ts`)
   - Receives order requests
   - Validates orders
   - Adds orders to queue
   - Returns immediate response

3. **Order Processing Worker**
   - Runs in background
   - Processes queued orders
   - Calls third-party APIs
   - Updates order status

## API Endpoints

### Place Order
```
POST /api/order
Content-Type: application/json

{
  "fundName": "Fund Name",
  "transactionType": "BUY" | "SELL",
  "quantity": 100
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderRefNo": "ORD123456",
    "status": "Submitted",
    "orderValue": 1000,
    "message": "Order has been queued for processing"
  }
}
```

### Get Order Status
```
GET /api/order/{orderRefNo}/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderRefNo": "ORD123456",
    "status": "COMPLETED" | "PENDING" | "CANCELLED",
    "orderValue": 1000,
    "transactionType": "BUY",
    "createdOn": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Queue Status (Admin)
```
GET /api/order/queue/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "waiting": 5,
    "active": 2,
    "completed": 100,
    "failed": 3
  }
}
```

## Order Processing Flow

1. **Order Submission**
   - User submits order via API
   - Order is validated and saved to database with "PENDING" status
   - Order is added to Redis queue
   - API immediately responds with "Submitted" status

2. **Queue Processing**
   - Background worker picks up order from queue
   - Worker calls third-party API to place order
   - Order status is updated based on API response:
     - Success: "COMPLETED"
     - Failure: "CANCELLED"

3. **Status Updates**
   - Order status is updated in database
   - User can check status via status endpoint
   - Failed orders are logged for debugging

## Configuration

### Environment Variables

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Queue Settings

- **Priority**: BUY orders have higher priority (1) than SELL orders (2)
- **Retry**: Failed jobs are automatically retried
- **Concurrency**: Multiple workers can process orders simultaneously
- **Progress Tracking**: Job progress is tracked and logged

## Error Handling

- **Queue Failures**: If queue is unavailable, orders are marked as "CANCELLED"
- **Third-party API Failures**: Orders are marked as "CANCELLED" and logged
- **Database Errors**: Errors are logged and thrown for proper handling
- **Network Issues**: Automatic retries with exponential backoff

## Monitoring

- Queue status can be monitored via `/api/order/queue/status`
- Job completion and failure events are logged
- Order status changes are tracked in database
- Audit trail is maintained for all order operations

## Benefits

1. **Performance**: API responses are under 1 second
2. **Reliability**: Orders are processed reliably even under high load
3. **Scalability**: System can handle increased order volume
4. **Monitoring**: Real-time visibility into order processing
5. **Error Recovery**: Automatic retry and error handling 