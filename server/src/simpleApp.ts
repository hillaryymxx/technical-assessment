import cors from 'cors';
import express from 'express';

const PORT = process.env.PORT || 3001;
const CONTRACT_ADDRESS = '0x9dE8472Ef25Fc12380FC889bd8f337a5De5A6615';
const RPC_URL = 'https://rpc.sepolia.org';

export function createSimpleApp(): express.Application {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
  });

  app.get('/health', (req, res) => {
    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        contract: CONTRACT_ADDRESS,
        network: 'sepolia'
      }
    });
  });

  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        contract: CONTRACT_ADDRESS
      }
    });
  });

  app.get('/api/contract/address', (req, res) => {
    res.json({
      success: true,
      data: {
        address: CONTRACT_ADDRESS,
        network: 'sepolia',
        chainId: 11155111
      }
    });
  });

  app.get('/api/contract/network', (req, res) => {
    res.json({
      success: true,
      data: {
        network: 'sepolia',
        chainId: 11155111,
        rpcUrl: RPC_URL,
        contractAddress: CONTRACT_ADDRESS
      }
    });
  });

  app.get('/api/contract/info', (req, res) => {
    res.json({
      success: true,
      data: {
        contractAddress: CONTRACT_ADDRESS,
        network: 'sepolia',
        chainId: 11155111,
        note: 'All transactions should be done from frontend using wagmi'
      }
    });
  });

  app.get('/api/listings', (req, res) => {
    res.json({
      success: true,
      data: {
        listings: [],
        total: 0,
        note: 'Listings are managed by smart contract. Use frontend to interact.'
      }
    });
  });

  app.use('/api', (req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Endpoint not found',
        path: req.originalUrl
      }
    });
  });

  app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  });

  return app;
}

export function listen(app: express.Application): void {
  const server = app.listen(PORT, () => {
    console.log('crosschainBule is running');
    console.log(`Open http://localhost:${PORT}`);
    console.log(`API http://localhost:${PORT}/api/health`);
    console.log(`Contract: ${CONTRACT_ADDRESS}`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the other server, then start again.`);
    } else {
      console.error(error);
    }
    process.exit(1);
  });

  process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\nShutting down server...');
    process.exit(0);
  });
}
