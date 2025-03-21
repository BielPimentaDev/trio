import { MENU } from '../entities/constants/menu';

export class Product {
	public name: string;
	public variant: string;
	public price: number;

	constructor(name: string, variant: string) {
		this.name = name;
		this.variant = variant;
		this.price = 0;
		this.validateProduct();
	}
	validateProduct() {
		const productData = MENU.find((item) => item.product === this.name);
		if (!productData) {
			throw new Error(`Product ${this.name} not found in the menu.`);
		}
		const variantData = productData.variation.find(
			(v) => v.name === this.variant
		);
		if (!variantData) {
			throw new Error(
				`Variant ${this.variant} not available for ${this.name}.`
			);
		}
		this.price = productData.basePrice + variantData.price;
	}
}
