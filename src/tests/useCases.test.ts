import { PaymentGateway } from './../aplication/ports/paymentGateway';

import { PlaceOrderUseCase } from './../aplication/usecases/placeOrderUseCase';

import { ViewDetailsUseCase } from '../aplication/usecases/viewDetailsUseCase';
import { ORDER_STATUS } from '../domain/entities/enums/orderStatus';
import { UpdateOrderUseCase } from '../aplication/usecases/updateOrderUseCase';
import { NotificationGateway } from '../aplication/ports/notificationGateway';
import { Product } from '../domain/value-object/Product';
import { visualizeMenuUseCase } from '../aplication/usecases/visualizeMenuUseCase';
import { InMemoryOrderRepository } from '../infraestructure/repositories/inMemoryOrderRepository';
import { Order } from '../domain/entities/Order';

describe('Place order use case', () => {
	const product1 = new Product('Latte', 'Vanilla');

	it('should be able to place an order after payment success', async () => {
		class PaymentMock implements PaymentGateway {
			processPayment(amount: number): Promise<any> {
				const response = {
					status: 200,
					data: { message: '', success: true },
				};
				return Promise.resolve(response);
			}
		}
		const memoryRepository = new InMemoryOrderRepository();
		const paymentMock = new PaymentMock();

		const placeOrderUseCase = new PlaceOrderUseCase(
			memoryRepository,
			paymentMock
		);

		const order = new Order([product1]);

		const placedOrder = await placeOrderUseCase.execute(order);

		const selectedOrder = await memoryRepository.getOrderById(order.id);

		expect(placedOrder.id).toBe(selectedOrder.id);
	}, 20000);

	it('should not be able to place an order after payment problem', async () => {
		class PaymentMock implements PaymentGateway {
			processPayment(amount: number): Promise<any> {
				throw new Error('');
			}
		}
		const memoryRepository = new InMemoryOrderRepository();
		const paymentMock = new PaymentMock();

		const placeOrderUseCase = new PlaceOrderUseCase(
			memoryRepository,
			paymentMock
		);

		const order = new Order([product1]);

		await expect(placeOrderUseCase.execute(order)).rejects.toThrow(
			'Payment failed after multiple attempts.'
		);
	}, 20000);
});

describe('View Order Details use case', () => {
	const product1 = new Product('Latte', 'Vanilla');
	const product2 = new Product('Espresso', 'Single Shot');
	it('Should return all order details', async () => {
		const memoryRepository = new InMemoryOrderRepository();
		const viewDetailsUseCase = new ViewDetailsUseCase(memoryRepository);

		const order = new Order([product1, product2]);
		await memoryRepository.createOrder(order);
		const details = await viewDetailsUseCase.execute(order.id);
		expect(details.totalPrice).toBe(6.8);
	});

	it('Should throw an error if the id is not found', async () => {
		const memoryRepository = new InMemoryOrderRepository();
		const viewDetailsUseCase = new ViewDetailsUseCase(memoryRepository);

		await expect(viewDetailsUseCase.execute('invalid-id')).rejects.toThrow(
			'Order not found in the database.'
		);
	});
});

describe('Update Order use case', () => {
	const product1 = new Product('Latte', 'Vanilla');
	it('Should be able to update the order to the next status', async () => {
		class NotificationMock implements NotificationGateway {
			sendNotification(status: string) {
				const response: any = {
					status: 200,
					data: {
						success: true,
						message: 'Success',
					},
				};
				return Promise.resolve(response);
			}
		}
		const notificationMock = new NotificationMock();
		const memoryRepository = new InMemoryOrderRepository();
		const updateOrderUseCase = new UpdateOrderUseCase(
			memoryRepository,
			notificationMock
		);

		const order = new Order([product1]);

		await memoryRepository.createOrder(order);
		await updateOrderUseCase.execute(order.id);

		const selectedOrder = await memoryRepository.getOrderById(order.id);

		expect(selectedOrder.status).toBe(ORDER_STATUS.preparation);
	});
	it('Should bot be able to update the order afer problem on notification', async () => {
		class NotificationMock implements NotificationGateway {
			sendNotification(status: string): Promise<any> {
				throw new Error('Notification has failed');
			}
		}
		const notificationMock = new NotificationMock();
		const memoryRepository = new InMemoryOrderRepository();
		const updateOrderUseCase = new UpdateOrderUseCase(
			memoryRepository,
			notificationMock
		);

		const order = new Order([product1]);

		await memoryRepository.createOrder(order);
		await expect(updateOrderUseCase.execute(order.id)).rejects.toThrow(
			'Notification has failed'
		);
	});
});

describe('View menu use case', () => {
	it('Should visualize the menu', async () => {
		const visualizeMenu = new visualizeMenuUseCase();
		const menu = await visualizeMenu.execute();

		expect(menu[0].product).toBeDefined;
		expect(menu[0].product).toBe('Latte');
		expect(menu[2].variation[0].price).toBe(0.5);
	});
});
