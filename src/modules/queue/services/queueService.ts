import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { IOrderDetail } from "../../../models/OrderDetail";
import { OrderDetail } from "../../../models/OrderDetail";
import axios from 'axios';

export class QueueService {
    private static redis: Redis;
    private static orderQueue: Queue;
    private static orderWorker: Worker;

    static async initialize() {
        // Initialize Redis connection
        const redisConfig: any = {
            host: process.env['REDIS_HOST'] || 'localhost',
            port: parseInt(process.env['REDIS_PORT'] || '6379'),
            maxRetriesPerRequest: null,
        };

        // Only add password if it exists
        if (process.env['REDIS_PASSWORD']) {
            redisConfig.password = process.env['REDIS_PASSWORD'];
        }

        this.redis = new Redis(redisConfig);

        // Initialize order queue
        this.orderQueue = new Queue('order-processing', {
            connection: this.redis,
        });

        // Initialize order worker
        this.orderWorker = new Worker('order-processing', this.processOrderJob, {
            connection: this.redis,
        });

        // Handle worker events
        this.orderWorker.on('completed', (job) => {
            console.log(`Job ${job.id} completed successfully`);
        });

        this.orderWorker.on('failed', (job, err) => {
            console.error(`Job ${job.id} failed:`, err);
        });

        console.log('QueueService initialized successfully');
    }

    static async addOrderToQueue(order: IOrderDetail) {
        if (!this.orderQueue) {
            throw new Error('Queue not initialized. Call initialize() first.');
        }

        const job = await this.orderQueue.add('process-order', {
            orderId: order._id,
            orderRefNo: order.orderRefNo,
            transactionType: order.transactionType,
            orderValue: order.orderValue,
            securityDetail: order.securityDetail,
            createdBy: order.createdBy,
        }, {
            priority: order.transactionType === 'BUY' ? 1 : 2, // BUY orders have higher priority
            delay: 0, // Process immediately
        });

        console.log(`Order ${order.orderRefNo} added to queue with job ID: ${job.id}`);
        return job;
    }

    private static async processOrderJob(job: Job) {
        const { orderId, orderRefNo, transactionType, orderValue, securityDetail, createdBy } = job.data;
        
        console.log(`Processing order: ${orderRefNo}`);
        
        try {
            // Update job progress
            await job.updateProgress(25);

            // Create a simplified order object for the third-party call
            const orderData = {
                _id: orderId,
                orderRefNo,
                transactionType,
                orderValue,
                securityDetail,
                createdBy,
                orderStatus: 'PENDING',
                createdOn: new Date(),
            };

            // Update job progress
            await job.updateProgress(50);

            // Simulate third-party API call
            const result = await this.callThirdPartyPlaceOrder(orderData);

            // Update job progress
            await job.updateProgress(75);

            // Update order status in database
            await this.updateOrderStatus(orderId, result.success ? 'COMPLETED' : 'CANCELLED', result.orderRefNo);

            // Update job progress
            await job.updateProgress(100);
            
            return { success: true, orderRefNo: result.orderRefNo };
        } catch (error) {
            console.error(`Failed to process order ${orderRefNo}:`, error);
            
            // Update order status to cancelled on error
            await this.updateOrderStatus(orderId, 'CANCELLED');
            
            throw error;
        }
    }

    private static async updateOrderStatus(orderId: string, status: 'PENDING' | 'COMPLETED' | 'CANCELLED', orderRefNo?: string) {
        try {
            const updateData: any = { orderStatus: status };
            if (orderRefNo) {
                updateData.orderRefNo = orderRefNo;
            }

            await OrderDetail.findByIdAndUpdate(orderId, updateData);
            console.log(`Updated order ${orderId} status to ${status}`);
        } catch (error) {
            console.error(`Failed to update order status for ${orderId}:`, error);
            throw error;
        }
    }

    private static async callThirdPartyPlaceOrder(order: Partial<IOrderDetail> & { orderRefNo: string }) {
        try {
            // Call third-party API using axios
            const response = await axios.post('http://localhost:3001/order', {
                securityDetail: order.securityDetail,
                transactionType: order.transactionType,
                quantity: order.quantity,
            });
            
            if (response.status !== 200) {
                throw new Error('Third-party API call failed');
            }

            console.log(`Successfully placed order with third-party: ${order.orderRefNo}`);
            return { success: true, orderRefNo: order.orderRefNo };
        } catch (error) {
            console.error('Error calling third-party place order:', error);
            throw error;
        }
    }

    static async getQueueStatus() {
        if (!this.orderQueue) {
            throw new Error('Queue not initialized');
        }

        const waiting = await this.orderQueue.getWaiting();
        const active = await this.orderQueue.getActive();
        const completed = await this.orderQueue.getCompleted();
        const failed = await this.orderQueue.getFailed();

        return {
            waiting: waiting.length,
            active: active.length,
            completed: completed.length,
            failed: failed.length,
        };
    }

    static async close() {
        if (this.orderWorker) {
            await this.orderWorker.close();
        }
        if (this.orderQueue) {
            await this.orderQueue.close();
        }
        if (this.redis) {
            await this.redis.quit();
        }
        console.log('QueueService closed successfully');
    }
}