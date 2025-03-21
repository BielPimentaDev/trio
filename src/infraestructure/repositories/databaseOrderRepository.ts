import { OrderRepository } from '../../aplication/ports/orderRepository';
import { Order } from '../../domain/entities/Order';
import { Product } from '../../domain/value-object/Product';
import { db } from '../database/database';

export class DataBaseOrderRepository implements OrderRepository {
	async createOrder(order: Order): Promise<Order> {
		for (const product of order.products) {
			const result = await db.query(
				'INSERT INTO public.orders (product, variant, price, status, date, order_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
				[
					product.name,
					product.variant,
					product.price,
					order.status,
					order.date,
					order.id,
				]
			);
		}

		return order;
	}

	async getOrderById(orderId: string): Promise<Order> {
		try {
			const result = await db.query(
				'SELECT * FROM public.orders WHERE order_id = $1',
				[orderId]
			);

			if (!result || result.length === 0) {
				throw new Error(`Failed to get the order: ${orderId}.`);
			}

			const productsAndVariants = result.map(
				(row: any) => new Product(row.product, row.variant)
			);

			const order = new Order(
				productsAndVariants,
				result[0].order_id,
				result[0].date,
				result[0].status
			);

			return order;
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	async updateStatus(id: string, status: string): Promise<Order> {
		await db.query('UPDATE public.orders SET status = $1 WHERE order_id = $2', [
			status,
			id,
		]);
		const order = await this.getOrderById(id);

		return order;
	}

	async deleteOrder(orderId: string) {
		return db.query(
			'DELETE FROM public.orders WHERE order_id = $1 returning *',
			[orderId]
		);
	}
}
