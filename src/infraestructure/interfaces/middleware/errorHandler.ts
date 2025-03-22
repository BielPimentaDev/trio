import { Request, NextFunction, Response } from 'express';

export function errorHandler(
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	res.status(400).json({
		error: err.name,
		message: err.message,
	});
}
