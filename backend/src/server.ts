import http from 'http';
import app from './app';
import { config } from './config/env';

const server = http.createServer(app);

export const startServer = (): http.Server => {
  return server.listen(config.PORT, () => {
    console.log(`[Server] JusBid AI Sales Agency API is running on port ${config.PORT} (${config.NODE_ENV})`);
    console.log(`[Server] Health check available at: http://localhost:${config.PORT}/api/v1/health`);
  });
};

const handleShutdown = (signal: string): void => {
  console.log(`\n[Server] Received ${signal}. Initiating graceful shutdown...`);
  server.close((err?: Error) => {
    if (err) {
      console.error('[Server] Error during shutdown:', err);
      process.exit(1);
    }
    console.log('[Server] HTTP server closed gracefully. Exiting process.');
    process.exit(0);
  });

  // Force shutdown after timeout if connections remain open
  const forceExitTimeout = setTimeout(() => {
    console.error('[Server] Forcing shutdown after 10s timeout.');
    process.exit(1);
  }, 10000);

  if (forceExitTimeout.unref) {
    forceExitTimeout.unref();
  }
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

startServer();

export default server;

