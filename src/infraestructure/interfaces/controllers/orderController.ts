import { NextFunction, Request, Response } from 'express';
import { NotificationGateway } from '../../../aplication/ports/notificationGateway';
import { PaymentGateway } from '../../../aplication/ports/paymentGateway';
import { Order } from '../../../domain/entities/Order';
import { visualizeMenuUseCase } from '../../../aplication/usecases/visualizeMenuUseCase';
import { PlaceOrderUseCase } from '../../../aplication/usecases/placeOrderUseCase';
import { ViewDetailsUseCase } from '../../../aplication/usecases/viewDetailsUseCase';
import { UpdateOrderUseCase } from '../../../aplication/usecases/updateOrderUseCase';
import { OrderRepository } from '../../../aplication/ports/orderRepository';
import { Product } from '../../../domain/value-object/Product';

export class OrderController {
	constructor(
		readonly orderRepository: OrderRepository,
		readonly paymentGateway: PaymentGateway,
		readonly notificationGateway: NotificationGateway
	) {}

	async getMenu(req: Request, res: Response, next: NextFunction): Promise<any> {
		try {
			const visualizeMenu = new visualizeMenuUseCase();
			const menu = await visualizeMenu.execute();
			res.json(menu);
		} catch (error) {
			next(error);
		}
	}

	async placeOrder(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> {
		try {
			const { products } = req.body;

			const productInstances = products.map(
				(product: any) => new Product(product.name, product.variant)
			);

			const order = new Order(productInstances);

			const placeOrderUseCase = new PlaceOrderUseCase(
				this.orderRepository,
				this.paymentGateway
			);
			const placedOrder = await placeOrderUseCase.execute(order);

			res.status(201).json(placedOrder);
		} catch (error) {
			next(error);
		}
	}

	async viewOrderDetails(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> {
		try {
			const orderId = req.params.id;
			const viewDetailsUseCase = new ViewDetailsUseCase(this.orderRepository);

			const details = await viewDetailsUseCase.execute(orderId);
			res.json(details);
		} catch (error) {}
	}

	async updateOrderStatus(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> {
		try {
			const orderId = req.params.id;
			const updateOrderUseCase = new UpdateOrderUseCase(
				this.orderRepository,
				this.notificationGateway
			);

			await updateOrderUseCase.execute(orderId);

			res.status(200).send({ message: 'Order status updated successfully' });
		} catch (error) {
			next(error);
		}
	}
}
