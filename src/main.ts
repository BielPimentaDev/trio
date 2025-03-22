import express from 'express';
import ordersRoute from './infraestructure/interfaces/routes/ordersRoute';
import dotenv from 'dotenv';
import { errorHandler } from './infraestructure/interfaces/middleware/errorHandler';

const app = express();
dotenv.config();
app.use(express.json());

app.use('/api', ordersRoute);

app.listen(3001, () => {
	console.log('Server is running on port 3001');
});
app.use(errorHandler);
