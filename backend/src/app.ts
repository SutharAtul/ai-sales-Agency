import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { corsOptions } from './config/cors';
import { httpLogger } from './config/logger';
import { requestIdMiddleware } from './middleware/request-id.middleware';
import { notFoundMiddleware } from './middleware/not-found.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import healthRoutes from './routes/health.routes';

export const createApp = (): Application => {
  const app = express();

  // 1. Request Correlation ID
  app.use(requestIdMiddleware);

  // 2. HTTP Security Headers with Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // 3. CORS Configuration
  app.use(cors(corsOptions));

  // 4. Structured HTTP Request Logging
  app.use(httpLogger);

  // 5. Body Parsers with payload limits
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // 6. Registered API Routers
  app.use('/api/v1', healthRoutes);

  // 7. 404 Route Handler
  app.use(notFoundMiddleware);

  // 8. Centralized Error Handler
  app.use(errorMiddleware);

  return app;
};

const app: Application = createApp();

export default app;
