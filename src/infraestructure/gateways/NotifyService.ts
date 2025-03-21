import axios from 'axios';
import { NotificationGateway } from '../../aplication/ports/notificationGateway';

export class NotifyService implements NotificationGateway {
	async sendNotification(status: string): Promise<any> {
		try {
			const response = await axios.post(
				`https://challenge.trio.dev/api/v1/notification?status=${status}`,
				{ status }
			);

			if (response.status !== 200) {
				throw new Error(`Notification failed with status: ${response.status}`);
			}
			return response.data;
		} catch (error: any) {
			throw new Error('Notification error');
		}
	}
}
