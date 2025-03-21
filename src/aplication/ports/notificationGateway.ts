export interface NotificationGateway {
	sendNotification(status: string): Promise<any>;
}
