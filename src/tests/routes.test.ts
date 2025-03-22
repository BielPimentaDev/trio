import axios from 'axios';
import { DataBaseOrderRepository } from '../infraestructure/repositories/databaseOrderRepository';
import { Product } from '../domain/value-object/Product';
import { Order } from '../domain/entities/Order';
import { TrioPayment } from '../infraestructure/gateways/TrioPayment';

const api = axios.create({
	baseURL: 'http://app:3001/api',
	headers: {
		'Content-Type': 'application/json',
		role: 'manager',
	},
});
describe('Api test', () => {
	const orderRepository = new DataBaseOrderRepository();
	const product1 = new Product('Latte', 'Vanilla');
	const order = new Order([product1, product1]);

	it('Should get the menu', async () => {
		const response = await api.get('/menu');
		expect(response.data[0].product).toBe('Latte');
		expect(response.data[2].basePrice).toBe(4);
	});

	it('Should place an order', async () => {
		const body = {
			products: [{ name: 'Latte', variant: 'Vanilla' }],
		};
		const response = await api.post('/orders', JSON.stringify(body));

		expect(response.status).toBe(201);
		await orderRepository.deleteOrder(response.data.id);
	}, 30000);

	it('Should view details for a order', async () => {
		const createdOrder = await orderRepository.createOrder(order);

		expect(createdOrder).toBeDefined();

		const detailsResponse = await api.get(`/orders/${createdOrder.id}`);

		expect(detailsResponse.status).toBe(200);

		expect(detailsResponse.data.totalPrice).toBe(8.6);

		await orderRepository.deleteOrder(createdOrder.id);
	}, 30000);

	it('Should update an order', async () => {
		const createdOrder = await orderRepository.createOrder(order);
		expect(createdOrder).toBeDefined();

		const updatedResponse = await api.patch(
			`/orders/${createdOrder.id}/status`
		);
		expect(updatedResponse.status).toBe(200);

		const detailsResponse = await orderRepository.getOrderById(createdOrder.id);
		expect(detailsResponse.status).toBe('preparation');

		await orderRepository.deleteOrder(createdOrder.id);
	}, 30000);
});
