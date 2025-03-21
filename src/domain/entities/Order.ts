import { Product } from '../value-object/Product';
import { ORDER_STATUS } from './enums/orderStatus';
import { randomUUID } from 'crypto';

export class Order {
	products: Product[];
	status: ORDER_STATUS;
	id: string;
	date: Date;

	constructor(
		products: Product[],
		id?: string,
		date?: Date,
		status?: ORDER_STATUS
	) {
		this.products = products;
		this.id = id ?? randomUUID();
		this.status = status ?? ORDER_STATUS.waiting;
		this.date = date ?? new Date();
	}

	getTotalPrice(): number {
		let total = 0;
		for (const product of this.products) {
			total += product.price;
		}
		return total;
	}

	updateStatus(): void {
		const currentStatus = this.status;

		const statusArray: ORDER_STATUS[] = [
			ORDER_STATUS.waiting,
			ORDER_STATUS.preparation,
			ORDER_STATUS.ready,
			ORDER_STATUS.delivered,
		];
		const currentIndex = statusArray.indexOf(currentStatus);

		const nextStatus = statusArray[currentIndex + 1];
		if (!nextStatus) {
			throw new Error(`Status already on the final stage`);
		}
		this.status = nextStatus;
	}
}
