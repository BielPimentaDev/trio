import { Order } from '../../domain/entities/Order';
import { OrderRepository } from '../ports/orderRepository';
import { PaymentGateway } from '../ports/paymentGateway';
import { useCase } from './useCase';
export class PlaceOrderUseCase implements useCase<Order, Order> {
	constructor(
		readonly orderRepository: OrderRepository,
		readonly paymentGateway: PaymentGateway
	) {}

	private async processWithRetry(
		amount: number,
		retries: number = 3,
		delay: number = 3000
	): Promise<any> {
		let attempts = 0;

		while (attempts < retries) {
			try {
				const response = await this.paymentGateway.processPayment(amount);
				return response;
			} catch (error: any) {
				attempts++;
				if (attempts >= retries) {
					throw new Error('Payment failed after multiple attempts.');
				}
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	}
	async execute(order: Order): Promise<Order> {
		const totalPrice = order.getTotalPrice();

		const payment = await this.processWithRetry(Number(totalPrice.toFixed(2)));

		console.log('Payment response :', payment);

		await this.orderRepository.createOrder(order);
		return order;
	}
}
