import { Order } from '../../domain/entities/Order';
import { NotificationGateway } from '../ports/notificationGateway';
import { OrderRepository } from './../ports/orderRepository';
import { useCase } from './useCase';

export class UpdateOrderUseCase implements useCase<string, Order> {
	constructor(
		readonly orderRepository: OrderRepository,
		readonly notificationGateway: NotificationGateway
	) {}

	async execute(orderId: string) {
		const order = await this.orderRepository.getOrderById(orderId);

		order.updateStatus();

		await this.orderRepository.updateStatus(order.id, order.status);

		const response = await this.notificationGateway.sendNotification(
			order.status
		);
		console.log('Notification response:', response);
		return order;
	}
}
