import path from "node:path";                     
import { fileURLToPath } from "node:url";                                                                                                                                                                                                                                                                                                                                                                                               import { createRequire } from "node:module"; const require = createRequire(import.meta.url);

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const emptyModule = path.join(projectRoot, "src/lib/stubs/empty-module.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  transpilePackages: ["wagmi"],
  experimental: {
    optimizePackageImports: ["lucide-react", "@heroicons/react"],
  },
  turbopack: {
    resolveAlias: {
      accounts: emptyModule,
    },
  },
  webpack(config) {
    config.resolve.alias = { ...config.resolve.alias, accounts: false };
    return config;
  },
  async rewrites() {
    const apiOrigin = process.env.API_ORIGIN || "http://127.0.0.1:3001";
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
      {
        source: "/health",
        destination: `${apiOrigin}/health`,
      },
    ];
  },
};

export default nextConfig;
