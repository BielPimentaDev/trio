import express from 'express';
import { OrderController } from '../controllers/orderController';
import authorize from '../middleware/authorize';
import { DataBaseOrderRepository } from '../../repositories/databaseOrderRepository';
import { NotifyService } from '../../gateways/NotifyService';
import { TrioPayment } from '../../gateways/TrioPayment';

const router = express.Router();
const orderRepository = new DataBaseOrderRepository();
const notificationGateway = new NotifyService();
const paymentGateway = new TrioPayment();

const orderController = new OrderController(
	orderRepository,
	paymentGateway,
	notificationGateway
);

router.get('/menu', authorize(['customer', 'manager']), (req, res, next) =>
	orderController.getMenu(req, res, next)
);

router.post('/orders', authorize(['customer', 'manager']), (req, res, next) =>
	orderController.placeOrder(req, res, next)
);

router.get(
	'/orders/:id',
	authorize(['customer', 'manager']),
	(req, res, next) => orderController.viewOrderDetails(req, res, next)
);

router.patch('/orders/:id/status', authorize(['manager']), (req, res, next) =>
	orderController.updateOrderStatus(req, res, next)
);

export default router;
