import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../shared/errors';

export const notFoundMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
};

export default notFoundMiddleware;

