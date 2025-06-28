import { OrderDetail } from "../../../models";


export class OrderService {
     static async updateOrderStatus(orderId: string, status: 'PENDING' | 'COMPLETED' | 'CANCELLED', orderRefNo?: string) {
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
}