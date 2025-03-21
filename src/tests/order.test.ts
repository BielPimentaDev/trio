import { Order } from '../domain/entities/Order';
import { ORDER_STATUS } from '../domain/entities/enums/orderStatus';
import { Product } from '../domain/value-object/Product';

describe('Order', () => {
	const product1 = new Product('Latte', 'Vanilla');

	it('Should create a product with success', () => {
		const product = new Product('Espresso', 'Single Shot');
		expect(product).toBeDefined;
		expect(product.price).toBe(2.5);
	});

	it('should not create a product if the product name dont match', () => {
		expect(() => new Product('x', 'Vanilla')).toThrow(
			'Product x not found in the menu.'
		);
	});

	it('should not create a product if the product variant  dont match', () => {
		expect(() => new Product('Espresso', 'x')).toThrow(
			'Variant x not available for Espresso.'
		);
	});

	it('should calculate the total price', () => {
		const order = new Order([product1, product1]);

		expect(order.getTotalPrice()).toBe(8.6);
	});

	it('should intialize with status of waiting', () => {
		const order = new Order([product1]);

		expect(order.status).toBe(ORDER_STATUS.waiting);
	});

	it('should update the status on the right order', () => {
		const order = new Order([product1]);

		order.updateStatus();
		expect(order.status).toBe(ORDER_STATUS.preparation);
		order.updateStatus();
		expect(order.status).toBe(ORDER_STATUS.ready);
		order.updateStatus();
		expect(order.status).toBe(ORDER_STATUS.delivered);
	});

	it('if update more than the status nothing should happen', () => {
		const order = new Order([product1]);

		order.status = ORDER_STATUS.delivered;

		expect(() => order.updateStatus()).toThrow(
			'Status already on the final stage'
		);
	});
});
