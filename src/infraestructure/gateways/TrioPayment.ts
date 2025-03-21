import axios from 'axios';
import { PaymentGateway } from '../../aplication/ports/paymentGateway';

export class TrioPayment implements PaymentGateway {
	async processPayment(amount: number): Promise<void> {
		try {
			const response = await axios.post(
				'https://challenge.trio.dev/api/v1/payment',
				{ value: amount },
				{ headers: { 'Content-Type': 'application/json' } }
			);
			if (response.status !== 200) {
				throw new Error(`Payment failed with status: ${response.status}`);
			}
			return response.data;
		} catch (error: any) {
			const errorMessage = error.response?.data || error.message;
			throw new Error(`Payment processing failed: ${errorMessage}`);
		}
	}
}
