import { ORDER_STATUS } from '../domain/entities/enums/orderStatus';
import { Order } from '../domain/entities/Order';
import { Product } from '../domain/value-object/Product';
import { db } from '../infraestructure/database/database';
import { DataBaseOrderRepository } from '../infraestructure/repositories/databaseOrderRepository';

describe('DataBaseOrderRepository', () => {
	const databaseRepository = new DataBaseOrderRepository();
	const product1 = new Product('Latte', 'Vanilla');
	const order = new Order([product1]);

	it.only('should connect to the database', async () => {
		const result = await db.any('SELECT 1');
		console.log({
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			database: process.env.DB_NAME,
		});
		expect(result).toEqual([{ '?column?': 1 }]);
	});

	it('should create an order successfully', async () => {
		const result = await databaseRepository.createOrder(order);
		expect(result).toEqual(order);
		await databaseRepository.deleteOrder(result.id);
	});

	it('should create an order successfully', async () => {
		const result = await databaseRepository.createOrder(order);
		expect(result).toEqual(order);
		await databaseRepository.deleteOrder(result.id);
	});

	it('should find an order by ID', async () => {
		const createdOrder = await databaseRepository.createOrder(order);
		const foundOrder = await databaseRepository.getOrderById(createdOrder.id);
		expect(foundOrder).toEqual(createdOrder);
	});

	it('should update an order successfully', async () => {
		const createdOrder = await databaseRepository.createOrder(order);
		const updatedOrder = await databaseRepository.updateStatus(
			createdOrder.id,
			ORDER_STATUS.ready
		);
		expect(updatedOrder.status).toEqual('ready');
		await databaseRepository.deleteOrder(updatedOrder.id);
	});

	it('should delete an order successfully', async () => {
		const createdOrder = await databaseRepository.createOrder(order);
		const deleted = await databaseRepository.deleteOrder(createdOrder.id);
		expect(deleted).toBeDefined;
		await expect(
			databaseRepository.getOrderById(createdOrder.id)
		).rejects.toThrow(`Failed to get the order: ${createdOrder.id}.`);
	});

	it('should fail when trying to find a non-existent order', async () => {
		const nonExistentOrderId = 'non-existent-id';

		await expect(
			databaseRepository.getOrderById(nonExistentOrderId)
		).rejects.toThrowError(
			new Error(`Failed to get the order: ${nonExistentOrderId}.`)
		);
	});
});
