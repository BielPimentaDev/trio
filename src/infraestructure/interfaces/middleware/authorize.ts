import { Request, Response, NextFunction } from 'express';

const authorize = (allowedRoles: string[]) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const role = req.headers.role as string;

		if (!role) {
			res.status(403).json({ message: 'Role is required' });
			return;
		}

		if (!allowedRoles.includes(role)) {
			res.status(403).json({ message: 'Access denied' });
			return;
		}

		next();
	};
};

export default authorize;
