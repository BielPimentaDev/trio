import { OrderRepository } from '../../aplication/ports/orderRepository';
import { ORDER_STATUS } from '../../domain/entities/enums/orderStatus';
import { Order } from '../../domain/entities/Order';

export class InMemoryOrderRepository implements OrderRepository {
	private orders: Order[] = [];

	async createOrder(order: Order): Promise<Order> {
		this.orders.push(order);
		return order;
	}

	async getOrderById(id: string): Promise<Order> {
		const order = this.orders.find((order) => order.id === id);
		if (!order) {
			throw new Error('Order not found in the database.');
		}
		return order;
	}

	async updateStatus(id: string, status: ORDER_STATUS): Promise<Order> {
		const order = await this.getOrderById(id);
		const updatedOrder = new Order(
			order.products,
			order.id,
			order.date,
			status
		);
		const index = this.orders.findIndex((order) => order.id === id);
		this.orders[index] = updatedOrder;

		return updatedOrder;
	}
}
