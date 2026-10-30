import 'express-async-errors';
import express from 'express';
import compression from 'compression';
import { config } from './config';
import { logger } from './utils/logger';
import { initializeDatabase, closeDatabase } from './storage';
import { BlockchainService } from './blockchain';
import { SchedulerService } from './services';
import {
  corsMiddleware,
  securityMiddleware,
  requestLogger,
  validateContentType,
  errorHandler,
  notFoundHandler
} from './middleware';
import { assertProjectRoot, attachClient } from './clientApp';
import apiRoutes from './routes';

/**
 * crosschainBule Backend Server
 * 
 * A production-ready Node.js + TypeScript backend service for the crosschainBule 
 * Ethereum-native escrow protocol.
 */
assertProjectRoot();

class crosschainBuleServer {
  private app: express.Application;
  private server: any;
  private blockchainService: BlockchainService;
  private schedulerService: SchedulerService;
  
  constructor() {
    this.app = express();
    this.setupMiddleware();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(corsMiddleware);
    this.app.use(securityMiddleware);
    
    // General middleware
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Custom middleware
    this.app.use(requestLogger);
    this.app.use(validateContentType);
  }

  private setupRoutes(): void {
    this.app.use('/api', apiRoutes);
  }

  private setupErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);
    
    // Global error handler (must be last)
    this.app.use(errorHandler);
  }

  async start(): Promise<void> {
    try {
      logger.info('Starting crosschainBule Backend Server...');
      
      // Initialize database
      logger.info('Initializing database...');
      initializeDatabase(config.databasePath);
      
      // Setup routes after database initialization
      logger.info('Setting up routes...');
      this.setupRoutes();
      await attachClient(this.app);
      this.setupErrorHandling();
      
      // Initialize blockchain service
      logger.info('Initializing blockchain service...');
      this.blockchainService = new BlockchainService({
        rpcUrl: config.ethRpcUrl,
        contractAddress: config.contractAddress,
        privateKey: config.privateKey,
        chainId: config.chainId,
        confirmationBlocks: config.blockConfirmationCount
      });
      
      // Start blockchain event listening
      logger.info('Starting blockchain event listener...');
      await this.blockchainService.startEventListening();
      
      // Initialize and start scheduler
      logger.info('Initializing background jobs scheduler...');
      this.schedulerService = new SchedulerService(this.blockchainService, {
        reconcileIntervalMs: config.reconcileIntervalMs
      });
      await this.schedulerService.start();
      
      // Start HTTP server
      logger.info('Starting HTTP server...');
      this.server = this.app.listen(config.port, () => {
        logger.info(`✨ crosschainBule Backend Server started successfully!`);
        logger.info(`✅ Server running on port ${config.port}`);
        logger.info(`✅ Environment: ${config.nodeEnv}`);
        logger.info(`✅ Database: ${config.databasePath}`);
        logger.info(`✅ Contract: ${config.contractAddress}`);
        logger.info(`✅ Chain ID: ${config.chainId}`);
        logger.info(`🚀 API available at: http://localhost:${config.port}/api`);
      });
      
    } catch (error) {
      logger.error('Failed to start server:', error);
      await this.shutdown();
      process.exit(1);
    }
  }

  async shutdown(): Promise<void> {
    logger.info('Shutting down crosschainBule Backend Server...');
    
    try {
      // Stop scheduler
      if (this.schedulerService) {
        logger.info('Stopping scheduler...');
        await this.schedulerService.stop();
      }
      
      // Stop blockchain service
      if (this.blockchainService) {
        logger.info('Stopping blockchain service...');
        await this.blockchainService.cleanup();
      }
      
      // Close database  
      logger.info('Closing database connection...');
      closeDatabase();
      
      // Close HTTP server
      if (this.server) {
        logger.info('Closing HTTP server...');
        await new Promise<void>((resolve) => {
          this.server.close(() => {
            logger.info('HTTP server closed');
            resolve();
          });
        });
      }
      
      logger.info('✅ Server shutdown completed');
    } catch (error) {
      logger.error('Error during shutdown:', error);
    }
  }
}

// Create and start server
const server = new crosschainBuleServer();

// Start server
server.start().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown handlers
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  await server.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  await server.shutdown();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});