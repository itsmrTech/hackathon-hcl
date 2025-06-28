import { Response, NextFunction } from 'express';
import { OrderController } from '../controllers/orderController';
import { Security } from '../../../modules/securities';
import { AuditAction } from '../../../models/AuditAction';
import { OrderDetail } from '../../../models/OrderDetail';
import { QueueService } from '../../../modules/queue/services/queueService';
import { ILoggedInRequest } from '../../../shared/interface';
import { AuthRequest } from '../../../middleware/auth';

// Mock all dependencies
jest.mock('../../../modules/securities');
jest.mock('../../../models/AuditAction');
jest.mock('../../../models/OrderDetail');
jest.mock('../../../modules/queue/services/queueService');

const mockSecurity = Security as jest.Mocked<typeof Security>;
const mockAuditAction = AuditAction as jest.Mocked<typeof AuditAction>;
const mockOrderDetail = OrderDetail as jest.Mocked<typeof OrderDetail>;
const mockQueueService = QueueService as jest.Mocked<typeof QueueService>;

describe('OrderController', () => {
  let mockRequest: Partial<ILoggedInRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      user: {
        id: 'user123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      },
      body: {
        orderRefNo: 'ORD123',
        fundName: 'Test Fund',
        transactionType: 'BUY',
        quantity: 100
      }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    mockSecurity.findOne = jest.fn();
    mockAuditAction.prototype.save = jest.fn();
    mockOrderDetail.prototype.save = jest.fn();
    mockQueueService.addOrderToQueue = jest.fn();
    mockQueueService.getQueueStatus = jest.fn();
  });

  describe('placeOrder', () => {
    it('should successfully place an order', async () => {
      const mockSecurityData = {
        _id: 'security123',
        securityName: 'Test Fund',
        value: 50
      };
      const mockAuditActionInstance = {
        _id: 'audit123',
        startDateTime: new Date(),
        endDateTime: null,
        save: jest.fn().mockResolvedValue(true)
      };
      const mockOrderDetailInstance = {
        _id: 'order123',
        orderRefNo: 'ORD123',
        orderValue: 5000,
        save: jest.fn().mockResolvedValue(true)
      };

      mockSecurity.findOne.mockResolvedValue(mockSecurityData);
      (mockAuditAction as any).mockImplementation(() => mockAuditActionInstance);
      (mockOrderDetail as any).mockImplementation(() => mockOrderDetailInstance);
      mockQueueService.addOrderToQueue.mockResolvedValue({ id: 'job123' } as any);

      await OrderController.placeOrder(
        mockRequest as ILoggedInRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockSecurity.findOne).toHaveBeenCalledWith({
        securityName: 'Test Fund'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          orderRefNo: 'ORD123',
          status: 'Submitted',
          orderValue: 5000,
          message: 'Order has been queued for processing'
        }
      });
    });

    it('should return 404 when security detail not found', async () => {
      mockSecurity.findOne.mockResolvedValue(null);

      await OrderController.placeOrder(
        mockRequest as ILoggedInRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Security detail not found'
      });
    });
  });

  describe('getOrderStatus', () => {
    let mockAuthRequest: Partial<AuthRequest>;

    beforeEach(() => {
      mockAuthRequest = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        },
        params: {
          orderRefNo: 'ORD123'
        }
      };
    });

    it('should successfully get order status', async () => {
      const mockOrder = {
        orderRefNo: 'ORD123',
        orderStatus: 'COMPLETED',
        orderValue: 5000,
        transactionType: 'BUY',
        createdOn: new Date('2024-01-01')
      };

      mockOrderDetail.findOne.mockResolvedValue(mockOrder);

      await OrderController.getOrderStatus(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockOrderDetail.findOne).toHaveBeenCalledWith({
        orderRefNo: 'ORD123',
        createdBy: 'user123'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          orderRefNo: 'ORD123',
          status: 'COMPLETED',
          orderValue: 5000,
          transactionType: 'BUY',
          createdOn: new Date('2024-01-01')
        }
      });
    });

    it('should return 401 when user is not authenticated', async () => {
      mockAuthRequest.user = undefined as any;

      await OrderController.getOrderStatus(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not authenticated'
      });
    });
  });

  describe('getQueueStatus', () => {
    let mockAuthRequest: Partial<AuthRequest>;

    beforeEach(() => {
      mockAuthRequest = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        }
      };
    });

    it('should successfully get queue status', async () => {
      const mockQueueStatus = {
        waiting: 5,
        active: 2,
        completed: 100,
        failed: 3
      };

      mockQueueService.getQueueStatus.mockResolvedValue(mockQueueStatus);

      await OrderController.getQueueStatus(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockQueueService.getQueueStatus).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockQueueStatus
      });
    });
  });
});
