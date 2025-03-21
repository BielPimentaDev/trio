import { Order } from '../../domain/entities/Order';
import { ORDER_STATUS } from '../../domain/entities/enums/orderStatus';
import { Product } from '../../domain/value-object/Product';
import { OrderRepository } from '../ports/orderRepository';
import { useCase } from './useCase';

export class ViewDetailsUseCase implements useCase<string, Output> {
	constructor(readonly orderRepository: OrderRepository) {}

	async execute(oderId: string): Promise<Output> {
		try {
			const order = await this.orderRepository.getOrderById(oderId);

			const output: Output = {
				products: order.products,
				orderCreation: order.date,
				orderStatus: order.status,
				orderId: order.id,
				totalPrice: order.getTotalPrice(),
			};
			return output;
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
}

type Output = {
	products: Product[];
	orderId: string;
	totalPrice: number;
	orderStatus: string;
	orderCreation: Date;
};
