import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/dist/compiled/react': path.resolve('./node_modules/react'),
    };
    if (config.module) {
      config.module.strictExportPresence = false;
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/search/:path*',
        destination: 'https://youtube-ads-library.onrender.com/api/search/:path*',
        basePath: false,
      },
      {
        source: '/api/cache/:path*',
        destination: 'https://youtube-ads-library.onrender.com/api/cache/:path*',
        basePath: false,
      },
      {
        source: '/api/vidtao/:path*',
        destination: 'https://youtube-ads-library.onrender.com/api/vidtao/:path*',
        basePath: false,
      },
    ]
  },
}

export default nextConfig
