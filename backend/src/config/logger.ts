import pino from 'pino';
import { Request, Response, NextFunction } from 'express';
import { config } from './env';

export const logger = pino({
  level: config.NODE_ENV === 'test' ? 'silent' : (process.env.LOG_LEVEL || 'info'),
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.token',
      'req.body.secret',
      'req.body.apiKey',
      'password',
      'token',
      'secret',
      'authorization',
      'cookie',
    ],
    censor: '[REDACTED]',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Structured HTTP request logging middleware.
 * Attaches request correlation ID and logs method, URL, status, and duration,
 * while strictly avoiding logging passwords, tokens, cookies, or sensitive personal data.
 */
export const httpLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    const logLevel = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

    logger[logLevel]({
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      userAgent: req.headers['user-agent'],
    }, `${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs}ms`);
  });

  next();
};

export default logger;

