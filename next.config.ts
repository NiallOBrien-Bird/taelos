import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  agentRules: false,
  distDir: process.env.DUDU_NEXT_DIST_DIR ?? '.next',
  experimental: {
    useTypeScriptCli: false,
  },
};

export default nextConfig;
