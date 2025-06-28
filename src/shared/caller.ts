import axios from "axios";

export async function  callThirdPartyPlaceOrder(order: Partial<IOrderDetail> & { orderRefNo: string }) {
    try {
        // Call third-party API using axios
        const response = await axios.post('http://localhost:3001/order', {
            fundName: order.securityDetail,
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