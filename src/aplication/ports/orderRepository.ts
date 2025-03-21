import { Order } from '../../domain/entities/Order';

export interface OrderRepository {
	createOrder(order: Order): Promise<Order>;
	getOrderById(id: string): Promise<Order>;
	updateStatus(id: string, status: string): Promise<Order>;
}
