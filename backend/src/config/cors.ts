import { CorsOptions } from 'cors';
import { config } from './env';

/**
 * Generates CORS options enforcing strict production origin checks
 * and allowing configured FRONTEND_URL / development origins.
 */
export const getCorsOptions = (envConfig = config): CorsOptions => {
  const isProduction = envConfig.NODE_ENV === 'production';
  const frontendUrl = envConfig.FRONTEND_URL;

  return {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (e.g. server-to-server, curl, health probes)
      if (!origin) {
        return callback(null, true);
      }

      // In production: Strictly forbid wildcard '*' and enforce whitelist
      if (isProduction) {
        if (!frontendUrl) {
          return callback(new Error('CORS blocked: FRONTEND_URL is not configured in production'));
        }

        const allowedOrigins = frontendUrl.split(',').map((u) => u.trim().toLowerCase());
        const normalizedOrigin = origin.trim().toLowerCase();

        if (allowedOrigins.includes(normalizedOrigin)) {
          return callback(null, true);
        }

        return callback(new Error(`CORS blocked: Origin '${origin}' is not authorized`));
      }

      // In development and test:
      if (frontendUrl) {
        const allowedOrigins = frontendUrl.split(',').map((u) => u.trim().toLowerCase());
        const normalizedOrigin = origin.trim().toLowerCase();
        if (allowedOrigins.includes(normalizedOrigin)) {
          return callback(null, true);
        }
      }

      // Allow typical local development loopbacks
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // In non-production without strict FRONTEND_URL, allow requests
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id'],
    maxAge: 86400,
  };
};

export const corsOptions = getCorsOptions();
export default corsOptions;

