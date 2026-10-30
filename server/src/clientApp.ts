import express from 'express';
import fs from 'fs';
import path from 'path';

export function repoRoot(): string {
  return path.resolve(process.cwd());
}

export function assertProjectRoot(): void {
  const root = repoRoot();
  const serverEntry = path.join(root, 'server', 'src', 'simple-index.ts');
  if (!fs.existsSync(serverEntry)) {
    console.error('Run npm install and npm run dev from the project root.');
    process.exit(1);
  }
}

function clientBuildDir(): string {
  return path.resolve(repoRoot(), 'server', 'dist', 'client');
}

export async function attachClient(app: express.Application): Promise<void> {
  const distDir = clientBuildDir();
  const indexFile = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexFile)) {
    throw new Error('Client build not found. From the project root run: npm run build');
  }
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next();
      return;
    }
    if (req.path.startsWith('/api') || req.path === '/health') {
      next();
      return;
    }
    res.sendFile(indexFile);
  });
}
