import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../shared/errors';
import { config } from '../config/env';
import { logger } from '../config/logger';

export const errorMiddleware: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const requestId = req.id || (req.headers['x-request-id'] as string) || 'unknown';

  let statusCode = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected internal server error occurred';
  let details: unknown = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    code = 'MALFORMED_JSON';
    message = 'Invalid JSON payload received';
  } else if (err.message && typeof err.message === 'string' && err.message.startsWith('CORS blocked')) {
    statusCode = 403;
    code = 'CORS_ERROR';
    message = err.message;
  }

  // Structured logging avoiding sensitive credentials
  if (statusCode >= 500) {
    logger.error(
      {
        requestId,
        err: {
          message: err.message,
          stack: config.NODE_ENV !== 'production' ? err.stack : undefined,
        },
        method: req.method,
        url: req.originalUrl,
      },
      'Unhandled internal server error'
    );
  } else {
    logger.warn(
      {
        requestId,
        code,
        message,
        method: req.method,
        url: req.originalUrl,
        statusCode,
      },
      'Operational error response sent'
    );
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
    requestId,
  });
};

export default errorMiddleware;

